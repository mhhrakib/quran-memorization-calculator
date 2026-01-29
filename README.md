# Quran Progress Tracker 📖

A beautiful and modern web application to track your Quran reading and memorization progress. Built with plain HTML, CSS, and JavaScript - no frameworks required!

![Quran Progress Tracker](https://github.com/user-attachments/assets/1714df0d-5d84-4476-9119-c3b6acd89736)

## ✨ Features

- **📚 Dual Tracking Modes**: Separate tracking for memorization and reading progress
- **🎯 Detailed Progress Statistics**: Track progress by words, characters, and overall percentage
- **📊 Visual Progress Bar**: Beautiful animated progress bar showing completed Surahs
- **🔢 Flexible Ayah Input**: Multiple input formats supported:
  - `F` - Full Surah
  - `1-10` - Range of verses (1 to 10)
  - `1,3,5` - Specific verses
  - `1-5,10-15` - Multiple ranges
- **💾 Local Storage**: Your progress is automatically saved in your browser
- **📤 Export/Import**: Backup and restore your progress with JSON files
- **🎨 Modern UI**: Gradient backgrounds, smooth animations, and glassmorphism effects
- **📱 Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **🌙 Arabic Support**: Full display of Surah names in Arabic and transliteration

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- A modern web browser (Chrome, Firefox, Safari, or Edge - latest version recommended)
- **Optional**: Python 3.x or Node.js (only for local server or Python scripts)
- **Optional**: Git (for cloning the repository)

No other dependencies or installations are required for the web application!

### Quick Start

#### Option 1: Direct File Access (Simplest)
1. Download or clone this repository:
   ```bash
   git clone https://github.com/mhhrakib/quran-memorization-calculator.git
   cd quran-memorization-calculator
   ```

2. Simply double-click `index.html` or open it directly in your web browser
   - Works offline immediately
   - No installation or setup required
   - Your progress is saved in browser's local storage

#### Option 2: Local Development Server (Recommended for Development)
If you're planning to modify the code or prefer a server environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/mhhrakib/quran-memorization-calculator.git
   cd quran-memorization-calculator
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js (npx comes with Node.js)
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

#### Option 3: Using Python Scripts (Command Line Interface)
For command-line based tracking using the original Python implementation:

1. Ensure Python 3 is installed:
   ```bash
   python3 --version
   ```

2. Run the statistics script:
   ```bash
   python3 stats.py
   ```
   This script allows you to:
   - Track progress for each Surah via terminal input
   - Calculate words and characters statistics
   - View percentage completion

## 📖 How to Use

### Adding Progress

1. **Select Mode**: Choose between "Memorization" or "Reading" mode
2. **Click "Add Surah"**: Opens the modal to add progress
3. **Select Surah**: Choose from all 114 Surahs
4. **Enter Ayah Range**: 
   - Type `F` for full Surah
   - Type `1-50` for verses 1 to 50
   - Type `1,5,10` for specific verses
   - Type `1-10,20-30` for multiple ranges
5. **Save**: Your progress is automatically calculated and displayed

### Progress Statistics

The app shows three key metrics:
- **Overall Progress**: Average of words and characters progress
- **Words Progress**: Percentage of total Quran words memorized/read
- **Characters Progress**: Percentage of total Quran characters memorized/read

### Managing Progress

- **Delete**: Click the 🗑️ button on any Surah card to remove it
- **Clear All**: Remove all progress for the current mode
- **Export**: Download your progress as a JSON file
- **Import**: Upload a previously exported JSON file to restore progress

## 🎨 Screenshots

### Empty State
![Empty State](https://github.com/user-attachments/assets/1714df0d-5d84-4476-9119-c3b6acd89736)

### With Progress
![With Progress](https://github.com/user-attachments/assets/383dafe8-94a7-44ad-94b4-9664135cb607)

## 🏗️ Architecture

### Project Structure

```
quran-memorization-calculator/
│
├── index.html              # Main HTML structure and layout
├── style.css               # Modern CSS with animations, gradients, and responsive design
├── app.js                  # Core JavaScript logic for tracking and calculations
│
├── quran-simple.json       # Complete Quran data - main data file (114 Surahs with verses)
├── quran_ar.json           # Original Arabic Quran data with metadata
├── quran-simple-clean.txt  # Cleaned text format of Quran verses
├── quran-simple-plain.txt  # Plain text format of Quran verses
│
├── calculate.py            # Python script for data processing and JSON generation
├── stats.py                # Python CLI tool for progress tracking
├── test.txt                # Test/temporary file
│
└── README.md               # This documentation file
```

### Data Files Explanation

#### Core Data File
- **quran-simple.json**: The primary data source used by the web application
  - Contains all 114 Surahs with complete metadata
  - Each verse includes Arabic text
  - Includes Surah information: name (Arabic), transliteration, type (Meccan/Medinan), verse count
  - Used by both the web app and Python scripts
  - Format: JSON array of Surah objects with nested verse arrays

#### Supporting Data Files
- **quran_ar.json**: Original source data with Arabic Quran text and metadata
- **quran-simple-clean.txt**: Pipe-delimited text format (`surah|verse|text`)
  - Used by `calculate.py` to generate the main JSON file
  - Format: `surah_number|ayah_number|arabic_text`
- **quran-simple-plain.txt**: Plain text version for alternative processing

#### Python Scripts
- **stats.py**: Interactive command-line interface for progress tracking
  - Provides the same calculation logic as the web app
  - Allows terminal-based input for memorization tracking
  - Outputs progress statistics (words, characters, percentages)
  
- **calculate.py**: Data processing utility
  - Processes raw Quran text files
  - Generates/validates the JSON data structure
  - Calculates total word and character counts (77,800 words, 330,709 characters)

### Calculation Logic

The app calculates progress based on:
- **Total Words in Quran**: 77,800 words
- **Total Characters in Quran**: 330,709 characters

Progress percentage is calculated as:
```
Average Progress = (Words Progress + Characters Progress) / 2
```

## 🔧 Technical Details

### Technologies Used

#### Frontend Stack
- **HTML5**: 
  - Semantic markup structure
  - ARIA labels for accessibility
  - Form inputs and interactive elements
  
- **CSS3**: Modern styling features including:
  - CSS Grid and Flexbox for responsive layouts
  - CSS Custom Properties (variables) for theming
  - Keyframe animations and transitions
  - Backdrop filters for glassmorphism effects
  - Gradient backgrounds
  - Media queries for mobile responsiveness
  
- **Vanilla JavaScript (ES6+)**: No frameworks or libraries required
  - Async/await for data loading
  - LocalStorage API for persistent data
  - Fetch API for JSON data loading
  - Array methods (map, filter, reduce, forEach)
  - Dynamic DOM manipulation
  - Event delegation and handling
  - JSON parsing and stringification

#### Backend/Data Processing
- **Python 3**: For data processing and CLI tracking
  - JSON module for data handling
  - File I/O operations
  - String manipulation and parsing
  - Unicode support for Arabic text

### Key Features Implementation

#### Progress Calculation Algorithm
The application uses a dual-metric system for accurate progress tracking:

1. **Word-based calculation**: 
   - Counts words in memorized/read verses
   - Total Quran words: 77,800
   - Formula: `(completed_words / 77800) × 100`

2. **Character-based calculation**:
   - Counts Arabic characters (excluding spaces)
   - Total Quran characters: 330,709
   - Formula: `(completed_chars / 330709) × 100`

3. **Average Progress**:
   - Combines both metrics for balanced accuracy
   - Formula: `(words_percent + chars_percent) / 2`

#### Ayah Range Parsing
Flexible input format supports:
- **Full Surah**: `F` or `f`
- **Single verse**: `5`
- **Range**: `1-10` (verses 1 through 10)
- **Multiple ranges**: `1-5,10-15,20-25`
- **Specific verses**: `1,3,5,7,9`
- **Mixed format**: `1-10,15,20-30`

The parser validates inputs against the actual number of verses in each Surah.

#### Progress Visualization
- **Segmented Progress Bars**: Shows memorized vs non-memorized sections within each Surah
- **Color-coded segments**: 
  - Green: Memorized ayahs
  - Gray: Not memorized ayahs
- **Dynamic width calculation**: Based on verse count ratio
- **Tooltip/title attributes**: Display verse ranges on hover

#### Data Persistence
- **LocalStorage**: Automatic saving on every change
- **JSON Export**: Backup progress to file
- **JSON Import**: Restore from backup
- **Data Structure Example**:
  ```json
  {
    "memorization": {
      "1": "F",
      "2": "1-100",
      "112": "1,2,3,4"
    },
    "reading": {
      "1": "F",
      "36": "F"
    }
  }
  ```
  Note: The keys are Surah IDs (1-114). Values can be:
  - `"F"` for full Surah
  - `"1-100"` for verse ranges
  - `"1,2,3,4"` for specific verses

### Browser Compatibility

#### Fully Supported
- ✅ Chrome/Chromium 90+ (Windows, macOS, Linux, Android)
- ✅ Edge 90+ (Chromium-based)
- ✅ Firefox 88+
- ✅ Safari 14+ (macOS, iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

#### Required Browser Features
- ES6+ JavaScript support
- LocalStorage API
- Fetch API
- CSS Grid and Flexbox
- CSS Custom Properties
- CSS backdrop-filter (optional - for glassmorphism effects)

#### Fallbacks
- The app gracefully degrades if certain CSS features aren't supported
- Core functionality works without advanced CSS effects

## 👨‍💻 Development

### Setting Up Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mhhrakib/quran-memorization-calculator.git
   cd quran-memorization-calculator
   ```

2. **Start a local development server**:
   ```bash
   # Python 3 (simplest option)
   python3 -m http.server 8080
   
   # Node.js with live reload
   npx live-server --port=8080
   ```

3. **Open in browser**:
   ```
   http://localhost:8080
   ```

4. **Open browser DevTools** (F12) to:
   - Debug JavaScript
   - Inspect LocalStorage
   - Monitor network requests
   - Test responsive design

### Code Structure Overview

#### HTML (`index.html`)
- Semantic structure with header, main content, and footer
- Mode selector for switching between Memorization and Reading
- Statistics overview cards
- Progress bar visualization
- Dynamic Surah list container
- Hidden file input for import functionality

#### CSS (`style.css`)
Key sections:
- **CSS Variables**: Color scheme and theming (`:root` selector)
- **Base Styles**: Body, container, header
- **Mode Selector**: Toggle between memorization and reading modes
- **Statistics Cards**: Progress overview display
- **Progress Bar**: Animated completion bar
- **Surah List**: Grid layout for all 114 Surahs
- **Surah Items**: Individual Surah cards with checkbox and input
- **Progress Segments**: Segmented visualization within each Surah
- **Animations**: Fade-in and slide-up effects
- **Responsive Design**: Mobile breakpoints and media queries

#### JavaScript (`app.js`)
Key functions and their purposes:

**Initialization**:
- `init()`: Main initialization function
- `loadQuranData()`: Fetch and validate JSON data
- `setupEventListeners()`: Attach all event handlers

**Data Processing**:
- `getAyahList(surahId, ayahString)`: Parse ayah range input
- `getSurahByAyah(surahId, ayahList)`: Calculate words/chars for specific ayahs
- `getFullSurahStats(surahId)`: Get complete Surah statistics
- `getSurahPercent(surahId, ayahList)`: Calculate progress percentage
- `getAyahSegments(surahId, ayahList)`: Create segments for progress bar

**Statistics**:
- `getFullStats()`: Calculate overall progress across all Surahs
- Returns: `{ words, chars, avg, completedSurahs }`

**UI Updates**:
- `updateUI()`: Refresh all UI elements
- `updateSurahList()`: Render all Surah cards dynamically

**Event Handlers**:
- `handleCheckboxChange(surahId, isChecked, inputElement)`: Full Surah toggle
- `handleAyahInputChange(surahId, value, checkboxElement)`: Ayah range input

**Data Persistence**:
- `saveProgressToStorage()`: Save to LocalStorage
- `loadProgressFromStorage()`: Load from LocalStorage
- `exportData()`: Download as JSON file
- `importData(event)`: Upload from JSON file

### How to Modify the App

#### Change Color Scheme
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #0d7a5f;    /* Main brand color */
    --secondary-color: #2d8b6e;  /* Secondary actions */
    --accent-color: #45a083;     /* Highlights */
    --bg-light: #f0f9f6;         /* Background */
    /* ... modify as needed ... */
}
```

#### Add New Features
1. **Add new statistics**: 
   - Modify `getFullStats()` in `app.js`
   - Add new stat card in `index.html`
   - Style in `style.css`

2. **Modify calculation logic**:
   - Update functions in `app.js`:
     - `getSurahByAyah()` for word/char counting
     - `getSurahPercent()` for percentage calculation

3. **Change data source**:
   - Replace `quran-simple.json` with your own data
   - Ensure same structure: array of Surahs with `id`, `name`, `transliteration`, `type`, `total_verses`, `verses[]`

#### Extend Python Scripts
1. **stats.py**: Command-line tracking
   - Modify input prompts
   - Add new calculation methods
   - Change output formatting

2. **calculate.py**: Data processing
   - Process different text formats
   - Generate custom JSON structures
   - Validate data integrity

### Building for Production

Since this is a static web application, "building" is minimal:

#### Optimization Steps (Optional)

1. **Minify CSS**:
   ```bash
   # Using online tools or:
   npm install -g clean-css-cli
   cleancss -o style.min.css style.css
   ```

2. **Minify JavaScript**:
   ```bash
   npm install -g terser
   terser app.js -o app.min.js -c -m
   ```

3. **Update HTML references** (if using minified files):
   ```html
   <link rel="stylesheet" href="style.min.css">
   <script src="app.min.js"></script>
   ```

4. **Compress images** (if you add any screenshots/icons)

#### Deployment Options

**GitHub Pages** (Free hosting):
```bash
# Enable GitHub Pages in repository settings
# Choose main branch or gh-pages branch
# Access at: https://username.github.io/quran-memorization-calculator
```

**Netlify** (Free hosting with drag-and-drop):
1. Go to [netlify.com](https://netlify.com)
2. Drag the project folder
3. Done! Auto-deployed.

**Vercel** (Free hosting):
```bash
npm install -g vercel
vercel
```

**Any Static Host**:
- Simply upload all files to any web server
- No server-side processing required
- Works with Apache, Nginx, or any static file server

### Testing and Validation

#### Manual Testing Checklist

**Functionality**:
- [ ] Mode switching (Memorization ↔ Reading)
- [ ] Add full Surah (checkbox)
- [ ] Add partial Surah (text input with ranges)
- [ ] Progress calculation accuracy
- [ ] Delete Surah progress
- [ ] Clear All functionality
- [ ] Export progress to JSON
- [ ] Import progress from JSON
- [ ] LocalStorage persistence (refresh page)

**Input Validation**:
- [ ] Test ayah range formats: `F`, `1-10`, `1,3,5`, `1-5,10-15`
- [ ] Invalid input handling
- [ ] Out-of-range verse numbers
- [ ] Edge cases (empty input, special characters)

**UI/UX**:
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Animations and transitions
- [ ] Progress bar updates
- [ ] Statistics accuracy
- [ ] Arabic text rendering
- [ ] Accessibility (keyboard navigation, screen readers)

**Browser Testing**:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

#### Browser Console Testing
Open DevTools (F12) and test:

```javascript
// View loaded Quran data
console.log(quranData);

// Check current progress data
console.log(progressData);

// Test ayah parsing
console.log(getAyahList(1, "1-7"));  // Should return [1,2,3,4,5,6,7]

// Test calculation
console.log(getSurahByAyah(1, [1,2,3,4,5,6,7]));  // Should return {words, chars}

// Check LocalStorage
console.log(localStorage.getItem('quranProgress'));
```

#### Python Scripts Testing
```bash
# Test stats.py
python3 stats.py

# Test calculate.py
python3 calculate.py
```

### Troubleshooting

**Issue**: Quran data not loading
- **Solution**: Ensure `quran-simple.json` is in the same directory as `index.html`
- **Check**: Browser console for CORS errors (use local server, not `file://`)

**Issue**: Progress not saving
- **Solution**: Check LocalStorage isn't disabled in browser
- **Check**: Browser privacy settings

**Issue**: Import not working
- **Solution**: Ensure JSON file has correct format with `memorization` and `reading` keys
- **Check**: JSON validity using [jsonlint.com](https://jsonlint.com)

**Issue**: Calculations seem incorrect
- **Solution**: Verify total constants match data: 77,800 words and 330,709 characters
- **Check**: Run `calculate.py` to recalculate totals from source data

## 🤝 Contributing

Contributions are welcome! Here's how you can help improve this project:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug, steps to reproduce, and expected behavior
2. **Suggest Features**: Share ideas for new features or improvements
3. **Submit Pull Requests**: Fix bugs or implement new features
4. **Improve Documentation**: Help make the README clearer or add examples
5. **Share Feedback**: Let us know how you're using the app and what could be better

### Contribution Workflow

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/quran-memorization-calculator.git
   cd quran-memorization-calculator
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Follow existing code style
   - Test thoroughly
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes clearly
   - Reference any related issues

### Code Style Guidelines

**JavaScript**:
- Use camelCase for variables and functions
- Use meaningful variable names
- Add comments for complex logic
- Follow existing indentation (4 spaces)

**CSS**:
- Use CSS variables for colors and reusable values
- Group related styles together
- Add comments for major sections
- Maintain mobile-first responsive design

**HTML**:
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Keep structure clean and organized

## 📄 License

This project is open source and available for everyone to use freely.

## 🙏 Acknowledgments

- Quran text data sourced from open Quran projects
- Made with ❤️ for the Ummah
- May Allah accept this effort and make it beneficial for all

## 📞 Support

If you find this project helpful, please:
- ⭐ Star this repository
- 🐛 Report any issues
- 🔄 Share with others who might benefit

---

**Note**: This is a client-side application. All data is stored locally in your browser. Make sure to export your progress regularly to avoid data loss.

**Previous Python Implementation**: This repository also includes Python scripts (`stats.py`, `calculate.py`) for command-line based progress tracking. The web app provides a more user-friendly interface with the same calculation logic.

## ❓ FAQ

**Q: Do I need an internet connection to use this app?**
A: No! Once you open the app, it works completely offline. All data is stored locally in your browser.

**Q: Will my progress be lost if I clear my browser data?**
A: Yes, clearing browser data will delete your LocalStorage. Use the Export feature regularly to backup your progress.

**Q: Can I use this on multiple devices?**
A: Yes! Export your progress from one device and import it on another device.

**Q: Is my data sent to any server?**
A: No, absolutely not. All data stays on your device. There are no analytics or tracking.

**Q: Can I track multiple people's progress?**
A: Currently, the app stores one set of progress per browser. You can export/import different JSON files to manage multiple profiles manually.

**Q: Why are there two modes (Memorization vs Reading)?**
A: To separately track verses you've memorized versus verses you've just read, allowing you to monitor both aspects of your Quran study.

**Q: How accurate are the calculations?**
A: Very accurate. The app uses the actual word and character counts from the Quran text (77,800 words and 330,709 characters).

**Q: Can I contribute or modify this project?**
A: Absolutely! This is open source. Fork it, modify it, and submit pull requests. See the Contributing section above.

**Q: What if I find a bug?**
A: Please open an issue on GitHub with details about the bug, and we'll address it as soon as possible.
