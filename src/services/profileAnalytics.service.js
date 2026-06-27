const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfileAnalytics = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 1. WEEKLY VISITS (Across all user projects)
  const recentVisits = await prisma.visit.findMany({
    where: {
      project: { userId },
      createdAt: { gte: sevenDaysAgo }
    },
    select: { createdAt: true, sessionId: true }
  });

  // Group by day and count unique sessionIds
  const visitBuckets = initializeWeekBuckets();
  const sessionTracker = new Set();

  recentVisits.forEach(visit => {
    const day = getShortDay(visit.createdAt);
    const uniqueKey = `${day}-${visit.sessionId}`;
    if (!sessionTracker.has(uniqueKey)) {
      sessionTracker.add(uniqueKey);
      const bucket = visitBuckets.find(b => b.day === day);
      if (bucket) bucket.visits += 1;
    }
  });

  // 2. WEEKLY API CALLS (Across all user monitors)
  const recentCalls = await prisma.checkResult.findMany({
    where: {
      monitor: { project: { userId } },
      checkedAt: { gte: sevenDaysAgo } // <-- Corrected Prisma field
    },
    select: { checkedAt: true } // <-- Corrected Prisma field
  });

  const apiBuckets = initializeWeekBuckets('calls');
  recentCalls.forEach(call => {
    const day = getShortDay(call.checkedAt); // <-- Corrected Prisma field
    const bucket = apiBuckets.find(b => b.day === day);
    if (bucket) bucket.calls += 1;
  });

  // 3. MONITORS BY PROJECT
  const projects = await prisma.project.findMany({
    where: { userId },
    select: {
      name: true,
      _count: { select: { monitors: true } }
    }
  });

  const monitorsByProject = projects.map(p => ({
    name: p.name,
    monitors: p._count.monitors
  })).filter(p => p.monitors > 0); // Only send projects that actually have monitors

  // 4. INCIDENT STATS (Across all user projects)
  const incidents = await prisma.incident.groupBy({
    by: ['status'],
    where: { monitor: { project: { userId } } },
    _count: { _all: true }
  });

  const incidentStats = incidents.map(inc => ({
    status: inc.status, // e.g., "OPEN", "RESOLVED"
    count: inc._count._all
  }));

  return {
    weeklyVisits: visitBuckets,
    weeklyApiCalls: apiBuckets,
    monitorsByProject,
    incidentStats
  };
};

// --- Helper Functions ---
function getShortDay(dateObj) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);
}

function initializeWeekBuckets(keyName = 'visits') {
  const buckets = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.push({ day: getShortDay(d), [keyName]: 0 });
  }
  return buckets;
}

module.exports = { getProfileAnalytics };