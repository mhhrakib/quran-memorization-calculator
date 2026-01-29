// Global variables
let quranData = [];
let currentMode = 'memorization'; // 'memorization' or 'reading'
let progressData = {
    memorization: {},
    reading: {}
};

const TOTAL_WORDS = 77800;
const TOTAL_CHARS = 330709;

// Initialize the app
async function init() {
    const loaded = await loadQuranData();
    if (!loaded) {
        return; // Stop initialization if data failed to load
    }
    loadProgressFromStorage();
    setupEventListeners();
    updateUI();
}

// Load Quran data from JSON
async function loadQuranData() {
    try {
        const response = await fetch('quran-simple.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quranData = await response.json();
        if (!quranData || quranData.length !== 114) {
            throw new Error('Invalid Quran data format');
        }
        console.log('Quran data loaded:', quranData.length, 'surahs');
    } catch (error) {
        console.error('Error loading Quran data:', error);
        alert('Failed to load Quran data. Please refresh the page.');
        return false;
    }
    return true;
}

// Setup event listeners
function setupEventListeners() {
    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentMode = btn.dataset.mode;
            updateUI();
        });
    });

    // Clear All button
    document.getElementById('clearAllBtn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to clear all ${currentMode} progress?`)) {
            progressData[currentMode] = {};
            saveProgressToStorage();
            updateUI();
        }
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportData);

    // Import button
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', importData);
}

// Local storage functions
function getAyahList(surahId, ayahString) {
    if (!surahId || surahId < 1 || surahId > 114) {
        console.error('Invalid surah ID:', surahId);
        return [];
    }
    const surah = quranData[surahId - 1];
    if (!surah) {
        console.error('Surah not found:', surahId);
        return [];
    }
    const totalAyah = surah.total_verses;
    
    if (ayahString === 'F' || ayahString === 'f') {
        return Array.from({ length: totalAyah }, (_, i) => i + 1);
    } else if (ayahString === '0' || ayahString === '') {
        return [];
    } else {
        const result = [];
        const parts = ayahString.split(',');
        
        for (const part of parts) {
            const trimmedPart = part.trim();
            if (trimmedPart.includes('-')) {
                const [start, end] = trimmedPart.split('-').map(s => parseInt(s.trim()));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= Math.min(end, totalAyah); i++) {
                        if (!result.includes(i)) {
                            result.push(i);
                        }
                    }
                }
            } else {
                const num = parseInt(trimmedPart);
                if (!isNaN(num) && num >= 1 && num <= totalAyah && !result.includes(num)) {
                    result.push(num);
                }
            }
        }
        
        return result.sort((a, b) => a - b);
    }
}

// Calculate words and chars for specific ayahs
function getSurahByAyah(surahId, ayahList) {
    const surah = quranData[surahId - 1];
    let words = 0;
    let chars = 0;
    
    for (const ayahNum of ayahList) {
        const verse = surah.verses[ayahNum - 1];
        if (verse) {
            const text = verse.text;
            words += text.split(/\s+/).filter(word => word.length > 0).length;
            chars += text.replace(/ /g, '').length;
        }
    }
    
    return { words, chars };
}

// Calculate full surah stats
function getFullSurahStats(surahId) {
    const surah = quranData[surahId - 1];
    let words = 0;
    let chars = 0;
    
    for (const verse of surah.verses) {
        const text = verse.text;
        words += text.split(/\s+/).filter(word => word.length > 0).length;
        chars += text.replace(/ /g, '').length;
    }
    
    return { words, chars };
}

// Calculate surah percentage
function getSurahPercent(surahId, ayahList) {
    const total = getFullSurahStats(surahId);
    const completed = getSurahByAyah(surahId, ayahList);
    
    const wordsPercent = total.words > 0 ? (completed.words * 100 / total.words) : 0;
    const charsPercent = total.chars > 0 ? (completed.chars * 100 / total.chars) : 0;
    const avgPercent = (wordsPercent + charsPercent) / 2;
    
    return {
        words: wordsPercent,
        chars: charsPercent,
        avg: avgPercent
    };
}

