let data = JSON.parse(localStorage.getItem("parkingData")) || [];
let deletedData = JSON.parse(localStorage.getItem("deletedData")) || [];

function showAddForm() {
    document.getElementById("addForm").style.display = "block";
}

function hideAddForm() {
    document.getElementById("addForm").style.display = "none";
    document.getElementById("newPersonForm").reset();
}

document.getElementById("newPersonForm").onsubmit = function (event) {
    event.preventDefault();
    const form = event.target;
    const newPerson = {
        parkingNo: form.parkingNo.value,
        apartmentNo: form.apartmentNo.value,
        name: form.name.value,
        lastName: form.lastName.value,
        carRegistration: form.carRegistration.value,
        telephone: form.telephone.value,
        email: form.email.value,
        profilePicture: form.profilePicture.files[0] ? URL.createObjectURL(form.profilePicture.files[0]) : "No Image",
    };
    data.push(newPerson);
    localStorage.setItem("parkingData", JSON.stringify(data));
    form.reset();
    hideAddForm();
    searchData();
};

function searchData() {
    const query = document.getElementById("search").value.trim().toLowerCase();
    const filteredData = data.filter((person) =>
        Object.values(person).some((value) =>
            value.toLowerCase().includes(query)
        )
    );
    displayData(filteredData);
}

function displayData(dataToShow) {
    const tableBody = document.getElementById("dataTable").querySelector("tbody");
    tableBody.innerHTML = "";
    dataToShow.forEach((person, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${person.parkingNo}</td>
            <td>${person.apartmentNo}</td>
            <td>${person.name}</td>
            <td>${person.lastName}</td>
            <td>${person.telephone}</td>
            <td>${person.email}</td>
            <td>${person.carRegistration}</td>
            <td>${
                person.profilePicture !== "No Image"
                    ? `<img src="${person.profilePicture}" alt="Profile Picture" class="profile-pic">`
                    : "No Image"
            }</td>
            <td>
                <button class="delete" onclick="deleteData(${index})">Delete</button>
                <button onclick="updatePerson(${index})">Update</button>
            </td>
        `;
    });
}

function deleteData(index) {
    deletedData.push(data[index]);
    localStorage.setItem("deletedData", JSON.stringify(deletedData));
    data.splice(index, 1);
    localStorage.setItem("parkingData", JSON.stringify(data));
    searchData();
}

function updatePerson(index) {
    const person = data[index];
    const form = document.getElementById("newPersonForm");
    form.parkingNo.value = person.parkingNo;
    form.apartmentNo.value = person.apartmentNo;
    form.name.value = person.name;
    form.lastName.value = person.lastName;
    form.carRegistration.value = person.carRegistration;
    form.telephone.value = person.telephone;
    form.email.value = person.email;
    form.onsubmit = function (event) {
        event.preventDefault();
        data[index] = {
            parkingNo: form.parkingNo.value,
            apartmentNo: form.apartmentNo.value,
            name: form.name.value,
            lastName: form.lastName.value,
            carRegistration: form.carRegistration.value,
            telephone: form.telephone.value,
            email: form.email.value,
            profilePicture: form.profilePicture.files[0] ? URL.createObjectURL(form.profilePicture.files[0]) : person.profilePicture,
        };
        localStorage.setItem("parkingData", JSON.stringify(data));
        searchData();
        form.reset();
        hideAddForm();
    };
    showAddForm();
}

function showAllData() {
    displayData(data);
}

function showDeletedData() {
    const tableBody = document.getElementById("dataTable").querySelector("tbody");
    tableBody.innerHTML = "";
    deletedData.forEach((person, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${person.parkingNo}</td>
            <td>${person.apartmentNo}</td>
            <td>${person.name}</td>
            <td>${person.lastName}</td>
            <td>${person.telephone}</td>
            <td>${person.email}</td>
            <td>${person.carRegistration}</td>
            <td>${
                person.profilePicture !== "No Image"
                    ? `<img src="${person.profilePicture}" alt="Profile Picture" class="profile-pic">`
                    : "No Image"
            }</td>
            <td>
                <button class="restore" onclick="restoreData(${index})">Restore</button>
                <button class="delete" onclick="permanentDelete(${index})">Permanently Delete</button>
            </td>
        `;
    });
}

function restoreData(index) {
    data.push(deletedData[index]);
    localStorage.setItem("parkingData", JSON.stringify(data));
    deletedData.splice(index, 1);
    localStorage.setItem("deletedData", JSON.stringify(deletedData));
    showDeletedData();
}

function permanentDelete(index) {
    deletedData.splice(index, 1);
    localStorage.setItem("deletedData", JSON.stringify(deletedData));
    showDeletedData();
}

// Initialize by displaying all data
searchData();
