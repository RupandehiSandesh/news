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

// News Management
let newsData = [];

// Load existing news
async function loadNews() {
    try {
        const response = await fetch('news-data.json');
        newsData = await response.json();
        displayNewsList();
    } catch (error) {
        console.error('Error loading news:', error);
        newsData = [];
        displayNewsList();
    }
}

// Save news to both localStorage and trigger update
async function saveNews() {
    // Save to localStorage for immediate access
    localStorage.setItem('rupandehi-sandesh-news', JSON.stringify(newsData));
    localStorage.setItem('lastNewsUpdate', new Date().getTime());
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(newsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'news-data.json';
    link.click();
    
    alert('News added successfully! The main website will update automatically.');
}

// Add new news article
document.getElementById('news-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newArticle = {
        id: Date.now(),
        title: document.getElementById('news-title').value,
        excerpt: document.getElementById('news-excerpt').value,
        content: document.getElementById('news-content').value,
        category: document.getElementById('news-category').value,
        author: document.getElementById('news-author').value,
        image: document.getElementById('news-image').value || 'https://via.placeholder.com/400x200?text=News+Image',
        date: new Date().toISOString(),
        isBreaking: document.getElementById('is-breaking').checked,
        isFeatured: document.getElementById('is-featured').checked
    };
    
    newsData.unshift(newArticle);
    saveNews();
    displayNewsList();
    this.reset();
});

// Clear form
document.getElementById('clear-form').addEventListener('click', function() {
    document.getElementById('news-form').reset();
});

// Display news list
function displayNewsList() {
    const container = document.getElementById('news-list-container');
    
    if (newsData.length === 0) {
        container.innerHTML = '<p>No news articles found. Add your first article above.</p>';
        return;
    }
    
    container.innerHTML = newsData.map(article => `
        <div class="news-item">
            <div class="news-item-header">
                <div>
                    <div class="news-item-title">${article.title}</div>
                    <div class="news-item-meta">
                        ${formatDate(article.date)} • ${article.author} • ${article.category}
                        ${article.isBreaking ? '• <span style="color: red;">BREAKING</span>' : ''}
                        ${article.isFeatured ? '• <span style="color: orange;">FEATURED</span>' : ''}
                    </div>
                </div>
                <div class="news-item-actions">
                    <button onclick="editArticle(${article.id})" class="btn btn-secondary btn-sm">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteArticle(${article.id})" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <p>${article.excerpt}</p>
        </div>
    `).join('');
}

// Edit article
function editArticle(id) {
    const article = newsData.find(item => item.id === id);
    if (article) {
        document.getElementById('news-title').value = article.title;
        document.getElementById('news-excerpt').value = article.excerpt;
        document.getElementById('news-content').value = article.content;
        document.getElementById('news-category').value = article.category;
        document.getElementById('news-author').value = article.author;
        document.getElementById('news-image').value = article.image;
        document.getElementById('is-breaking').checked = article.isBreaking;
        document.getElementById('is-featured').checked = article.isFeatured;
        
        // Remove the article from the list
        newsData = newsData.filter(item => item.id !== id);
        saveNews();
        displayNewsList();
        
        alert('Article loaded for editing. Make changes and click "Add News Article" to update.');
    }
}

// Delete article
function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        newsData = newsData.filter(item => item.id !== id);
        saveNews();
        displayNewsList();
        alert('Article deleted successfully!');
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

// Initialize
updateDateTime();
setInterval(updateDateTime, 1000);
loadNews();
