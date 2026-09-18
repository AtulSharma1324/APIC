import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  student_id: string;
  role: 'STUDENT' | 'ADMIN';
  program_id?: number | null;
  specialization_id?: number | null;
  current_semester?: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Program {
  id: number;
  code: string;
  name: string;
  description: string;
  duration_years: number;
  total_semesters: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Specialization {
  id: number;
  program_id: number;
  code: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Semester {
  id: number;
  program_id: number;
  semester_number: number;
  name: string;
  status: string;
  created_at: string;
}

export interface Subject {
  id: number;
  specialization_id: number;
  semester_id: number;
  course_code: string;
  name: string;
  subject_type: 'Core' | 'Elective' | 'Lab' | 'Project';
  credits: number;
  description: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface Syllabus {
  id: number;
  subject_id: number;
  file_url: string;
  file_name: string;
  version: string;
  description: string;
  uploaded_at: string;
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
  created_at: string;
  updated_at?: string;
}

export interface AcademicDocument {
  id: number;
  title: string;
  category: string;
  content_summary: string;
  file_url: string;
  created_at: string;
}

export interface AIConversation {
  id: number;
  user_id?: number;
  query: string;
  response: string;
  sources_used?: string;
  created_at: string;
}

// In-Memory Database Default Seed State
const defaultPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'AdminPass123!', 10);

export const memoryStore = {
  users: [
    {
      id: 1,
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@university.edu',
      password_hash: defaultPasswordHash,
      student_id: 'ADM001',
      role: 'ADMIN',
      current_semester: 1,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Atul Sharma',
      email: 'atul.student@university.edu',
      password_hash: defaultPasswordHash,
      student_id: 'STU2026001',
      role: 'STUDENT',
      program_id: 1,
      specialization_id: 1,
      current_semester: 2,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    }
  ] as User[],

  programs: [
    {
      id: 1,
      code: 'MCA',
      name: 'Master of Computer Applications',
      description: 'Advanced post-graduate program specializing in software engineering, AI/ML, and enterprise architecture.',
      duration_years: 2,
      total_semesters: 4,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      code: 'BCA',
      name: 'Bachelor of Computer Applications',
      description: 'Foundational undergraduate degree covering software development, web technologies, and computing fundamentals.',
      duration_years: 3,
      total_semesters: 6,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      code: 'MSC',
      name: 'Master of Science in Information Technology',
      description: 'Post-graduate research and technology program focusing on data systems and network infrastructure.',
      duration_years: 2,
      total_semesters: 4,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      code: 'BSC',
      name: 'Bachelor of Science in Computer Science',
      description: 'Core science program emphasizing algorithm design, theoretical computer science, and systems programming.',
      duration_years: 3,
      total_semesters: 6,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    }
  ] as Program[],

  specializations: [
    { id: 1, program_id: 1, code: 'MCA-AIML', name: 'Artificial Intelligence & Machine Learning', description: 'Specialized track in deep learning, neural networks, computer vision, and NLP.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 2, program_id: 1, code: 'MCA-CYBER', name: 'Cyber Security & Forensics', description: 'Focuses on network defense, ethical hacking, cryptography, and security compliance.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 3, program_id: 1, code: 'MCA-DATA', name: 'Data Analytics & Big Data', description: 'Specializes in data warehousing, predictive modeling, and scalable big data frameworks.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 4, program_id: 2, code: 'BCA-WEB', name: 'Web & Mobile Development', description: 'Full-stack development track focusing on modern JavaScript frameworks and mobile apps.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 5, program_id: 2, code: 'BCA-GAME', name: 'Gaming & Immersive Tech', description: 'Game physics, 3D graphics rendering, Unity/Unreal Engine development.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 6, program_id: 2, code: 'BCA-ROBO', name: 'Robotics & Automation', description: 'Embedded systems, microcontrollers, IoT, and industrial robotics programming.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 7, program_id: 2, code: 'BCA-CYBER', name: 'Cyber Security Fundamentals', description: 'Foundational cybersecurity principles, defense mechanisms, and secure coding.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 8, program_id: 3, code: 'MSC-IT', name: 'Information Technology', description: 'Advanced cloud computing, database management, and enterprise software systems.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 9, program_id: 3, code: 'MSC-CS', name: 'Computer Science Research', description: 'Algorithms complexity, distributed systems, and quantum computing foundations.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 10, program_id: 4, code: 'BSC-CS', name: 'Computer Science Core', description: 'Theoretical computer science, compiler design, and software engineering.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 11, program_id: 4, code: 'BSC-IT', name: 'Applied Information Technology', description: 'Practical software engineering, database administration, and web applications.', status: 'ACTIVE', created_at: new Date().toISOString() }
  ] as Specialization[],

  semesters: [
    { id: 1, program_id: 1, semester_number: 1, name: 'Semester 1', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 2, program_id: 1, semester_number: 2, name: 'Semester 2', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 3, program_id: 1, semester_number: 3, name: 'Semester 3', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 4, program_id: 1, semester_number: 4, name: 'Semester 4', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 5, program_id: 2, semester_number: 1, name: 'Semester 1', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 6, program_id: 2, semester_number: 2, name: 'Semester 2', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 7, program_id: 2, semester_number: 3, name: 'Semester 3', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 8, program_id: 2, semester_number: 4, name: 'Semester 4', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 9, program_id: 2, semester_number: 5, name: 'Semester 5', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 10, program_id: 2, semester_number: 6, name: 'Semester 6', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 11, program_id: 3, semester_number: 1, name: 'Semester 1', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 12, program_id: 3, semester_number: 2, name: 'Semester 2', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 13, program_id: 3, semester_number: 3, name: 'Semester 3', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 14, program_id: 3, semester_number: 4, name: 'Semester 4', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 15, program_id: 4, semester_number: 1, name: 'Semester 1', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 16, program_id: 4, semester_number: 2, name: 'Semester 2', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 17, program_id: 4, semester_number: 3, name: 'Semester 3', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 18, program_id: 4, semester_number: 4, name: 'Semester 4', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 19, program_id: 4, semester_number: 5, name: 'Semester 5', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 20, program_id: 4, semester_number: 6, name: 'Semester 6', status: 'ACTIVE', created_at: new Date().toISOString() }
  ] as Semester[],

  subjects: [
    { id: 1, specialization_id: 1, semester_id: 1, course_code: 'MCA101', name: 'Advanced Data Structures & Algorithms', subject_type: 'Core', credits: 4, description: 'In-depth study of trees, graphs, dynamic programming, and asymptotic computational complexity.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 2, specialization_id: 1, semester_id: 1, course_code: 'MCA102', name: 'Object-Oriented Software Engineering', subject_type: 'Core', credits: 4, description: 'UML modeling, design patterns, microservices design, and modern software development lifecycles.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 3, specialization_id: 1, semester_id: 1, course_code: 'MCA103', name: 'Mathematical Foundations for AI', subject_type: 'Core', credits: 3, description: 'Linear algebra, multivariable calculus, probability distributions, and optimization for machine learning.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 4, specialization_id: 1, semester_id: 1, course_code: 'MCA104', name: 'Python Programming Lab', subject_type: 'Lab', credits: 2, description: 'Hands-on laboratory sessions building data manipulation scripts and algorithm implementations.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 5, specialization_id: 1, semester_id: 2, course_code: 'MCA201', name: 'Data Structures & Machine Learning Principles', subject_type: 'Core', credits: 4, description: 'Supervised and unsupervised learning, regression, classification trees, and feature engineering techniques.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 6, specialization_id: 1, semester_id: 2, course_code: 'MCA202', name: 'Database Management Systems & SQL', subject_type: 'Core', credits: 4, description: 'Relational model, query optimization, ACID transactions, and indexing strategies in PostgreSQL.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 7, specialization_id: 1, semester_id: 2, course_code: 'MCA203', name: 'Deep Learning & Neural Networks', subject_type: 'Core', credits: 4, description: 'Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN), Transformers, and PyTorch.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 8, specialization_id: 1, semester_id: 2, course_code: 'MCA204', name: 'Cloud Computing Architecture', subject_type: 'Elective', credits: 3, description: 'Serverless architecture, containerization, virtual networks, and deployment strategies.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 9, specialization_id: 2, semester_id: 1, course_code: 'MCA105', name: 'Computer Networks & Protocols', subject_type: 'Core', credits: 4, description: 'OSI model, TCP/IP stack, routing protocols, and network packet analysis.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 10, specialization_id: 2, semester_id: 2, course_code: 'MCA205', name: 'Applied Cryptography & Security', subject_type: 'Core', credits: 4, description: 'Symmetric and asymmetric encryption, public key infrastructure (PKI), and cryptographic hash functions.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 11, specialization_id: 4, semester_id: 5, course_code: 'BCA101', name: 'Programming in C & Logic Design', subject_type: 'Core', credits: 4, description: 'Basic programming concepts, control statements, memory management, pointers, and arrays.', status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 12, specialization_id: 4, semester_id: 6, course_code: 'BCA201', name: 'Modern Web Technologies (HTML, CSS, JS)', subject_type: 'Core', credits: 4, description: 'Frontend Web architecture, responsive design principles, modern JavaScript (ES6+), and DOM manipulation.', status: 'ACTIVE', created_at: new Date().toISOString() }
  ] as Subject[],

  syllabus: [
    { id: 1, subject_id: 1, file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', file_name: 'MCA101_Advanced_Data_Structures.pdf', version: '1.0', description: 'Official syllabus document covering 5 modules of Advanced Data Structures.', uploaded_at: new Date().toISOString() },
    { id: 2, subject_id: 5, file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', file_name: 'MCA201_Data_Structures_and_ML.pdf', version: '1.1', description: 'Comprehensive syllabus containing unit-wise topics, recommended textbooks, and evaluation pattern.', uploaded_at: new Date().toISOString() },
    { id: 3, subject_id: 6, file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', file_name: 'MCA202_DBMS_Syllabus.pdf', version: '1.0', description: 'Detailed curriculum on PostgreSQL, relational algebra, and normalization procedures.', uploaded_at: new Date().toISOString() },
    { id: 4, subject_id: 7, file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', file_name: 'MCA203_Deep_Learning_Syllabus.pdf', version: '2.0', description: 'Updated neural network and transformer model course breakdown.', uploaded_at: new Date().toISOString() }
  ] as Syllabus[],

  caRules: [
    { id: 1, program_id: 1, semester_id: 1, total_ca: 4, required_ca: 3, best_of: 3, weightage_percentage: 30, description: 'MCA Semester 1 assessment rule: 4 Continuous Assessments scheduled per subject; best 3 scores will be calculated for 30% internal evaluation.', created_at: new Date().toISOString() },
    { id: 2, program_id: 1, semester_id: 2, total_ca: 4, required_ca: 3, best_of: 3, weightage_percentage: 30, description: 'MCA Semester 2 assessment rule: 4 Continuous Assessments scheduled per subject; best 3 scores will be calculated for 30% internal evaluation.', created_at: new Date().toISOString() },
    { id: 3, program_id: 1, semester_id: 3, total_ca: 4, required_ca: 3, best_of: 3, weightage_percentage: 30, description: 'MCA Semester 3 assessment rule: 4 Continuous Assessments scheduled; best 3 selected for final internal grade.', created_at: new Date().toISOString() },
    { id: 4, program_id: 2, semester_id: 5, total_ca: 4, required_ca: 2, best_of: 2, weightage_percentage: 25, description: 'BCA Semester 1 assessment rule: 4 CAs conducted; best 2 considered for 25% weightage.', created_at: new Date().toISOString() },
    { id: 5, program_id: 2, semester_id: 6, total_ca: 4, required_ca: 2, best_of: 2, weightage_percentage: 25, description: 'BCA Semester 2 assessment rule: 4 CAs conducted; best 2 considered for 25% weightage.', created_at: new Date().toISOString() }
  ] as CARule[],

  academicDocuments: [
    { id: 1, title: 'Academic Regulations Handbook 2026', category: 'Regulations', content_summary: 'Official university academic policy detailing attendance requirements (minimum 75%), grading scales (CGPA/SGPA calculation), re-examination guidelines, and continuous assessment credit requirements.', file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', created_at: new Date().toISOString() },
    { id: 2, title: 'Continuous Assessment & Evaluation Scheme', category: 'Assessment Policy', content_summary: 'Comprehensive explanation of internal assessment weightage: 30% internal CA tests, 10% lab assignments/practicals, and 60% end-semester written examinations.', file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', created_at: new Date().toISOString() }
  ] as AcademicDocument[],

  aiConversations: [] as AIConversation[]
};
