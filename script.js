// Toggles visibility of elements
function toggleBox() {
    var toggleBox = document.getElementById('toggleBox');
    toggleBox.classList.toggle('hidden');
}

function toggleHome() {
    var toggleHomeBox = document.getElementById('toggleHomeBox');
    toggleHomeBox.classList.toggle('hidden');
}

// Search functionality
document.getElementById('searchBox').addEventListener('input', searchTable);
document.getElementById('searchBox').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchTable();
    }
});

function searchTable() {
    const query = document.getElementById('searchBox').value.toUpperCase();
    const rows = document.querySelectorAll('#dataTable tbody tr');
    let matchedRows = 0;

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const rowText = Array.from(cells).map(cell => cell.textContent.toUpperCase()).join(' ');
        if (rowText.includes(query)) {
            row.style.display = '';
            matchedRows++;
        } else {
            row.style.display = 'none';
        }
    });

    document.getElementById('totalEntries').textContent = `Total Entries: ${matchedRows}`;
}

// Handle form submission and update table
let editRow = null;

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value || " ";
    });

    if (editRow) {
        updateRow(editRow, data);
    } else {
        addNewRow(data);
    }

    event.target.reset();
    updateRowCount();
    saveTableData();
});

function addNewRow(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = generateRowHTML(data, tableBody.rows.length + 1);
    tableBody.appendChild(newRow);
}

function updateRow(row, data) {
    row.innerHTML = generateRowHTML(data, row.cells[0].textContent);
    editRow = null;
}

function generateRowHTML(data, rowIndex) {
    return `
        <td>${rowIndex}</td>
        <td>${data.name}</td>
        <td>${data.cardNo}</td>
        <td>${data.Blocked || " "}</td>
        <td>${data.company}</td>
        <td>${data.mobilePhone}</td>
        <td>${data.remark}</td>
        <td>${data.vehicleNo1}</td>
        <td>${data.vehicleNo2}</td>
        <td>${data.vehicleNo3}</td>
        <td>${data.vehicleNo4}</td>
        <td>${data.validFrom}</td>
        <td>${data.validUntil}</td>
        <td>${data.bayNo}</td>
        <td>${data.zone}</td>
        <td>${data.cardType}</td>
        <td class="actions">
            <button onclick="editRowFunction(this)">Edit</button>
            <button onclick="saveRowFunction(this)">Save</button>
            <button onclick="deleteRowFunction(this)">Delete</button>
        </td>
    `;
}

function editRowFunction(button) {
    editRow = button.closest('tr');
    const cells = editRow.getElementsByTagName('td');

    document.getElementById('name').value = cells[1]?.textContent || '';
    document.getElementById('cardNo').value = cells[2]?.textContent || '';

    const blockedStatus = cells[3]?.textContent.trim().toUpperCase();
    document.getElementById('block').checked = (blockedStatus === 'BLOCK');
    document.getElementById('unblock').checked = (blockedStatus !== 'BLOCK');

    document.getElementById('company-input').value = cells[4]?.textContent || '';

    document.getElementById('mobilePhone').value = cells[5]?.textContent || '';
    document.getElementById('remark').value = cells[6]?.textContent || '';
    document.getElementById('vehicleNo1').value = cells[7]?.textContent || '';
    document.getElementById('vehicleNo2').value = cells[8]?.textContent || '';
    document.getElementById('vehicleNo3').value = cells[9]?.textContent || '';
    document.getElementById('vehicleNo4').value = cells[10]?.textContent || '';
    document.getElementById('validFrom').value = cells[11]?.textContent || '';
    document.getElementById('validUntil').value = cells[12]?.textContent || '';
    document.getElementById('bayNo').value = cells[13]?.textContent || '';
    document.getElementById('zone').value = cells[14]?.textContent || '';
    document.getElementById('cardType').value = cells[15]?.textContent || '';
}

function saveRowFunction(button) {
    saveTableData();
    alert('Data saved successfully!');
}

function deleteRowFunction(button) {
    if (confirm('Are you sure you want to delete this row?')) {
        button.closest('tr').remove();
        updateRowCount();
        saveTableData();
    }
}

function updateRowCount() {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').textContent = index + 1;
    });
    saveTableData();
}

function saveTableData() {
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    const data = [];

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => cell.textContent.trim());
        data.push(rowData);
    });

    localStorage.setItem('tableData', JSON.stringify(data));
}

