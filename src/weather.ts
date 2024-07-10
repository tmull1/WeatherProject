const apiKey: string = '59f72fe52cd3e3850e1389dcc6cfaa11';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
  }[];
}

interface GeoData {
  lat: number;
  lon: number;
  name: string;
}

// Add an event listener to the form with id 'weatherForm' to handle form submission
document.getElementById('weatherForm')?.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const zipCode = (document.getElementById('zipCode') as HTMLInputElement).value; // Get the value of the input field with id 'zipCode'
  console.log(`Zip Code entered: ${zipCode}`);
  showLoadingSpinner(); // Show a loading spinner while fetching data
  getWeatherDataByZip(zipCode); // Call the function to fetch weather data using the zip code
});

// Add an event listener to the form with id 'cityStateForm' to handle form submission
document.getElementById('cityStateForm')?.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const city = (document.getElementById('city') as HTMLInputElement).value; // Get the value of the input field with id 'city'
  const state = (document.getElementById('state') as HTMLInputElement).value; // Get the value of the input field with id 'state'
  console.log(`City and State entered: ${city}, ${state}`);
  showLoadingSpinner(); // Show a loading spinner while fetching data
  getWeatherDataByCityState(city, state); // Call the function to fetch weather data using the city and state
});

// Add an event listener to the button with id 'convertTemp' to handle temperature conversion
document.getElementById('convertTemp')?.addEventListener('click', function () {
  console.log('Convert Temperature button clicked');
  convertTemperature(); // Call the function to convert the temperature
});

let isFahrenheit: boolean = true; // Boolean flag to track the current temperature unit

// Function to show the loading spinner
function showLoadingSpinner(): void {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'block'; // Display the loading spinner element
  }
}

// Function to hide the loading spinner
function hideLoadingSpinner(): void {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'none'; // Hide the loading spinner element
  }
}

// Function to fetch weather data using a zip code
function getWeatherDataByZip(zipCode: string): void {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`; // Geolocation API URL
  console.log(`Fetching geo data from: ${geoUrl}`);

  fetch(geoUrl)
    .then(response => {
      console.log(`Geo response status: ${response.status}`);
      return response.json();
    })
    .then((data: GeoData) => {
      console.log('Geo data received:', data);
      if (!data.lat || !data.lon) { // Check if latitude and longitude are not available
        throw new Error('Invalid zip code'); // Throw an error if the zip code is invalid
      }
      const { lat, lon, name: city } = data; // Destructure the latitude, longitude, and city name from the response
      getWeatherData(lat, lon, city); // Call the function to fetch weather data using the latitude and longitude
    })
    .catch(error => {
      console.error('Error fetching geolocation data:', error); // Log any errors to the console
      hideLoadingSpinner(); // Hide the loading spinner
      displayErrorMessage('Error fetching geolocation data. Please try again.'); // Display an error message to the user
    });
}

// Function to fetch weather data using a city and state
function getWeatherDataByCityState(city: string, state: string): void {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&appid=${apiKey}`; // Geolocation API URL
  console.log(`Fetching geo data from: ${geoUrl}`);

  fetch(geoUrl)
    .then(response => {
      console.log(`Geo response status: ${response.status}`);
      return response.json();
    })
    .then((data: GeoData[]) => {
      console.log('Geo data received:', data);
      if (data.length === 0) { // Check if the response array is empty
        throw new Error('City not found'); // Throw an error if the city is not found
      }
      const { lat, lon, name: city } = data[0]; // Destructure the latitude, longitude, and city name from the first element in the response array
      getWeatherData(lat, lon, city); // Call the function to fetch weather data using the latitude and longitude
    })
    .catch(error => {
      console.error('Error fetching geolocation data:', error); // Log any errors to the console
      hideLoadingSpinner(); // Hide the loading spinner
      displayErrorMessage('Error fetching geolocation data. Please try again.'); // Display an error message to the user
    });
}

// Function to fetch weather data using latitude and longitude
function getWeatherData(lat: number, lon: number, city: string): void {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`; // Weather API URL
  console.log(`Fetching weather data from: ${weatherUrl}`);

  fetch(weatherUrl)
    .then(response => {
      console.log(`Weather response status: ${response.status}`);
      return response.json();
    })
    .then((weatherData: WeatherData) => {
      console.log('Weather data received:', weatherData);
      displayWeatherData(city, weatherData); // Call the function to display the weather data
      hideLoadingSpinner(); // Hide the loading spinner
    })
    .catch(error => {
      console.error('Error fetching weather data:', error); // Log any errors to the console
      hideLoadingSpinner(); // Hide the loading spinner
      displayErrorMessage('Error fetching weather data. Please try again.'); // Display an error message to the user
    });
}

// Function to display weather data on the page
function displayWeatherData(city: string, data: WeatherData): void {
  const currentDate = new Date().toLocaleDateString(); // Date is a class
  const currentTemp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const humidity = data.main.humidity;
  const currentConditions = data.weather[0].description;
  const tempHi = data.main.temp_max;
  const tempLo = data.main.temp_min;

  const weatherDataSection = document.getElementById('weatherData');
  if (weatherDataSection) {
    weatherDataSection.innerHTML = `
      <h2>Weather in ${city}</h2>
      <p><i class="fas fa-calendar-day"></i> Date: ${currentDate}</p>
      <p><i class="fas fa-thermometer-half"></i> Current Temperature: <span id="currentTemp">${currentTemp}</span> °F</p>
      <p><i class="fas fa-temperature-high"></i> Feels Like: ${feelsLike} °F</p>
      <p><i class="fas fa-tint"></i> Humidity: ${humidity}%</p>
      <p><i class="fas fa-cloud"></i> Conditions: ${currentConditions}</p>
      <p><i class="fas fa-temperature-high"></i> High: ${tempHi} °F</p>
      <p><i class="fas fa-temperature-low"></i> Low: ${tempLo} °F</p>
    `; // Update the inner HTML of the 'weatherData' element to display the weather information

    const body = document.body;
    // Change the background color of the body based on the current weather conditions
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
}

// Function to convert the temperature between Fahrenheit and Celsius
function convertTemperature(): void {
  const currentTempElement = document.getElementById('currentTemp');
  if (currentTempElement) {
    let currentTemp = parseFloat(currentTempElement.textContent || '0'); // Parse the current temperature as a float

    // Convert the temperature and update the text content and button text based on the current unit
    if (isFahrenheit) {
      currentTemp = (currentTemp - 32) * (5 / 9); // Convert Fahrenheit to Celsius
      currentTempElement.textContent = currentTemp.toFixed(2); // Update the text content with the converted temperature
      const convertTempButton = document.getElementById('convertTemp');
      if (convertTempButton) {
        convertTempButton.textContent = 'Convert to Fahrenheit'; // Update the button text
      }
      isFahrenheit = false; // Set the flag to indicate the temperature is now in Celsius
    } else {
      currentTemp = (currentTemp * (9 / 5)) + 32; // Convert Celsius to Fahrenheit
      currentTempElement.textContent = currentTemp.toFixed(2); // Update the text content with the converted temperature
      const convertTempButton = document.getElementById('convertTemp');
      if (convertTempButton) {
        convertTempButton.textContent = 'Convert to Celsius'; // Update the button text
      }
      isFahrenheit = true; // Set the flag to indicate the temperature is now in Fahrenheit
    }
  }
}

// Function to display an error message on the page
function displayErrorMessage(message: string): void {
  const weatherDataSection = document.getElementById('weatherData');
  if (weatherDataSection) {
    weatherDataSection.innerHTML = `<p class="error-message">${message}</p>`; // Update the inner HTML to display the error message
  }
}












