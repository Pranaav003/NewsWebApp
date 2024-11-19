// Initialize search history array
let searchHistory = [];

// Load search history from localStorage
function loadSearchHistory() {
    const history = localStorage.getItem('searchHistory');
    if (history) {
        searchHistory = JSON.parse(history);
    } else {
        searchHistory = [];
    }
}

// Save search history to localStorage
function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Update the search history dropdown
function updateSearchHistoryDropdown() {
    const dropdown = document.getElementById('search-history-dropdown');
    const list = document.getElementById('search-history-list');
    list.innerHTML = '';

    if (searchHistory.length === 0) {
        const noHistoryItem = document.createElement('li');
        noHistoryItem.className = 'px-4 py-2 text-gray-500';
        noHistoryItem.textContent = 'No search history';
        list.appendChild(noHistoryItem);
    } else {
        searchHistory.slice().reverse().forEach((query) => {
            const listItem = document.createElement('li');
            listItem.className = 'px-4 py-2 hover:bg-gray-200 cursor-pointer';
            listItem.textContent = query;
            listItem.addEventListener('click', () => {
                document.getElementById('default-search').value = query;
                dropdown.classList.add('hidden');
                fetchArticles(query);
            });
            list.appendChild(listItem);
        });
    }
}

// Show the search history dropdown
function showSearchHistoryDropdown() {
    const dropdown = document.getElementById('search-history-dropdown');
    updateSearchHistoryDropdown();
    dropdown.classList.remove('hidden');
}

// Hide the search history dropdown
function hideSearchHistoryDropdown() {
    const dropdown = document.getElementById('search-history-dropdown');
    setTimeout(() => {
        dropdown.classList.add('hidden');
    }, 100); // Delay to allow click event on dropdown items
}

// Event listener for search input focus
document.getElementById('default-search').addEventListener('focus', showSearchHistoryDropdown);

// Event listener for search input blur
document.getElementById('default-search').addEventListener('blur', hideSearchHistoryDropdown);

// Event listener for search form submission
document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const searchQuery = document.getElementById('default-search').value.trim();

    if (searchQuery) {
        // Add to search history if it's not a duplicate
        if (!searchHistory.includes(searchQuery)) {
            searchHistory.push(searchQuery);
            if (searchHistory.length > 10) {
                // Limit history to 10 items
                searchHistory.shift();
            }
            saveSearchHistory();
        }
        fetchArticles(searchQuery);
        hideSearchHistoryDropdown();
    }
});

// Event listener for dropdown items
document.querySelectorAll('[data-category]').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        const category = event.target.getAttribute('data-category');
        fetchArticles(category);
    });
});

// Load search history on page load
loadSearchHistory();