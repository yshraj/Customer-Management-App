let currentPage = 1; // Start on the first page
const rowsPerPage = 10; // Number of rows to show per page

function renderCustomerTable(container) {
  // Fetch customers from the backend
  fetch("http://localhost:3000/customers")
    .then((response) => response.json())
    .then((data) => {
      const totalPages = Math.ceil(data.length / rowsPerPage);
      
      // Slice data for pagination
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const customersToDisplay = data.slice(startIndex, endIndex);

      container.innerHTML = `
        <h3>View Customers</h3>
        <input
          type="text"
          id="searchBox"
          class="form-control mb-3"
          placeholder="Search customers..."
          onkeyup="filterCustomers()"
        />
        <table class="table table-bordered" id="customerTable" style="font-size: 13px; margin-bottom: 15px;">
          <thead>
            <tr>
              <th style="width: 17%;">
                Company Name
                <button onclick="sortTable(0, 'asc')">↑</button>
                <button onclick="sortTable(0, 'desc')">↓</button>
              </th>
              <th style="width: 20%;">
                Address
                <button onclick="sortTable(1, 'asc')">↑</button>
                <button onclick="sortTable(1, 'desc')">↓</button>
              </th>
              <th style="width: 15%;">
                City
                <button onclick="sortTable(2, 'asc')">↑</button>
                <button onclick="sortTable(2, 'desc')">↓</button>
              </th>
              <th style="width: 15%;">
                State
                <button onclick="sortTable(3, 'asc')">↑</button>
                <button onclick="sortTable(3, 'desc')">↓</button>
              </th>
              <th style="width: 15%;">
                GSTIN
                <button onclick="sortTable(4, 'asc')">↑</button>
                <button onclick="sortTable(4, 'desc')">↓</button>
              </th>
              <th style="width: 28%;">Actions</th>
            </tr>
          </thead>

          <tbody id="customerRows">
            ${customersToDisplay
              .map(
                (customer, index) => `
                <tr>
                  <td>${customer.companyName}</td>
                  <td>${customer.address}</td>
                  <td>${customer.city}</td>
                  <td>${customer.state}</td>
                  <td>${customer.gstin}</td>
                  <td>
                    <button class="btn btn-primary btn-sm" onclick="viewCustomer(${startIndex + index})">View</button>
                    <button class="btn btn-warning btn-sm" onclick="editCustomer(${startIndex + index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${startIndex + index})">Delete</button>
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Bootstrap Pagination -->
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <button class="page-link" onclick="changePage('prev')">Previous</button>
            </li>
            <li class="page-item">
              <span class="page-link">Page ${currentPage} of ${totalPages}</span>
            </li>
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
              <button class="page-link" onclick="changePage('next')">Next</button>
            </li>
          </ul>
        </nav>
      `;
    })
    .catch((error) => console.error("Error fetching customers:", error));
}



// Change page based on Next or Previous button click
function changePage(direction) {
  const totalPages = Math.ceil(customers.length / rowsPerPage);
  if (direction === "next" && currentPage < totalPages) {
    currentPage++;
  } else if (direction === "prev" && currentPage > 1) {
    currentPage--;
  }

  renderCustomerTable(document.getElementById("customerTableContainer"));
}

// Search Functionality
function filterCustomers() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const rows = document.getElementById("customerRows").getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let match = false;
    for (let cell of cells) {
      if (cell.innerText.toLowerCase().includes(query)) {
        match = true;
        break;
      }
    }
    rows[i].style.display = match ? "" : "none";
  }
}

// Sort Functionality
function sortTable(columnIndex, direction) {
  const table = document.getElementById("customerTable");
  const rows = Array.from(table.rows).slice(1);
  const isAscending = direction === 'asc';

  // Clear active styles
  const buttons = table.querySelectorAll("th button");
  buttons.forEach(button => button.classList.remove('active', 'asc', 'desc'));

  // Add active class to the clicked button
  const clickedButton = table.rows[0].cells[columnIndex].querySelector(`button[onclick="sortTable(${columnIndex}, '${direction}')"]`);
  clickedButton.classList.add('active', direction);

  // Sort rows based on the text content
  const sortedRows = rows.sort((a, b) => {
    const aText = a.cells[columnIndex].innerText.trim();
    const bText = b.cells[columnIndex].innerText.trim();
    
    if (isAscending) {
      return aText.localeCompare(bText);
    } else {
      return bText.localeCompare(aText);
    }
  });

  // Re-insert the sorted rows
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  sortedRows.forEach(row => tbody.appendChild(row));
}


let customerToDelete = null; // To hold the customer index to be deleted

// Function to show the custom confirmation dialog
function showConfirmDialog(index) {
  customerToDelete = index;
  const confirmDialog = document.getElementById("confirmDialog");
  confirmDialog.style.display = "flex"; // Show the dialog
}

// Function to hide the custom confirmation dialog
function hideConfirmDialog() {
  const confirmDialog = document.getElementById("confirmDialog");
  confirmDialog.style.display = "none"; // Hide the dialog
}

// When "Yes" is clicked, delete the customer
document.getElementById("confirmYes").addEventListener("click", function() {
  if (customerToDelete !== null) {
    fetch(`http://localhost:3000/customers/${customerToDelete}`, { method: "DELETE" })
      .then(() => {
        alert("Customer deleted successfully");
        navigateTo("viewCustomers");  // Refresh the page after deletion
      })
      .catch((error) => console.error("Error deleting customer:", error));

    hideConfirmDialog();  // Close the dialog after deletion
  }
});

// When "No" is clicked, hide the confirmation dialog without deleting
document.getElementById("confirmNo").addEventListener("click", function() {
  hideConfirmDialog();  // Close the dialog without action
});


