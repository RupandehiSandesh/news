// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Date and Time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US');
}

// Simulate Temperature
function updateTemperature() {
    const temperatures = ['22°C', '24°C', '25°C', '23°C', '26°C'];
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    document.getElementById('temperature').textContent = `Temperature: ${randomTemp}`;
}

// News Data Management
let newsData = [];

// Load news from JSON file with auto-refresh
async function loadNews() {
    try {
        // Try to load from localStorage first (faster)
        const localNews = localStorage.getItem('rupandehi-sandesh-news');
        if (localNews) {
            newsData = JSON.parse(localNews);
            displayNews();
        }
        
        // Then try to load from JSON file
        const response = await fetch('news-data.json?' + new Date().getTime());
        const fileNews = await response.json();
        
        // Use whichever has more recent data
        if (fileNews.length > newsData.length) {
            newsData = fileNews;
            displayNews();
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        loadSampleData();
    }
}

function loadSampleData() {
    newsData = [
        {
            id: 1,
            title: "Welcome to Rupandehi Sandesh",
            category: "featured",
            excerpt: "Your trusted news portal for latest updates from Rupandehi and beyond.",
            content: "Rupandehi Sandesh is your premier source for news, updates, and stories from Rupandehi and surrounding areas. We are committed to delivering accurate, timely, and relevant news to our readers.",
            image: "https://via.placeholder.com/400x200?text=Rupandehi+Sandesh",
            date: new Date().toISOString(),
            author: "Editor",
            isBreaking: true,
            isFeatured: true
        }
    ];
    displayNews();
}

function displayNews() {
    displayFeaturedNews();
    displayCategoryNews('politics');
    displayCategoryNews('business');
    displayCategoryNews('sports');
    displayCategoryNews('entertainment');
    displayCategoryNews('technology');
    updateBreakingNews();
}

function displayFeaturedNews() {
    const featuredContainer = document.getElementById('featured-news');
    const featuredNews = newsData.filter(news => news.isFeatured);
    
    if (featuredNews.length === 0) {
        featuredContainer.innerHTML = '<p>No featured news available.</p>';
        return;
    }
    
    featuredContainer.innerHTML = featuredNews.map((news, index) => `
        <div class="featured-item">
            <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=News+Image'">
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <div class="news-meta">
                    <span>${formatDate(news.date)}</span> • 
                    <span>${news.author}</span>
                </div>
                <p class="news-excerpt">${news.excerpt}</p>
            </div>
        </div>
    `).join('');
}

function displayCategoryNews(category) {
    const container = document.getElementById(`${category}-news`);
    const categoryNews = newsData.filter(news => news.category === category && !news.isFeatured);
    
    if (categoryNews.length === 0) {
        container.innerHTML = `<p>No ${category} news available.</p>`;
        return;
    }
    
    container.innerHTML = categoryNews.map(news => `
        <div class="news-card">
            <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='https://via.placeholder.com/400x200?text=News+Image'">
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <div class="news-meta">
                    <span>${formatDate(news.date)}</span> • 
                    <span>${news.author}</span>
                </div>
                <p class="news-excerpt">${news.excerpt}</p>
            </div>
        </div>
    `).join('');
}

function updateBreakingNews() {
    const breakingNews = newsData.find(news => news.isBreaking);
    const breakingElement = document.getElementById('breaking-news-text');
    
    if (breakingNews) {
        breakingElement.textContent = `BREAKING: ${breakingNews.title}`;
    }
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Auto-refresh news every 30 seconds
setInterval(() => {
    loadNews();
}, 30000);

// Refresh when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadNews();
    }
});

// Initialize everything
updateDateTime();
updateTemperature();
setInterval(updateDateTime, 1000);
setInterval(updateTemperature, 300000);
loadNews();
