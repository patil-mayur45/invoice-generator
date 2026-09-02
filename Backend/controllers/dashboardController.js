import Invoice from "../models/Invoice.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusCounts, totals, monthly, recent] = await Promise.all([
      Invoice.aggregate([
        { $match: { userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Invoice.aggregate([
        { $match: { userId, status: "paid" } },
        { $group: { _id: null, revenue: { $sum: "$total" } } },
      ]),
      Invoice.aggregate([
        { $match: { userId, status: "paid" } },
        {
          $group: {
            _id: { year: { $year: "$issueDate" }, month: { $month: "$issueDate" } },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
      Invoice.find({ userId }).populate("clientId", "name").sort({ createdAt: -1 }).limit(5),
    ]);

    const statusMap = { draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0 };
    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const totalInvoices = Object.values(statusMap).reduce((a, b) => a + b, 0);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyRevenue = monthly.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      revenue: m.revenue,
    }));

    res.json({
      totalRevenue: totals[0]?.revenue || 0,
      totalInvoices,
      paid: statusMap.paid,
      pending: statusMap.sent + statusMap.draft,
      overdue: statusMap.overdue,
      monthlyRevenue,
      recentInvoices: recent,
    });
  } catch (err) {
    next(err);
  }
};
