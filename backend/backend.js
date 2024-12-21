const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../data/customers.json");

// Read Data
function readData() {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return [];
}

// Write Data
function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readData, saveData };
