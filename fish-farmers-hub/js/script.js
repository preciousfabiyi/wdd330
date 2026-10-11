// Mobile navigation
const menuButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#primary-navigation');

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('open');

        menuButton.setAttribute('aria-expanded', isOpen);
        menuButton.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation menu' : 'Open navigation menu'
        );

        menuButton.textContent = isOpen ? '✕' : '☰';
    });
}

// Automatically display the current year
const currentYear = document.querySelector('#current-year');

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
// Dark mode
const themeToggle = document.querySelector('#theme-toggle');

// Restore the saved theme preference
const savedTheme = localStorage.getItem('fish-farmers-theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

function updateThemeButton() {
    if (!themeToggle) return;

    const darkModeEnabled = document.body.classList.contains('dark-mode');

    themeToggle.textContent = darkModeEnabled
        ? '☀️ Light Mode'
        : '🌙 Dark Mode';

    themeToggle.setAttribute(
        'aria-label',
        darkModeEnabled ? 'Switch to light mode' : 'Switch to dark mode'
    );
}

if (themeToggle) {
    updateThemeButton();

    themeToggle.addEventListener('click', () => {
        const darkModeEnabled = document.body.classList.toggle('dark-mode');

        localStorage.setItem(
            'fish-farmers-theme',
            darkModeEnabled ? 'dark' : 'light'
        );

        updateThemeButton();
    });
}
// Fish feeding calculator
const feedCalculator = document.querySelector('#feed-calculator');

if (feedCalculator) {
    feedCalculator.addEventListener('submit', (event) => {
        event.preventDefault();

        const fishCount = Number(
            document.querySelector('#fish-count').value
        );

        const averageWeight = Number(
            document.querySelector('#average-weight').value
        );

        const feedingRate = Number(
            document.querySelector('#feeding-rate').value
        );

        const result = document.querySelector('#calculator-result');

        if (
            !Number.isInteger(fishCount) ||
            fishCount < 1 ||
            !Number.isFinite(averageWeight) ||
            averageWeight <= 0 ||
            !Number.isFinite(feedingRate) ||
            feedingRate < 0.1 ||
            feedingRate > 10
        ) {
            result.textContent = 'Please enter valid values in all fields.';
            return;
        }

        // Calculate total fish biomass in kilograms.
        const totalBiomassKg =
            (fishCount * averageWeight) / 1000;

        // Estimate daily feed in kilograms.
        const dailyFeedKg =
            totalBiomassKg * (feedingRate / 100);

        result.replaceChildren();

        const biomassText = document.createElement('p');
        biomassText.textContent =
            `Estimated total fish biomass: ${totalBiomassKg.toFixed(2)} kg`;

        const feedText = document.createElement('p');
        feedText.textContent =
            `Estimated daily feed: ${dailyFeedKg.toFixed(3)} kg (${(dailyFeedKg * 1000).toFixed(0)} grams)`;

        result.append(biomassText, feedText);
    });
}
// Fish Stock Tracker
const stockForm = document.querySelector('#stock-form');
const stockList = document.querySelector('#stock-list');
const stockSummary = document.querySelector('#stock-summary');
const stockMessage = document.querySelector('#stock-message');

const stockStorageKey = 'fish-farmers-stock';

function getStockRecords() {
    try {
        const savedRecords = localStorage.getItem(stockStorageKey);
        const records = savedRecords ? JSON.parse(savedRecords) : [];

        return Array.isArray(records) ? records : [];
    } catch {
        return [];
    }
}

function saveStockRecords(records) {
    localStorage.setItem(stockStorageKey, JSON.stringify(records));
}

function displayStockRecords() {
    if (!stockList || !stockSummary) return;

    const records = getStockRecords();

    stockList.replaceChildren();

    const totalFish = records.reduce(
        (total, record) => total + record.count,
        0
    );

    stockSummary.textContent =
        `Total stock records: ${records.length} | Total fish recorded: ${totalFish}`;

    if (records.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 4;
        cell.textContent = 'No stock records yet. Add your first record above.';

        row.appendChild(cell);
        stockList.appendChild(row);

        return;
    }

    records.forEach((record) => {
        const row = document.createElement('tr');

        const typeCell = document.createElement('td');
        typeCell.textContent = record.type;

        const countCell = document.createElement('td');
        countCell.textContent = record.count;

        const dateCell = document.createElement('td');
        dateCell.textContent = record.date;

        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');

        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute(
            'aria-label',
            `Delete ${record.type} stock record`
        );

        deleteButton.addEventListener('click', () => {
            const updatedRecords = getStockRecords().filter(
                (item) => item.id !== record.id
            );

            saveStockRecords(updatedRecords);
            displayStockRecords();

            if (stockMessage) {
                stockMessage.textContent = 'Stock record deleted.';
            }
        });

        actionCell.appendChild(deleteButton);

        row.append(
            typeCell,
            countCell,
            dateCell,
            actionCell
        );

        stockList.appendChild(row);
    });
}

if (stockForm) {
    const stockDate = document.querySelector('#stock-date');

    stockDate.value = new Date().toLocaleDateString('en-CA');

    stockForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const type = document.querySelector('#fish-type').value;
        const count = Number(
            document.querySelector('#stock-count').value
        );
        const date = stockDate.value;

        if (
            !type ||
            !Number.isInteger(count) ||
            count < 1 ||
            !date
        ) {
            stockMessage.textContent =
                'Please enter valid information for every field.';
            return;
        }

        const records = getStockRecords();

        records.push({
            id: crypto.randomUUID(),
            type,
            count,
            date,
        });

        try {
            saveStockRecords(records);

            stockForm.reset();
            stockDate.value = new Date().toLocaleDateString('en-CA');

            stockMessage.textContent = 'Stock record saved successfully.';

            displayStockRecords();
        } catch {
            stockMessage.textContent =
                'Unable to save the record. Check your browser storage.';
        }
    });
}

