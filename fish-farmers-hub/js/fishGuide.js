// ==========================================
// FISH FARMERS HUB - FISH SPECIES GUIDE
// Seafood Watch API
// ==========================================

const fishSearchForm = document.querySelector('#fish-search-form');
const fishSearchInput = document.querySelector('#fish-search');
const fishStatus = document.querySelector('#fish-status');
const fishResults = document.querySelector('#fish-results');
const FISH_DATA_URL = "data/fish-species.json";



async function getFishSpecies() {
  const response = await fetch(FISH_DATA_URL);

  if (!response.ok) {
    throw new Error("Unable to load the fish species dataset.");
  }

  const fishSpecies = await response.json();

  if (!Array.isArray(fishSpecies)) {
    throw new Error("The fish species data has an invalid format.");
  }

  return fishSpecies;
}

function displayFishResults(fishSpecies) {
  fishResults.replaceChildren();

  if (fishSpecies.length === 0) {
    fishStatus.textContent =
      "No matching fish species found. Try another name.";

    return;
  }

  fishStatus.textContent =
    `Found ${fishSpecies.length} matching fish species.`;

  fishSpecies.forEach((fish) => {
    const card = document.createElement("article");
    card.className = "fish-card";

    const title = document.createElement("h3");
    title.textContent = fish.commonName;

    const scientificName = document.createElement("p");
    scientificName.textContent =
      `Scientific name: ${fish.scientificName}`;

    const group = document.createElement("p");
    group.textContent = `Group: ${fish.group}`;

    const rating = document.createElement("p");
    rating.textContent = `Sustainability: ${fish.rating}`;

    const description = document.createElement("p");
    description.textContent = fish.description;

    card.append(
      title,
      scientificName,
      group,
      rating,
      description
    );

    fishResults.appendChild(card);
  });
}

if (fishSearchForm) {
  fishSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchTerm = fishSearchInput.value.trim().toLowerCase();

    if (!searchTerm) {
      fishStatus.textContent = "Please enter a fish species name.";
      fishResults.replaceChildren();
      return;
    }

    fishStatus.textContent = "Searching fish species...";
    fishResults.replaceChildren();

    try {
      const fishSpecies = await getFishSpecies();

      const filteredFish = fishSpecies.filter((fish) => {
        return (
          fish.commonName.toLowerCase().includes(searchTerm) ||
          fish.scientificName.toLowerCase().includes(searchTerm) ||
          fish.group.toLowerCase().includes(searchTerm)
        );
      });

      displayFishResults(filteredFish);
    } catch (error) {
      console.error("Fish guide error:", error);

      fishStatus.textContent =
        "Unable to load fish data. Please try again.";

      fishResults.replaceChildren();
    }
  });
}

// ==========================================
// FETCH FISH ASSESSMENTS
// ==========================================

async function searchFishSpecies(searchTerm) {
    const response = await fetch(SEAFOOD_API_URL, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(
            `The fish data request failed (${response.status}).`
        );
    }

    const assessments = await response.json();

    if (!Array.isArray(assessments)) {
        throw new Error('The API returned data in an unexpected format.');
    }

    const search = searchTerm.toLowerCase();

    return assessments.filter((assessment) => {
        const species = assessment.species || [];

        const speciesMatches = species.some((fish) => {
            const commonName =
                (fish.sP_CommonName || '').toLowerCase();

            const scientificName =
                (fish.sP_ScientificName || '').toLowerCase();

            return (
                commonName.includes(search) ||
                scientificName.includes(search)
            );
        });

        const titleMatches =
            (assessment.title || '').toLowerCase().includes(search);

        return speciesMatches || titleMatches;
    });
}

// ==========================================
// DISPLAY FISH ASSESSMENTS
// ==========================================

function displayFishResults(assessments) {
    fishResults.replaceChildren();

    if (assessments.length === 0) {
        fishStatus.textContent =
            'No matching assessments were found. Try another species name.';
        return;
    }

    fishStatus.textContent =
        `Found ${assessments.length} matching assessment(s).`;

    assessments.forEach((assessment) => {
        const card = document.createElement('article');
        card.className = 'fish-card';

        const title = document.createElement('h3');
        title.textContent =
            assessment.title || 'Fish Species Assessment';

        card.appendChild(title);

        // Display species information
        const species = assessment.species || [];

        species.forEach((fish) => {
            const commonName = document.createElement('p');
            commonName.textContent =
                `Common name: ${fish.sP_CommonName || 'Not provided'}`;

            const scientificName = document.createElement('p');
            scientificName.textContent =
                `Scientific name: ${fish.sP_ScientificName || 'Not provided'}`;

            const groupName = document.createElement('p');
            groupName.textContent =
                `Group: ${fish.gR_GroupName || 'Not provided'}`;

            card.append(commonName, scientificName, groupName);
        });

        // Display rating
        const rating = document.createElement('p');
        rating.textContent =
            `Rating: ${assessment.ratingColor?.name || 'Not provided'}`;

        card.appendChild(rating);

        // Display description
        if (assessment.description) {
            const description = document.createElement('p');
            description.textContent = assessment.description;
            card.appendChild(description);
        }

        // Display publication date when available
        if (assessment.publishDate) {
            const date = document.createElement('p');
            date.textContent =
                `Published: ${assessment.publishDate.slice(0, 10)}`;

            card.appendChild(date);
        }

        // Link to the original assessment
        if (assessment.reportURL) {
            const reportLink = document.createElement('a');
            reportLink.href = assessment.reportURL;
            reportLink.textContent = 'View original assessment';
            reportLink.target = '_blank';
            reportLink.rel = 'noopener noreferrer';

            card.appendChild(reportLink);
        }

        fishResults.appendChild(card);
    });
}

// ==========================================
// HANDLE SEARCH FORM
// ==========================================

if (fishSearchForm) {
    fishSearchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const searchTerm = fishSearchInput.value.trim();

        if (!searchTerm) {
            fishStatus.textContent =
                'Please enter a fish species name.';
            return;
        }

        fishStatus.textContent = 'Searching fish assessments...';
        fishResults.replaceChildren();

        try {
            const assessments = await searchFishSpecies(searchTerm);

            displayFishResults(assessments);
        } catch (error) {
            console.error('Fish guide error:', error);

            fishStatus.textContent =
                'Unable to load fish assessments. Please check your internet connection and try again.';

            fishResults.replaceChildren();
        }
    });
}