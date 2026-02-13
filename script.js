// Music Player State
let currentTrack = {
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    image: 'https://picsum.photos/seed/current/56/56.jpg',
    duration: 200, // seconds
    currentTime: 83 // seconds
};

let isPlaying = false;
let volume = 0.7;
let isMuted = false;
let isLiked = false;
let isShuffled = false;
let repeatMode = 0; // 0: off, 1: all, 2: one

// Playlist data
const tracks = [
    { name: 'Blinding Lights', artist: 'The Weeknd', image: 'https://picsum.photos/seed/current/56/56.jpg', duration: 200 },
    { name: 'Levitating', artist: 'Dua Lipa', image: 'https://picsum.photos/seed/track2/56/56.jpg', duration: 203 },
    { name: 'Stay', artist: 'The Kid LAROI & Justin Bieber', image: 'https://picsum.photos/seed/track3/56/56.jpg', duration: 141 },
    { name: 'Good 4 U', artist: 'Olivia Rodrigo', image: 'https://picsum.photos/seed/track4/56/56.jpg', duration: 178 },
    { name: 'Heat Waves', artist: 'Glass Animals', image: 'https://picsum.photos/seed/track5/56/56.jpg', duration: 238 },
    { name: 'Peaches', artist: 'Justin Bieber', image: 'https://picsum.photos/seed/track6/56/56.jpg', duration: 198 },
    { name: 'Montero', artist: 'Lil Nas X', image: 'https://picsum.photos/seed/track7/56/56.jpg', duration: 137 },
    { name: 'Save Your Tears', artist: 'The Weeknd', image: 'https://picsum.photos/seed/track8/56/56.jpg', duration: 215 }
];

let currentTrackIndex = 0;

// DOM Elements
const mainPlayBtn = document.querySelector('.main-play-btn');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.progress-container .time:first-child');
const totalTimeEl = document.querySelector('.progress-container .time:last-child');
const volumeSlider = document.querySelector('.volume-slider');
const volumeProgress = document.querySelector('.volume-progress');
const trackNameEl = document.querySelector('.track-name');
const artistNameEl = document.querySelector('.artist-name');
const trackImageEl = document.querySelector('.track-image');
const likeBtn = document.querySelector('.track-controls .control-btn:first-child');
const shuffleBtn = document.querySelector('.extra-controls .control-btn:nth-child(3)');
const repeatBtn = document.querySelector('.extra-controls .control-btn:nth-child(4)');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTrackInfo();
    updateProgress();
    updateVolume();
    setupEventListeners();
    startProgressSimulation();
});

// Event Listeners
function setupEventListeners() {
    // Play/Pause
    mainPlayBtn.addEventListener('click', togglePlayPause);
    
    // Progress bar
    progressBar.addEventListener('click', seekTrack);
    
    // Volume control
    volumeSlider.addEventListener('click', setVolume);
    
    // Navigation
    document.querySelector('.playback-controls .control-btn:first-child').addEventListener('click', previousTrack);
    document.querySelector('.playback-controls .control-btn:last-child').addEventListener('click', nextTrack);
    
    // Track controls
    likeBtn.addEventListener('click', toggleLike);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Card play buttons
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            const cardArtist = this.querySelector('p').textContent;
            playCard(cardTitle, cardArtist);
        });
    });
    
    // Recent items
    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.querySelector('span').textContent;
            playRecent(itemName);
        });
    });
    
    // Mobile menu
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
}

// Playback Controls
function togglePlayPause() {
    isPlaying = !isPlaying;
    updatePlayButton();
    
    if (isPlaying) {
        startProgressSimulation();
    }
}

