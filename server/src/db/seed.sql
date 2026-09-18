-- Academic Program & Credit Information System Database Seed Data

-- Clear existing data
TRUNCATE TABLE ai_conversations, academic_documents, ca_rules, syllabus, subjects, semesters, specializations, users, programs RESTART IDENTITY CASCADE;

-- Insert Admin and Demo Student Users
-- Admin Password: AdminPass123! -> bcrypt hash $2a$10$wT.4D7yC3Q.8pYw3dY/JeeV3lJ14J1F1E5fW.z4K0J2u4L4d5H6mG (or hashed dynamically in seed.ts)
INSERT INTO users (name, email, password_hash, student_id, role, current_semester) VALUES
('System Administrator', 'admin@university.edu', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADM001', 'ADMIN', 1),
('Atul Sharma', 'atul.student@university.edu', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'STU2026001', 'STUDENT', 2);

-- Insert Programs
INSERT INTO programs (id, code, name, description, duration_years, total_semesters, status) VALUES
(1, 'MCA', 'Master of Computer Applications', 'Advanced post-graduate program specializing in software engineering, AI/ML, and enterprise architecture.', 2, 4, 'ACTIVE'),
(2, 'BCA', 'Bachelor of Computer Applications', 'Foundational undergraduate degree covering software development, web technologies, and computing fundamentals.', 3, 6, 'ACTIVE'),
(3, 'MSC', 'Master of Science in Information Technology', 'Post-graduate research and technology program focusing on data systems and network infrastructure.', 2, 4, 'ACTIVE'),
(4, 'BSC', 'Bachelor of Science in Computer Science', 'Core science program emphasizing algorithm design, theoretical computer science, and systems programming.', 3, 6, 'ACTIVE');

-- Reset program sequence
SELECT setval('programs_id_seq', (SELECT MAX(id) FROM programs));

-- Insert Specializations
INSERT INTO specializations (id, program_id, code, name, description, status) VALUES
-- MCA Specializations
(1, 1, 'MCA-AIML', 'Artificial Intelligence & Machine Learning', 'Specialized track in deep learning, neural networks, computer vision, and NLP.', 'ACTIVE'),
(2, 1, 'MCA-CYBER', 'Cyber Security & Forensics', 'Focuses on network defense, ethical hacking, cryptography, and security compliance.', 'ACTIVE'),
(3, 1, 'MCA-DATA', 'Data Analytics & Big Data', 'Specializes in data warehousing, predictive modeling, and scalable big data frameworks.', 'ACTIVE'),

-- BCA Specializations
(4, 2, 'BCA-WEB', 'Web & Mobile Development', 'Full-stack development track focusing on modern JavaScript frameworks and mobile apps.', 'ACTIVE'),
(5, 2, 'BCA-GAME', 'Gaming & Immersive Tech', 'Game physics, 3D graphics rendering, Unity/Unreal Engine development.', 'ACTIVE'),
(6, 2, 'BCA-ROBO', 'Robotics & Automation', 'Embedded systems, microcontrollers, IoT, and industrial robotics programming.', 'ACTIVE'),
(7, 2, 'BCA-CYBER', 'Cyber Security Fundamentals', 'Foundational cybersecurity principles, defense mechanisms, and secure coding.', 'ACTIVE'),

-- MSc Specializations
(8, 3, 'MSC-IT', 'Information Technology', 'Advanced cloud computing, database management, and enterprise software systems.', 'ACTIVE'),
(9, 3, 'MSC-CS', 'Computer Science Research', 'Algorithms complexity, distributed systems, and quantum computing foundations.', 'ACTIVE'),

-- BSc Specializations
(10, 4, 'BSC-CS', 'Computer Science Core', 'Theoretical computer science, compiler design, and software engineering.', 'ACTIVE'),
(11, 4, 'BSC-IT', 'Applied Information Technology', 'Practical software engineering, database administration, and web applications.', 'ACTIVE');

SELECT setval('specializations_id_seq', (SELECT MAX(id) FROM specializations));

-- Update demo student program & specialization
UPDATE users SET program_id = 1, specialization_id = 1 WHERE email = 'atul.student@university.edu';

-- Insert Semesters (MCA 4 semesters, BCA 6 semesters, MSc 4 semesters, BSc 6 semesters)
INSERT INTO semesters (id, program_id, semester_number, name) VALUES
-- MCA
(1, 1, 1, 'Semester 1'),
(2, 1, 2, 'Semester 2'),
(3, 1, 3, 'Semester 3'),
(4, 1, 4, 'Semester 4'),
-- BCA
(5, 2, 1, 'Semester 1'),
(6, 2, 2, 'Semester 2'),
(7, 2, 3, 'Semester 3'),
(8, 2, 4, 'Semester 4'),
(9, 2, 5, 'Semester 5'),
(10, 2, 6, 'Semester 6'),
-- MSc
(11, 3, 1, 'Semester 1'),
(12, 3, 2, 'Semester 2'),
(13, 3, 3, 'Semester 3'),
(14, 3, 4, 'Semester 4'),
-- BSc
(15, 4, 1, 'Semester 1'),
(16, 4, 2, 'Semester 2'),
(17, 4, 3, 'Semester 3'),
(18, 4, 4, 'Semester 4'),
(19, 4, 5, 'Semester 5'),
(20, 4, 6, 'Semester 6');

SELECT setval('semesters_id_seq', (SELECT MAX(id) FROM semesters));

-- Insert Subjects
INSERT INTO subjects (id, specialization_id, semester_id, course_code, name, subject_type, credits, description) VALUES
-- MCA AI/ML Sem 1
(1, 1, 1, 'MCA101', 'Advanced Data Structures & Algorithms', 'Core', 4.0, 'In-depth study of trees, graphs, dynamic programming, and asymptotic computational complexity.'),
(2, 1, 1, 'MCA102', 'Object-Oriented Software Engineering', 'Core', 4.0, 'UML modeling, design patterns, microservices design, and modern software development lifecycles.'),
(3, 1, 1, 'MCA103', 'Mathematical Foundations for AI', 'Core', 3.0, 'Linear algebra, multivariable calculus, probability distributions, and optimization for machine learning.'),
(4, 1, 1, 'MCA104', 'Python Programming Lab', 'Lab', 2.0, 'Hands-on laboratory sessions building data manipulation scripts and algorithm implementations.'),

-- MCA AI/ML Sem 2
(5, 1, 2, 'MCA201', 'Data Structures & Machine Learning Principles', 'Core', 4.0, 'Supervised and unsupervised learning, regression, classification trees, and feature engineering techniques.'),
(6, 1, 2, 'MCA202', 'Database Management Systems & SQL', 'Core', 4.0, 'Relational model, query optimization, ACID transactions, and indexing strategies in PostgreSQL.'),
(7, 1, 2, 'MCA203', 'Deep Learning & Neural Networks', 'Core', 4.0, 'Convolutional Neural Networks (CNN), Recurrent Neural Networks (RNN), Transformers, and PyTorch.'),
(8, 1, 2, 'MCA204', 'Cloud Computing Architecture', 'Elective', 3.0, 'Serverless architecture, containerization, virtual networks, and deployment strategies.'),

-- MCA Cyber Security Sem 1 & 2
(9, 2, 1, 'MCA105', 'Computer Networks & Protocols', 'Core', 4.0, 'OSI model, TCP/IP stack, routing protocols, and network packet analysis.'),
(10, 2, 2, 'MCA205', 'Applied Cryptography & Security', 'Core', 4.0, 'Symmetric and asymmetric encryption, public key infrastructure (PKI), and cryptographic hash functions.'),

-- BCA Web Development Sem 1 & 2
(11, 4, 5, 'BCA101', 'Programming in C & Logic Design', 'Core', 4.0, 'Basic programming concepts, control statements, memory management, pointers, and arrays.'),
(12, 4, 6, 'BCA201', 'Modern Web Technologies (HTML, CSS, JS)', 'Core', 4.0, 'Frontend Web architecture, responsive design principles, modern JavaScript (ES6+), and DOM manipulation.');

SELECT setval('subjects_id_seq', (SELECT MAX(id) FROM subjects));

-- Insert Syllabus Data
INSERT INTO syllabus (subject_id, file_url, file_name, version, description) VALUES
(1, 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', 'MCA101_Advanced_Data_Structures.pdf', '1.0', 'Official syllabus document covering 5 modules of Advanced Data Structures.'),
(5, 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', 'MCA201_Data_Structures_and_ML.pdf', '1.1', 'Comprehensive syllabus containing unit-wise topics, recommended textbooks, and evaluation pattern.'),
(6, 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', 'MCA202_DBMS_Syllabus.pdf', '1.0', 'Detailed curriculum on PostgreSQL, relational algebra, and normalization procedures.'),
(7, 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf', 'MCA203_Deep_Learning_Syllabus.pdf', '2.0', 'Updated neural network and transformer model course breakdown.');

-- Insert Continuous Assessment (CA) Rules
INSERT INTO ca_rules (program_id, semester_id, total_ca, required_ca, best_of, weightage_percentage, description) VALUES
(1, 1, 4, 3, 3, 30.00, 'MCA Semester 1 assessment rule: 4 Continuous Assessments scheduled per subject; best 3 scores will be calculated for 30% internal evaluation.'),
(1, 2, 4, 3, 3, 30.00, 'MCA Semester 2 assessment rule: 4 Continuous Assessments scheduled per subject; best 3 scores will be calculated for 30% internal evaluation.'),
(1, 3, 4, 3, 3, 30.00, 'MCA Semester 3 assessment rule: 4 Continuous Assessments scheduled; best 3 selected for final internal grade.'),
(2, 5, 4, 2, 2, 25.00, 'BCA Semester 1 assessment rule: 4 CAs conducted; best 2 considered for 25% weightage.'),
(2, 6, 4, 2, 2, 25.00, 'BCA Semester 2 assessment rule: 4 CAs conducted; best 2 considered for 25% weightage.');

-- Insert Academic Documents (for AI Knowledge base)
INSERT INTO academic_documents (title, category, content_summary, file_url) VALUES
('Academic Regulations Handbook 2026', 'Regulations', 'Official university academic policy detailing attendance requirements (minimum 75%), grading scales (CGPA/SGPA calculation), re-examination guidelines, and continuous assessment credit requirements.', 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf'),
('Continuous Assessment & Evaluation Scheme', 'Assessment Policy', 'Comprehensive explanation of internal assessment weightage: 30% internal CA tests, 10% lab assignments/practicals, and 60% end-semester written examinations.', 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf');
