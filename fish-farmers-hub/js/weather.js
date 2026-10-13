// Fish Farmers Hub - Weather API

const API_KEY = 'a21d7894af614155802235218261210';

// Select HTML elements
const weatherForm = document.querySelector('#weather-form');
const locationInput = document.querySelector('#weather-location');
const weatherStatus = document.querySelector('#weather-status');
const weatherResults = document.querySelector('#weather-results');



async function getWeather(location) {
    const url = new URL(
        'https://api.weatherapi.com/v1/forecast.json'
    );

    url.searchParams.set('key', API_KEY);
    url.searchParams.set('q', location);
    url.searchParams.set('days', '3');
    url.searchParams.set('aqi', 'no');
    url.searchParams.set('alerts', 'no');

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(
            data.error?.message ||
            'Unable to retrieve weather information.'
        );
    }

    return data;
}

// ==========================================
// DISPLAY CURRENT WEATHER AND FORECAST
// ==========================================

function displayWeather(data) {
    const location = data.location;
    const current = data.current;
    const forecastDays = data.forecast.forecastday;

    // Clear previous results
    weatherResults.replaceChildren();

    // Location heading
    const heading = document.createElement('h3');
    heading.textContent = `${location.name}, ${location.country}`;

    weatherResults.appendChild(heading);

    // Current weather card
    const currentCard = document.createElement('article');
    currentCard.className = 'weather-card current-weather';

    const temperature = document.createElement('h2');
    temperature.textContent = `${current.temp_c}°C`;

    const condition = document.createElement('p');
    condition.textContent = `Condition: ${current.condition.text}`;

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${current.humidity}%`;

    const wind = document.createElement('p');
    wind.textContent = `Wind speed: ${current.wind_kph} km/h`;

    const feelsLike = document.createElement('p');
    feelsLike.textContent = `Feels like: ${current.feelslike_c}°C`;

    currentCard.append(
        temperature,
        condition,
        humidity,
        wind,
        feelsLike
    );

    weatherResults.appendChild(currentCard);

    // Forecast heading
    const forecastHeading = document.createElement('h3');
    forecastHeading.textContent = 'Three-Day Forecast';

    weatherResults.appendChild(forecastHeading);

    // Create a card for each forecast day
    forecastDays.forEach((day) => {
        const forecastCard = document.createElement('article');
        forecastCard.className = 'weather-card forecast-card';

        const date = document.createElement('h4');
        date.textContent = day.date;

        const forecastCondition = document.createElement('p');
        forecastCondition.textContent =
            `Condition: ${day.day.condition.text}`;

        const maxTemperature = document.createElement('p');
        maxTemperature.textContent =
            `Maximum temperature: ${day.day.maxtemp_c}°C`;

        const minTemperature = document.createElement('p');
        minTemperature.textContent =
            `Minimum temperature: ${day.day.mintemp_c}°C`;

        const rainChance = document.createElement('p');
        rainChance.textContent =
            `Chance of rain: ${day.day.daily_chance_of_rain}%`;

        forecastCard.append(
            date,
            forecastCondition,
            maxTemperature,
            minTemperature,
            rainChance
        );

        weatherResults.appendChild(forecastCard);
    });
}

// ==========================================
// HANDLE WEATHER SEARCH
// ==========================================

if (weatherForm) {
    weatherForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const location = locationInput.value.trim();

        if (!location) {
            weatherStatus.textContent =
                'Please enter a city or location.';
            return;
        }

        // Show loading message
        weatherStatus.textContent =
            'Loading weather information...';

        weatherResults.replaceChildren();

        try {
            const weatherData = await getWeather(location);

            displayWeather(weatherData);

            weatherStatus.textContent =
                `Weather information loaded for ${weatherData.location.name}.`;
        } catch (error) {
            weatherStatus.textContent =
                `Weather error: ${error.message}`;

            weatherResults.replaceChildren();
        }
    });
}