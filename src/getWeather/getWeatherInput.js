import config from '../../config.js';
import axios from 'axios';

const getWeatherInput = async (lat, long) => {
  const weatherAPI = config.API_KEY_WEATHER;
  const cors = `https://cors-anywhere.herokuapp.com/`;

  const weather = await axios.get(`${cors}http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherAPI}`);
  

  // *** WEATHER ICONS ***
  const icon = document.querySelector('#weather-search-icon');
  const weatherIcon = weather.data.weather[0].icon;
  

  const weatherID = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  icon.src = weatherID;


  // *** WEATHER DESCRIPTION ***
  const description = document.querySelector('#weather-search-description');
  const weatherDescription = weather.data.weather[0].description;
  description.textContent = weatherDescription;

  
  // *** TEMPERATURE ***
  let temp = Math.floor(((weather.data.main.temp - 273.15) * 1.8) + 32);

  const tempId = document.querySelector('#temp-search');
  tempId.textContent = temp + '°';


  // *** PRESSURE ***
  const pressureMB = weather.data.main.pressure;
  const pressureInches = (weather.data.main.pressure * 0.0295301).toFixed(2);

  const pressure = document.querySelector('#weather-search-pressure');
  pressure.textContent = 'Pressure: ' + pressureInches + 'in';


  // *** HUMIDITY ***
  const weatherHumidity = weather.data.main.humidity;

  const humidity = document.querySelector('#weather-search-humidity');
  humidity.textContent = 'Humidity: ' + weatherHumidity + ' %';

}

export { getWeatherInput };