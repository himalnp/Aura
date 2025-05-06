// Global data store
let appData = {
    students: [],
    champions: { first: null, second: null, third: null }
};

// DOM elements
const elements = {
    studentsGrid: document.getElementById('studentsGrid'),
    addForm: document.getElementById('addForm'),
    saveBtn: document.getElementById('saveBtn'),
    firstSelect: document.getElementById('firstSelect'),
    secondSelect: document.getElementById('secondSelect'),
    thirdSelect: document.getElementById('thirdSelect')
};

// Initialize the app
async function init() {
    await loadData();
    renderStudentGrid();
    renderChampionSelects();
    setupEventListeners();
}

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data/students.json');
        const data = await response.json();
        appData.students = data.students || [];
        appData.champions = data.champions || { first: null, second: null, third: null };
    } catch (error) {
        console.error("Error loading data:", error);
        // Initialize with sample data if file doesn't exist
        appData.students = [
            { id: 1, name: "Bhabesh", aura: 0, gender: "male", badge: "", history: [] },
            { id: 2, name: "Ritesh", aura: 0, gender: "male", badge: "", history: [] }
        ];
    }
}

// Render all students in the grid
function renderStudentGrid() {
    elements.studentsGrid.innerHTML = '';
    
    appData.students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${student.name}</h3>
            <p>Gender: ${student.gender}</p>
            <div class="form-group">
                <label>Aura Points</label>
                <input type="number" value="${student.aura}" 
                       data-id="${student.id}" class="aura-input">
            </div>
            <div class="form-group">
                <label>Badge Emoji</label>
                <input type="text" value="${student.badge}" 
                       data-id="${student.id}" class="badge-input">
            </div>
            <button class="btn btn-danger remove-btn" data-id="${student.id}">
                Remove
            </button>
        `;
        elements.studentsGrid.appendChild(card);
    });
}

// Render champion dropdown selects
function renderChampionSelects() {
    [elements.firstSelect, elements.secondSelect, elements.thirdSelect].forEach(select => {
        select.innerHTML = '<option value="">-- Select --</option>';
    });
    
    appData.students.forEach(student => {
        const option = `<option value="${student.id}">${student.name}</option>`;
        elements.firstSelect.innerHTML += option;
        elements.secondSelect.innerHTML += option;
        elements.thirdSelect.innerHTML += option;
    });
    
    // Set current selections
    elements.firstSelect.value = appData.champions.first || '';
    elements.secondSelect.value = appData.champions.second || '';
    elements.thirdSelect.value = appData.champions.third || '';
}

// Setup event listeners
function setupEventListeners() {
    // Add new student
    elements.addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value.trim();
        const gender = document.getElementById('studentGender').value;
        
        if (name) {
            const newId = appData.students.length > 0 
                ? Math.max(...appData.students.map(s => s.id)) + 1 
                : 1;
            
            appData.students.push({
                id: newId,
                name,
                gender,
                aura: 0,
                badge: "",
                history: []
            });
            
            renderStudentGrid();
            renderChampionSelects();
            elements.addForm.reset();
        }
    });
    
    // Save all changes
    elements.saveBtn.addEventListener('click', () => {
        // Update champion selections
        appData.champions = {
            first: elements.firstSelect.value || null,
            second: elements.secondSelect.value || null,
            third: elements.thirdSelect.value || null
        };
        
        // Update aura points and badges
        document.querySelectorAll('.aura-input').forEach(input => {
            const id = parseInt(input.dataset.id);
            const student = appData.students.find(s => s.id === id);
            if (student) student.aura = parseInt(input.value) || 0;
        });
        
        document.querySelectorAll('.badge-input').forEach(input => {
            const id = parseInt(input.dataset.id);
            const student = appData.students.find(s => s.id === id);
            if (student) student.badge = input.value;
        });
        
        alert('Changes saved! (Note: On GitHub Pages, you need to manually update students.json)');
        console.log('Data to save:', appData);
    });
    
    // Remove student (delegated event)
    elements.studentsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const id = parseInt(e.target.dataset.id);
            appData.students = appData.students.filter(s => s.id !== id);
            renderStudentGrid();
            renderChampionSelects();
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);