// Calculate overall stats
function getFullStats() {
    let totalWords = 0;
    let totalChars = 0;
    let completedSurahs = 0;
    
    const currentData = progressData[currentMode];
    
    for (let i = 1; i <= quranData.length; i++) {
        const ayahString = currentData[i] || '0';
        const ayahList = getAyahList(i, ayahString);
        const stats = getSurahByAyah(i, ayahList);
        
        totalWords += stats.words;
        totalChars += stats.chars;
        
        // Check if surah is complete
        const surah = quranData[i - 1];
        if (ayahList.length === surah.total_verses) {
            completedSurahs++;
        }
    }
    
    const wordsPercent = (totalWords * 100 / TOTAL_WORDS);
    const charsPercent = (totalChars * 100 / TOTAL_CHARS);
    const avgPercent = (wordsPercent + charsPercent) / 2;
    
    return {
        words: wordsPercent,
        chars: charsPercent,
        avg: avgPercent,
        completedSurahs
    };
}

// Update UI
function updateUI() {
    const stats = getFullStats();
    
    // Update stats cards
    document.getElementById('totalPercent').textContent = stats.avg.toFixed(2) + '%';
    document.getElementById('wordsPercent').textContent = stats.words.toFixed(2) + '%';
    document.getElementById('charsPercent').textContent = stats.chars.toFixed(2) + '%';
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    document.getElementById('progressFill').style.width = stats.avg + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(stats.avg));
    document.getElementById('progressText').textContent = `${stats.completedSurahs} of 114 Surahs`;
    
    // Update surah list
    updateSurahList();
}

// Update surah list - Display all 114 surahs
function updateSurahList() {
    const surahList = document.getElementById('surahList');
    surahList.innerHTML = '';
    
    const currentData = progressData[currentMode];
    
    // Display all surahs
    quranData.forEach((surah) => {
        const surahId = surah.id;
        const ayahString = currentData[surahId] || '';
        const ayahList = getAyahList(surahId, ayahString);
        const isFullyMemorized = ayahList.length === surah.total_verses;
        
        const surahItem = document.createElement('div');
        surahItem.className = 'surah-item';
        
        const percent = ayahList.length > 0 ? getSurahPercent(surahId, ayahList) : { avg: 0 };
        
        surahItem.innerHTML = `
            <div class="surah-checkbox-container">
                <input type="checkbox" 
                       id="checkbox-${surahId}" 
                       class="surah-checkbox" 
                       ${isFullyMemorized ? 'checked' : ''}
                       data-surah-id="${surahId}"
                       aria-label="Mark ${surah.transliteration} as fully memorized">
                <label for="checkbox-${surahId}" class="checkbox-label" tabindex="0" role="checkbox" aria-checked="${isFullyMemorized}">✓</label>
            </div>
            <div class="surah-info-container">
                <div class="surah-header">
                    <span class="surah-number">${surah.id}</span>
                    <span class="surah-name">${surah.transliteration}</span>
                    <span class="surah-name-arabic">${surah.name}</span>
                </div>
                <div class="surah-meta">
                    <span class="surah-type">${surah.type.charAt(0).toUpperCase() + surah.type.slice(1)}</span>
                    <span class="surah-verses">${surah.total_verses} verses</span>
                    ${ayahList.length > 0 ? `<span class="surah-progress-text">${ayahList.length}/${surah.total_verses} verses</span>` : ''}
                </div>
            </div>
            <div class="surah-input-container">
                <input type="text" 
                       class="ayah-input" 
                       placeholder="e.g., 1-10, 1,3,5"
                       value="${ayahString && ayahString !== 'F' && ayahString !== 'f' ? ayahString : ''}"
                       ${isFullyMemorized ? 'disabled' : ''}
                       data-surah-id="${surahId}"
                       aria-label="Ayah range for ${surah.transliteration}">
            </div>
            <div class="surah-percent-container">
                <span class="surah-percent">${percent.avg.toFixed(1)}%</span>
            </div>
        `;
        
        // Attach event listeners
        const checkbox = surahItem.querySelector('.surah-checkbox');
        const checkboxLabel = surahItem.querySelector('.checkbox-label');
        const input = surahItem.querySelector('.ayah-input');
        
        checkbox.addEventListener('change', (e) => {
            handleCheckboxChange(surahId, e.target.checked, input);
        });
        
        // Keyboard support for checkbox label
        checkboxLabel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        input.addEventListener('blur', (e) => {
            handleAyahInputChange(surahId, e.target.value, checkbox);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        });
        
        surahList.appendChild(surahItem);
    });
}

