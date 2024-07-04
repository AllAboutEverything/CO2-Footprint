document.addEventListener('DOMContentLoaded', function () {
    // Load emissions data
    fetch('data/emissions.json')
        .then(response => response.json())
        .then(data => {
            const countriesData = [];
            const companiesData = [];

            data.forEach(row => {
                if (row.type === 'country') {
                    countriesData.push(row);
                } else if (row.type === 'company') {
                    companiesData.push(row);
                }
            });

            // Populate countries table
            populateTable('countries-table', countriesData);
            // Populate companies table
            populateTable('companies-table', companiesData);

            // Search functionality for countries table
            document.getElementById('countrySearch').addEventListener('input', function () {
                filterTable('countries-table', this.value);
            });

            // Search functionality for companies table
            document.getElementById('companySearch').addEventListener('input', function () {
                filterTable('companies-table', this.value);
            });
        });

    function populateTable(tableId, data) {
        const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${sanitizeInput(row.name)}</td><td>${sanitizeInput(row.emissions)}</td>`;
            tableBody.appendChild(tr);
        });
    }

    // Detect local navigation
    const userLang = navigator.language || navigator.userLanguage;
    const rtlLangs = ['ar', 'he', 'fa', 'ur'];
    if (rtlLangs.some(lang => userLang.startsWith(lang))) {
            document.body.classList.add('rtl');
    }

    function sanitizeInput(input) {
        const element = document.createElement('div');
        element.textContent = input;
        return element.innerHTML;
    }

    function filterTable(tableId, searchTerm) {
        const table = document.getElementById(tableId);
        const rows = table.getElementsByTagName('tr');
        const lowerSearchTerm = searchTerm.toLowerCase();

        for (let i = 1; i < rows.length; i++) { // Start at 1 to skip table header
            const cells = rows[i].getElementsByTagName('td');
            let showRow = false;

            for (let j = 0; j < cells.length; j++) {
                if (cells[j].textContent.toLowerCase().includes(lowerSearchTerm)) {
                    showRow = true;
                    break;
                }
            }

            rows[i].style.display = showRow ? '' : 'none';
        }
    }

    window.sortTable = function (colIndex, tableId) {
        const table = document.getElementById(tableId);
        const header = table.getElementsByTagName('th')[colIndex];
        const rows = Array.from(table.getElementsByTagName('tr')).slice(1); // Exclude header row
        const isNumericColumn = !isNaN(rows[0].getElementsByTagName('td')[colIndex].textContent);
        const isAscending = header.classList.contains('asc');

        rows.sort((a, b) => {
            const aText = a.getElementsByTagName('td')[colIndex].textContent;
            const bText = b.getElementsByTagName('td')[colIndex].textContent;

            if (isNumericColumn) {
                return isAscending ? parseFloat(aText) - parseFloat(bText) : parseFloat(bText) - parseFloat(aText);
            }

            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        rows.forEach(row => table.getElementsByTagName('tbody')[0].appendChild(row));

        // Toggle sorting order
        header.classList.toggle('asc', !isAscending);
        header.classList.toggle('desc', isAscending);

        // Remove sort indicators from other headers
        Array.from(header.parentNode.children).forEach(th => {
            if (th !== header) {
                th.classList.remove('asc', 'desc');
            }
        });
    }
});
