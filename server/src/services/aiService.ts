import { GoogleGenerativeAI } from '@google/generative-ai';
import { query as dbQuery } from '../config/db';
import { memoryStore } from './store';

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export interface AcademicSearchResult {
  programs: any[];
  specializations: any[];
  subjects: any[];
  caRules: any[];
  syllabus: any[];
  documents: any[];
}

export const searchAcademicData = async (searchQuery: string): Promise<AcademicSearchResult> => {
  const q = searchQuery.toLowerCase().trim();

  try {
    // Try querying database if available
    const progRes = await dbQuery(
      `SELECT * FROM programs WHERE LOWER(name) LIKE $1 OR LOWER(code) LIKE $1`,
      [`%${q}%`]
    );
    const specRes = await dbQuery(
      `SELECT s.*, p.name as program_name FROM specializations s JOIN programs p ON s.program_id = p.id WHERE LOWER(s.name) LIKE $1 OR LOWER(s.code) LIKE $1`,
      [`%${q}%`]
    );
    const subjRes = await dbQuery(
      `SELECT sub.*, p.name as program_name, sp.name as specialization_name, sem.name as semester_name 
       FROM subjects sub 
       LEFT JOIN specializations sp ON sub.specialization_id = sp.id 
       LEFT JOIN programs p ON sp.program_id = p.id 
       LEFT JOIN semesters sem ON sub.semester_id = sem.id 
       WHERE LOWER(sub.name) LIKE $1 OR LOWER(sub.course_code) LIKE $1 OR LOWER(sub.description) LIKE $1`,
      [`%${q}%`]
    );
    const caRes = await dbQuery(
      `SELECT ca.*, p.name as program_name, sem.name as semester_name 
       FROM ca_rules ca 
       JOIN programs p ON ca.program_id = p.id 
       JOIN semesters sem ON ca.semester_id = sem.id 
       WHERE LOWER(p.name) LIKE $1 OR LOWER(sem.name) LIKE $1 OR LOWER(ca.description) LIKE $1`,
      [`%${q}%`]
    );
    const sylRes = await dbQuery(
      `SELECT s.*, sub.course_code, sub.name as subject_name 
       FROM syllabus s 
       JOIN subjects sub ON s.subject_id = sub.id 
       WHERE LOWER(sub.course_code) LIKE $1 OR LOWER(sub.name) LIKE $1 OR LOWER(s.description) LIKE $1`,
      [`%${q}%`]
    );
    const docRes = await dbQuery(
      `SELECT * FROM academic_documents WHERE LOWER(title) LIKE $1 OR LOWER(content_summary) LIKE $1`,
      [`%${q}%`]
    );

    return {
      programs: progRes ? progRes.rows : [],
      specializations: specRes ? specRes.rows : [],
      subjects: subjRes ? subjRes.rows : [],
      caRules: caRes ? caRes.rows : [],
      syllabus: sylRes ? sylRes.rows : [],
      documents: docRes ? docRes.rows : []
    };
  } catch {
    // Fallback to memory store search
    const matchedPrograms = memoryStore.programs.filter(
      p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
    const matchedSpecs = memoryStore.specializations.filter(
      s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    );
    const matchedSubjects = memoryStore.subjects.filter(
      sub => sub.name.toLowerCase().includes(q) || sub.course_code.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q)
    );
    const matchedCaRules = memoryStore.caRules.filter(ca => {
      const prog = memoryStore.programs.find(p => p.id === ca.program_id);
      const sem = memoryStore.semesters.find(s => s.id === ca.semester_id);
      return (prog && prog.name.toLowerCase().includes(q)) || (sem && sem.name.toLowerCase().includes(q)) || ca.description.toLowerCase().includes(q);
    });
    const matchedSyllabus = memoryStore.syllabus.filter(s => {
      const sub = memoryStore.subjects.find(sb => sb.id === s.subject_id);
      return sub && (sub.course_code.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q));
    });
    const matchedDocs = memoryStore.academicDocuments.filter(
      d => d.title.toLowerCase().includes(q) || d.content_summary.toLowerCase().includes(q)
    );

    return {
      programs: matchedPrograms,
      specializations: matchedSpecs,
      subjects: matchedSubjects,
      caRules: matchedCaRules,
      syllabus: matchedSyllabus,
      documents: matchedDocs
    };
  }
};

