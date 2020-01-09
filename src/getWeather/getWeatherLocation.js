import config from '../../config.js';
import axios from 'axios';

const getWeatherLocation = async (lat, long) => {
  const weatherAPI = config.API_KEY_WEATHER;
  const cors = `https://cors-anywhere.herokuapp.com/`;

  const weather = await axios.get(`${cors}http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherAPI}`);

  
  // *** WEATHER ICONS ***
  const icon = document.querySelector('#weather-icon');
  const weatherIcon = weather.data.weather[0].icon;

  const weatherID = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  icon.src = weatherID;

  // *** WEATHER DESCRIPTION ***
  const description = document.querySelector('#weather-description');
  const weatherDescription = weather.data.weather[0].description;
  description.textContent = weatherDescription;

  // *** TEMPERATURE ***
  let temp = Math.floor(((weather.data.main.temp - 273.15) * 1.8) + 32);

  const tempId = document.querySelector('#temp');
  tempId.textContent = temp + '°';


  // *** PRESSURE ***
  const pressureMB = weather.data.main.pressure;
  const pressureInches = (weather.data.main.pressure * 0.0295301).toFixed(2);

  const pressure = document.querySelector('#weather-pressure');
  pressure.textContent = 'Pressure: ' + pressureMB + 'mb';


  // *** HUMIDITY ***
  const weatherHumidity = weather.data.main.humidity;

  const humidity = document.querySelector('#weather-humidity');
  humidity.textContent = 'Humidity: ' + weatherHumidity + ' %';

  // *** Temp Conversion Button
  const tempButton = document.querySelector('#tempBtn');
  tempButton.addEventListener('click', () => {
    if (fc.textContent === 'F') {
      const celcius = Math.round((temp - 32) / 1.8);
      tempId.textContent = celcius + '°';
      fc.textContent = 'C';
    } else {
      tempId.textContent = temp + '°';
      fc.textContent = 'F';
    }
  });

  // *** Pressure Conversion Button
  const pressureButton = document.querySelector('#pressureBtn');
  pressureButton.addEventListener('click', () => {
    if (!pressure.textContent.match(/mb/)) {
      pressure.textContent = 'Pressure: ' + pressureMB + 'mb';
    } else {
      pressure.textContent = 'Pressure: ' + pressureInches + 'in';
    }
  });
}

  

export { getWeatherLocation }