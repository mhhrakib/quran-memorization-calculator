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

### Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/mhhrakib/quran-memorization-calculator.git
   cd quran-memorization-calculator
   ```

2. Open `index.html` in your web browser, or start a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   ```

3. Navigate to `http://localhost:8080` in your browser

### No Installation Required!

Simply open the `index.html` file directly in your browser - it works offline!

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

### Files Structure

```
├── index.html      # Main HTML structure
├── style.css       # Modern CSS with animations and gradients
├── app.js          # JavaScript logic for tracking and calculations
├── quran-simple.json   # Complete Quran data (114 Surahs)
└── README.md       # Documentation
```

### Data Source

The app uses `quran-simple.json` which contains:
- All 114 Surahs
- Arabic text for each verse
- Surah metadata (name, transliteration, type, verse count)

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

- **HTML5**: Semantic markup
- **CSS3**: Modern features including:
  - CSS Grid and Flexbox
  - CSS Variables
  - Animations and transitions
  - Backdrop filters (glassmorphism)
- **JavaScript (ES6+)**: Vanilla JavaScript with:
  - Async/await
  - LocalStorage API
  - Fetch API
  - Array methods

### Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

### Data Storage

Progress is stored in browser's LocalStorage:
```json
{
  "memorization": {
    "1": "F",
    "2": "1-100",
    "112": "F"
  },
  "reading": {
    "1": "F",
    "36": "F"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

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
