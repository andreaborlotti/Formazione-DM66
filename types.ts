export interface CourseSession {
  dateInfo: string; // Es: "10/9/2025 dalle 15.00 alle 17.00"
  hours: number;
  status: 'completed' | 'registered' | 'none' | 'absent'; // 'completed' = hours > 0, 'registered' = *, 'none' = empty, 'absent' = 0
}

export interface CourseGroup {
  title: string; // Es: "Apprendimento inclusivo..."
  sessions: CourseSession[];
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  school: string;
  courseGroups: CourseGroup[];
  totalHours: number;
}

export interface AppState {
  teachers: Teacher[];
  schools: string[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface FilterState {
  selectedSchool: string;
  searchQuery: string;
  showAll: boolean;
}