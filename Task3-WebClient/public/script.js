// script.js

// Получение данных из API и отображение в таблице
fetch('/api/flowdatas')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#flowDataTable tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.timestamp).toLocaleString()}</td>
                <td>${item.device_id}</td>
                <td>${item.location}</td>
                <td>${item.flow_rate}</td>
                <td>${item.water_temperature}</td>
                <td>${item.pressure}</td>
                <td>${item.status}</td>
                <td>${item.units}</td>
                <td>${item.calibration}</td>
                <td><button class="delete-btn" data-id="${item._id}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Добавление обработчика событий для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                deleteData(id);
            });
        });
    })
    .catch(error => console.error('Error fetching data:', error));

// Функция для удаления данных
function deleteData(id) {
    fetch(`/api/flowdatas/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Удаление строки таблицы
            document.querySelector(`button[data-id="${id}"]`).closest('tr').remove();
        } else {
            console.error('Error deleting data:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting data:', error));
}

document.getElementById('addDataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Отримання значень з полів форми
    const data = {
        timestamp: new Date(document.getElementById('timestamp').value).getTime(),
        device_id: document.getElementById('device_id').value,
        location: document.getElementById('location').value,
        flow_rate: parseFloat(document.getElementById('flow_rate').value),
        water_temperature: parseFloat(document.getElementById('water_temperature').value),
        pressure: parseFloat(document.getElementById('pressure').value),
        status: document.getElementById('status').value,
        units: document.getElementById('units').value,
        calibration: parseFloat(document.getElementById('calibration').value),
    };

    // Відправка POST запиту на сервер
    fetch('/api/flowdatas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(newData => {
        // Додавання нового рядка до таблиці
        const tableBody = document.querySelector('#flowDataTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(newData.timestamp).toLocaleString()}</td>
            <td>${newData.device_id}</td>
            <td>${newData.location}</td>
            <td>${newData.flow_rate}</td>
            <td>${newData.water_temperature}</td>
            <td>${newData.pressure}</td>
            <td>${newData.status}</td>
            <td>${newData.units}</td>
            <td>${newData.calibration}</td>
            <td><button class="delete-btn" data-id="${newData._id}">Delete</button></td>
        `;
        tableBody.appendChild(row);

        // Додавання обробника для кнопки видалення
        row.querySelector('.delete-btn').addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            deleteData(id);
        });

        // Очистка форми
        document.getElementById('addDataForm').reset();
    })
    .catch(error => console.error('Error adding data:', error));
});


// Функция для удаления данных
function deleteData(id) {
    fetch(`/api/flowdatas/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Удаление строки таблицы
            document.querySelector(`button[data-id="${id}"]`).closest('tr').remove();
        } else {
            console.error('Error deleting data:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting data:', error));
}

// Обработчик события для кнопки обновления страницы
document.getElementById('updatePageButton').addEventListener('click', () => {
    const deviceId = document.getElementById('deviceIdFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;
    loadData(deviceId, sortBy, sortOrder);
});

// Вызов loadData при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

document.addEventListener('DOMContentLoaded', function () {
    // Get references to the buttons and containers
    const showAddDataFormButton = document.getElementById('showAddDataFormButton');
    const addDataFormContainer = document.getElementById('addDataFormContainer');
    
    const showSortingOptionsButton = document.getElementById('showSortingOptionsButton');
    const sortingOptionsContainer = document.getElementById('sortingOptionsContainer');

    // Add click event listener for the "Add Data" button
    showAddDataFormButton.addEventListener('click', function () {
        if (addDataFormContainer.style.display === 'none') {
            addDataFormContainer.style.display = 'block';
            showAddDataFormButton.textContent = 'Hide Form'; // Optional: Change button text
        } else {
            addDataFormContainer.style.display = 'none';
            showAddDataFormButton.textContent = 'Add Data'; // Optional: Change button text
        }
    });

    // Add click event listener for the "Show Sorting Options" button
    showSortingOptionsButton.addEventListener('click', function () {
        if (sortingOptionsContainer.style.display === 'none') {
            sortingOptionsContainer.style.display = 'block';
            showSortingOptionsButton.textContent = 'Hide Sorting Options'; // Optional: Change button text
        } else {
            sortingOptionsContainer.style.display = 'none';
            showSortingOptionsButton.textContent = 'Show Sorting Options'; // Optional: Change button text
        }
    });
});
