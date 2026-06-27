const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const getProjectOverview = async(
    userId,
    projectId,
    range = '24H'
) => {

    const project =
    await prisma.project.findFirst({
        where:{
            id:projectId,
            userId
        },
        include:{
            monitors:{
                include:{
                    checkResults:true,
                    incidents:true
                }
            }
        }
    });

    if(!project){
        throw new AppError(
            'Project not found',
            404
        );
    }

    const totalMonitors =
    project.monitors.length;

    let totalChecks = 0;
    let successfulChecks = 0;
    let totalResponseTime = 0;
    let activeIncidents = 0;
    let totalIncidents = 0;

    const monitorHealth = [];

    for(const monitor of project.monitors){

        const checks =
        monitor.checkResults;

        const incidents =
        monitor.incidents;

        const monitorChecks =
        checks.length;

        const monitorSuccess =
        checks.filter(
            c => c.success
        ).length;

        const monitorResponseTime =
        checks.reduce(
            (sum,c)=>
            sum + (c.responseTime || 0),
            0
        );

        const uptime =
        monitorChecks > 0
        ? (
            monitorSuccess /
            monitorChecks
          ) * 100
        : 0;

        const avgLatency =
        monitorChecks > 0
        ? Math.round(
            monitorResponseTime /
            monitorChecks
          )
        : 0;

        const latestCheck =
            checks.length > 0
            ? [...checks].sort(
                (a,b)=>
                new Date(b.checkedAt) -
                new Date(a.checkedAt)
            )[0]
            : null;

        const hasOpenIncident =
            incidents.some(
                incident =>
                incident.status === 'OPEN'
            );

        let status = 'UNKNOWN';

        if(hasOpenIncident){
            status = 'DOWN';
        }
        else if(
            latestCheck &&
            latestCheck.success &&
            latestCheck.responseTime > 2000
        ){
            status = 'DEGRADED';
        }
        else if(
            latestCheck &&
            latestCheck.success
        ){
            status = 'OPERATIONAL';
        }
        else if(
            latestCheck &&
            !latestCheck.success
        ){
            status = 'DOWN';
        }

        monitorHealth.push({
            id:monitor.id,
            name:monitor.name,
            uptimePercentage:Number(
                uptime.toFixed(2)
            ),
            avgResponseTime:avgLatency,
            incidents:incidents.length,
            status
        });
                totalChecks += monitorChecks;
        successfulChecks += monitorSuccess;
        totalResponseTime +=
        monitorResponseTime;

        totalIncidents +=
        incidents.length;

        activeIncidents +=
        incidents.filter(
            incident =>
            incident.status ===
            'OPEN'
        ).length;
    }

    const uptimePercentage =
    totalChecks > 0
    ? Number(
        (
            successfulChecks /
            totalChecks
        ) * 100
      ).toFixed(2)
    : 0;

    const averageResponseTime =
    totalChecks > 0
    ? Math.round(
        totalResponseTime /
        totalChecks
      )
    : 0;

    const slowestMonitors =
    [...monitorHealth]
    .sort(
        (a,b)=>
        b.avgResponseTime -
        a.avgResponseTime
    )
    .slice(0,5);

    const recentIncidents =
    await prisma.incident.findMany({
        where:{
            monitor:{
                projectId
            }
        },
        include:{
            monitor:true
        },
        orderBy:{
            startedAt:'desc'
        },
        take:5
    });

    let fromDate = new Date();

    switch(range){

        case '1H':
            fromDate.setHours(
                fromDate.getHours() - 1
            );
            break;

        case '6H':
            fromDate.setHours(
                fromDate.getHours() - 6
            );
            break;

        case '24H':
            fromDate.setDate(
                fromDate.getDate() - 1
            );
            break;

        case '7D':
            fromDate.setDate(
                fromDate.getDate() - 7
            );
            break;

        case '30D':
            fromDate.setDate(
                fromDate.getDate() - 30
            );
            break;

        default:
            fromDate.setDate(
                fromDate.getDate() - 1
            );
    }

    const latencyTrend =
    await prisma.checkResult.findMany({
        where:{
            monitor:{
                projectId
            },
            checkedAt:{
                gte: fromDate
            }
        },
        select:{
            checkedAt:true,
            responseTime:true
        },
        orderBy:{
            checkedAt:'asc'
        }
    });
    const rangeAverageResponseTime =
    latencyTrend.length > 0
    ? Math.round(
        latencyTrend.reduce(
        (sum, check) =>
            sum + (check.responseTime || 0),
        0
        ) / latencyTrend.length
    )
    : 0;
    
    // =========================================================
    // NEW: 7-Day Aggregation for UI Charts
    // =========================================================
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1. Initialize the 7-day template to ensure days with 0 data still show up on the chart
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyApiCallsArray = [];
    const weeklyVisitsArray = [];
    
    // Map to keep track of array indices by day string
    const dayIndexMap = new Map();

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = daysOfWeek[d.getDay()];
        
        weeklyApiCallsArray.push({ day: dayName, calls: 0 });
        weeklyVisitsArray.push({ day: dayName, visits: 0 });
        dayIndexMap.set(d.toISOString().split('T')[0], 6 - i); // Maps 'YYYY-MM-DD' to array index
    }

    // 2. Fetch Weekly API Calls (Assuming CheckResults represents the API calls made)
    // If your "API calls" are tracked in a different model, replace `checkResult` with that model.
    const recentChecks = await prisma.checkResult.findMany({
        where: {
            monitor: { projectId },
            checkedAt: { gte: sevenDaysAgo }
        },
        select: { checkedAt: true }
    });

    recentChecks.forEach(check => {
        const dateString = check.checkedAt.toISOString().split('T')[0];
        const index = dayIndexMap.get(dateString);
        if (index !== undefined) {
            weeklyApiCallsArray[index].calls += 1;
        }
    });

    // 3. Fetch Weekly Visits (Requires a Visit model tracking unique sessionIds)
    // Ensure you have a Visit model in Prisma: { id, projectId, sessionId, createdAt }
    // We group by sessionId to ignore page refreshes.
    const recentVisits = await prisma.visit.findMany({
        where: {
            projectId: projectId,
            createdAt: { gte: sevenDaysAgo }
        },
        select: {
            createdAt: true,
            sessionId: true
        }
    });

    // Use a Set to ensure we only count one unique session per day
    const uniqueDailySessions = new Set();

    recentVisits.forEach(visit => {
        const dateString = visit.createdAt.toISOString().split('T')[0];
        const uniqueKey = `${dateString}-${visit.sessionId}`;
        
        if (!uniqueDailySessions.has(uniqueKey)) {
            uniqueDailySessions.add(uniqueKey);
            const index = dayIndexMap.get(dateString);
            if (index !== undefined) {
                weeklyVisitsArray[index].visits += 1;
            }
        }
    });

   

    return {
        project: {
            id: project.id,
            name: project.name,
            description: project.description
        },
        summary: {
            totalMonitors,
            uptimePercentage,
            averageResponseTime: averageResponseTime,
            rangeAverageResponseTime: rangeAverageResponseTime,
            totalIncidents,
            activeIncidents
        },
        monitorHealth,
        slowestMonitors,
        recentIncidents: recentIncidents.map(incident => ({
            id: incident.id,
            monitorName: incident.monitor.name,
            status: incident.status,
            startedAt: incident.startedAt
        })),
        latencyTrend: latencyTrend.reverse(),
        
        // ADD THE NEW DATA HERE
        weeklyVisits: weeklyVisitsArray,
        weeklyApiCalls: weeklyApiCallsArray
    };
};
const logVisit = async (projectId, sessionId) => {
    await prisma.visit.create({
        data: {
            projectId,
            sessionId
        }
    });
};

    


module.exports = {
    getProjectOverview,
    logVisit
};