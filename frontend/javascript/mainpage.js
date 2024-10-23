// Sample news data, you can replace this with actual API data
const newsData = [
    {
        date: "2024-10-06",
        title: "Tesla's new breakthrough in battery technology",
        description: "Tesla has revealed a new battery technology that could significantly increase the range of electric vehicles.",
        url: "#"
    },
    {
        date: "2024-10-05",
        title: "Microsoft releases Windows 12",
        description: "Microsoft announces the launch of its latest operating system, Windows 12, with innovative new features.",
        url: "#"
    },
    {
        date: "2024-10-04",
        title: "Apple's new iPhone 15",
        description: "Apple introduces the iPhone 15 with cutting-edge camera technology and enhanced processing power.",
        url: "#"
    },
    {
        date: "2024-10-03",
        title: "Nvidia announces RTX 5090",
        description: "Nvidia's latest GPU, the RTX 5090, promises revolutionary performance for gamers and AI developers.",
        url: "#"
    },
    {
        date: "2024-10-02",
        title: "Business growth tips for small startups",
        description: "Here are some practical growth tips for small businesses looking to scale their operations.",
        url: "#"
    },
    {
        date: "2024-10-01",
        title: "Miscellaneous insights: The art of multitasking",
        description: "How to master multitasking and improve productivity in various fields of work.",
        url: "#"
    }
];

// Function to dynamically create news article cards
function createNewsCard(article) {
    return `
    <div class="bg-white shadow-lg rounded-lg p-10 relative border-gray-200 hover:shadow-xl transition transform duration-100 hover:scale-105 transition transform duration-300">
        <!-- Placeholder Image -->
        <img src="javascript/test.png" alt="Article Image" class="w-full h-auto mb-4 rounded-t-lg">
        
        <!-- Article Date -->
        <p class="text-sm text-gray-500 absolute bottom-2 left-2">${article.date}</p>
        
        <!-- Article Title -->
        <h2 class="text-xl font-semibold text-gray-800 text-center">${article.title}</h2>
        
        <!-- Read More Button -->
        <a href="${article.url}" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1">Read More</a>
    </div>`;
}

// Function to populate the news grid dynamically
function populateNewsGrid(newsArray) {
    const newsGrid = document.getElementById("news-grid");
    let newsContent = "";
    newsArray.forEach(article => {
        newsContent += createNewsCard(article);
    });
    newsGrid.innerHTML = newsContent;
}

// Function to load news articles on page load
function loadNewsArticles() {
    populateNewsGrid(newsData);
}
