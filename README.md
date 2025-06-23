[![Netlify Status](https://api.netlify.com/api/v1/badges/0dc984f4-cbab-4138-b84f-263c77c81e55/deploy-status)](https://app.netlify.com/sites/vasearch/deploys)

# V&A Museum Search

A single-page application (SPA) for searching and exploring the Victoria & Albert Museum's collection using their public API.

🔗 **Live Demo**: [https://vasearch.netlify.app/](https://vasearch.netlify.app/)

![V&A Museum Logo](images/va-logo.svg)

## Overview

This web application provides an intuitive interface to search through the V&A Museum's extensive collection of art and design objects. Users can search for items, view results in a grid layout, and click on individual items to see more details in an expanded showcase view.

## Features

- 🔍 **Search Functionality**: Search the V&A collection by keywords
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🖼️ **Image Gallery**: Browse results in a visually appealing grid layout
- 🔎 **Detailed View**: Click on any item to see expanded details in a showcase modal
- 📄 **Pagination**: Navigate through multiple pages of search results
- 🎨 **Smooth Animations**: Elegant transitions and loading effects
- 🖌️ **IIIF Image Support**: High-quality images using the IIIF standard

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: SCSS/CSS with custom animations
- **API**: [V&A Museum API v2](https://developers.vam.ac.uk/)
- **Fonts**: 
  - K2D (Google Fonts)
  - Playfair Display (Google Fonts)
  - Raleway (Google Fonts)
- **Icons**: Font Awesome 5
- **Hosting**: Netlify

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/va-museum-search.git
cd va-museum-search
```

2. Open `index.html` in your browser, or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (install http-server globally first)
npx http-server

# Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

3. The application should now be running locally!

## Project Structure

```
VA-Museum-Client/
├── css/
│   ├── index.css         # Compiled CSS
│   ├── index.css.map     # Source map
│   └── index.scss        # Source SCSS file
├── fonts/
│   ├── novar.woff        # Custom font files
│   └── novar.woff2
├── images/
│   ├── header-pattern.svg # Background pattern
│   └── va-logo.svg       # V&A Museum logo
├── scripts/
│   └── index.js          # Main JavaScript file
├── index.html            # Main HTML file
└── README.md            # This file
```

## Usage

1. **Search**: Enter a search term in the search box (e.g., "pottery", "dress", "chair")
2. **Browse**: View results in the grid layout
3. **Navigate**: Use pagination controls to see more results
4. **View Details**: Click on any item to see an expanded view with more information
5. **Close Details**: Click the close button (×) to return to the grid view

## API Information

This application uses the [V&A Museum API v2](https://developers.vam.ac.uk/). The API provides:
- Access to over a million collection records
- High-quality images via IIIF
- Detailed metadata about objects including:
  - Title and object type
  - Artist/maker information
  - Date and place of creation
  - Current location in the museum

### API Endpoints Used

- Search: `https://api.vam.ac.uk/v2/objects/search`
- Parameters:
  - `q`: Search query
  - `page`: Page number
  - `page_size`: Results per page (default: 15)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

- Some objects may not have images available
- Titles may be empty for certain objects (displays object type as fallback)

## Contributing

Feel free to submit issues and enhancement requests!

## Credits

- **Original Developer**: James Rogers (2018)
- **Data & Images**: © Victoria and Albert Museum, London
- **API**: V&A Museum Digital Team

## License

This project is for educational purposes. All collection data and images are © Victoria and Albert Museum, London and are subject to their [terms and conditions](https://www.vam.ac.uk/info/va-terms-and-conditions).

---

Made with ❤️ for exploring art and design history