export const buildAcademicContext = (searchData: AcademicSearchResult): string => {
  let context = "=== APPROVED ACADEMIC DATABASE RECORDS ===\n\n";

  if (searchData.programs.length > 0) {
    context += "PROGRAMS:\n";
    searchData.programs.forEach(p => {
      context += `- [Program Code: ${p.code}] ${p.name}: ${p.description} (Duration: ${p.duration_years} Years, ${p.total_semesters} Semesters)\n`;
    });
    context += "\n";
  }

  if (searchData.specializations.length > 0) {
    context += "SPECIALIZATIONS:\n";
    searchData.specializations.forEach(s => {
      context += `- [Spec Code: ${s.code}] ${s.name}: ${s.description}\n`;
    });
    context += "\n";
  }

  if (searchData.subjects.length > 0) {
    context += "SUBJECTS & CURRICULUM:\n";
    searchData.subjects.forEach(s => {
      context += `- Course Code: ${s.course_code} | Subject Name: "${s.name}" | Credits: ${s.credits} | Type: ${s.subject_type} | Description: ${s.description}\n`;
    });
    context += "\n";
  }

  if (searchData.caRules.length > 0) {
    context += "CONTINUOUS ASSESSMENT (CA) RULES:\n";
    searchData.caRules.forEach(ca => {
      context += `- Rule Details: Total CAs: ${ca.total_ca}, Required CAs: ${ca.required_ca}, Best Of: ${ca.best_of}, Weightage: ${ca.weightage_percentage}%. Summary: ${ca.description}\n`;
    });
    context += "\n";
  }

  if (searchData.syllabus.length > 0) {
    context += "SYLLABUS DOCUMENTS:\n";
    searchData.syllabus.forEach(s => {
      context += `- Document for Subject ID ${s.subject_id} (${s.file_name}): Version ${s.version}, Download Link: ${s.file_url}. Description: ${s.description}\n`;
    });
    context += "\n";
  }

  if (searchData.documents.length > 0) {
    context += "INSTITUTIONAL POLICY DOCUMENTS:\n";
    searchData.documents.forEach(d => {
      context += `- Title: "${d.title}" (${d.category}): ${d.content_summary}\n`;
    });
    context += "\n";
  }

  if (
    searchData.programs.length === 0 &&
    searchData.specializations.length === 0 &&
    searchData.subjects.length === 0 &&
    searchData.caRules.length === 0 &&
    searchData.syllabus.length === 0 &&
    searchData.documents.length === 0
  ) {
    context += "NO MATCHING ACADEMIC RECORDS FOUND IN DATABASE FOR THIS QUERY.\n\n";
  }

  return context;
};

export const answerAcademicQuery = async (
  userQuery: string,
  userContextInfo?: { program?: string; specialization?: string; semester?: number }
): Promise<{ text: string; sources: string[] }> => {
  // Extract keywords to search database
  const searchResults = await searchAcademicData(userQuery);
  const contextText = buildAcademicContext(searchResults);

  const sources: string[] = [];
  searchResults.subjects.forEach(s => sources.push(`${s.course_code} - ${s.name}`));
  searchResults.syllabus.forEach(s => sources.push(`Syllabus: ${s.file_name}`));
  searchResults.caRules.forEach(ca => sources.push(`CA Policy Rule ID #${ca.id}`));

  const systemInstruction = `
You are an academic assistant for the Academic Program and Credit Information System.

Answer questions using ONLY information retrieved from the application's approved academic database and documents provided in the context below.

CRITICAL RULES:
1. Never invent course codes, credits, subjects, syllabus content, CA rules, or institutional regulations.
2. If the requested information is NOT present in the provided context, clearly state: "I could not find this information in the current academic database. Please contact the administrator or academic department."
3. When answering, cite the specific Course Code or Document Name from the database if available.
4. Keep answers concise, accurate, professional, and student-friendly.
`;

  const prompt = `${systemInstruction}

CONTEXT FROM DATABASE:
${contextText}

STUDENT QUERY: "${userQuery}"

Provide a clear, grounded response based strictly on the database context above:`;

  if (genAI && geminiApiKey) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return {
        text: responseText,
        sources: Array.from(new Set(sources))
      };
    } catch (err: any) {
      console.warn('⚠️ Gemini API call failed. Using grounded local response synthesis:', err?.message || err);
    }
  }

  // Fallback Rule-Based Grounded Synthesis (when GEMINI_API_KEY is not set)
  let localAnswer = '';
  if (searchResults.subjects.length > 0) {
    const sub = searchResults.subjects[0];
    localAnswer = `According to the academic database, **${sub.course_code}** is **${sub.name}** (${sub.subject_type}). It carries **${sub.credits} credits**. ${sub.description}`;
    if (searchResults.syllabus.length > 0) {
      localAnswer += `\n\n📄 **Syllabus Document:** You can view or download the syllabus for ${sub.course_code} [here](${searchResults.syllabus[0].file_url}).`;
    }
  } else if (searchResults.caRules.length > 0) {
    const ca = searchResults.caRules[0];
    localAnswer = `According to official academic rules maintained in the system:\n- **Total CAs:** ${ca.total_ca}\n- **Required CAs:** ${ca.required_ca}\n- **Best-of Rule:** Best ${ca.best_of} scores out of ${ca.total_ca}\n- **Internal Weightage:** ${ca.weightage_percentage}%\n\n${ca.description}`;
  } else if (searchResults.programs.length > 0) {
    const p = searchResults.programs[0];
    localAnswer = `Program **${p.name} (${p.code})** is a ${p.duration_years}-year academic program spanning ${p.total_semesters} semesters. ${p.description}`;
  } else {
    localAnswer = "I could not find this information in the academic database. Please contact the administrator or academic department.";
  }

  return {
    text: localAnswer,
    sources: Array.from(new Set(sources))
  };
};