displayStockRecords();

// Contact form
const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        contactStatus.textContent =
            'Thank you for your message. This demonstration form does not send messages to a server.';

        contactForm.reset();
    });
}

// Community reviews
const reviewForm = document.querySelector('#review-form');
const reviewsList = document.querySelector('#reviews-list');
const reviewSummary = document.querySelector('#review-summary');
const reviewStatus = document.querySelector('#review-status');

const reviewsStorageKey = 'fish-farmers-reviews';

function getReviews() {
    try {
        const savedReviews = localStorage.getItem(reviewsStorageKey);
        const reviews = savedReviews ? JSON.parse(savedReviews) : [];

        return Array.isArray(reviews) ? reviews : [];
    } catch {
        return [];
    }
}

function displayReviews() {
    if (!reviewsList || !reviewSummary) return;

    const reviews = getReviews();

    reviewsList.replaceChildren();

    const averageRating = reviews.length
        ? reviews.reduce((total, review) => total + review.rating, 0)
            / reviews.length
        : 0;

    reviewSummary.textContent = reviews.length
        ? `${reviews.length} review(s) | Average rating: ${averageRating.toFixed(1)} out of 5`
        : 'No reviews yet. Be the first to share your experience!';

    reviews.forEach((review) => {
        const article = document.createElement('article');
        article.classList.add('review-card');

        const heading = document.createElement('h3');
        heading.textContent = review.name;

        const stars = document.createElement('p');
        stars.classList.add('review-stars');
        stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;
        stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);

        const text = document.createElement('p');
        text.textContent = review.text;

        const date = document.createElement('p');
        date.classList.add('review-date');
        date.textContent = `Submitted on ${review.date}`;

        article.append(heading, stars, text, date);
        reviewsList.appendChild(article);
    });
}

if (reviewForm) {
    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.querySelector('#review-name').value.trim();
        const text = document.querySelector('#review-text').value.trim();
        const selectedRating = reviewForm.querySelector(
            'input[name="rating"]:checked'
        );

        if (!name || !text || !selectedRating) {
            reviewStatus.textContent =
                'Please enter your name, select a rating, and write a review.';
            return;
        }

        const review = {
            name,
            text,
            rating: Number(selectedRating.value),
            date: new Date().toLocaleDateString(),
        };

        try {
            const reviews = getReviews();
            reviews.unshift(review);

            localStorage.setItem(
                reviewsStorageKey,
                JSON.stringify(reviews)
            );

            reviewForm.reset();

            reviewStatus.textContent = 'Thank you! Your review has been saved.';
            displayReviews();
        } catch {
            reviewStatus.textContent =
                'Your review could not be saved. Check your browser storage.';
        }
    });
}

displayReviews();