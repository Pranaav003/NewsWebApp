const apiKey = "pub_56179a4b5b18c78b12e1a276ab220aa3c99f1"; // Replace with your actual API key

/**
* Truncate text to a specified length and append ellipsis.
* @param {string} text - The text to truncate.
* @param {number} maxLength - The maximum allowed length.
* @returns {string} - Truncated text with ellipsis if necessary.
*/

// Show the search history dropdown
function showSearchHistoryDropdown() {
    const dropdown = document.getElementById('search-history-dropdown');
    dropdown.classList.remove('hidden');
}

// Hide the search history dropdown
function hideSearchHistoryDropdown() {
    const dropdown = document.getElementById('search-history-dropdown');
    setTimeout(() => {
        if (!dropdown.matches(':hover')) {
            dropdown.classList.add('hidden');
        }
    }, 300); // Increased delay to allow click event on dropdown items
}

// Event listener for search input focus
document.getElementById('default-search').addEventListener('focus', showSearchHistoryDropdown);

// Event listener for search input blur
document.getElementById('default-search').addEventListener('blur', hideSearchHistoryDropdown);

// Event listener for dropdown items
document.querySelectorAll('[data-entry]').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        const query = event.target.getAttribute('data-entry');
        fetchArticles(query);
    });
});

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Fetch articles based on query
async function fetchArticles(query) {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === "success" && data.results.length > 0) {
            const filteredArticles = filterAdultContent(data.results);
            const uniqueArticles = removeDuplicateArticles(filteredArticles);
            displayArticles(uniqueArticles);
        } else {
            console.error("No articles found");
            document.getElementById("news-grid").innerHTML = `<p class="text-center text-red-500">No articles found for "${category}". Please try a different category.</p>`;
        }
    } catch (error) {
        console.error("Error fetching the news:", error);
        document.getElementById("news-grid").innerHTML = `<p class="text-center text-red-500">An error occurred while fetching the news.</p>`;
    }
}

// Function to dynamically create a news article card
function createNewsCard(article) {
    const title = article.title && article.title !== '[Removed]' ? truncateText(article.title, 100) : null;
    const description = article.description && article.description !== '[Removed]' ? article.description : null;
    const image_url = article.image_url && (article.image_url !== null || article.image_url !== '[Article Image]' ? article.image_url : '/public/test.png');
    const link = article.link ? article.link : null;
    const pubDate = article.pubDate ? new Date(article.pubDate).toLocaleDateString() : "Date not available";
    const source_icon = article.source_icon ? article.source_icon : '/public/test.png'; // Fallback to a placeholder icon

    // Skip this article if any of the key fields are missing (except image_url)
    if (!title || !description || !link) {
        return null;
    }

    // Use test.png if image_url or source_icon is not available
    const finalImageUrl = image_url ? (image_url.includes('600px') ? image_url : resizeImage(image_url, 600)) : '/test.png';

    return `
    <div class="bg-white shadow-lg rounded-lg p-10 relative border-gray-200 hover:shadow-xl transition transform duration-100 hover:scale-105 transition transform duration-300 h-96 news-card fade-in" data-title="${title}" data-description="${description}">
        <!-- Article Image or Source Icon -->
        <img src="${finalImageUrl}" alt="Article Image" class="w-full h-48 mb-4 rounded-t-lg object-cover">
        
        <!-- Article Date -->
        <p class="text-sm text-gray-500 absolute bottom-2 left-2">${pubDate}</p>
        
        <!-- Article Title -->
        <h2 class="text-xl font-semibold text-gray-800 text-center absolute bottom-[40px] right-[10px] left-[10px]">${title}</h2>
        
        <!-- Read More Button -->
        <a href="${link}" target="_blank" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 z-10">Read More</a>
        
        <!-- Hover Effect -->
        <div class="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <p class="text-gray-800 text-lg font-bold outline outline-offset-[5px] absolute top-10">AI Summary</p>
            <p class="text-gray-800 text-lg summary-text mt-4 px-7 text-center items-center animate-fade-out">[Loading summary...]</p>
        </div>
    </div>`;
}

// Function to resize image
function resizeImage(url, maxWidth) {
    return `${url}?width=${maxWidth}`;
}

// Function to display multiple articles in the news grid
function displayArticles(articles) {
    const newsGrid = document.getElementById("news-grid");
    newsGrid.innerHTML = ''; // Clear any existing content
    const uniqueArticles = getUniqueArticles(articles, 9); // Get 9 unique articles
    uniqueArticles.forEach((article, index) => {
        const newsCard = createNewsCard(article);
        if (newsCard) {  // Only add the card if it's valid
            newsGrid.innerHTML += newsCard;
        }
    });

    // Add hover event listeners to fetch summaries
    document.querySelectorAll('.news-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`; // Add delay for each card
        card.addEventListener('mouseenter', async (event) => {
            const title = event.currentTarget.getAttribute('data-title');
            const description = event.currentTarget.getAttribute('data-description');
            const summaryTextElement = event.currentTarget.querySelector('.summary-text');

            // Check if summary is already fetched
            if (summaryTextElement.getAttribute('data-fetched') === 'true') {
                return;
            }

            try {
                const response = await fetch('/summarize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: `${title}. ${description}` })
                });

                const data = await response.json();
                if (data.success) {
                    summaryTextElement.textContent = data.summary;
                    summaryTextElement.setAttribute('data-fetched', 'true'); // Mark as fetched
                    summaryTextElement.classList.remove('animate-fade-out');
                    summaryTextElement.classList.add('animate-fade-in');
                } else {
                    summaryTextElement.textContent = 'Failed to fetch summary.';
                }
            } catch (error) {
                summaryTextElement.textContent = 'Error fetching summary.';
            }
        });
    });
}

// Function to get a specified number of unique articles
function getUniqueArticles(articles, count) {
    const shuffled = articles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to remove duplicate articles based on title and link
function removeDuplicateArticles(articles) {
    const seen = new Set();
    return articles.filter(article => {
        const identifier = `${article.title}-${article.link}`;
        if (seen.has(identifier)) {
            return false;
        } else {
            seen.add(identifier);
            return true;
        }
    });
}

// Function to filter out adult content
function filterAdultContent(articles) {
    const adultKeywords = ['nude', 'sexy', 'summary'];
    return articles.filter(article => {
        const title = article.title ? article.title.toLowerCase() : '';
        const description = article.description ? article.description.toLowerCase() : '';
        return !adultKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
    });
}

//Fetch articles using query from search
if(query !== '') {
    fetchArticles(query)
} else { // Fetch and display a random set of articles when the page loads
    fetchArticles('microsoft OR apple OR tesla OR conflict OR war OR dispute OR bitcoin OR stocks OR wallstreet OR protests');
}
