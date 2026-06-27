const profileAnalyticsService = require('../services/profileAnalytics.service');

const getProfileAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware

    const analytics = await profileAnalyticsService.getProfileAnalytics(userId);

    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error("Profile Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile analytics"
    });
  }
};

module.exports = { getProfileAnalytics };