function loadTableData() {
    const data = JSON.parse(localStorage.getItem('tableData'));
    if (data) {
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = ''; // Clear existing table content before loading data

        data.forEach((rowData, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${rowData[1]}</td>
                <td>${rowData[2]}</td>
                <td>${rowData[3]}</td>
                <td>${rowData[4]}</td>
                <td>${rowData[5]}</td>
                <td>${rowData[6]}</td>
                <td>${rowData[7]}</td>
                <td>${rowData[8]}</td>
                <td>${rowData[9]}</td>
                <td>${rowData[10]}</td>
                <td>${rowData[11]}</td>
                <td>${rowData[12]}</td>
                <td>${rowData[13]}</td>
                <td>${rowData[14]}</td>
                <td>${rowData[15]}</td>
                <td class="actions">
                    <button onclick="editRowFunction(this)">Edit</button>
                    <button onclick="deleteRowFunction(this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });

        updateRowCount(); // Update counts after loading data
    }
}function updateRowCount() {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    let visibleRows = 0;
    let reservedCount = 0;
    let floatingCount = 0;
    let additionalCount = 0;
    let tendamCount = 0;
    let blockCount = 0;

    rows.forEach((row, index) => {
        if (row.style.display !== 'none') {
            visibleRows++;
            row.cells[0].textContent = visibleRows;

            const cardType = row.cells[14].textContent.trim().toUpperCase();
            const blockedStatus = row.cells[3].textContent.trim().toUpperCase();

            switch (cardType) {
                case 'RESERVED': reservedCount++; break;
                case 'FLOATING': floatingCount++; break;
                case 'ADDITIONAL': additionalCount++; break;
                case 'TENDAM': tendamCount++; break;
            }

            if (blockedStatus === 'BLOCK') {
                blockCount++;
            }
        }
    });

    document.getElementById('rowCount').textContent = visibleRows;
    document.getElementById('reservedCount').textContent = reservedCount;
    document.getElementById('floatingCount').textContent = floatingCount;
    document.getElementById('additionalCount').textContent = additionalCount;
    document.getElementById('tendamCount').textContent = tendamCount;
    document.getElementById('blockCount').textContent = blockCount;
    document.getElementById('totalEntries').textContent = `Total Entries: ${visibleRows}`;

    saveTableData();  // Save updated data after counting
}




document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('th.sortable');
    
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const table = header.closest('table');
        const index = Array.from(header.parentNode.children).indexOf(header);
        const rows = Array.from(table.querySelectorAll('tbody tr'));
  
        const isAscending = header.classList.contains('asc');
        header.classList.toggle('asc', !isAscending);
        header.classList.toggle('desc', isAscending);
  
        rows.sort((a, b) => {
          const cellA = a.children[index].innerText.trim();
          const cellB = b.children[index].innerText.trim();
  
          if (isAscending) {
            return cellA.localeCompare(cellB);
          } else {
            return cellB.localeCompare(cellA);
          }
        });
  
        rows.forEach(row => table.querySelector('tbody').appendChild(row));
      });
    });
  });







 function handleSelectChange() {
            const select = document.getElementById('company-select');
            const input = document.getElementById('company-input');
            
            if (select.value) {
                input.value = select.value;
            }
        }

        function handleInputChange() {
            const select = document.getElementById('company-select');
            const input = document.getElementById('company-input');
            
            // Update select box to match input field value
            const options = Array.from(select.options);
            const inputValue = input.value;
            const matchedOption = options.find(option => option.value === inputValue);

            if (matchedOption) {
                select.value = inputValue;
            }
        }


        function ensureStartsWithSN() {
            const input = document.getElementById('cardNo');
            const value = input.value.toUpperCase();

            // Ensure the value starts with "SN"
            if (!value.startsWith('SN')) {
                input.value = 'SN' + value.replace(/^SN/, '');
            }
        }



        document.getElementById('mobilePhone').addEventListener('input', function(event) {
            const input = event.target;
            let value = input.value;
        
            // Remove any non-digit characters
            value = value.replace(/\D/g, '');
        
            // Format the value to standard format: 012 345 6789
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value.replace(/(\d{0,3})/, '$1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '$1 $2');
                } else {
                    value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3');
                }
            }
        
            input.value = value;
        });




// Load table data on page load
window.onload = loadTableData;
