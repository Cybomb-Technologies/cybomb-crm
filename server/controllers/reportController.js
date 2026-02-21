const Lead = require('../models/Lead');
const Deal = require('../models/Deal');

// Pipeline Summary (Deals by Stage)
exports.getPipelineSummary = async (req, res) => {
  try {
    const pipeline = await Deal.aggregate([
      { $match: { organization: req.user.organization } },
      { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
      { $project: { stage: '$_id', count: 1, totalValue: 1, _id: 0 } }
    ]);

    // Ensure all stages are represented even if 0
    const stages = ['Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const result = stages.map(stage => {
      const found = pipeline.find(p => p.stage === stage);
      return found || { stage, count: 0, totalValue: 0 };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching pipeline summary:', err);
    res.status(500).send('Server Error');
  }
};

// Revenue Forecast (Deals Won by Month for current year)
exports.getRevenueForecast = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const forecast = await Deal.aggregate([
      { 
        $match: { 
          organization: req.user.organization, 
          stage: 'Closed Won',
          expectedCloseDate: { $gte: startOfYear, $lte: endOfYear }
        } 
      },
      {
        $group: {
          _id: { $month: '$expectedCloseDate' },
          revenue: { $sum: '$value' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Format output to month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map((month, index) => {
      const found = forecast.find(f => f._id === index + 1);
      return { month, revenue: found ? found.revenue : 0 };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching revenue forecast:', err);
    res.status(500).send('Server Error');
  }
};

// Lead Status Distribution
exports.getLeadDistribution = async (req, res) => {
  try {
    const distribution = await Lead.aggregate([
      { $match: { organization: req.user.organization } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);
    
    // Capitalize status names
    const result = distribution.map(d => ({
        name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
        value: d.value
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching lead distribution:', err);
    res.status(500).send('Server Error');
  }
};

// Sales Leaderboard (Deals Won by User)
exports.getSalesLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Deal.aggregate([
      { $match: { organization: req.user.organization, stage: 'Closed Won' } },
      { $group: { _id: '$assignedTo', wonDeals: { $sum: 1 }, totalRevenue: { $sum: '$value' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', email: '$user.email', wonDeals: 1, totalRevenue: 1, _id: 0 } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching sales leaderboard:', err);
    res.status(500).send('Server Error');
  }
};
