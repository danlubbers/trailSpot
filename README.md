<p align="center">
  <img src="https://github.com/danlubbers/trailSpot/blob/master/public/assets/images/trailspot.png" alt="trailSpot">
</p>

## Description
A simple app that gets the users location and gives a selection of trails around the area or the user can search by city/state to find trails for future trips. Current weather conditions are shown for the searched location as well.

## Setup

1. Clone this repo: `https://github.com/danlubbers/trailSpot`
2. CD into `trailSpot`
3. `npm install` dependencies 

You will need to get 'three' API keys from the following sites:
  1. https://www.hikingproject.com/data
  2. https://opencagedata.com/api
  3. https://openweathermap.org/api

Once you have those api keys, create a `config.js` file and set it up like this

```
module.exports = {
  API_KEY_REI : 'Your KEY',
  API_KEY_OPENCAGE : 'Your KEY', 
  API_KEY_WEATHER : 'Your KEY'
}

```

4. After you have created the `config.js` file and added the code above and put in your api keys, you can now run the app.
5. `npm start`


## Project Requirements
---

* [x] Your project must make one asynchronous call per person in your group.
* [x] You must use an aysnchronous library or API that we covered in class (Fetch, Axios and/or Async & Await).
* [x] You will need at least one API that will return images somewhere within the results. You must display images on the page from this API call.
* [x] You must store content in simple data structures (arrays, objects and sets).
* [x] Your code must contain at least one high order function with arrays (e.g. _Array.forEach_, _Array.map_, _Array.find_, _Array.filter_ and _Array.reduce_).
* [x] Your code should not have any Cross Site Scripting (XSS) vulnerabilities.
* [x] You must have at least one arrow function.
* [x] Do not use _var_.
* [x] You must show and hide DOM elements on the screen.
* [x] You must handle at least three different events.
* [x] You must handle user input somewhere within the project. (For example, handle a search engine or display text that the user typed somewhere on the page).
* [x] Limit your use of global variables. You can do this by organizing your code.
* [x] You must create a new repository for this project. Everyone in the group should be contributors.


## Author

* **Dan Lubbers**   [danlubbers.com](https://danlubbers.com)