// Global variables
let students = [];
let champions = { first: null, second: null, third: null };

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderLeaderboards();
});

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data/students.json');
        const data = await response.json();
        students = data.students;
        champions = data.champions || { first: null, second: null, third: null };
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render all leaderboards
function renderLeaderboards() {
    // Sort students by aura (descending)
    const sortedStudents = [...students].sort((a, b) => b.aura - a.aura);
    
    // Render podium
    renderPodium(sortedStudents);
    
    // Render leaderboards
    renderLeaderboard('all', sortedStudents);
    renderLeaderboard('boys', sortedStudents.filter(s => s.gender === 'male'));
    renderLeaderboard('girls', sortedStudents.filter(s => s.gender === 'female'));
    
    // Render student grid
    renderStudentGrid(sortedStudents);
}

// Render podium
function renderPodium(students) {
    const topStudents = students.slice(0, 3);
    
    // Get champion data if available
    const firstPlace = students.find(s => s.id === champions.first) || topStudents[0] || null;
    const secondPlace = students.find(s => s.id === champions.second) || topStudents[1] || null;
    const thirdPlace = students.find(s => s.id === champions.third) || topStudents[2] || null;
    
    // Update DOM
    if (firstPlace) {
        document.getElementById('first-name').textContent = firstPlace.name;
        document.getElementById('first-points').textContent = firstPlace.aura;
        document.getElementById('first-badge').textContent = firstPlace.badge;
    }
    
    if (secondPlace) {
        document.getElementById('second-name').textContent = secondPlace.name;
        document.getElementById('second-points').textContent = secondPlace.aura;
        document.getElementById('second-badge').textContent = secondPlace.badge;
    }
    
    if (thirdPlace) {
        document.getElementById('third-name').textContent = thirdPlace.name;
        document.getElementById('third-points').textContent = thirdPlace.aura;
        document.getElementById('third-badge').textContent = thirdPlace.badge;
    }
}

// Render leaderboard
function renderLeaderboard(type, students) {
    const container = document.getElementById(`${type}-leaderboard`);
    if (!container) return;
    
    container.innerHTML = students.map((student, index) => `
        <li class="leaderboard-item">
            <span class="rank">${index + 1}.</span>
            <span class="name">${student.name}</span>
            <span class="points">${student.aura} Aura ${student.badge || ''}</span>
        </li>
    `).join('');
}

// Render student grid
function renderStudentGrid(students) {
    const grid = document.getElementById('student-grid');
    if (!grid) return;
    
    grid.innerHTML = students.map(student => `
        <div class="student-card">
            <h3>${student.name} <small>(${student.gender === 'male' ? '♂' : '♀'})</small></h3>
            <div class="aura">${student.aura} ${student.badge || ''}</div>
            ${student.history.length ? `<div class="history">History: ${student.history.join(' → ')}</div>` : ''}
        </div>
    `).join('');
}

// Show tab
function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Update active tab button
    document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId));
    });
}

// Change theme
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}