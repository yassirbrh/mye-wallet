import User from '../models/UserModel';
import Report from '../models/ReportModel';
const asyncHandler = require('express-async-handler');

const createReport = asyncHandler(async (req, res) => {
    const userID = req.session.userId;
    const { reportMessage, reportType } = req.body;

    if (!reportMessage || !reportType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const report = await Report.create({ userID, reportMessage, reportType });

    res.status(201).json({
        message: 'Report created successfully. Awaiting response!',
        reportId: report._id,
    });
});

// Fetch user reports
const getReports = asyncHandler(async (req, res) => {
    const userID = req.session.userId;

    const reports = await Report.find({ userID }).sort({ doneAt: -1 });

    if (!reports || reports.length === 0) {
        return res.status(404).json({ message: 'No reports found' });
    }

    res.status(200).json(reports);
});

module.exports = { createReport, getReports };