// Handle checkbox change
function handleCheckboxChange(surahId, isChecked, inputElement) {
    const checkboxLabel = document.querySelector(`label[for="checkbox-${surahId}"]`);
    
    if (isChecked) {
        // Mark as fully memorized
        progressData[currentMode][surahId] = 'F';
        inputElement.value = '';
        inputElement.disabled = true;
        if (checkboxLabel) checkboxLabel.setAttribute('aria-checked', 'true');
    } else {
        // Uncheck - clear progress
        delete progressData[currentMode][surahId];
        inputElement.disabled = false;
        if (checkboxLabel) checkboxLabel.setAttribute('aria-checked', 'false');
    }
    saveProgressToStorage();
    updateUI();
}

// Handle ayah input change
function handleAyahInputChange(surahId, value, checkboxElement) {
    const trimmedValue = value.trim();
    
    if (!trimmedValue || trimmedValue === '0') {
        // Clear progress
        delete progressData[currentMode][surahId];
        checkboxElement.checked = false;
    } else {
        // Validate input format (only allow numbers, commas, hyphens, F, and spaces)
        if (!/^[0-9,\-\sFf]+$/.test(trimmedValue) && trimmedValue !== 'F' && trimmedValue !== 'f') {
            alert('Invalid ayah range format. Only numbers, commas, and hyphens are allowed.');
            return;
        }
        
        // Validate and save
        try {
            const ayahList = getAyahList(surahId, trimmedValue);
            if (ayahList.length === 0 && trimmedValue !== 'F' && trimmedValue !== 'f') {
                alert('Invalid ayah range. Please check your input.');
                return;
            }
            
            // Check if it's full surah
            const surah = quranData[surahId - 1];
            if (ayahList.length === surah.total_verses || trimmedValue === 'F' || trimmedValue === 'f') {
                progressData[currentMode][surahId] = 'F';
                checkboxElement.checked = true;
            } else {
                progressData[currentMode][surahId] = trimmedValue;
                checkboxElement.checked = false;
            }
        } catch (error) {
            alert('Invalid ayah range format.');
            return;
        }
    }
    
    saveProgressToStorage();
    updateUI();
}

// Local storage functions
function saveProgressToStorage() {
    localStorage.setItem('quranProgress', JSON.stringify(progressData));
}

function loadProgressFromStorage() {
    const saved = localStorage.getItem('quranProgress');
    if (saved) {
        try {
            progressData = JSON.parse(saved);
            // Ensure both modes exist
            if (!progressData.memorization) progressData.memorization = {};
            if (!progressData.reading) progressData.reading = {};
        } catch (error) {
            console.error('Error loading progress from storage:', error);
            progressData = { memorization: {}, reading: {} };
        }
    }
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quran-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    // Delay revoking URL to ensure download completes
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Validate structure
            if (!imported || typeof imported !== 'object') {
                alert('Invalid data format.');
                return;
            }
            
            if (imported.memorization || imported.reading) {
                // Validate and sanitize imported data
                const sanitized = {
                    memorization: {},
                    reading: {}
                };
                
                ['memorization', 'reading'].forEach(mode => {
                    if (imported[mode] && typeof imported[mode] === 'object') {
                        Object.keys(imported[mode]).forEach(surahId => {
                            const id = parseInt(surahId);
                            // Validate surah ID is in valid range
                            if (id >= 1 && id <= 114) {
                                const value = imported[mode][surahId];
                                // Only allow string values with valid characters
                                if (typeof value === 'string' && /^[0-9,\-\sFf]+$/.test(value)) {
                                    sanitized[mode][id] = value;
                                }
                            }
                        });
                    }
                });
                
                if (confirm('This will replace your current progress. Continue?')) {
                    progressData = sanitized;
                    saveProgressToStorage();
                    updateUI();
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid data format.');
            }
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
