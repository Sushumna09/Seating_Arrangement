#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>

using namespace std;

// Person structure
struct Person {
    string name;
    int age;
    char gender;
    vector<string> preferences;
    vector<string> conflicts;
    bool assigned;
};

// Seating arrangement structure
struct SeatingArrangement {
    vector<vector<string>> seats;
    int rows;
    int cols;
    int satisfaction_score;
    int conflicts_resolved;
};

// Global variables
vector<Person> people;
map<string, int> name_to_index;
vector<vector<string>> seating_matrix;
int total_rows, total_cols;

// Function to read people data from file
void readPeopleData(const string& filename) {
    ifstream file(filename);
    if (!file) {
        cout << "Error: Could not open " << filename << endl;
        return;
    }
    
    string line;
    while (getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;
        
        istringstream iss(line);
        string name, age_str, gender_str, preferences_str, conflicts_str;
        
        if (iss >> name >> age_str >> gender_str >> preferences_str >> conflicts_str) {
            Person person;
            person.name = name;
            person.age = stoi(age_str);
            person.gender = gender_str[0];
            person.assigned = false;
            
            // Parse preferences
            if (preferences_str != "none") {
                string pref = preferences_str.substr(1, preferences_str.length() - 2);
                size_t pos = 0;
                while ((pos = pref.find(",")) != string::npos) {
                    person.preferences.push_back(pref.substr(0, pos));
                    pref.erase(0, pos + 1);
                }
                person.preferences.push_back(pref);
            }
            
            // Parse conflicts
            if (conflicts_str != "none") {
                string conflict = conflicts_str.substr(1, conflicts_str.length() - 2);
                size_t pos = 0;
                while ((pos = conflict.find(",")) != string::npos) {
                    person.conflicts.push_back(conflict.substr(0, pos));
                    conflict.erase(0, pos + 1);
                }
                person.conflicts.push_back(conflict);
            }
            
            people.push_back(person);
            name_to_index[name] = people.size() - 1;
        }
    }
    
    cout << "Loaded " << people.size() << " people from file." << endl;
}

// Function to sort people by age (bubble sort)
void sortPeopleByAge() {
    int n = people.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (people[j].age > people[j + 1].age) {
                swap(people[j], people[j + 1]);
            }
        }
    }
}

// Function to sort people by name (selection sort)
void sortPeopleByName() {
    int n = people.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (people[j].name < people[min_idx].name) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(people[i], people[min_idx]);
        }
    }
}

// Function to check if two people can sit together
bool canSitTogether(const Person& p1, const Person& p2) {
    // Check conflicts
    for (const string& conflict : p1.conflicts) {
        if (conflict == p2.name) return false;
    }
    for (const string& conflict : p2.conflicts) {
        if (conflict == p1.name) return false;
    }
    
    // Check gender separation (optional constraint)
    // Uncomment the next line if you want gender separation
    // if (p1.gender == p2.gender) return false;
    
    return true;
}

// Function to calculate satisfaction score for a position
int calculateSatisfaction(const Person& person, int row, int col) {
    int score = 0;
    
    // Check preferences
    for (const string& pref : person.preferences) {
        if (pref == "front" && row == 0) score += 10;
        if (pref == "back" && row == total_rows - 1) score += 10;
        if (pref == "window" && (col == 0 || col == total_cols - 1)) score += 8;
        if (pref == "aisle" && (col == 1 || col == total_cols - 2)) score += 6;
        if (pref == "middle" && col > 0 && col < total_cols - 1) score += 5;
    }
    
    // Check neighbors
    vector<pair<int, int>> neighbors = {
        {row-1, col}, {row+1, col}, {row, col-1}, {row, col+1}
    };
    
    for (const auto& neighbor : neighbors) {
        int nr = neighbor.first, nc = neighbor.second;
        if (nr >= 0 && nr < total_rows && nc >= 0 && nc < total_cols) {
            if (!seating_matrix[nr][nc].empty()) {
                int neighbor_idx = name_to_index[seating_matrix[nr][nc]];
                if (canSitTogether(person, people[neighbor_idx])) {
                    score += 5;
                } else {
                    score -= 10; // Conflict penalty
                }
            }
        }
    }
    
    return score;
}

