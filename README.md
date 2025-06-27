# Seating Arrangement System

A comprehensive seating arrangement application that uses various DSA concepts to optimally assign seats based on multiple constraints and preferences.

## Project Description

This application demonstrates the implementation of seating arrangement algorithms using:
- **Backtracking Algorithm**: For constraint satisfaction problems
- **Graph Theory**: Representing people relationships and conflicts
- **Sorting Algorithms**: Multiple criteria sorting (age, name, preferences)
- **Matrix Operations**: 2D array representation of seating layout
- **Optimization Techniques**: Finding the best possible arrangement
- **Web Interface**: Interactive drag-and-drop seating management

## DSA Concepts Used

- **Backtracking**: Finding valid seating combinations that satisfy all constraints
- **Graph Theory**: People as nodes, relationships and conflicts as edges
- **Matrix/2D Arrays**: Seating grid representation and manipulation
- **Sorting Algorithms**: Multiple criteria sorting (bubble sort, selection sort)
- **Search Algorithms**: Finding optimal positions and conflict resolution
- **Constraint Satisfaction**: Meeting gender, age, preference requirements
- **Optimization**: Maximizing satisfaction while minimizing conflicts
- **File I/O**: Reading people data and saving arrangements

## Folder Structure

```
seating-arrangement/
├── backend/
│   ├── seating_algorithm.cpp    # Main seating arrangement algorithm
│   ├── constraints.cpp          # Constraint checking functions
│   └── people.txt              # Input file with people data
├── frontend/
│   ├── index.html              # Interactive seating interface
│   ├── style.css               # Styling for the web interface
│   └── script.js               # JavaScript for interactivity
├── db/
│   └── schema.sql              # Database schema (placeholder)
└── README.md                   # Project documentation
```

## How to Run the C++ Program

### Prerequisites
- C++ compiler (g++ recommended)
- Input file `people.txt` with people data

### Compilation and Execution

1. **Navigate to the project directory:**
   ```bash
   cd seating-arrangement
   ```

2. **Compile the C++ program:**
   ```bash
   g++ backend/seating_algorithm.cpp backend/constraints.cpp -o backend/seating
   ```

3. **Run the program:**
   ```bash
   backend/seating
   ```

4. **Follow the prompts:**
   - Enter number of rows and columns
   - View the optimal seating arrangement
   - See constraint satisfaction details

### Input File Format (`people.txt`)

Each line contains: `Name Age Gender Preferences Conflicts`
```
John 25 M "front,window" "Sarah"
Sarah 23 F "back,aisle" "John"
Mike 30 M "middle" "none"
Lisa 28 F "window" "none"
```

## Sample Input/Output

### Example 1: Classroom Seating
```
Enter number of rows: 3
Enter number of columns: 4

--- Seating Arrangement Algorithm ---
Processing constraints...
Finding optimal arrangement...
Backtracking through combinations...

--- Final Seating Arrangement ---
Row 1: [John] [Lisa] [Mike] [Sarah]
Row 2: [Emma] [David] [Anna] [Tom]
Row 3: [Kate] [Paul] [Mary] [James]

Constraint Satisfaction:
✅ Gender separation maintained
✅ Age groups distributed evenly
✅ Conflicts avoided
✅ Preferences satisfied: 85%
```

### Example 2: Event Seating
```
Enter number of rows: 2
Enter number of columns: 3

--- Seating Arrangement ---
Row 1: [Alice] [Bob] [Carol]
Row 2: [David] [Eve] [Frank]

Total satisfaction score: 92%
Conflicts resolved: 3
```

## Web Interface

The frontend provides an interactive seating management system:
- Drag-and-drop seat assignment
- Real-time constraint checking
- Visual conflict highlighting
- Multiple layout views (grid, list, 3D)
- Export seating charts

To use the web interface:
1. Open `frontend/index.html` in a web browser
2. Add people and their preferences
3. Drag people to seats
4. View real-time constraint satisfaction

## Algorithm Complexity

- **Time Complexity**: O(n!) for backtracking (worst case)
- **Space Complexity**: O(n²) for seating matrix
- **Optimization**: Heuristic improvements reduce complexity
- **Constraint Checking**: O(n) per arrangement

## Features

- Interactive drag-and-drop seating interface
- Multiple constraint types (gender, age, preferences, conflicts)
- Real-time conflict detection and resolution
- Multiple sorting algorithms for different criteria
- Export functionality (PDF, Excel, seating charts)
- Visual feedback and satisfaction scoring
- Mobile-responsive design

## Author

"Sushumna Gajarla" 
*Data Structures and Algorithms Project*

---

*This project demonstrates advanced DSA concepts through a practical seating arrangement application.*
