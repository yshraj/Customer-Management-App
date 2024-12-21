function renderDownloadPage(container) {
    container.innerHTML = `
        <h2>Download Customer Data</h2>
        <button class="btn btn-success" onclick="downloadCustomerData()">Download Excel</button>
    `;
}

// Function to handle data download
function downloadCustomerData() {
    fetch("http://localhost:3000/customers")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch customer data.");
            }
            return response.json();
        })
        .then((data) => {
            createExcelFile(data);
        })
        .catch((error) => {
            console.error("Error fetching customer data:", error);
        });
}

// Create and download Excel file
function createExcelFile(data) {
    const workbook = XLSX.utils.book_new();

    // Create Sheet 1: Company Details
    const sheet1Data = data.map((customer) => ({
        CompanyName: customer.companyName,
        Address: customer.address,
        City: customer.city,
        State: customer.state,
        GSTIN: customer.gstin,
        FieldOfBusiness: customer.fieldOfBusiness,
    }));
    const sheet1 = XLSX.utils.json_to_sheet(sheet1Data);
    XLSX.utils.book_append_sheet(workbook, sheet1, "Company Details");

    // Create Sheet 2: Contact Details
    const sheet2Data = [];
    data.forEach((customer) => {
        customer.contacts.forEach((contact, index) => {
            sheet2Data.push({
                CompanyName: customer.companyName, 
                ContactName: contact.name,
                Mobile: contact.mobile,
                Email: contact.email,
            });
        });
    });
    const sheet2 = XLSX.utils.json_to_sheet(sheet2Data);
    XLSX.utils.book_append_sheet(workbook, sheet2, "Contact Details");

    // Write the Excel File
    XLSX.writeFile(workbook, "CustomerData.xlsx");
}

