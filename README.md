# News Me

A modern, responsive news aggregator web application that allows users to browse, search, and bookmark news articles from various categories.

## Features

- 📰 Real-time news updates from NewsAPI
- 🔍 Search functionality for articles
- 📂 Category-based filtering (General, Technology, Business, Science, Health)
- ⭐ Bookmark articles for later reading
- 💾 Persistent bookmarks using localStorage
- 📱 Responsive design for all devices

## Technologies Used

- HTML5
- CSS3 with CSS Variables
- Vanilla JavaScript (ES6+)
- NewsAPI for fetching news data

## Getting Started

1. Clone this repository:
```bash
git clone https://github.com/yourusername/News-Me.git
```

2. Replace the API key in `script.js`:
```javascript
const NEWS_API_KEY = 'your_api_key_here';
```

3. Open `index.html` in a web browser or serve it using a local development server.

## Usage

- Click on category buttons to filter news by topic
- Use the search bar to find specific articles
- Click the star icon to bookmark/unbookmark articles
- Click on article titles to read the full story on the source website

## API Key

This project uses the [NewsAPI](https://newsapi.org/). To run this project:
1. Sign up for a free API key at [https://newsapi.org/register](https://newsapi.org/register)
2. Replace the `NEWS_API_KEY` constant in `script.js` with your API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

