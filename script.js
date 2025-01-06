const NEWS_API_KEY = '4368033c3ba841698ba47777c51bdb98';

const state = {
    selectedCategories: new Set([]),
    bookmarks: new Map(),
    articles: [],
    searchQuery: ''
};

const newsGrid = document.getElementById('newsGrid');

function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
        state.bookmarks = new Map(JSON.parse(savedBookmarks));
    }
}

function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify([...state.bookmarks]));
}

async function fetchNews() {
    try {
        const categories = state.selectedCategories.size > 0 ? state.selectedCategories : new Set(['general', 'technology', 'business', 'science', 'health']);
        const fetchPromises = Array.from(categories).map(category =>
            fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}`)
                .then(response => response.json())
                .then(data => data.articles)
        );

        const articlesArrays = await Promise.all(fetchPromises);
        const uniqueArticles = Array.from(
            new Map(
                articlesArrays.flat()
                    .map(article => [article.title, article])
            ).values()
        );

        state.articles = uniqueArticles;
        return uniqueArticles;
    } catch (error) {
        state.error = error.message;
        return [];
    }
}

function toggleCategory(category) {
    if (state.selectedCategories.has(category)) {
        state.selectedCategories.delete(category);
    } else {
        state.selectedCategories.add(category);
    }
    updateSelectedTopics();
    renderNews();
}

function updateSelectedTopics() {
    const container = document.getElementById('selectedTopics');
    if (!container) {
        console.error('Element with id "selectedTopics" not found.');
        return;
    }

    try {
        if (!state.selectedCategories || !state.selectedCategories.size) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = Array.from(state.selectedCategories)
            .map(category => `
                <span class="selected-topic">
                    ${category}
                    <span class="remove-topic" onclick="toggleCategory('${category}')">&times;</span>
                </span>
            `).join('');
    } catch (error) {
        console.error('Error updating selected topics:', error);
    }
}

//render articles
function processArticles(articles) {
    const searchTerm = state.searchQuery.toLowerCase();
    
    const bookmarkedArticles = Array.from(state.bookmarks.values());
    const allArticles = [...bookmarkedArticles, ...articles];
    
    const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.title, article])).values()
    );
    
    const filteredArticles = uniqueArticles.filter(article => {
        const titleMatch = article.title?.toLowerCase().includes(searchTerm);
        const descriptionMatch = article.description?.toLowerCase().includes(searchTerm);
        return titleMatch || descriptionMatch;
    });
    
    return filteredArticles.sort((a, b) => {
        const aBookmarked = state.bookmarks.has(a.title);
        const bBookmarked = state.bookmarks.has(b.title);
        return bBookmarked - aBookmarked;
    });
}

function toggleBookmark(article) {
    try {
        const articleObj = typeof article === 'string' ? JSON.parse(article) : article;
        
        if (state.bookmarks.has(articleObj.title)) {
            state.bookmarks.delete(articleObj.title);
        } else {
            state.bookmarks.set(articleObj.title, articleObj);
        }
        
        saveBookmarks();
        renderNews();
    } catch (error) {
        console.error('Error toggling bookmark:', error);
    }
}

async function renderNews() {
    const fetchedArticles = await fetchNews();
    const sortedArticles = processArticles(fetchedArticles);
    
    newsGrid.innerHTML = sortedArticles.length ? 
        sortedArticles.map(article => `
            <article class="news-card ${state.bookmarks.has(article.title) ? 'bookmarked' : ''}">
                <img src="${article.urlToImage || '/api/placeholder/400/320'}" 
                     alt="${article.title}"
                     class="news-image"
                     onerror="this.src='/api/placeholder/400/320'">
                <div class="news-content">
                    <h3 class="news-title">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                            ${article.title}
                        </a>
                    </h3>
                    <p class="news-description">${article.description || 'No description available'}</p>
                    <div class="news-meta">
                        <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
                        <span>${article.source.name}</span>
                    </div>
                    <button class="bookmark-btn" onclick='toggleBookmark(${JSON.stringify(article).replace(/'/g, "&#39;")})' style="font-size: 1.5em;">
                        ${state.bookmarks.has(article.title) ? '★' : '☆'}
                    </button>
                </div>
            </article>
        `).join('') :
        '<div class="no-results">No articles found matching your search criteria</div>';
}

//filter the articles
function filterArticles(articles) {
    const searchTerm = state.searchQuery.toLowerCase();
    return articles.filter(article => {
        const titleMatch = article.title?.toLowerCase().includes(searchTerm);
        const descriptionMatch = article.description?.toLowerCase().includes(searchTerm);
        return titleMatch || descriptionMatch;
    });
}

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('selected');
        const category = button.dataset.category;
        if (state.selectedCategories.has(category)) {
            state.selectedCategories.delete(category);
        } else {
            state.selectedCategories.add(category);
        }
        updateSelectedTopics();
        renderNews();
    });
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderNews();
});

//__init
async function init() {
    loadBookmarks();
    updateSelectedTopics();
    await renderNews();
}

init();