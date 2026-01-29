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
    populateSurahSelect();
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

    // Add Surah button
    document.getElementById('addSurahBtn').addEventListener('click', () => {
        openModal();
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

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveSurahProgress);

    // Surah select change
    document.getElementById('surahSelect').addEventListener('change', (e) => {
        const surahId = parseInt(e.target.value);
        if (surahId) {
            updateSurahInfo(surahId);
        }
    });

    // Close modal on backdrop click
    document.getElementById('surahModal').addEventListener('click', (e) => {
        if (e.target.id === 'surahModal') {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('surahModal').classList.contains('show')) {
            closeModal();
        }
    });
}

// Populate surah select dropdown
function populateSurahSelect() {
    const select = document.getElementById('surahSelect');
    quranData.forEach((surah, index) => {
        const option = document.createElement('option');
        option.value = surah.id;
        option.textContent = `${surah.id}. ${surah.transliteration} (${surah.name})`;
        select.appendChild(option);
    });
}

// Update surah info in modal
function updateSurahInfo(surahId) {
    const surah = quranData[surahId - 1];
    document.getElementById('totalVerses').textContent = surah.total_verses;
    document.getElementById('surahType').textContent = surah.type.charAt(0).toUpperCase() + surah.type.slice(1);
    document.getElementById('surahInfo').classList.remove('hidden');
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

// Update surah list
function updateSurahList() {
    const surahList = document.getElementById('surahList');
    surahList.innerHTML = '';
    
    const currentData = progressData[currentMode];
    const entries = Object.entries(currentData).filter(([_, value]) => value !== '0');
    
    if (entries.length === 0) {
        surahList.innerHTML = '<div class="empty-state">No progress added yet. Click "Add Surah" to get started!</div>';
        return;
    }
    
    entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    
    for (const [surahId, ayahString] of entries) {
        const surah = quranData[parseInt(surahId) - 1];
        const ayahList = getAyahList(parseInt(surahId), ayahString);
        const percent = getSurahPercent(parseInt(surahId), ayahList);
        
        const surahItem = document.createElement('div');
        surahItem.className = 'surah-item';
        
        let ayahDisplay = ayahString;
        if (ayahString === 'F' || ayahString === 'f') {
            ayahDisplay = 'Full Surah';
        } else if (ayahList.length > 0) {
            ayahDisplay = `Ayahs: ${ayahString}`;
        }
        
        surahItem.innerHTML = `
            <div class="surah-info-left">
                <span class="surah-number">${surah.id}</span>
                <span class="surah-name">${surah.transliteration} (${surah.name})</span>
                <div class="surah-details">${ayahDisplay} • ${ayahList.length}/${surah.total_verses} verses</div>
            </div>
            <div class="surah-progress">
                <div class="surah-percent">${percent.avg.toFixed(1)}%</div>
            </div>
            <button class="delete-btn" aria-label="Delete surah ${surah.transliteration}" data-surah-id="${surah.id}">🗑️</button>
        `;
        
        // Attach delete event listener
        const deleteBtn = surahItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            const surahId = parseInt(e.currentTarget.getAttribute('data-surah-id'));
            deleteSurah(surahId);
        });
        
        surahList.appendChild(surahItem);
    }
}

// Open modal
function openModal() {
    document.getElementById('surahModal').classList.add('show');
    document.getElementById('surahSelect').value = '';
    document.getElementById('ayahRange').value = '';
    document.getElementById('surahInfo').classList.add('hidden');
    
    // Set focus to surah select for accessibility
    setTimeout(() => {
        document.getElementById('surahSelect').focus();
    }, 100);
}

// Close modal
function closeModal() {
    document.getElementById('surahModal').classList.remove('show');
}

// Save surah progress
function saveSurahProgress() {
    const surahId = parseInt(document.getElementById('surahSelect').value);
    const ayahRange = document.getElementById('ayahRange').value.trim();
    
    if (!surahId) {
        alert('Please select a Surah');
        return;
    }
    
    if (!ayahRange) {
        alert('Please enter an ayah range');
        return;
    }
    
    // Validate ayah range
    try {
        const ayahList = getAyahList(surahId, ayahRange);
        if (ayahRange !== 'F' && ayahRange !== 'f' && ayahRange !== '0' && ayahList.length === 0) {
            alert('Invalid ayah range. Please check your input.');
            return;
        }
    } catch (error) {
        alert('Invalid ayah range format.');
        return;
    }
    
    progressData[currentMode][surahId] = ayahRange;
    saveProgressToStorage();
    updateUI();
    closeModal();
}

// Delete surah
function deleteSurah(surahId) {
    if (confirm('Are you sure you want to remove this Surah?')) {
        delete progressData[currentMode][surahId];
        saveProgressToStorage();
        updateUI();
    }
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
