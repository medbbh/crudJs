document.addEventListener('DOMContentLoaded', function () {
    const crudForm = document.getElementById('crudForm');
    const addModal = document.getElementById('addModal');
    const editModal = document.getElementById('editModal');
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

    // Load data from localStorage on page load
    let data = loadDataFromLocal();
    // displayData();


    // Event listener for form submission (Add Form)
    crudForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newLastName = addLastNameInput.value.trim();
        const newFirstName = addFirstNameInput.value.trim();
        const newGender = addGenderInput.value.trim();
        const newDOB = addDobInput.value.trim();

        if (newLastName !== '' && newFirstName !== '' && newGender !== '' && newDOB !== '') {
            // Create operation
            addData(newLastName, newFirstName, newGender, newDOB);

            // Update display
            displayData();

            // Clear input fields
            addLastNameInput.value = '';
            addFirstNameInput.value = '';
            addGenderInput.value = '';
            addDobInput.value = '';

            // Close the modal
            closeAddModal();
        }
    });

    // Event listener for form submission (Edit Form)
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const editId = parseInt(editIdInput.value);
        const editLastName = editLastNameInput.value.trim();
        const editFirstName = editFirstNameInput.value.trim();
        const editGender = editGenderInput.value.trim();
        const editDOB = editDobInput.value.trim();

        if (editLastName !== '' && editFirstName !== '' && editGender !== '' && editDOB !== '') {
            // Update operation
            updateData(editId, editLastName, editFirstName, editGender, editDOB);

            // Hide edit modal
            closeEditModal();

            // Update display
            displayData();
        }
    });

    // Function to display data in the table
    function displayData(dataToDisplay) {
        // Clear existing table rows
        tableBody.innerHTML = '';

        // Use the provided data or the filtered data
        const itemsToDisplay = dataToDisplay || data;

        // Populate table with data
        itemsToDisplay.forEach(item => {
            const formattedDate = new Date(item.dob).toDateString();

            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.lastName}</td>` +
                `<td>${item.firstName}</td>` +
                `<td>${item.gender}</td>` +
                `<td>${formattedDate}</td>` +
                '<td>' +
                `<button type="button" onclick="editData(${item.id})"><i class="fa-regular fa-edit"></i></button>` +
                `<button type="button" onclick="deleteData(${item.id})"><i class="fa-solid fa-trash"></i></button>` +
                '</td>';
            tableBody.appendChild(row);
        });
    }

    // Function to add data to the array
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

    // Function to update data in the array
    function updateData(id, lastName, firstName, gender, dob) {
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index].lastName = lastName;
            data[index].firstName = firstName;
            data[index].gender = gender;
            data[index].dob = dob;
        }
    }

    // Function to delete data from the array
    window.deleteData = function (id) {
        data = data.filter(item => item.id !== id);

        // Update display after deletion
        displayData();
    };

    // Function to edit data
    window.editData = function (id) {
        const itemToEdit = data.find(item => item.id === id);

        // Populate edit form with existing data
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

        // Filter data based on search input
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


    function sortDataBy(property) {
        data.sort((a, b) => {
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
            return 0;
        });
    }

    function handleSortClick(event) {
        console.log('Sorting clicked!');
    
        const columnHeader = event.target;
        const columnName = columnHeader.textContent.toLowerCase().trim();
    
        console.log('Column Name:', columnName);
    
        if (columnName) {
            sortDataBy(columnName);
            console.log('Data after sorting:', data);
            displayData();  // Update display after sorting
        }
    }
    

    // Add event listeners for sorting when clicking on table headers
    const tableHeaders = document.querySelectorAll('#table thead th');
    tableHeaders.forEach(header => {
        header.addEventListener('click', handleSortClick);
        
    });
    displayData();
});