function deleteCustomer(index) {
  showConfirmDialog(index);  // Show the custom confirmation dialog
}

// Edit Customer
function editCustomer(index) {
  fetch(`http://localhost:3000/customers/${index}`)
    .then((response) => response.json())
    .then((customer) => {
      // Populate the form with customer data
      document.getElementById("editCustomerIndex").value = index;
      document.getElementById("editCompanyName").value = customer.companyName;
      document.getElementById("editAddress").value = customer.address;
      document.getElementById("editCity").value = customer.city;
      document.getElementById("editState").value = customer.state;
      document.getElementById("editGSTIN").value = customer.gstin;
      document.getElementById("editFieldOfBusiness").value = customer.fieldOfBusiness;

      // Populate contacts
      const contactsContainer = document.getElementById("editContactsContainer");
      contactsContainer.innerHTML = ''; // Clear existing fields

      customer.contacts.forEach((contact, index) => {
        const contactDiv = document.createElement("div");
        contactDiv.classList.add("contact-field");
        contactDiv.innerHTML = `
          <h5>Contact ${index + 1}</h5>
          <div class="form-group">
            <label for="editContactName_${index}">Name</label>
            <input type="text" id="editContactName_${index}" class="form-control" value="${contact.name}" required />
          </div>
          <div class="form-group">
            <label for="editContactMobile_${index}">Mobile</label>
            <input type="text" id="editContactMobile_${index}" class="form-control" value="${contact.mobile}" required />
          </div>
          <div class="form-group">
            <label for="editContactEmail_${index}">Email</label>
            <input type="email" id="editContactEmail_${index}" class="form-control" value="${contact.email}" />
          </div>
        `;
        contactsContainer.appendChild(contactDiv);
      });

      // Display the edit modal
      document.getElementById("editCustomerModal").style.display = "flex";
    })
    .catch((error) => console.error("Error fetching customer:", error));
}

// Add a new contact field set
function addContactField() {
  const contactsContainer = document.getElementById("editContactsContainer");
  const contactIndex = contactsContainer.children.length; // Get the current number of contacts

  const contactDiv = document.createElement("div");
  contactDiv.classList.add("contact-field");
  contactDiv.innerHTML = `
    <h5>Contact ${contactIndex + 1}</h5>
    <div class="form-group">
      <label for="editContactName_${contactIndex}">Name</label>
      <input type="text" id="editContactName_${contactIndex}" class="form-control" required />
    </div>
    <div class="form-group">
      <label for="editContactMobile_${contactIndex}">Mobile</label>
      <input type="text" id="editContactMobile_${contactIndex}" class="form-control" required />
    </div>
    <div class="form-group">
      <label for="editContactEmail_${contactIndex}">Email</label>
      <input type="email" id="editContactEmail_${contactIndex}" class="form-control" />
    </div>
  `;
  contactsContainer.appendChild(contactDiv);
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById("editCustomerModal").style.display = "none";
}

// Submit the Edited Form
function submitEditForm(event) {
  event.preventDefault();

  const index = document.getElementById("editCustomerIndex").value;
  const updatedCustomer = {
    companyName: document.getElementById("editCompanyName").value,
    address: document.getElementById("editAddress").value,
    city: document.getElementById("editCity").value,
    state: document.getElementById("editState").value,
    gstin: document.getElementById("editGSTIN").value,
    fieldOfBusiness: document.getElementById("editFieldOfBusiness").value,
    contacts: []
  };

  // Get all contact details
  const contactFields = document.getElementsByClassName("contact-field");
  for (let i = 0; i < contactFields.length; i++) {
    const contact = {
      name: document.getElementById(`editContactName_${i}`).value,
      mobile: document.getElementById(`editContactMobile_${i}`).value,
      email: document.getElementById(`editContactEmail_${i}`).value
    };
    updatedCustomer.contacts.push(contact);
  }

  // Send the PUT request to update the customer data
  fetch(`http://localhost:3000/customers/${index}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCustomer),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Customer updated successfully");
      closeEditModal(); // Close the modal after saving
      // You can refresh the customer list or update the UI here
    })
    .catch((error) => {
      console.error("Error updating customer:", error);
      alert("Error updating customer");
    });
}


// Function to view customer details
function viewCustomer(index) {
  fetch(`http://localhost:3000/customers/${index}`)
    .then((response) => response.json())
    .then((customer) => {
      const modal = document.getElementById("viewCustomerModal");
      const customerDetailsContainer = document.getElementById("viewCustomerDetails");
      
      // Clear previous content
      customerDetailsContainer.innerHTML = "";

      // Display the customer details
      customerDetailsContainer.innerHTML = `
        <p><strong>Company Name:</strong> ${customer.companyName}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
        <p><strong>City:</strong> ${customer.city}</p>
        <p><strong>State:</strong> ${customer.state}</p>
        <p><strong>GSTIN:</strong> ${customer.gstin}</p>
        <p><strong>Field of Business:</strong> ${customer.fieldOfBusiness}</p>
        
        <h5>Contacts:</h5>
        <ul>
          ${customer.contacts
            .map(
              (contact) => `
                <li>
                  <strong>Name:</strong> ${contact.name}<br>
                  <strong>Mobile:</strong> ${contact.mobile}<br>
                  <strong>Email:</strong> ${contact.email || "N/A"}
                </li>
              `
            )
            .join("")}
        </ul>
      `;

      // Show the modal
      modal.style.display = "flex";
    })
    .catch((error) => console.error("Error fetching customer:", error));
}

// Function to close the view modal
function closeViewModal() {
  const modal = document.getElementById("viewCustomerModal");
  modal.style.display = "none"; // Hide the modal
}
