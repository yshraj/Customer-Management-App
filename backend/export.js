const XLSX = require("xlsx");
const { readData } = require("./backend");

function exportToExcel() {
  const data = readData();
  const workbook = XLSX.utils.book_new();

  const customersSheet = XLSX.utils.json_to_sheet(data.map((item) => ({
    Company: item.companyName,
    Address: item.address,
    City: item.city,
    State: item.state,
    GSTIN: item.gstin,
  })));

  XLSX.utils.book_append_sheet(workbook, customersSheet, "Customers");
  XLSX.writeFile(workbook, "CustomerData.xlsx");
}

module.exports = { exportToExcel };