// Backtracking function to find optimal seating arrangement
bool findOptimalArrangement(int person_idx) {
    if (person_idx >= people.size()) {
        return true; // All people assigned
    }
    
    Person& person = people[person_idx];
    
    // Try each position
    for (int row = 0; row < total_rows; row++) {
        for (int col = 0; col < total_cols; col++) {
            if (seating_matrix[row][col].empty()) {
                // Check if this position is suitable
                bool valid = true;
                
                // Check neighbors for conflicts
                vector<pair<int, int>> neighbors = {
                    {row-1, col}, {row+1, col}, {row, col-1}, {row, col+1}
                };
                
                for (const auto& neighbor : neighbors) {
                    int nr = neighbor.first, nc = neighbor.second;
                    if (nr >= 0 && nr < total_rows && nc >= 0 && nc < total_cols) {
                        if (!seating_matrix[nr][nc].empty()) {
                            int neighbor_idx = name_to_index[seating_matrix[nr][nc]];
                            if (!canSitTogether(person, people[neighbor_idx])) {
                                valid = false;
                                break;
                            }
                        }
                    }
                }
                
                if (valid) {
                    // Assign person to this position
                    seating_matrix[row][col] = person.name;
                    person.assigned = true;
                    
                    // Recursively assign remaining people
                    if (findOptimalArrangement(person_idx + 1)) {
                        return true;
                    }
                    
                    // Backtrack
                    seating_matrix[row][col] = "";
                    person.assigned = false;
                }
            }
        }
    }
    
    return false;
}

// Function to display seating arrangement
void displaySeatingArrangement() {
    cout << "\n--- Final Seating Arrangement ---" << endl;
    for (int row = 0; row < total_rows; row++) {
        cout << "Row " << (row + 1) << ": ";
        for (int col = 0; col < total_cols; col++) {
            if (seating_matrix[row][col].empty()) {
                cout << "[Empty] ";
            } else {
                cout << "[" << seating_matrix[row][col] << "] ";
            }
        }
        cout << endl;
    }
    
    // Calculate statistics
    int assigned = 0, conflicts_resolved = 0, total_satisfaction = 0;
    
    for (int row = 0; row < total_rows; row++) {
        for (int col = 0; col < total_cols; col++) {
            if (!seating_matrix[row][col].empty()) {
                assigned++;
                int person_idx = name_to_index[seating_matrix[row][col]];
                total_satisfaction += calculateSatisfaction(people[person_idx], row, col);
            }
        }
    }
    
    cout << "\n--- Statistics ---" << endl;
    cout << "People assigned: " << assigned << "/" << people.size() << endl;
    cout << "Conflicts resolved: " << conflicts_resolved << endl;
    cout << "Average satisfaction score: " << (assigned > 0 ? total_satisfaction / assigned : 0) << endl;
}

int main() {
    cout << "=== Seating Arrangement System ===" << endl;
    
    // Read people data
    readPeopleData("people.txt");
    
    if (people.empty()) {
        cout << "No people data found. Please check people.txt" << endl;
        return 1;
    }
    
    // Get seating layout dimensions
    cout << "\nEnter number of rows: ";
    cin >> total_rows;
    cout << "Enter number of columns: ";
    cin >> total_cols;
    
    // Initialize seating matrix
    seating_matrix.resize(total_rows, vector<string>(total_cols, ""));
    
    // Sort people by different criteria
    cout << "\n--- Sorting People ---" << endl;
    sortPeopleByAge();
    cout << "People sorted by age." << endl;
    
    sortPeopleByName();
    cout << "People sorted by name." << endl;
    
    // Display people information
    cout << "\n--- People Information ---" << endl;
    for (const Person& person : people) {
        cout << person.name << " (" << person.age << ", " << person.gender << ")";
        if (!person.preferences.empty()) {
            cout << " - Prefers: ";
            for (const string& pref : person.preferences) {
                cout << pref << " ";
            }
        }
        if (!person.conflicts.empty()) {
            cout << " - Conflicts: ";
            for (const string& conflict : person.conflicts) {
                cout << conflict << " ";
            }
        }
        cout << endl;
    }
    
    // Find optimal seating arrangement
    cout << "\n--- Finding Optimal Arrangement ---" << endl;
    cout << "Processing constraints..." << endl;
    cout << "Finding optimal arrangement..." << endl;
    cout << "Backtracking through combinations..." << endl;
    
    if (findOptimalArrangement(0)) {
        displaySeatingArrangement();
    } else {
        cout << "No valid seating arrangement found!" << endl;
    }
    
    return 0;
} 