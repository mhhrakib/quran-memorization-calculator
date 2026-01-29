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
        // Prevent further operations
        document.getElementById('addSurahBtn').disabled = true;
        return false;
    }
    return true;
}

// Setup event listeners
function setupEventListeners() {
    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
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

// Parse ayah range string
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

/**
 * Get segments from ayah list for progress bar visualization
 * @param {number} surahId - The ID of the surah (1-114)
 * @param {Array<number>} ayahList - Sorted array of memorized ayah numbers
 * @returns {Array<{start: number, end: number, memorized: boolean}>} Array of segments
 */
function getAyahSegments(surahId, ayahList) {
    const surah = quranData[surahId - 1];
    const totalAyahs = surah.total_verses;
    
    if (ayahList.length === 0) {
        return [{ start: 1, end: totalAyahs, memorized: false }];
    }
    
    if (ayahList.length === totalAyahs) {
        return [{ start: 1, end: totalAyahs, memorized: true }];
    }
    
    // Create a Set for O(1) lookup
    const memorizedSet = new Set(ayahList);
    const segments = [];
    
    let i = 1;
    while (i <= totalAyahs) {
        const isMemorized = memorizedSet.has(i);
        const start = i;
        
        // Continue while ayahs have the same memorization status
        while (i <= totalAyahs && memorizedSet.has(i) === isMemorized) {
            i++;
        }
        
        segments.push({ start, end: i - 1, memorized: isMemorized });
    }
    
    return segments;
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
    document.getElementById('progressFill').style.width = stats.avg + '%';
    document.getElementById('progressText').textContent = `${stats.completedSurahs} of 114 Surahs`;
    
    // Update surah list
    updateSurahList();
}

// Update surah list - Display all 114 surahs inline
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
        const percent = ayahList.length > 0 ? getSurahPercent(surahId, ayahList) : { avg: 0 };
        const segments = ayahList.length > 0 ? getAyahSegments(surahId, ayahList) : [];
        
        const surahItem = document.createElement('div');
        surahItem.className = 'surah-item';
        
        // Build progress bar segments
        const totalAyahs = surah.total_verses;
        let segmentMarkup = '';
        if (segments.length > 0) {
            for (const segment of segments) {
                const segmentWidth = ((segment.end - segment.start + 1) / totalAyahs) * 100;
                const segmentClass = segment.memorized ? 'segment-memorized' : 'segment-not-memorized';
                const status = segment.memorized ? 'Memorized' : 'Not Memorized';
                const ariaLabel = `Verses ${segment.start} to ${segment.end}: ${status}`;
                const title = `Verses ${segment.start}-${segment.end} (${status})`;
                segmentMarkup += `<div class="progress-segment ${segmentClass}" style="width: ${segmentWidth}%;" title="${title}" aria-label="${ariaLabel}" role="img"></div>`;
            }
        }
        
        surahItem.innerHTML = `
            <div class="surah-checkbox-container">
                <input type="checkbox" 
                       id="checkbox-${surahId}" 
                       class="surah-checkbox" 
                       ${isFullyMemorized ? 'checked' : ''}
                       data-surah-id="${surahId}"
                       aria-label="Mark ${surah.transliteration} as fully memorized">
                <label for="checkbox-${surahId}" class="checkbox-label">✓</label>
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
                    ${ayahList.length > 0 ? `<span class="surah-progress-text">${ayahList.length}/${surah.total_verses} memorized</span>` : ''}
                </div>
                ${segmentMarkup ? `<div class="surah-progress-bar" role="progressbar" aria-valuenow="${percent.avg.toFixed(1)}" aria-valuemin="0" aria-valuemax="100" aria-label="Memorization progress: ${percent.avg.toFixed(1)}%">
                    ${segmentMarkup}
                </div>` : ''}
            </div>
            <div class="surah-input-container">
                <input type="text" 
                       class="ayah-input" 
                       placeholder="e.g., 1-10, 1,3,5"
                       value="${ayahString && ayahString !== 'F' && ayahString !== 'f' ? ayahString : ''}"
                       data-surah-id="${surahId}"
                       ${isFullyMemorized ? 'disabled' : ''}
                       aria-label="Ayah range for ${surah.transliteration}">
            </div>
            <div class="surah-percent-container">
                <span class="surah-percent">${percent.avg.toFixed(1)}%</span>
            </div>
        `;
        
        // Attach event listeners
        const checkbox = surahItem.querySelector('.surah-checkbox');
        const input = surahItem.querySelector('.ayah-input');
        
        checkbox.addEventListener('change', (e) => {
            handleCheckboxChange(surahId, e.target.checked, input);
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
    if (isChecked) {
        // Mark as fully memorized
        progressData[currentMode][surahId] = 'F';
        inputElement.value = '';
        inputElement.disabled = true;
    } else {
        // Uncheck - clear progress
        delete progressData[currentMode][surahId];
        inputElement.disabled = false;
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
            if (imported.memorization || imported.reading) {
                if (confirm('This will replace your current progress. Continue?')) {
                    progressData = imported;
                    // Ensure both modes exist
                    if (!progressData.memorization) progressData.memorization = {};
                    if (!progressData.reading) progressData.reading = {};
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
