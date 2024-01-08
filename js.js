document.addEventListener('DOMContentLoaded', function () {
    const crudForm = document.getElementById('crudForm');
    const tableBody = document.getElementById('tableBody');
    const editForm = document.getElementById('editForm');
    const editIdInput = document.getElementById('editId');
    const editLastNameInput = document.getElementById('editLastName');
    const editFirstNameInput = document.getElementById('editFirstName');
    const editGenderInput = document.getElementById('editGender');
    const editDobInput = document.getElementById('editDob');
    const addLastNameInput = document.getElementById('lastName');
    const addFirstNameInput = document.getElementById('firstName');
    const addGenderInput = document.getElementById('gender');
    const addDobInput = document.getElementById('dob');
    const searchInput = document.getElementById('search');

    let data = loadDataFromLocal();
    displayData();

    function toggleSortDirection() {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    crudForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newLastName = addLastNameInput.value.trim();
        const newFirstName = addFirstNameInput.value.trim();
        const newGender = addGenderInput.value.trim();
        const newDOB = addDobInput.value.trim();

        if (newLastName !== '' && newFirstName !== '' && newGender !== '' && newDOB !== '') {

            addData(newLastName, newFirstName, newGender, newDOB);

            displayData();

            addLastNameInput.value = '';
            addFirstNameInput.value = '';
            addGenderInput.value = '';
            addDobInput.value = '';

            closeAddModal();
        }
    });


    // Edit form 
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const editId = parseInt(editIdInput.value);
        const editLastName = editLastNameInput.value.trim();
        const editFirstName = editFirstNameInput.value.trim();
        const editGender = editGenderInput.value.trim();
        const editDOB = editDobInput.value.trim();

        if (editLastName !== '' && editFirstName !== '' && editGender !== '' && editDOB !== '') {

            updateData(editId, editLastName, editFirstName, editGender, editDOB);

            closeEditModal();

            // Update display
            displayData();
        }
    });

    // Function to display data in the table
    function displayData(dataToDisplay) {

        // Clear existing table rows
        tableBody.innerHTML = '';

        const itemsToDisplay = dataToDisplay || data;

        itemsToDisplay.forEach(item => {
            const formattedDate = new Date(item.dob).toDateString();

            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.lastName}</td>` +
                `<td>${item.firstName}</td>` +
                `<td>${item.gender}</td>` +
                `<td>${formattedDate}</td>` +
                '<td>' +
                `<button type="button" onclick="editData(${item.id})"><i class="fa-regular fa-edit"></i></button>&nbsp;` +
                `<button type="button" onclick="deleteData(${item.id})"><i class="fa-solid fa-trash"></i></button>` +
                '</td>';
            tableBody.appendChild(row);
        });
    }

    // add data
    function addData(lastName, firstName, gender, dob) {
        const newEntry = {
            id: Date.now(),
            lastName: lastName,
            firstName: firstName,
            gender: gender,
            dob: dob
        };

        data.push(newEntry)
        saveDataToLocal(data)

    }

    // update data 
    function updateData(id, lastName, firstName, gender, dob) {
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index].lastName = lastName;
            data[index].firstName = firstName;
            data[index].gender = gender;
            data[index].dob = dob;
        }
        saveDataToLocal(data)
    }

    // delete data from the array
    window.deleteData = function (id) {
        data = data.filter(item => item.id !== id);

        // Update display
        displayData();
    };

    // edit data
    window.editData = function (id) {
        const itemToEdit = data.find(item => item.id === id);

        editIdInput.value = itemToEdit.id;
        editLastNameInput.value = itemToEdit.lastName;
        editFirstNameInput.value = itemToEdit.firstName;
        editGenderInput.value = itemToEdit.gender;
        editDobInput.value = itemToEdit.dob;

        // Show edit modal
        openEditModal();
    };

    // Function to cancel edit operation
    window.cancelEdit = function () {
        closeEditModal();
    };

    // Function to search data
    window.searchData = function () {
        const searchInputValue = searchInput.value.trim().toLowerCase();

        const filteredData = data.filter(item =>
            item.lastName.toLowerCase().includes(searchInputValue) ||
            item.firstName.toLowerCase().includes(searchInputValue) ||
            item.gender.toLowerCase().includes(searchInputValue) ||
            item.dob.toLowerCase().includes(searchInputValue)
        );

        // Update display with filtered data
        displayData(filteredData);
    };


    function saveDataToLocal(data) {
        localStorage.setItem('crudData', JSON.stringify(data));
    }

    function loadDataFromLocal() {
        const storedData = localStorage.getItem('crudData');
        return storedData ? JSON.parse(storedData) : [];
    }


    let sortDirection = 'asc'; // Default sorting direction

    // Property mapping
    const propertyMap = {
        'Last Name': 'lastName',
        'First Name': 'firstName',
        'Gender': 'gender',
        'Date of Birth': 'dob',
    };

    // Function to toggle sorting order
    function toggleSortDirection() {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    // Function to sort data
    function sortTable(columnName) {
        toggleSortDirection();

        const objectProperty = propertyMap[columnName];

        data.sort((a, b) => {
            const valueA = a[objectProperty];
            const valueB = b[objectProperty];

            const multiplier = sortDirection === 'asc' ? 1 : -1;

            if (objectProperty === 'dob') {
                const dateA = new Date(valueA).getTime();
                const dateB = new Date(valueB).getTime();

                return (dateA - dateB) * multiplier;
            } else {
                const stringA = String(valueA).toLowerCase();
                const stringB = String(valueB).toLowerCase();

                return stringA.localeCompare(stringB) * multiplier;
            }
        });

        displayData();
    }

    // Add event listeners for sorting when clicking on table headers
    const tableHeaders = document.querySelectorAll('#table th');
    tableHeaders.forEach(header => {
        header.addEventListener('click', function (event) {
            const columnName = event.target.textContent.trim();
            sortTable(columnName);
        });
    });
});

