import "../src/style.scss";

// Global Variables / State
let count = 0;
let cityInput = '';
let stateInput = '';

//  *** Handling User Input *** //
// Get User Input
const citySearch = document.querySelector('#city-search');
citySearch.addEventListener('blur', e => {
  console.log(e.target.value);
  cityInput = e.target.value
});

const stateSearch = document.querySelector('#state-search');
stateSearch.addEventListener('blur', e => {
  console.log(e.target.value);
  stateInput = e.target.value
});

console.log('CITY: ', cityInput);
console.log('State: ', stateInput);


// *** Uses at least 1 arrow function *** //
const searchUserLocation = () => {
  // This stops the page from hitting the api multiple times if user keeps clicking the search button
  console.log(count);
  
  if(count < 1) {

// *** Makes at least 1 async call *** //
      ( async () => {
        try {
          const cors = `https://cors-anywhere.herokuapp.com/`;
          // const apiKey = config.API_KEY;
          const apiKey = '200317067-bb02b30d1d856f69f66afd74e01891b3';

// *** Uses Axios & Async/Await *** //
          const userLocation = await axios.get(`https://ipapi.co/json/`);
          console.log(userLocation);
          const lat = userLocation.data.latitude;
          const long = userLocation.data.longitude;
          // console.log('Lat: ', lat);
          // console.log('Long: ', long);
// *** Shows and hide dom elements *** //
          // This shows the hidden text until after the user clicks the location search button
          const areaContainer = document.querySelector('#area-container');
          areaContainer.style.display = "flex";

          const city = document.querySelector('#city');
          city.textContent = `${userLocation.data.city}`;
          const region = document.querySelector('#region');
          region.textContent = `${userLocation.data.region}`;

          const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiKey}`);
          console.log(trails.data.trails[0].name);

          // STATIC TESTING for Boulder, CO
          // const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=40.0150&lon=-105.2705&maxDistance=10&key=${apiKey}`);

          // const name = document.querySelector('#name');
          // name.textContent = trails.data.trails[0].name;

        let list = document.createElement('ul');
        list.className = 'trail-list';
// *** Must use at least 1 higher order function *** //
        trails.data.trails.forEach((e, i) => {
          let p = document.createElement('p');
          let img = document.createElement('img');
          // let aTag = document.createElement('a');
          let div = document.createElement('div');
          p.className = 'trail-info';
          img.className = 'trail-image';
          // aTag.className = 'url';
          div.className = 'horizontal-line'
          p.textContent = `${e.name} \nLocation: ${e.location} \nDescription: ${e.summary}`; 
          // aTag.setAttribute('href', e.url);
          // aTag.innerText = `URL: ${e.name}`;
          img.src = `${e.imgSmallMed}`     
          
          list.appendChild(p)
          // list.appendChild(aTag)
// *** Must display images *** //          
          list.appendChild(img)
          list.appendChild(div)
            

          // let linkList = document.querySelectorAll('a');
          // console.log(linkList);
          // linkList.forEach(e => e.setAttribute('target', '_blank'));
          });
          
        let trailInfoContainer = document.querySelector('#trail-info');
        trailInfoContainer.appendChild(list)
        
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

  if(!cityInput && !stateInput) alert('You can not search without first adding a city and state')

  const cors = `https://cors-anywhere.herokuapp.com/`;
  // OpenCageData API
  const apiOpenCageKey=`ea27d74cb98447fabd597d1a5d1a8c8b`;
  // Rei Trails API
  const apiTrailsKey = '200317067-bb02b30d1d856f69f66afd74e01891b3';

  
  ( async () => {
    
    try {

      // Using the global variables cityInput and stateInput, I inject those values into the api to get the region the user wants to search
      const userInput = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${cityInput}%20${stateInput}&key=${apiOpenCageKey}`);
      
      // console.log(userInput.data.results[0].geometry);

      const lat = userInput.data.results[0].geometry.lat;
      console.log('lat', lat);
      const long = userInput.data.results[0].geometry.lng;
      console.log('long', long);
      
      const areaContainer = document.querySelector('#area-container');
      areaContainer.style.display = "flex";

      const city = document.querySelector('#city');
      city.textContent = `${cityInput}`;
      const region = document.querySelector('#region');
      region.textContent = `${stateInput}`;

      const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiTrailsKey}`);
      console.log(trails.data);


      let list = document.createElement('ul');
      list.className = 'trail-list';

      trails.data.trails.forEach((e, i) => {
        let p = document.createElement('p');
        let img = document.createElement('img');
        
        let div = document.createElement('div');
        p.className = 'trail-info';
        img.className = 'trail-image';
        
        div.className = 'horizontal-line'
        p.textContent = `${e.name} \nLocation: ${e.location} \nDescription: ${e.summary}`; 
        
        img.src = `${e.imgSmallMed}`     
        
        list.appendChild(p)
        
        list.appendChild(img)
        list.appendChild(div)
          
        });
        
      let trailInfoContainer = document.querySelector('#trail-info');
      trailInfoContainer.appendChild(list)
      
      // const locationResultsContainer = document.querySelector('#location-results-container');
      // locationResultsContainer.style.display = "none";

    } catch (err) {
      return console.error(err)
    }
  }) ();
};

const userSearchInput = document.querySelector('#userSearchInput');
userSearchInput.addEventListener("click", searchUserInput);
