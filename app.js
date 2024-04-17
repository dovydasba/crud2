// app.ts
// Firebase konfigūracija
var firebaseConfig = {
    apiKey: "AIzaSyB4rdqtRcYfUia33gc6Fp1IbvOzniiXt4Y",
    authDomain: "puikistovykla.firebaseapp.com",
    databaseURL: "https://puikistovykla-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "puikistovykla",
    storageBucket: "puikistovykla.appspot.com",
    messagingSenderId: "1049267344881",
    appId: "1:1049267344881:web:f7b463a5eb1f40ac28e050",
    measurementId: "G-42VFXGK658"
};
// Inicializuojame Firebase
firebase.initializeApp(firebaseConfig);
// Gauname nuorodą į duomenų bazę
var database = firebase.database();
// Gauname formą
var form = document.getElementById('registrationForm');
// Funkcija, kuri įterpia duomenis į Firebase duomenų bazę
function submitForm(e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var surname = document.getElementById('surname').value;
    var birthYear = document.getElementById('birthYear').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    database.ref('registrations/').push({
        name: name,
        surname: surname,
        birthYear: birthYear,
        gender: gender,
        email: email,
        phone: phone
    });
    form.reset();
}
// Priskiriame funkciją formos pateikimo įvykiui
form.addEventListener('submit', submitForm);
// Get the table element
var table = document.getElementById('registrationsTable');
// Function to add a row to the table
function addRow(data, key) {
    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = data.name;
    row.insertCell(1).innerHTML = data.surname;
    row.insertCell(2).innerHTML = data.birthYear;
    row.insertCell(3).innerHTML = data.gender;
    row.insertCell(4).innerHTML = data.email;
    row.insertCell(5).innerHTML = data.phone;
    var editCell = row.insertCell(6);
    editCell.innerHTML = '<button onclick="editRow(\'' + key + '\')">Redaguoti</button>';
    row.setAttribute('data-key', key); // Store the key in the row for later use
}
// Retrieve data from Firebase and add to the table
database.ref('registrations/').on('child_added', function (snapshot) {
    addRow(snapshot.val());
});
function editRow(key) {
    // Retrieve the data for the given key
    database.ref('registrations/' + key).once('value', function (snapshot) {
        var data = snapshot.val();
        // Fill the form with the data
        document.getElementById('name').value = data.name;
        document.getElementById('surname').value = data.surname;
        document.getElementById('birthYear').value = data.birthYear;
        document.getElementById('email').value = data.email;
        document.getElementById('phone').value = data.phone;
        document.getElementById('male').checked = data.gender === 'male';
        document.getElementById('female').checked = data.gender === 'female';
        // Change the form to update mode
        document.getElementById('form').setAttribute('data-key', key);
        // Show the confirm button
        document.getElementById('confirmButton').style.display = 'block';
    });
}
document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    // Get the key from the form
    var key = this.getAttribute('data-key');
    if (key) { // If the key exists, update the existing data
        database.ref('registrations/' + key).set({
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            birthYear: document.getElementById('birthYear').value,
            gender: document.getElementById('male').checked ? 'male' : 'female',
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        });
    }
    else { // If the key doesn't exist, add new data
        database.ref('registrations/').push({
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            birthYear: document.getElementById('birthYear').value,
            gender: document.getElementById('male').checked ? 'male' : 'female',
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        });
    }
    // Clear the form
    this.reset();
    this.removeAttribute('data-key');
    // Hide the confirm button
    document.getElementById('confirmButton').style.display = 'none';
});
