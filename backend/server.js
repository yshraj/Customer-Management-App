const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readData, saveData } = require("./backend");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Fetch All Customers
app.get("/customers", (req, res) => {
  const customers = readData();
  res.json(customers);
});

// Delete Customer
app.delete("/customers/:index", (req, res) => {
  const customers = readData();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < customers.length) {
    customers.splice(index, 1);
    saveData(customers);
    res.send({ message: "Customer deleted successfully" });
  } else {
    res.status(400).send({ error: "Invalid index" });
  }
});

// Update Customer (Optional: Can be added later for Edit)
app.put("/customers/:index", (req, res) => {
  const customers = readData();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < customers.length) {
    customers[index] = req.body;
    saveData(customers);
    res.send({ message: "Customer updated successfully" });
  } else {
    res.status(400).send({ error: "Invalid index" });
  }
});

// Add Customer
app.post("/add", (req, res) => {
  const customers = readData(); // Read existing data
  const newCustomer = req.body;

  if (!newCustomer.companyName || !newCustomer.address || !newCustomer.city || !newCustomer.state || !newCustomer.gstin) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  customers.push(newCustomer); // Add new customer
  saveData(customers); // Save updated data
  res.send({ message: "Customer added successfully" });
});

// Fetch a specific customer by index
app.get("/customers/:index", (req, res) => {
  const customers = readData();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < customers.length) {
    res.json(customers[index]);
  } else {
    res.status(404).send({ error: "Customer not found" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
