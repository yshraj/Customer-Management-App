// Function to navigate between pages
function navigateTo(page) {
  const appContent = document.getElementById("app-content");
  const searchSection = document.getElementById("search-section");

  // Hide the search section by default
  searchSection.style.display = "none";

  // Clear app content
  appContent.innerHTML = "";

  if (page === "home") {
    // Home Page: Show buttons and the search bar
    searchSection.style.display = "block";
    loadHomePage();
  } else if (page === "addCustomer") {
    // Load Add Customer Page
    loadScript("./js/addCustomer.js", () => renderAddCustomerForm(appContent));
  } else if (page === "viewCustomers") {
    // Load View/Edit Customers Page
    loadScript("./js/viewCustomers.js", () => renderCustomerTable(appContent));
  } else if (page === "downloadData") {
    // Load Download Data Page
    loadScript("./js/download.js", () => renderDownloadPage(appContent));
  }
}

// Function to load the home page
function loadHomePage() {
  const appContent = document.getElementById("app-content");

  // Clear any dynamic content and reset to only buttons
  appContent.innerHTML = ""; // Home page only shows buttons
}

// Dynamically load script files
function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// Function to search and display customers
function searchCustomers() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const searchResults = document.getElementById("searchResults");

  // Clear previous search results
  searchResults.innerHTML = "";

  if (searchInput === "") {
    // If input is empty, do not fetch or display results
    return;
  }

  // Fetch all customers from the backend
  fetch("http://localhost:3000/customers")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch customer data.");
      }
      return response.json();
    })
    .then((customers) => {
      // Filter customers based on search input
      const filteredCustomers = customers.filter(
        (customer) =>
          customer.companyName.toLowerCase().includes(searchInput) ||
          customer.gstin.toLowerCase().includes(searchInput)
      );

      // Display matching customers
      if (filteredCustomers.length > 0) {
        filteredCustomers.forEach((customer) => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item", "list-group-item-action");
          listItem.textContent = `${customer.companyName} (${customer.gstin})`;
          searchResults.appendChild(listItem);
        });
      } else {
        // No results found
        const noResults = document.createElement("li");
        noResults.classList.add("list-group-item");
        noResults.textContent = "No matching customers found.";
        searchResults.appendChild(noResults);
      }
    })
    .catch((error) => {
      console.error("Error:", error);

      // Handle fetch errors gracefully
      const errorItem = document.createElement("li");
      errorItem.classList.add("list-group-item", "text-danger");
      errorItem.textContent = "Error fetching customer data.";
      searchResults.appendChild(errorItem);
    });
}

// On page load, navigate to the home page
window.onload = function () {
  navigateTo("home");
};
