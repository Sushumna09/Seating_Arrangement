// Global variables
let people = [];
let seatingLayout = [];
let rows = 3;
let cols = 4;
let draggedPerson = null;

// Person class
class Person {
    constructor(name, age, gender, preferences = [], conflicts = []) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.preferences = preferences;
        this.conflicts = conflicts;
        this.assigned = false;
        this.seatPosition = null;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    createSeatingLayout();
    loadSamplePeople();
    updateStatistics();
});

// Create seating layout
function createSeatingLayout() {
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    
    const layoutDiv = document.getElementById('seatingLayout');
    layoutDiv.innerHTML = '';
    layoutDiv.style.gridTemplateColumns = `repeat(${cols}, 120px)`;
    
    seatingLayout = [];
    
    for (let i = 0; i < rows; i++) {
        seatingLayout[i] = [];
        for (let j = 0; j < cols; j++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = `Seat ${i+1}-${j+1}`;
            seat.dataset.row = i;
            seat.dataset.col = j;
            
            // Add drag and drop event listeners
            seat.addEventListener('dragover', handleDragOver);
            seat.addEventListener('drop', handleDrop);
            seat.addEventListener('dragenter', handleDragEnter);
            seat.addEventListener('dragleave', handleDragLeave);
            
            layoutDiv.appendChild(seat);
            seatingLayout[i][j] = null;
        }
    }
}

// Load sample people
function loadSamplePeople() {
    const samplePeople = [
        new Person('John', 25, 'M', ['front', 'window'], ['Sarah']),
        new Person('Sarah', 23, 'F', ['back', 'aisle'], ['John']),
        new Person('Mike', 30, 'M', ['middle'], []),
        new Person('Lisa', 28, 'F', ['window'], []),
        new Person('David', 35, 'M', ['front'], ['Emma']),
        new Person('Emma', 26, 'F', ['aisle'], ['David']),
        new Person('Tom', 22, 'M', ['back'], []),
        new Person('Anna', 29, 'F', ['window', 'front'], [])
    ];
    
    people = samplePeople;
    renderPeopleList();
}

// Add new person
function addPerson() {
    const name = document.getElementById('personName').value.trim();
    const age = parseInt(document.getElementById('personAge').value);
    const gender = document.getElementById('personGender').value;
    const preferences = document.getElementById('personPreferences').value.split(',').map(p => p.trim()).filter(p => p);
    const conflicts = document.getElementById('personConflicts').value.split(',').map(c => c.trim()).filter(c => c);
    
    if (!name || !age) {
        alert('Please enter name and age');
        return;
    }
    
    const person = new Person(name, age, gender, preferences, conflicts);
    people.push(person);
    
    // Clear form
    document.getElementById('personName').value = '';
    document.getElementById('personAge').value = '';
    document.getElementById('personPreferences').value = '';
    document.getElementById('personConflicts').value = '';
    
    renderPeopleList();
    updateStatistics();
}

// Render people list
function renderPeopleList() {
    const peopleListDiv = document.getElementById('peopleList');
    peopleListDiv.innerHTML = '';
    
    people.forEach((person, index) => {
        if (!person.assigned) {
            const personCard = document.createElement('div');
            personCard.className = 'person-card';
            personCard.draggable = true;
            personCard.dataset.index = index;
            
            personCard.innerHTML = `
                <div class="gender ${person.gender === 'M' ? 'male' : 'female'}">${person.gender}</div>
                <h4>${person.name}</h4>
                <p>Age: ${person.age}</p>
                <p>Prefs: ${person.preferences.join(', ') || 'None'}</p>
                <p>Conflicts: ${person.conflicts.join(', ') || 'None'}</p>
            `;
            
            // Add drag event listeners
            personCard.addEventListener('dragstart', handleDragStart);
            personCard.addEventListener('dragend', handleDragEnd);
            
            peopleListDiv.appendChild(personCard);
        }
    });
}

// Drag and drop handlers
function handleDragStart(e) {
    draggedPerson = people[parseInt(e.target.dataset.index)];
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedPerson = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    if (!draggedPerson) return;
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    // Check if seat is already occupied
    if (seatingLayout[row][col]) {
        alert('This seat is already occupied!');
        return;
    }
    
    // Check for conflicts with neighbors
    if (hasConflicts(draggedPerson, row, col)) {
        alert('Cannot place here due to conflicts with neighbors!');
        return;
    }
    
    // Assign person to seat
    seatingLayout[row][col] = draggedPerson;
    draggedPerson.assigned = true;
    draggedPerson.seatPosition = {row, col};
    
    // Update seat display
    e.target.textContent = draggedPerson.name;
    e.target.classList.add('occupied');
    
    // Check for conflicts and highlight
    checkAndHighlightConflicts();
    
    // Re-render people list and update statistics
    renderPeopleList();
    updateStatistics();
}

