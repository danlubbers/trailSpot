import "../src/style.scss";
import config from '../config.js';
import axios from 'axios';
import { sanitize } from 'dompurify';

// Import from JS components
import { clearResults } from "./clear/clearResults";
import { getWeatherInput } from "./getWeather/getWeatherInput";
import { getWeatherLocation } from "./getWeather/getWeatherLocation";
import { getTrailInfoLocation } from "./getTrails/getTrailInfoLocation";
import { getTrailInfoInput } from "./getTrails/getTrailInfoInput";

// Global Variables / State
let count = 0;
let cityInput = '';
let stateInput = '';


//  *** Handling User Input *** //
const form = document.querySelector("#form");
form.addEventListener("submit", event => {
  event.preventDefault();
  const elements = [...event.target.elements].filter(e =>
    e.matches("input")
  );

  let isValid = true;
  elements.forEach(e => {
    if (e.value) {
      e.classList.remove("error");
    } else {
      isValid = false;
      e.classList.add("error");
    }
  });

  if (!isValid) return;


  const cleanCity = sanitize(elements[0].value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_TAGS: ['style'],
  })
  cityInput = cleanCity

  const cleanState = sanitize(elements[1].value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_TAGS: ['style'],
  })
  stateInput = cleanState;

getUserInput()
  
});

const getUserInput = () => {

  // Shows/Hides the appropriate container content
  const locationContainer = document.querySelector('#location-results-container');
  const searchContainer = document.querySelector('#search-results-container');

  
  // Resets the trail-container so multiple different searches are not appended
  document.querySelector('#trail-search-container').innerHTML = '';
  
  if (locationContainer.style.display === 'flex') {
    locationContainer.style.display = 'none';
    searchContainer.style.display = 'flex';
  }

  (async () => {
  
      try {

        const apiOpenCageKey = config.API_KEY_OPENCAGE;

        // Using the global variables cityInput and stateInput, I inject those values into the api to get the region the user wants to search
        const userInput = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityInput}%20${stateInput}&key=${apiOpenCageKey}`);
  
        const lat = userInput.data.results[0].geometry.lat;
        const long = userInput.data.results[0].geometry.lng;
      
        // *** STARTS WEATHER SEARCH *** //
        getWeatherInput(lat, long);
  
        const searchContainer = document.querySelector('#search-results-container');
        searchContainer.style.display = "flex";
  
        const city = document.querySelector('#city-text-search');
        // Capitalizes every first letter
        let cityInputCaps = cityInput.split(' ').map(word => {
          return word.slice(0, 1).toUpperCase() + word.slice(1);
        }).join(' ');
  
        city.textContent = `${cityInputCaps}`;
  
        const region = document.querySelector('#region-text-search');
        region.textContent = `${stateInput.toUpperCase()}`;

        // *** Displays Trail Information from API to DOM *** //
        getTrailInfoInput(lat, long);
  
        // This clears the input field back to the placeholder 
        const inputs = Object.values(document.querySelectorAll('input'));
        inputs.forEach(e => e.value = '')
  
      } catch (err) {
        return console.error(err)
      }
    })();

  }





// *** Uses at least 1 arrow function *** //
const searchUserLocation = () => {

  // Resets the trail-container so multiple different searches are not appended
  document.querySelector('#trail-search-container').innerHTML = '';

  // If location has already been searched this unhides the location-results-container div to reveal the trails and does not hit the API multiple times
  const locationContainer = document.querySelector('#location-results-container');
  const searchContainer = document.querySelector('#search-results-container');

  if (locationContainer.style.display === 'none') {
    locationContainer.style.display = 'flex';
  }
  searchContainer.style.display = 'none';

  // Prevents multiple hits or reloads of the API with the same content
  if (count < 1) {

    // *** Makes at least 1 async call *** //
    (async () => {

      try {

        // *** Uses Axios & Async/Await *** //
        const userLocation = await axios.get(`https://ipapi.co/json/`);
        
        const lat = userLocation.data.latitude;
        const long = userLocation.data.longitude;
     

        // *** STARTS WEATHER SEARCH *** //
        getWeatherLocation(lat, long);


        // *** Shows and hide dom elements *** //
        // This shows the hidden text until after the user clicks the location search button
        const locationContainer = document.querySelector('#location-results-container');
        locationContainer.style.display = "flex";

        const city = document.querySelector('#city-text-location');
        city.textContent = `${userLocation.data.city},`;
        const region = document.querySelector('#region-text-location');
        region.textContent = `${userLocation.data.region}`;

        // *** Displays Trail Information from API to DOM *** //
        getTrailInfoLocation(lat, long);

      } catch (err) {
        return console.error(err)
      }
    })();
  }
  count++;
}

const apiLocator = document.querySelector('#apiLocator');
apiLocator.addEventListener("click", searchUserLocation);

clearResults();
