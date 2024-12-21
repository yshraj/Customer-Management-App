function renderAddCustomerForm(container) {
  container.innerHTML = `
    <form id="customer-form" class="needs-validation" novalidate>
      <div id="step-1">
        <h3>Step 1: Basic Customer Details</h3>
        <div class="mb-3">
          <label for="companyName" class="form-label">
            Company Name <span class="text-danger">*</span>
          </label>
          <input type="text" id="companyName" class="form-control" required />
          <div class="invalid-feedback">Company Name is required.</div>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">
            Address <span class="text-danger">*</span>
          </label>
          <input type="text" id="address" class="form-control" required />
          <div class="invalid-feedback">Address is required.</div>
        </div>
        <div class="mb-3">
          <label for="city" class="form-label">
            City <span class="text-danger">*</span>
          </label>
          <input type="text" id="city" class="form-control" required />
          <div class="invalid-feedback">City is required.</div>
        </div>
        <div class="mb-3">
          <label for="state" class="form-label">
            State <span class="text-danger">*</span>
          </label>
          <input type="text" id="state" class="form-control" required />
          <div class="invalid-feedback">State is required.</div>
        </div>
        <div class="mb-3">
          <label for="gstin" class="form-label">
            GSTIN <span class="text-danger">*</span>
          </label>
          <input type="text" id="gstin" class="form-control" required />
          <div class="invalid-feedback">GSTIN is required.</div>
        </div>
        <button type="button" class="btn btn-secondary" onclick="resetStep1()">Reset Step 1</button>
        <button type="button" class="btn btn-primary" onclick="showStep2()">Next</button>
      </div>

      <div id="step-2" style="display: none;">
        <h3>Step 2: Additional Details</h3>
        <div class="mb-3">
          <label for="fieldOfBusiness" class="form-label">Field of Business</label>
          <input type="text" id="fieldOfBusiness" class="form-control" />
        </div>
        <div id="contact-list">
          <h4>Contact Details</h4>
          <div class="contact-item">
            <div class="mb-3">
              <label class="form-label">Contact Name</label>
              <input type="text" class="form-control contactName" />
            </div>
            <div class="mb-3">
              <label class="form-label">Mobile No.</label>
              <input type="text" class="form-control contactMobile" oninput="validateAddContactButton()" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email ID</label>
              <input type="email" class="form-control contactEmail" oninput="validateAddContactButton()" />
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-secondary" onclick="resetStep2()">Reset Step 2</button>
        <button type="button" class="btn btn-success" id="addContactButton" onclick="addContact()" disabled>+ Add Another Contact</button>
        <button type="button" class="btn btn-primary" onclick="saveCustomer()">Save</button>
      </div>
    </form>
  `;
}


function resetStep1() {
  const form = document.getElementById("customer-form");
  form.reset(); // Reset all inputs
  form.classList.remove("was-validated"); // Remove validation styles
  document.getElementById("step-1").style.display = "block";
  document.getElementById("step-2").style.display = "none";
}

function resetStep2() {
  document.getElementById("fieldOfBusiness").value = "";
  const contactList = document.getElementById("contact-list");
  contactList.innerHTML = `
    <h4>Contact Details</h4>
    <div class="contact-item">
      <div class="mb-3">
        <label for="contactName" class="form-label">Contact Name</label>
        <input type="text" class="form-control contactName" oninput="toggleAddContact()" />
      </div>
      <div class="mb-3">
        <label for="contactMobile" class="form-label">Mobile No.</label>
        <input type="text" class="form-control contactMobile" />
      </div>
      <div class="mb-3">
        <label for="contactEmail" class="form-label">Email ID</label>
        <input type="email" class="form-control contactEmail" />
      </div>
    </div>
  `;
  document.getElementById("addContactButton").disabled = true;
}

function toggleAddContact() {
  const contactItems = document.querySelectorAll(".contact-item");
  const lastContact = contactItems[contactItems.length - 1];

  // Get the values of the last contact's email and phone fields
  const lastContactEmail = lastContact.querySelector(".contactEmail").value.trim();
  const lastContactMobile = lastContact.querySelector(".contactMobile").value.trim();

  // Enable/disable the "Add Another Contact" button
  const addContactButton = document.getElementById("addContactButton");
  addContactButton.disabled = !(lastContactEmail || lastContactMobile);
}

function validateAddContactButton() {
  const contactItems = document.querySelectorAll(".contact-item");
  const lastContact = contactItems[contactItems.length - 1];

  const mobile = lastContact.querySelector(".contactMobile").value.trim();
  const email = lastContact.querySelector(".contactEmail").value.trim();

  const addContactButton = document.getElementById("addContactButton");
  addContactButton.disabled = !(mobile || email); // Enable only if one is non-empty
}

function showStep2() {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  // Validate Step 1 Fields
  const form = document.getElementById("customer-form");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  step1.style.display = "none";
  step2.style.display = "block";
}

function addContact() {
  const contactList = document.getElementById("contact-list");

  // Add a new contact form
  const newContact = document.createElement("div");
  newContact.classList.add("contact-item");
  newContact.innerHTML = `
    <hr />
    <div class="mb-3">
      <label class="form-label">Contact Name</label>
      <input type="text" class="form-control contactName" />
    </div>
    <div class="mb-3">
      <label class="form-label">Mobile No.</label>
      <input type="text" class="form-control contactMobile" oninput="validateAddContactButton()" />
    </div>
    <div class="mb-3">
      <label class="form-label">Email ID</label>
      <input type="email" class="form-control contactEmail" oninput="validateAddContactButton()" />
    </div>
  `;
  contactList.appendChild(newContact);

  // Disable "Add Contact" button until valid input is provided in the new contact row
  document.getElementById("addContactButton").disabled = true;
}

function saveCustomer() {
  // Validate Basic Details
  const companyName = document.getElementById("companyName").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const gstin = document.getElementById("gstin").value.trim();

  if (!companyName || !address || !city || !state || !gstin) {
    alert("Please fill in all compulsory fields marked with *.");
    return;
  }

  // Prepare customer object
  const customer = {
    companyName,
    address,
    city,
    state,
    gstin,
    fieldOfBusiness: document.getElementById("fieldOfBusiness").value.trim(),
    contacts: [],
  };

  // Collect valid contacts
  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item) => {
    const name = item.querySelector(".contactName").value.trim();
    const mobile = item.querySelector(".contactMobile").value.trim();
    const email = item.querySelector(".contactEmail").value.trim();

    if (name || mobile || email) {
      customer.contacts.push({ name, mobile, email });
    }
  });

  // Check for duplicates
  fetch("http://localhost:3000/customers") // Endpoint to fetch all customers
    .then((response) => response.json())
    .then((customers) => {
      // Check if companyName or gstin already exists
      const isDuplicate = customers.some(
        (existingCustomer) =>
          existingCustomer.companyName.toLowerCase() === companyName.toLowerCase() ||
          existingCustomer.gstin.toUpperCase() === gstin.toUpperCase()
      );

      if (isDuplicate) {
        alert("Duplicate entry detected! Redirecting to the home page...");
        window.location.href = "index.html"; // Redirect to the home page
      } else {
        // Proceed to save the customer
        fetch("http://localhost:3000/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        })
          .then((response) => {
            if (response.ok) {
              alert("Customer saved successfully!");
              window.location.href = "index.html"; // Redirect to the home page
            } else {
              alert("Failed to save customer.");
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Error: Unable to save customer.");
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching customers:", error);
      alert("Unable to validate uniqueness. Please try again.");
    });
}