// Check for conflicts with neighbors
function hasConflicts(person, row, col) {
    const neighbors = [
        {row: row-1, col: col},
        {row: row+1, col: col},
        {row: row, col: col-1},
        {row: row, col: col+1}
    ];
    
    for (const neighbor of neighbors) {
        if (neighbor.row >= 0 && neighbor.row < rows && 
            neighbor.col >= 0 && neighbor.col < cols) {
            const neighborPerson = seatingLayout[neighbor.row][neighbor.col];
            if (neighborPerson) {
                if (person.conflicts.includes(neighborPerson.name) ||
                    neighborPerson.conflicts.includes(person.name)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Check and highlight conflicts
function checkAndHighlightConflicts() {
    // Clear previous conflict highlights
    document.querySelectorAll('.seat.conflict').forEach(seat => {
        seat.classList.remove('conflict');
    });
    
    // Check each occupied seat for conflicts
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const person = seatingLayout[i][j];
            if (person && hasConflicts(person, i, j)) {
                const seatElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                seatElement.classList.add('conflict');
            }
        }
    }
}

// Calculate satisfaction score
function calculateSatisfaction(person, row, col) {
    let score = 0;
    
    // Check preferences
    for (const pref of person.preferences) {
        if (pref === 'front' && row === 0) score += 10;
        if (pref === 'back' && row === rows - 1) score += 10;
        if (pref === 'window' && (col === 0 || col === cols - 1)) score += 8;
        if (pref === 'aisle' && (col === 1 || col === cols - 2)) score += 6;
        if (pref === 'middle' && col > 0 && col < cols - 1) score += 5;
    }
    
    return score;
}

// Update statistics
function updateStatistics() {
    let assignedCount = 0;
    let conflictsResolved = 0;
    let totalSatisfaction = 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const person = seatingLayout[i][j];
            if (person) {
                assignedCount++;
                totalSatisfaction += calculateSatisfaction(person, i, j);
            }
        }
    }
    
    // Count conflicts resolved (people who don't have conflicts with neighbors)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const person = seatingLayout[i][j];
            if (person && !hasConflicts(person, i, j)) {
                conflictsResolved++;
            }
        }
    }
    
    document.getElementById('assignedCount').textContent = assignedCount;
    document.getElementById('conflictsResolved').textContent = conflictsResolved;
    document.getElementById('satisfactionScore').textContent = 
        assignedCount > 0 ? Math.round(totalSatisfaction / assignedCount) : 0;
}

// Auto arrange function (simple greedy algorithm)
function autoArrange() {
    // Clear current arrangement
    clearLayout();
    
    // Sort people by priority (age, then name)
    const sortedPeople = [...people].sort((a, b) => {
        if (a.age !== b.age) return b.age - a.age; // Older people first
        return a.name.localeCompare(b.name);
    });
    
    let personIndex = 0;
    
    // Try to place each person
    for (let i = 0; i < rows && personIndex < sortedPeople.length; i++) {
        for (let j = 0; j < cols && personIndex < sortedPeople.length; j++) {
            const person = sortedPeople[personIndex];
            
            // Find best position for this person
            let bestRow = i, bestCol = j, bestScore = -1;
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (!seatingLayout[r][c] && !hasConflicts(person, r, c)) {
                        const score = calculateSatisfaction(person, r, c);
                        if (score > bestScore) {
                            bestScore = score;
                            bestRow = r;
                            bestCol = c;
                        }
                    }
                }
            }
            
            // Place person if valid position found
            if (bestScore >= 0) {
                seatingLayout[bestRow][bestCol] = person;
                person.assigned = true;
                person.seatPosition = {row: bestRow, col: bestCol};
                
                // Update seat display
                const seatElement = document.querySelector(`[data-row="${bestRow}"][data-col="${bestCol}"]`);
                seatElement.textContent = person.name;
                seatElement.classList.add('occupied');
            }
            
            personIndex++;
        }
    }
    
    checkAndHighlightConflicts();
    renderPeopleList();
    updateStatistics();
    
    alert('Auto arrangement completed!');
}

// Clear layout
function clearLayout() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            seatingLayout[i][j] = null;
        }
    }
    
    // Reset all people
    people.forEach(person => {
        person.assigned = false;
        person.seatPosition = null;
    });
    
    // Clear seat displays
    document.querySelectorAll('.seat').forEach(seat => {
        seat.textContent = `Seat ${parseInt(seat.dataset.row)+1}-${parseInt(seat.dataset.col)+1}`;
        seat.classList.remove('occupied', 'conflict');
    });
    
    renderPeopleList();
    updateStatistics();
}

// Export layout
function exportLayout() {
    let exportText = 'Seating Arrangement\n';
    exportText += '==================\n\n';
    
    for (let i = 0; i < rows; i++) {
        exportText += `Row ${i+1}: `;
        for (let j = 0; j < cols; j++) {
            const person = seatingLayout[i][j];
            exportText += person ? `[${person.name}] ` : '[Empty] ';
        }
        exportText += '\n';
    }
    
    exportText += '\nStatistics:\n';
    exportText += `People assigned: ${document.getElementById('assignedCount').textContent}\n`;
    exportText += `Conflicts resolved: ${document.getElementById('conflictsResolved').textContent}\n`;
    exportText += `Satisfaction score: ${document.getElementById('satisfactionScore').textContent}%\n`;
    
    // Create download link
    const blob = new Blob([exportText], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating_arrangement.txt';
    a.click();
    URL.revokeObjectURL(url);
} 