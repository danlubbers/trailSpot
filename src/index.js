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

// const form = document.querySelector("#form");
// form.addEventListener("submit", event => {
//   event.preventDefault();
//   const elements = [...event.target.elements].filter(element =>
//     element.matches("input")
//   );
//   // console.log('FORM elements ', elements);

  
//   const cleanCity = sanitize(elements[0].value, {
//     FORBID_ATTR: ['width', 'height', 'style'],
//     FORBID_TAGS: ['style'],
//   }) 
//   cityInput = cleanCity
//   console.log(cleanCity);
//   console.log(cityInput);
  
//   const cleanState = sanitize(elements[1].value, {
//     FORBID_ATTR: ['width', 'height', 'style'],
//     FORBID_TAGS: ['style'],
//   })
//   stateInput = cleanState;
//   console.log(cleanState);
//   console.log(stateInput);
// });



// Get User Input
const citySearch = document.querySelector('#city-search');
citySearch.addEventListener('blur', e => {
// *** NO Cross Site Scripting Vulnerabilities *** //
  const clean = sanitize(e.target.value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_TAGS: ['style'],
  }) 
  cityInput = clean;
});

const stateSearch = document.querySelector('#state-search');
stateSearch.addEventListener('blur', e => {
  const clean = sanitize(e.target.value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_TAGS: ['style'],
  })
  stateInput = clean;
});

// *** Uses at least 1 arrow function *** //
const searchUserLocation = () => {
  // This stops the page from hitting the api multiple times if user keeps clicking the search button
  console.log(count);

  // If location has already been searched this unhides the location-results-container div to reveal the trails and does not hit the API multiple times
  const locationContainer = document.querySelector('#location-results-container');
  const searchContainer = document.querySelector('#search-results-container');
  console.log('Location: ', locationContainer.style.display);
  console.log('Search: ', searchContainer.style.display);
  
  if(locationContainer.style.display === 'none') {
    locationContainer.style.display = 'flex';
  }

  if(searchContainer.style.display === 'flex') {
    searchContainer.style.display = 'none';
  }
  
  // Prevents multiple hits or reloads of the API with the same content
  if(count < 1) {

    // const trailContainer = document.querySelector('#trail-search-container');
    // trailContainer.remove();

// *** Makes at least 1 async call *** //
      ( async () => {
        try {

// *** Uses Axios & Async/Await *** //
          const userLocation = await axios.get(`https://ipapi.co/json/`);
          console.log(userLocation);
          const lat = userLocation.data.latitude;
          const long = userLocation.data.longitude;
          // console.log('Lat: ', lat);
          // console.log('Long: ', long);
// *** Shows and hide dom elements *** //
          // This shows the hidden text until after the user clicks the location search button
          const locationContainer = document.querySelector('#location-results-container');
          locationContainer.style.display = "flex";

          const city = document.querySelector('#city-text-location');
          city.textContent = `${userLocation.data.city},`;
          const region = document.querySelector('#region-text-location');
          region.textContent = `${userLocation.data.region}`;

          const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiTrailsKey}`);
          console.log(trails.data.trails[0].name);

          // STATIC TESTING for Boulder, CO
          // const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=40.0150&lon=-105.2705&maxDistance=10&key=${apiTrailsKey}`);


// *** Must use at least 1 higher order function *** //
// *** Must store content in simple data structures *** //
        let trailInfo = trails.data.trails.map((e, i) => {          
          return `
              <div key='${++i}' style=' margin: 20px 0;
                                        padding: 0;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
              '>
                <h2 style='margin: 5px 0; padding-left: 5px;'>${e.name}</h2>
                <h3 style='margin: 5px 0; padding-left: 5px;'>${e.location}</h3>
                <p style='padding-left: 5px;' class="">${e.summary}</p>
                <div style='display: flex; justify-content: center;'>
                <img style='margin-bottom: 20px; width: 400px; height: 100%;' src='${e.imgSmallMed}' alt='${e.name}' />
                </div>
                <div style='  width: 80%;
                              margin: 20px 0;
                              display: block;
                              overflow: hidden;
                              border-style: solid;
                              border-width: 1px;
                              color: rgb(150, 150, 150);
                '>
                </div>
              </div>
          `;
        }).join('');

        // console.log(Array.isArray(trailInfo));
        // console.log(typeof trailInfo);
        
        // turns a string into a DOM element
        const trailInfoFragment = document.createRange().createContextualFragment(trailInfo)
        // console.log(trailInfoFragment);
        
        // *** <-- ISSUE RIGHT HERE after I created locationDIV on Line 39--> 
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


const searchUserInput = () => {

  if(!cityInput && !stateInput) alert('You can not search without first adding a city and state');

  const locationContainer = document.querySelector('#location-results-container');
  const searchContainer = document.querySelector('#search-results-container');
  console.log('Location: ', locationContainer.style.display);
  console.log('Search: ', searchContainer.style.display);
  
  if(locationContainer.style.display === 'flex') {
    locationContainer.style.display = 'none';
  }
  if(searchContainer.style.display === 'none') {
    searchContainer.style.display = 'flex';
  }

  

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
      
      const searchContainer = document.querySelector('#search-results-container');
      searchContainer.style.display = "flex";

      const city = document.querySelector('#city-text-search');
      // Capitalizes every first letter
      let cityInputCaps = cityInput.split(' ').map(word => {
        return word.slice(0, 1).toUpperCase() + word.slice(1);
      }).join(' ');
  
      city.textContent = `${cityInputCaps}`;
      console.log('textcontent', city.textContent);
      
      const region = document.querySelector('#region-text-search');
      region.textContent = `${stateInput.toUpperCase()}`;

      const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiTrailsKey}`);
      console.log(trails.data);

      let trailInfo = trails.data.trails.map((e, i) => {          
        return `
            <div key='${++i}' style=' margin: 20px 0;
                                      padding: 0;
                                      display: flex;
                                      flex-direction: column;
                                      align-items: center;
            '>
              <h2 style='margin: 5px 0; padding-left: 5px;'>${e.name}</h2>
              <h3 style='margin: 5px 0; padding-left: 5px;'>${e.location}</h3>
              <p style='padding-left: 5px;' class="">${e.summary}</p>
              <div style='display: flex; justify-content: center;'>
              <img style='margin-bottom: 20px; width: 400px; height: 100%;' src='${e.imgSmallMed}' alt='${e.name}' />
              </div>
              <div style='  width: 80%;
                            margin: 20px 0;
                            display: block;
                            overflow: hidden;
                             border-style: solid;
                            border-width: 1px;
                            color: rgb(150, 150, 150);
              '>
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
      let clearInputValues = inputs.map(e => e.value = '')

    } catch (err) {
      return console.error(err)
    }
  }) ();
};

const userSearchInput = document.querySelector('#userSearchInput');
userSearchInput.addEventListener("click", searchUserInput);

// Currently hides display, but if searched again appends results which is not good
const clearBtn = document.querySelector('#clearBtn');
clearBtn.addEventListener('click', () => {

  const locationContainer = document.querySelector('#location-results-container');
  console.log(locationContainer.style.display);
  
  if(locationContainer.style.display === 'flex') {
    locationContainer.style.display = 'none'
  }
  
  const searchContainer = document.querySelector('#search-results-container');
  console.log(searchContainer.style.display);
  
  if(searchContainer.style.display === 'flex') {
    searchContainer.style.display = 'none'
  }

  // This clears/resets the searched content and input fields
  document.querySelector('#trail-search-container').innerHTML = '';
 
  // count = 0;
});
