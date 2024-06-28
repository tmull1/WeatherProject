document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const zipCode = document.getElementById('zipCode').value;
    showLoadingSpinner();
    getWeatherDataByZip(zipCode);
});

document.getElementById('cityStateForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    showLoadingSpinner();
    getWeatherDataByCityState(city, state);
});

document.getElementById('convertTemp').addEventListener('click', function () {
    convertTemperature();
});

let isFahrenheit = true;

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function getWeatherDataByZip(zipCode) {
    const apiKey = '59f72fe52cd3e3850e1389dcc6cfaa11';
    const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.lat || !data.lon) {
                throw new Error('Invalid zip code');
            }
            const { lat, lon, name: city } = data;
            getWeatherData(lat, lon, city);
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
            hideLoadingSpinner();
            displayErrorMessage('Error fetching geolocation data. Please try again.');
        });
}

function getWeatherDataByCityState(city, state) {
    const apiKey = '59f72fe52cd3e3850e1389dcc6cfaa11';
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                throw new Error('City not found');
            }
            const { lat, lon, name: city } = data[0];
            getWeatherData(lat, lon, city);
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
            hideLoadingSpinner();
            displayErrorMessage('Error fetching geolocation data. Please try again.');
        });
}

function getWeatherData(lat, lon, city) {
    const apiKey = '59f72fe52cd3e3850e1389dcc6cfaa11';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => {
            displayWeatherData(city, weatherData);
            hideLoadingSpinner();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            hideLoadingSpinner();
            displayErrorMessage('Error fetching weather data. Please try again.');
        });
}

function displayWeatherData(city, data) {
    const currentDate = new Date().toLocaleDateString();
    const currentTemp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const currentConditions = data.weather[0].description;
    const tempHi = data.main.temp_max;
    const tempLo = data.main.temp_min;

    const weatherDataSection = document.getElementById('weatherData');
    weatherDataSection.innerHTML = `
        <h2>Weather in ${city}</h2>
        <p><i class="fas fa-calendar-day"></i> Date: ${currentDate}</p>
        <p><i class="fas fa-thermometer-half"></i> Current Temperature: <span id="currentTemp">${currentTemp}</span> °F</p>
        <p><i class="fas fa-temperature-high"></i> Feels Like: ${feelsLike} °F</p>
        <p><i class="fas fa-tint"></i> Humidity: ${humidity}%</p>
        <p><i class="fas fa-cloud"></i> Conditions: ${currentConditions}</p>
        <p><i class="fas fa-temperature-high"></i> High: ${tempHi} °F</p>
        <p><i class="fas fa-temperature-low"></i> Low: ${tempLo} °F</p>
    `;

    const body = document.body;
    if (currentConditions.includes('rain')) {
        body.style.backgroundColor = '#a4b0be';
    } else if (currentConditions.includes('cloud')) {
        body.style.backgroundColor = '#dfe4ea';
    } else if (currentConditions.includes('clear')) {
        body.style.backgroundColor = '#ffda79';
    } else {
        body.style.backgroundColor = '#f0f0f0';
    }
}

function convertTemperature() {
    const currentTempElement = document.getElementById('currentTemp');
    let currentTemp = parseFloat(currentTempElement.textContent);

    if (isFahrenheit) {
        currentTemp = (currentTemp - 32) * (5 / 9);
        currentTempElement.textContent = currentTemp.toFixed(2);
        document.getElementById('convertTemp').textContent = 'Convert to Fahrenheit';
        isFahrenheit = false;
    } else {
        currentTemp = (currentTemp * (9 / 5)) + 32;
        currentTempElement.textContent = currentTemp.toFixed(2);
        document.getElementById('convertTemp').textContent = 'Convert to Celsius';
        isFahrenheit = true;
    }
}

function displayErrorMessage(message) {
    const weatherDataSection = document.getElementById('weatherData');
    weatherDataSection.innerHTML = `<p class="error-message">${message}</p>`;
}




