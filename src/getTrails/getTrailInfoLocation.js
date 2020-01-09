import config from '../../config.js';
import axios from 'axios';

const getTrailInfoLocation = async (lat, long) => {
  const cors = `https://cors-anywhere.herokuapp.com/`;
  const apiTrailsKey = config.API_KEY_REI;

  const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${apiTrailsKey}`);

  // STATIC TESTING for Boulder, CO
  // const trails = await axios.get(`${cors}https://www.hikingproject.com/data/get-trails?lat=40.0150&lon=-105.2705&maxDistance=10&key=${apiTrailsKey}`);
  
        // If no trails are found this will notify the user, no trails were found in the searched area
        const noTrails = document.querySelector('#found-trails');
        if (trails.data.trails.length === 0) {
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

        // turns a string into a DOM element
        const trailInfoFragment = document.createRange().createContextualFragment(trailInfo)
  
        const trailLocationContainer = document.querySelector('#trail-location-container');
        trailLocationContainer.appendChild(trailInfoFragment);
}

export { getTrailInfoLocation }