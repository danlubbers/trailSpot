const clearResults = () => {

  // *** CLEAR/RESET RESULTS AREA *** //
  const clearBtn = document.querySelector('#clearBtn');
  clearBtn.addEventListener('click', () => {

    const locationContainer = document.querySelector('#location-results-container');

    if (locationContainer.style.display === 'flex') {
      locationContainer.style.display = 'none'
    }

    const searchContainer = document.querySelector('#search-results-container');

    if (searchContainer.style.display === 'flex') {
      searchContainer.style.display = 'none'
    }

    document.querySelector('#form').reset();

  });
}

export { clearResults }