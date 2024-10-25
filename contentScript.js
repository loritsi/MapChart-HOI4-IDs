// fetch the state data from the JSON file
async function fetchStateData() {
  try {
    const response = await fetch(browser.runtime.getURL('list.json'));
    const stateData = await response.json();
    return stateData;
  } catch (error) {
    console.error('Error fetching state data:', error);
    return {};
  }
}

function modifyTooltip(stateData) {
  const tooltipElement = document.querySelector('#info-tooltip .tooltip-title');

  // define custom matching allowances as key-value pairs
  const customMatches = {
    "Borkou Ennedi Tibesti": "B.E.T.",
    "Luxemburg": "Luxembourg",
    "Pampas": "Buenos Aires",
    "Mesopotamia": "Santa Fe",
    "Santa Cruz AR": "Santa Cruz",
    "Södermalm": "Södermanland",
    "Cabo Verde": "Cape Verde"
  };

  if (tooltipElement && !tooltipElement.getAttribute('data-modified')) {
    let stateName = tooltipElement.textContent.trim();
    
    // check if the state name has a manual override
    stateName = customMatches[stateName] || stateName; // use custom match if available

    // normalize the state name by removing special characters, spaces, and hyphens
    const normalizedStateName = stateName
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics (e.g. ô -> o)
      .replace(/\s|-/g, ''); // remove spaces and hyphens

    // loop through the state data to find a match
    const matchedState = stateData.find(state => {
      const normalizedStateKey = Object.keys(state)[0]
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/\s|-/g, ''); // remove spaces and hyphens

      return normalizedStateKey === normalizedStateName;
    });

    if (matchedState) {
      const stateId = Object.values(matchedState)[0];
      tooltipElement.textContent = `${Object.keys(matchedState)[0]} (ID: ${stateId})`; // append state ID
      tooltipElement.setAttribute('data-modified', 'true'); // mark tooltip as modified
    }
  }
}


// load state data and observe changes in the tooltip
fetchStateData().then(stateData => {
  // observe the tooltip container for changes
  const observer = new MutationObserver(() => {
    modifyTooltip(stateData);
  });

  // start observing the tooltip element
  const tooltipDiv = document.getElementById('info-tooltip');
  if (tooltipDiv) {
    observer.observe(tooltipDiv, { childList: true, subtree: true });
  }
});
