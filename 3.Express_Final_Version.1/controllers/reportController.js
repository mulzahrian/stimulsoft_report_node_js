const { loadTemplateAndData, generateReport } = require('../services/reportService');

const viewReport = async (req, res) => {
  const { filter, columns } = req.body;

  try {
    const { report, data, alias } = await loadTemplateAndData(req.templatePath, filter, columns);
    const htmlData = await generateReport(report, data, alias, 'html', '');
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlData);
  } catch (error) {
    console.error('Error generating view:', error);
    res.status(500).send('Error generating view');
  }
};

const downloadReport = async (req, res) => {
  const { format } = req.params;
  const { filter, columns } = req.body;
  const templateName = req.params.filename.replace('.mrt', '');

  try {
    const { report, data, alias } = await loadTemplateAndData(req.templatePath, filter, columns);
    const filePath = await generateReport(report, data, alias, format, templateName);
    res.download(filePath);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report');
  }
};

module.exports = { viewReport, downloadReport };
