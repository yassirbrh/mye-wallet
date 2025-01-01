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

    // Fetch and sort reports by doneAt in descending order
    const reports = await Report.find({ userID }).sort({ doneAt: -1 });

    if (!reports || reports.length === 0) {
        return res.status(404).json({ message: 'No reports found' });
    }

    // Process reports to group and rename them by date
    const groupedReports = {};
    reports.forEach((report) => {
        const formattedDate = new Date(report.doneAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace(/ /g, '_'); // Convert to "26_Dec_2024"
        
        if (!groupedReports[formattedDate]) {
            groupedReports[formattedDate] = [];
        }

        groupedReports[formattedDate].push(report);
    });

    // Rename reports within each date group
    const renamedReports = [];
    Object.keys(groupedReports).forEach((date) => {
        groupedReports[date].forEach((report, index) => {
            const reportName = groupedReports[date].length === 1 
                ? `${date}_Report` 
                : `${date}_Report${index + 1}`;
            const formattedDate = new Date(report.doneAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
            renamedReports.push({ ...report.toObject(), reportName, doneAt: formattedDate });
        });
    });

    res.status(200).json(renamedReports);
});


module.exports = { createReport, getReports };