function updatePlayButton() {
    const svg = mainPlayBtn.querySelector('svg');
    if (isPlaying) {
        svg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else {
        svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
}

function nextTrack() {
    if (isShuffled) {
        currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    }
    loadTrack(currentTrackIndex);
}

function loadTrack(index) {
    currentTrack = tracks[index];
    currentTrack.currentTime = 0;
    updateTrackInfo();
    updateProgress();
    
    if (isPlaying) {
        // Simulate track change
        console.log(`Now playing: ${currentTrack.name} by ${currentTrack.artist}`);
    }
}

function updateTrackInfo() {
    trackNameEl.textContent = currentTrack.name;
    artistNameEl.textContent = currentTrack.artist;
    trackImageEl.src = currentTrack.image;
    totalTimeEl.textContent = formatTime(currentTrack.duration);
}

// Progress Bar
function updateProgress() {
    const percentage = (currentTrack.currentTime / currentTrack.duration) * 100;
    progress.style.width = `${percentage}%`;
    currentTimeEl.textContent = formatTime(currentTrack.currentTime);
}

function seekTrack(e) {
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    currentTrack.currentTime = percentage * currentTrack.duration;
    updateProgress();
}

function startProgressSimulation() {
    if (isPlaying) {
        currentTrack.currentTime += 1;
        if (currentTrack.currentTime >= currentTrack.duration) {
            handleTrackEnd();
        } else {
            updateProgress();
            setTimeout(startProgressSimulation, 1000);
        }
    }
}

function handleTrackEnd() {
    if (repeatMode === 2) {
        currentTrack.currentTime = 0;
        startProgressSimulation();
    } else if (repeatMode === 1 || currentTrackIndex < tracks.length - 1) {
        nextTrack();
        if (isPlaying) {
            startProgressSimulation();
        }
    } else {
        isPlaying = false;
        updatePlayButton();
    }
}

// Volume Control
function updateVolume() {
    volumeProgress.style.width = `${volume * 100}%`;
}

function setVolume(e) {
    const rect = volumeSlider.getBoundingClientRect();
    volume = (e.clientX - rect.left) / rect.width;
    volume = Math.max(0, Math.min(1, volume));
    updateVolume();
}

// Track Controls
function toggleLike() {
    isLiked = !isLiked;
    likeBtn.style.color = isLiked ? '#1ED760' : '#b3b3b3';
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#1ED760' : '#b3b3b3';
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    switch (repeatMode) {
        case 0:
            repeatBtn.style.color = '#b3b3b3';
            break;
        case 1:
            repeatBtn.style.color = '#1ED760';
            break;
        case 2:
            repeatBtn.style.color = '#1ED760';
            break;
    }
}

// Card and Recent Item Actions
function playCard(title, artist) {
    // Simulate playing a card
    currentTrack = {
        name: title,
        artist: artist.split(',')[0],
        image: `https://picsum.photos/seed/${title.replace(/\s+/g, '')}/56/56.jpg`,
        duration: Math.floor(Math.random() * 120) + 120,
        currentTime: 0
    };
    
    updateTrackInfo();
    updateProgress();
    isPlaying = true;
    updatePlayButton();
    startProgressSimulation();
    
    console.log(`Playing: ${title}`);
}

function playRecent(name) {
    // Simulate playing a recent item
    playCard(name, 'Various Artists');
}

// Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function handleKeyPress(e) {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            previousTrack();
            break;
        case 'ArrowRight':
            nextTrack();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volume = Math.min(1, volume + 0.1);
            updateVolume();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volume = Math.max(0, volume - 0.1);
            updateVolume();
            break;
    }
}

// Playlist Management
function createPlaylist(name) {
    const playlistList = document.querySelector('.playlist-list');
    const newPlaylist = document.createElement('a');
    newPlaylist.href = '#';
    newPlaylist.className = 'playlist-item';
    newPlaylist.textContent = name;
    newPlaylist.addEventListener('click', (e) => {
        e.preventDefault();
        playPlaylist(name);
    });
    
    playlistList.appendChild(newPlaylist);
    console.log(`Created playlist: ${name}`);
}

function playPlaylist(name) {
    console.log(`Playing playlist: ${name}`);
    // Simulate playing first track of playlist
    isPlaying = true;
    updatePlayButton();
    startProgressSimulation();
}

// Search functionality
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for artists, songs, or podcasts';
    searchInput.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        border: 1px solid #333;
        padding: 10px 15px;
        border-radius: 20px;
        z-index: 1000;
        display: none;
        width: 300px;
    `;
    
    document.body.appendChild(searchInput);
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
            if (searchInput.style.display === 'block') {
                searchInput.focus();
            }
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
}

function performSearch(query) {
    if (query.length < 2) return;
    
    console.log(`Searching for: ${query}`);
    // Implement actual search logic here
}

// Initialize search
setupSearch();

// Theme switching (bonus feature)
function toggleTheme() {
    const body = document.body;
    if (body.style.backgroundColor === '#fff') {
        body.style.backgroundColor = '#121212';
        document.documentElement.style.setProperty('--bg-color', '#121212');
        document.documentElement.style.setProperty('--text-color', '#fff');
    } else {
        body.style.backgroundColor = '#fff';
        document.documentElement.style.setProperty('--bg-color', '#fff');
        document.documentElement.style.setProperty('--text-color', '#000');
    }
}

// Add keyboard shortcut for theme toggle
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        toggleTheme();
    }
});

// Initialize tooltips
function initializeTooltips() {
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            showTooltip(e.target);
        });
        
        btn.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

function showTooltip(element) {
    // Simple tooltip implementation
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
    `;
    
    // Add tooltip text based on button
    if (element.classList.contains('main-play-btn')) {
        tooltip.textContent = isPlaying ? 'Pause' : 'Play';
    } else if (element.closest('.playback-controls')) {
        const index = Array.from(element.parentElement.children).indexOf(element);
        const tooltips = ['Previous', 'Play/Pause', 'Next'];
        tooltip.textContent = tooltips[index];
    }
    
    if (tooltip.textContent) {
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    }
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize tooltips
initializeTooltips();

// Console welcome message
console.log('%c🎵 Spotify Web Player', 'font-size: 20px; font-weight: bold; color: #1ED760;');
console.log('%cKeyboard shortcuts:\n• Space: Play/Pause\n• Arrow Left/Right: Previous/Next\n• Arrow Up/Down: Volume\n• Ctrl+F: Search\n• Ctrl+Shift+T: Toggle theme', 'color: #b3b3b3;');