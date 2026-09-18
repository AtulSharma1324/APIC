export interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  student_id?: string;
  program_id?: number | null;
  specialization_id?: number | null;
  current_semester?: number;
  program_name?: string;
  specialization_name?: string;
  created_at?: string;
}

export interface Specialization {
  id: number;
  program_id: number;
  code: string;
  name: string;
  description: string;
  status: string;
  program_name?: string;
  created_at?: string;
}

export interface Program {
  id: number;
  code: string;
  name: string;
  description: string;
  duration_years: number;
  total_semesters: number;
  status: string;
  specializations?: Specialization[];
  created_at?: string;
}

export interface Semester {
  id: number;
  program_id: number;
  semester_number: number;
  name: string;
  program_name?: string;
  created_at?: string;
}

export interface Syllabus {
  id: number;
  subject_id: number;
  file_url: string;
  file_name: string;
  version: string;
  description: string;
  uploaded_at: string;
  course_code?: string;
  subject_name?: string;
  program_name?: string;
}

export interface CARule {
  id: number;
  program_id: number;
  semester_id: number;
  total_ca: number;
  required_ca: number;
  best_of: number;
  weightage_percentage: number;
  description: string;
  program_name?: string;
  program_code?: string;
  semester_number?: number;
  semester_name?: string;
}

export interface Subject {
  id: number;
  specialization_id?: number;
  semester_id?: number;
  course_code: string;
  name: string;
  subject_type: 'Core' | 'Elective' | 'Lab' | 'Project';
  credits: number;
  description: string;
  status: string;
  specialization_name?: string;
  program_id?: number;
  program_name?: string;
  semester_number?: number;
  semester_name?: string;
  syllabus_url?: string | null;
  syllabus_file_name?: string | null;
  syllabus_version?: string | null;
  syllabus?: Syllabus | null;
  caRule?: CARule | null;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: string[];
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
