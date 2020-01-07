import "../src/style.scss";
import config from '../config.js';
import axios from 'axios';
import { sanitize } from 'dompurify';

// Global Variables / State
const apiTrailsKey = config.API_KEY_REI;
const apiOpenCageKey = config.API_KEY_OPENCAGE;
const cors = `https://cors-anywhere.herokuapp.com/`;
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
  // console.log('FORM elements ', elements);

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
  // console.log(cleanCity);
  // console.log(cityInput);
  
  const cleanState = sanitize(elements[1].value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_TAGS: ['style'],
  })
  stateInput = cleanState;
  // console.log(cleanState);
  // console.log(stateInput);


  // Shows/Hides the appropriate container content
  const locationContainer = document.querySelector('#location-results-container');
  const searchContainer = document.querySelector('#search-results-container');
  // console.log('Location: ', locationContainer.style.display);
  // console.log('Search: ', searchContainer.style.display);
  
  // Resets the trail-container so multiple different searches are not appended
  document.querySelector('#trail-search-container').innerHTML = '';
  
  if(locationContainer.style.display === 'flex') {
    locationContainer.style.display = 'none';
    searchContainer.style.display = 'flex';
  }
  
  // console.log('isSearch: ', searchContainer.style.display);
  
  
  ( async () => {
    
    // console.log('CITY: ', cityInput);
    // console.log('State: ', stateInput);  
    
    try {
      
      // Using the global variables cityInput and stateInput, I inject those values into the api to get the region the user wants to search
      const userInput = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityInput}%20${stateInput}&key=${apiOpenCageKey}`);
      
      // console.log(userInput.data.results[0].geometry);
      
      const lat = userInput.data.results[0].geometry.lat;
      // console.log('lat', lat);
      const long = userInput.data.results[0].geometry.lng;
      // console.log('long', long);


      const weatherAPI = config.API_KEY_WEATHER;
          const weather = await axios.get(`${cors}http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherAPI}`);
          // console.log(weather);
          

          // *** WEATHER ICONS ***
          const icon = document.querySelector('#weather-search-icon');
          const weatherIcon = weather.data.weather[0].icon;
          // console.log(weatherIcon);
          
          const weatherID = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
          // console.log(weatherID);
          icon.src = weatherID;

          // *** WEATHER DESCRIPTION ***
          const description = document.querySelector('#weather-search-description');
          const weatherDescription = weather.data.weather[0].description;
          description.textContent = weatherDescription;

          // *** TEMPERATURE ***
          let temp = Math.floor(((weather.data.main.temp - 273.15) * 1.8) + 32);
          // console.log('Weather: ', temp);
      
          const tempId = document.querySelector('#temp-search');
          //  const fc = document.querySelector('#fc');
          tempId.textContent = temp + '°';


          // *** PRESSURE ***
          const pressureMB = weather.data.main.pressure;
          const pressureInches = (weather.data.main.pressure * 0.0295301).toFixed(2);
          // console.log(pressureMB);

          const pressure = document.querySelector('#weather-search-pressure');
          pressure.textContent = 'Pressure: ' + pressureMB + 'mb';
          

          // *** HUMIDITY ***
          const weatherHumidity = weather.data.main.humidity;
          // console.log(weatherHumidity);

          const humidity = document.querySelector('#weather-search-humidity');
          humidity.textContent = 'Humidity: ' + weatherHumidity + ' %';
          
          // *** Temp Conversion Button
          const tempButton = document.querySelector('#tempSearchBtn');
          tempButton.addEventListener('click', () => {
            console.log('FC: ', fcSearch.textContent);
            
            if(fcSearch.textContent === 'F') {
            const celcius = Math.round((temp - 32) / 1.8);
            tempId.textContent = celcius + '°';
            fcSearch.textContent = 'C';
          } else {
            tempId.textContent = temp + '°';
            fcSearch.textContent = 'F';
            }
          });

// ISSUE upon reload where 1 click goes to false then true immediately and doesn't toggle correctly.
          // *** Pressure Conversion Button
          const pressureButton = document.querySelector('#pressureSearchBtn');
          pressureButton.addEventListener('click', () => {
            console.log(pressure.textContent);
            if(!pressure.textContent.match(/mb/)) {
              pressure.textContent = 'Pressure: ' + pressureMB + 'mb';    
            } else {
              pressure.textContent = 'Pressure: ' + pressureInches + 'in';    
            }
          });
          


      
      const searchContainer = document.querySelector('#search-results-container');
      searchContainer.style.display = "flex";
      
      const city = document.querySelector('#city-text-search');
      // Capitalizes every first letter
      let cityInputCaps = cityInput.split(' ').map(word => {
        return word.slice(0, 1).toUpperCase() + word.slice(1);
      }).join(' ');
      
      city.textContent = `${cityInputCaps}`;
      // console.log('textcontent', city.textContent);
      
      const region = document.querySelector('#region-text-search');
      region.textContent = `${stateInput.toUpperCase()}`;
      
      const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiTrailsKey}`);
      console.log(trails.data);

      // If no trails are found this will notify the user, no trails were found in the searched area
      const noTrails = document.querySelector('#found-trails');
      if(trails.data.trails.length === 0) {
        noTrails.textContent = 'We have "NOT" found any trails in the area of:'
      } else {
        noTrails.textContent = 'We have found trails around the area of:'
      }
      
      let trailInfo = trails.data.trails.map((e, i) => {          
        return `
              <div key='${++i}' style=' margin: 40px 0;
                                        padding: 0;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        
                                        width: 100%;
              '>
              <div style='width: 600px; display: flex; flex-direction: column; align-items: center;'>

                <h2 style='margin: 5px 0; padding-left: 5px;'>${e.name}</h2>
                <h3 style='margin: 5px 0; padding-left: 5px;'>${e.location}</h3>
                <h4 style='margin: 5px 0; padding-left: 20px;'>${e.summary}</h4>

                <div style='width: 100%; margin: 10px 0px 10px 20px;'>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Trail Length:</strong> <h5>${e.length}mi</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Max Elevation:</strong> <h5>${e.high}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Min Elevation:</strong> <h5>${e.low}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Trail Conditions:</strong> <h5>${e.conditionStatus}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Condition Details:</strong> <h5>${e.conditionDetails}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Last Date Conditions were updated:</strong> <h5>${e.conditionDate}</h5></div>
                </div>

                <div style='display: flex; justify-content: center;'>
                <img style='margin-bottom: 20px; width: 400px; height: 100%; border-radius: 10px;' src='${e.imgSmallMed}' alt='${e.name}' />
                </div>
                <div style='  width: 100%;
                              margin: 40px 0;
                              display: block;
                              overflow: hidden;
                              border-style: solid;
                              border-width: 1px;
                              color: rgb(150, 150, 150);
                '>
                </div>
                </div>
              </div>
          `;
      }).join('');
      
      // console.log(Array.isArray(trailInfo));
      // console.log(typeof trailInfo);
      
      // turns a string into a DOM element
      const trailInfoFragment = document.createRange().createContextualFragment(trailInfo)
      // console.log(trailInfoFragment);
      
      
      const trailSearchContainer = document.querySelector('#trail-search-container');
      trailSearchContainer.appendChild(trailInfoFragment);
      
      // This clears the input field back to the placeholder 
      const inputs = Object.values(document.querySelectorAll('input'));
      inputs.forEach(e => e.value = '')
      // console.log(inputs);
      
      
    } catch (err) {
      return console.error(err)
    }
  }) ();
});







