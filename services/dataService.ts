import { Teacher, CourseGroup, CourseSession } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMYpvpzg628--Aea0AnXPgIxBbkYfMtI8QOPxyjMKv2GjY40_0ygDos9RzIs7I_SdCQrNhqOiVBRj6/pub?gid=563691476&single=true&output=csv';

// Column Indices (0-based)
const COL_F_INDEX = 5;
const COL_AX_INDEX = 49;

/**
 * Robust CSV Parser that handles newlines inside quoted cells.
 * Splits the text into a 2D array of strings.
 */
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  
  // Iterate char by char to handle state properly
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote ("") -> becomes single quote (")
        currentCell += '"';
        i++; // Skip the next quote
      } else if (char === '"') {
        // Closing quote
        insideQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        // Starting quote
        insideQuotes = true;
      } else if (char === ',') {
        // End of cell
        currentRow.push(currentCell);
        currentCell = '';
      } else if (char === '\n' || char === '\r') {
        // End of row
        // Handle CRLF or simple LF/CR
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        
        // Push last cell of the row
        currentRow.push(currentCell);
        rows.push(currentRow);
        
        // Reset for next row
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  // Flush any remaining data
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
};

/**
 * Formats the session info string.
 * Simply cleans up whitespace to preserve the original format "data... dalle... alle..."
 * as requested by the user ("lascia quello che vedi").
 */
const formatSessionInfo = (rawDateInfo: string): string => {
  if (!rawDateInfo) return "";
  // Clean up excessive whitespace but keep original text structure
  return rawDateInfo.replace(/\s+/g, ' ').trim();
};

/**
 * Splits a raw header string into a Course Title and Session Info (Date/Time).
 * Returns empty title if only date is found (to support inheritance).
 */
const parseHeaderInfo = (rawHeader: string): { title: string, dateInfo: string } => {
  if (!rawHeader) return { title: "", dateInfo: "" };

  // Regex: look for start of a date. 
  // Supports d/m/y, d-m-y, d.m.y or text dates (5 dicembre 2025)
  const dateRegex = /(\d{1,2}\s*[\/\-\.]\s*\d{1,2}\s*[\/\-\.]\s*\d{2,4}|\d{1,2}\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre|gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)\.?\s+\d{2,4})/i;
  
  const match = rawHeader.match(dateRegex);

  if (match && match.index !== undefined) {
    const titlePart = rawHeader.substring(0, match.index).trim();
    const rawDatePart = rawHeader.substring(match.index).trim();
    
    // Clean up trailing separators from title if any (e.g. "Title - ")
    const cleanTitle = titlePart.replace(/[\-\–\—\:]+$/, '').trim();
    
    // Format the date info part (simple cleanup)
    const formattedDateInfo = formatSessionInfo(rawDatePart);

    return { 
      title: cleanTitle, // Can be empty string if header starts with date
      dateInfo: formattedDateInfo 
    };
  }

  // Fallback if no date found
  return { title: rawHeader, dateInfo: '' };
};

export const fetchAndParseData = async (): Promise<{ teachers: Teacher[]; schools: string[] }> => {
  try {
    const response = await fetch(`${CSV_URL}&t=${new Date().getTime()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    // Use robust parser instead of simple split
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) return { teachers: [], schools: [] };

    // Header is row 0
    const rawHeaders = rows[0];

    const teachers: Teacher[] = [];
    const schoolSet = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Skip empty or malformed rows
      if (row.length < 4) continue;

      const lastName = row[1]?.trim() || '';
      const firstName = row[2]?.trim() || '';
      const school = row[3]?.trim() || 'N/D';

      if (!lastName && !firstName) continue;

      schoolSet.add(school);

      // Map to group sessions by Course Title
      const groupsMap = new Map<string, CourseSession[]>();
      let totalHours = 0;
      let lastValidTitle = "";

      // Force iteration from Column F (5) up to Column AX (49)
      for (let j = COL_F_INDEX; j <= COL_AX_INDEX; j++) {
        // Safe access to header and row value
        const rawHeaderName = rawHeaders[j] || '';
        let { title, dateInfo } = parseHeaderInfo(rawHeaderName);
        
        // INHERITANCE LOGIC:
        // If title is missing (header started with date) OR header was completely empty
        // OR header looks like an auto-generated ID (if any), inherit from previous.
        if ((!title || title === "") && lastValidTitle) {
            title = lastValidTitle;
        } else if (title) {
            lastValidTitle = title;
        } else {
            // No title, no last title, no date? Skip or mark unknown
            if (!dateInfo) title = "Altro"; 
            else title = "Corso Sconosciuto";
        }

        const cellValue = row[j]?.trim() || '';
        
        let status: CourseSession['status'] = 'none';
        let hours = 0;

        // Check for asterisk (registration)
        if (cellValue.includes('*')) {
            status = 'registered';
        } 
        // Check for numeric hours (handles "4", "4h", "4 ore", "0")
        else if (cellValue) {
            const numberMatch = cellValue.replace(',', '.').match(/(\d+(\.\d+)?)/);
            if (numberMatch) {
                hours = parseFloat(numberMatch[0]);
                if (hours > 0) {
                    status = 'completed';
                    totalHours += hours;
                } else {
                    // It is 0
                    status = 'absent';
                }
            }
        }

        if (!groupsMap.has(title)) {
            groupsMap.set(title, []);
        }
        
        // Add session even if empty, but we filter later
        groupsMap.get(title)?.push({
            dateInfo: dateInfo || "Data non specificata",
            hours,
            status
        });
      }

      // Convert Map to Array
      // Filter logic: Keep the group ONLY if at least one session is 'registered' or 'completed' or 'absent'
      const courseGroups: CourseGroup[] = Array.from(groupsMap.entries())
        .filter(([_, sessions]) => sessions.some(s => s.status !== 'none'))
        .map(([title, sessions]) => ({
            title,
            sessions // We keep all sessions (even 'none') so user sees the full calendar of that course
        }));

      teachers.push({
        id: `${lastName}-${firstName}-${i}`,
        firstName,
        lastName,
        school,
        courseGroups,
        totalHours
      });
    }

    const schools = Array.from(schoolSet).sort();
    return { teachers, schools };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};