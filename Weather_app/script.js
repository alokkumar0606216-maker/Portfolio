const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');

// State Containers
const welcomeState = document.getElementById('welcome-state');
const loaderState = document.getElementById('loader-state');
const errorState = document.getElementById('error-state');
const weatherBox = document.getElementById('weather-box');

// Weather DOM Elements
const weatherIcon = document.getElementById('weather-icon');
const tempValue = document.getElementById('temp-value');
const weatherDesc = document.getElementById('weather-desc');
const locationName = document.getElementById('location-name');
const humidityValue = document.getElementById('humidity-value');
const windValue = document.getElementById('wind-value');
const uvIndexValue = document.getElementById('uv-index');
const pressureValue = document.getElementById('pressure');
const historyContainer = document.getElementById('history-container');

// Open-Meteo APIs (No Keys Required)
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_GEO_API_URL = 'https://nominatim.openstreetmap.org/reverse';

// Weather Code mapping for BoxIcons and Gradients
function getWeatherInfo(code, isDay) {
    const weatherCodes = {
        0: { desc: 'Clear sky', icon: isDay ? 'bx-sun' : 'bx-moon', bg: isDay ? 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)' : 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
        1: { desc: 'Mainly clear', icon: isDay ? 'bx-cloud-light' : 'bx-moon', bg: isDay ? 'linear-gradient(135deg, #2980B9 0%, #6DD5FA 100%)' : 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' },
        2: { desc: 'Partly cloudy', icon: isDay ? 'bx-cloud' : 'bx-cloud', bg: isDay ? 'linear-gradient(135deg, #4CA1AF 0%, #C4E0E5 100%)' : 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' },
        3: { desc: 'Overcast', icon: 'bx-cloud', bg: 'linear-gradient(135deg, #3E5151 0%, #DECBA4 100%)' },
        45: { desc: 'Fog', icon: 'bx-water', bg: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)' },
        48: { desc: 'Rime fog', icon: 'bx-water', bg: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)' },
        51: { desc: 'Light drizzle', icon: 'bx-cloud-drizzle', bg: 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)' },
        53: { desc: 'Moderate drizzle', icon: 'bx-cloud-drizzle', bg: 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)' },
        55: { desc: 'Dense drizzle', icon: 'bx-cloud-drizzle', bg: 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)' },
        56: { desc: 'Light freezing drizzle', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        57: { desc: 'Dense freezing drizzle', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        61: { desc: 'Slight rain', icon: 'bx-cloud-rain', bg: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)' },
        63: { desc: 'Moderate rain', icon: 'bx-cloud-rain', bg: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)' },
        65: { desc: 'Heavy rain', icon: 'bx-cloud-rain', bg: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' },
        66: { desc: 'Light freezing rain', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        67: { desc: 'Heavy freezing rain', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        71: { desc: 'Slight snow', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)' },
        73: { desc: 'Moderate snow', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)' },
        75: { desc: 'Heavy snow', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        77: { desc: 'Snow grains', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        80: { desc: 'Slight showers', icon: 'bx-cloud-rain', bg: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)' },
        81: { desc: 'Moderate showers', icon: 'bx-cloud-rain', bg: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)' },
        82: { desc: 'Violent showers', icon: 'bx-cloud-lightning', bg: 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)' },
        85: { desc: 'Slight snow showers', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)' },
        86: { desc: 'Heavy snow showers', icon: 'bx-cloud-snow', bg: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)' },
        95: { desc: 'Thunderstorm', icon: 'bx-cloud-lightning', bg: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' },
        96: { desc: 'Thunderstorm with hail', icon: 'bx-cloud-lightning', bg: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' },
        99: { desc: 'Heavy thunderstorm', icon: 'bx-cloud-lightning', bg: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' },
    };

    return weatherCodes[code] || { desc: 'Unknown', icon: 'bx-cloud', bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' };
}

// Helper to format Date
function formatDate(dateStr) {
    const options = { weekday: 'short' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
}

// Switch UI Views
function showState(stateElement) {
    [welcomeState, loaderState, errorState, weatherBox].forEach(el => el.classList.remove('active'));
    stateElement.classList.add('active');
}

// Fetch by City Name
async function fetchWeatherByCity(city) {
    try {
        showState(loaderState);
        
        const geoResponse = await fetch(`${GEO_API_URL}?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showState(errorState);
            return;
        }

        const location = geoData.results[0];
        fetchWeatherByCoords(location.latitude, location.longitude, `${location.name}, ${location.country_code}`);

    } catch (error) {
        console.error("Geocoding error:", error);
        showState(errorState);
    }
}

// Fetch by Lat/Lon Coordinates
async function fetchWeatherByCoords(lat, lon, locationNameStr = null) {
    try {
        showState(loaderState);

        // Reverse geocoding if location name is missing (e.g. User clicked Location button)
        if (!locationNameStr) {
            try {
                const res = await fetch(`${REVERSE_GEO_API_URL}?format=json&lat=${lat}&lon=${lon}`);
                const data = await res.json();
                locationNameStr = data.address.city || data.address.town || data.address.village || data.address.country || "Unknown Location";
            } catch (e) {
                locationNameStr = "Your Location";
            }
        }

        const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,uv_index_max&hourly=temperature_2m,weather_code&timezone=auto&past_days=5`;
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        updateUI(locationNameStr, weatherData);

    } catch (error) {
        console.error("Weather fetching error:", error);
        showState(errorState);
    }
}

// Inject Data into DOM
function updateUI(locationStr, data) {
    const current = data.current;
    const daily = data.daily;
    
    const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
    
    // Animate background
    document.body.style.background = weatherInfo.bg;
    document.body.style.backgroundSize = "400% 400%";
    document.body.style.animation = "gradientBG 15s ease infinite";
    
    // Update main info
    locationName.innerHTML = `<i class='bx bx-map'></i> ${locationStr}`;
    tempValue.textContent = Math.round(current.temperature_2m);
    weatherDesc.textContent = weatherInfo.desc;
    
    // Update Details Grid
    humidityValue.textContent = `${current.relative_humidity_2m}%`;
    windValue.textContent = `${current.wind_speed_10m} km/h`;
    pressureValue.textContent = `${Math.round(current.surface_pressure)} hPa`;
    uvIndexValue.textContent = daily.uv_index_max[0] ? Math.round(daily.uv_index_max[0]) : '--';
    
    // Handle Icon rendering
    weatherIcon.className = `bx ${weatherInfo.icon}`;
    if (weatherInfo.icon === 'bx-sun') weatherIcon.className = 'bx bxs-sun';
    if (weatherInfo.icon === 'bx-moon') weatherIcon.className = 'bx bxs-moon';

    // Update Past 5 Days Hourly History (Indices 0 to 4 in daily, Indices 0 to 119 in hourly)
    historyContainer.innerHTML = '';
    
    // Loop through the past 5 days
    for (let dayIndex = 0; dayIndex <= 4; dayIndex++) {
        const dateStr = daily.time[dayIndex];
        const dateObj = new Date(dateStr);
        const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        const minTemp = Math.round(daily.temperature_2m_min[dayIndex]);
        const maxTemp = Math.round(daily.temperature_2m_max[dayIndex]);
        const medTemp = Math.round(daily.temperature_2m_mean[dayIndex]);
        
        let dayGroupHTML = `
            <div class="history-day-group">
                <h4>
                    <span>${displayDate}</span>
                    <span style="color: rgba(255,255,255,0.7); font-size: 11px;">Low: ${minTemp}° | Med: ${medTemp}° | High: ${maxTemp}°</span>
                </h4>
                <div class="hourly-container">
        `;
        
        // Loop through the 24 hours for this specific day
        for (let h = 0; h < 24; h++) {
            const hourIndex = (dayIndex * 24) + h;
            const hourTimeStr = data.hourly.time[hourIndex];
            const hourDateObj = new Date(hourTimeStr);
            const timeStr = hourDateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            
            const hTemp = Math.round(data.hourly.temperature_2m[hourIndex]);
            const hCode = data.hourly.weather_code[hourIndex];
            
            // Determine if it's day or night for the icon based on hour (roughly 6 AM to 6 PM)
            const hourNum = hourDateObj.getHours();
            const isDayTime = (hourNum >= 6 && hourNum <= 18) ? 1 : 0;
            
            const hInfo = getWeatherInfo(hCode, isDayTime); 
            let hIconClass = `bx ${hInfo.icon}`;
            if (hInfo.icon === 'bx-sun') hIconClass = 'bx bxs-sun';
            if (hInfo.icon === 'bx-moon') hIconClass = 'bx bxs-moon';

            dayGroupHTML += `
                    <div class="hourly-item">
                        <span class="time">${timeStr}</span>
                        <i class="${hIconClass}"></i>
                        <span class="temp">${hTemp}°</span>
                    </div>
            `;
        }
        
        dayGroupHTML += `
                </div>
            </div>
        `;
        
        historyContainer.insertAdjacentHTML('beforeend', dayGroupHTML);
    }

    // Display the weather box
    showState(weatherBox);
}

// Event Listeners for Buttons
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeatherByCity(city);
    }
});

// Geolocation Trigger
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showState(loaderState);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Please enable location permissions in your browser.");
                showState(welcomeState);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
