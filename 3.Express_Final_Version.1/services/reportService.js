const Stimulsoft = require('stimulsoft-reports-js');
const sequelize = require('../config/db');
const path = require('path');
const fs = require('fs');

async function loadTemplateAndData(templatePath, filter, columns) {
  const report = new Stimulsoft.Report.StiReport();
  report.loadFile(templatePath);

  const dataSources = report.dictionary.dataSources.list;
  if (!dataSources || dataSources.length === 0) {
    throw new Error('No data sources found in the template.');
  }

  const originalSqlCommand = dataSources[0].sqlCommand;

  let selectedColumns = '*';
  if (columns && columns.length > 0) {
    selectedColumns = columns.join(', ');
  }

  const modifiedSqlCommand = filter
    ? `SELECT ${selectedColumns} FROM (${originalSqlCommand}) AS SubQuery ${filter}`
    : `SELECT ${selectedColumns} FROM (${originalSqlCommand}) AS SubQuery`;

  console.log('Modified SQL Command:', modifiedSqlCommand);

  dataSources[0].sqlCommand = modifiedSqlCommand;
  const [results] = await sequelize.query(modifiedSqlCommand);

  return { report, data: results, alias: dataSources[0].alias };
}

async function generateReport(report, data, alias, format, templateName) {
  return new Promise((resolve, reject) => {
    report.regData(alias, data);
    report.renderAsync(() => {
      switch (format) {
        case 'pdf':
          report.exportDocumentAsync((pdfData) => {
            const filePath = path.join(__dirname, '../templates', `${templateName}.pdf`);
            Stimulsoft.System.StiObject.saveAs(pdfData, filePath, 'application/pdf');
            resolve(filePath);
          }, Stimulsoft.Report.StiExportFormat.Pdf);
          break;
        case 'excel':
          report.exportDocumentAsync((excelData) => {
            const filePath = path.join(__dirname, '../templates', `${templateName}.xlsx`);
            fs.writeFileSync(filePath, excelData);
            resolve(filePath);
          }, Stimulsoft.Report.StiExportFormat.Excel2007);
          break;
        case 'html':
          const htmlData = report.exportDocument(Stimulsoft.Report.StiExportFormat.Html);
          resolve(htmlData);
          break;
        default:
          reject(new Error('Format ekspor tidak valid.'));
      }
    }, (error) => reject(error));
  });
}

module.exports = { loadTemplateAndData, generateReport };