// *** Uses at least 1 arrow function *** //
const searchUserLocation = () => {
  // This stops the page from hitting the api multiple times if user keeps clicking the search button
  // console.log(count);


  // Resets the trail-container so multiple different searches are not appended
  document.querySelector('#trail-search-container').innerHTML = '';

  // If location has already been searched this unhides the location-results-container div to reveal the trails and does not hit the API multiple times
  const locationContainer = document.querySelector('#location-results-container');
  const searchContainer = document.querySelector('#search-results-container');
  // console.log('Location: ', locationContainer.style.display);
  // console.log('Search: ', searchContainer.style.display);
  
  if(locationContainer.style.display === 'none') {
    locationContainer.style.display = 'flex';
  }
  searchContainer.style.display = 'none';
  
  // Prevents multiple hits or reloads of the API with the same content
  if(count < 1) {

// *** Makes at least 1 async call *** //
      ( async () => {
        try {

// *** Uses Axios & Async/Await *** //
          const userLocation = await axios.get(`https://ipapi.co/json/`);
          // console.log(userLocation);
          const lat = userLocation.data.latitude;
          const long = userLocation.data.longitude;
          // console.log('Lat: ', lat);
          // console.log('Long: ', long);

          
          const weatherAPI = config.API_KEY_WEATHER;
          const weather = await axios.get(`${cors}http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherAPI}`);
          console.log(weather);
          

          // *** WEATHER ICONS ***
          const icon = document.querySelector('#weather-icon');
          const weatherIcon = weather.data.weather[0].icon;
          // console.log(weatherIcon);
          
          const weatherID = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
          // console.log(weatherID);
          icon.src = weatherID;

          // *** WEATHER DESCRIPTION ***
          const description = document.querySelector('#weather-description');
          const weatherDescription = weather.data.weather[0].description;
          description.textContent = weatherDescription;

          // *** TEMPERATURE ***
          let temp = Math.floor(((weather.data.main.temp - 273.15) * 1.8) + 32);
          // console.log('Weather: ', temp);
      
          const tempId = document.querySelector('#temp');
          //  const fc = document.querySelector('#fc');
          tempId.textContent = temp + '°';


          // *** PRESSURE ***
          const pressureMB = weather.data.main.pressure;
          const pressureInches = (weather.data.main.pressure * 0.0295301).toFixed(2);
          // console.log(pressureMB);

          const pressure = document.querySelector('#weather-pressure');
          pressure.textContent = 'Pressure: ' + pressureMB + 'mb';
          

          // *** HUMIDITY ***
          const weatherHumidity = weather.data.main.humidity;
          // console.log(weatherHumidity);

          const humidity = document.querySelector('#weather-humidity');
          humidity.textContent = 'Humidity: ' + weatherHumidity + ' %';
          
          // *** Temp Conversion Button
          const tempButton = document.querySelector('#tempBtn');
          tempButton.addEventListener('click', () => {
            if(fc.textContent === 'F') {
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
            if(!pressure.textContent.match(/mb/)) {
              pressure.textContent = 'Pressure: ' + pressureMB + 'mb';    
            } else {
              pressure.textContent = 'Pressure: ' + pressureInches + 'in';    
            }
          });
              
        


// *** Shows and hide dom elements *** //
          // This shows the hidden text until after the user clicks the location search button
          const locationContainer = document.querySelector('#location-results-container');
          locationContainer.style.display = "flex";

          const city = document.querySelector('#city-text-location');
          city.textContent = `${userLocation.data.city},`;
          const region = document.querySelector('#region-text-location');
          region.textContent = `${userLocation.data.region}`;

          const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiTrailsKey}`);
          // console.log(trails.data.trails[0].name);

          // STATIC TESTING for Boulder, CO
          // const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=40.0150&lon=-105.2705&maxDistance=10&key=${apiTrailsKey}`);


// *** Must use at least 1 higher order function *** //
// *** Must store content in simple data structures *** //
        let trailInfo = trails.data.trails.map((e, i) => {          
          return `
              <div key='${++i}' style=' margin: 40px 0;
                                        padding: 0;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                        
                                        width: 100%;
              '>
              <div style='width: 600px; display: flex; flex-direction: column; align-items: center;'>

                <h2 style='margin: 5px 0; padding-left: 5px;'>${e.name}</h2>
                <h3 style='margin: 5px 0; padding-left: 5px;'>${e.location}</h3>
                <h4 style='margin: 5px 0; padding-left: 20px;'>${e.summary}</h4>

                <div style='width: 100%; margin: 10px 0px 10px 20px;'>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Trail Length:</strong> <h5>${e.length}mi</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Max Elevation:</strong> <h5>${e.high}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Min Elevation:</strong> <h5>${e.low}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Trail Conditions:</strong> <h5>${e.conditionStatus}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Condition Details:</strong> <h5>${e.conditionDetails}</h5></div>
                  <div style='margin: 5px 0; display: flex; flex-direction: row;'><strong>Last Date Conditions were updated:</strong> <h5>${e.conditionDate}</h5></div>
                </div>

                <div style='display: flex; justify-content: center;'>
                <img style='margin-bottom: 20px; width: 400px; height: 100%; border-radius: 10px;' src='${e.imgSmallMed}' alt='${e.name}' />
                </div>
                <div style='  width: 100%;
                              margin: 40px 0;
                              display: block;
                              overflow: hidden;
                              border-style: solid;
                              border-width: 1px;
                              color: rgb(150, 150, 150);
                '>
                </div>
                </div>
              </div>
          `;
        }).join('');

        // console.log(Array.isArray(trailInfo));
        // console.log(typeof trailInfo);
        
        // turns a string into a DOM element
        const trailInfoFragment = document.createRange().createContextualFragment(trailInfo)
        // console.log(trailInfoFragment);
        
        const trailContainer = document.querySelector('#trail-location-container')
        trailContainer.appendChild(trailInfoFragment);
        // console.log(trailContainer);
        
        
        
      } catch (err) {
        return console.error(err)
      }
    }) ();
  }
  count++;
}

const apiLocator = document.querySelector('#apiLocator');
apiLocator.addEventListener("click", searchUserLocation);





// *** CLEAR/RESET RESULTS AREA *** //
const clearBtn = document.querySelector('#clearBtn');
clearBtn.addEventListener('click', () => {
  
  const locationContainer = document.querySelector('#location-results-container');
  // console.log(locationContainer.style.display);
  
  if(locationContainer.style.display === 'flex') {
    locationContainer.style.display = 'none'
  }
  
  const searchContainer = document.querySelector('#search-results-container');
  // console.log(searchContainer.style.display);
  
  if(searchContainer.style.display === 'flex') {
    searchContainer.style.display = 'none'
  }

  document.querySelector('#form').reset();

});