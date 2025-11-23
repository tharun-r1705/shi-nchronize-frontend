const SECTION_HEADERS = [
  'about',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'publications',
  'certifications',
  'licenses',
  'volunteer experience',
  'honors & awards',
  'organizations',
  'languages',
];

const SECTION_HEADER_SET = new Set(SECTION_HEADERS.map((header) => header.toLowerCase()));

const cleanLine = (line = '') =>
  line
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const splitLines = (text = '') =>
  text
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => cleanLine(line))
    .filter(Boolean);

const findSectionIndices = (lines) =>
  lines.reduce((acc, line, index) => {
    const key = line.toLowerCase();
    if (SECTION_HEADER_SET.has(key)) {
      acc.push({ header: key, index });
    }
    return acc;
  }, []);

const sliceSection = (lines, header, sectionMap) => {
  const target = sectionMap.find((section) => section.header === header.toLowerCase());
  if (!target) return [];

  const currentIndex = sectionMap.indexOf(target);
  const nextSection = sectionMap[currentIndex + 1];
  const endIndex = nextSection ? nextSection.index : lines.length;
  return lines.slice(target.index + 1, endIndex).filter(Boolean);
};

const parseSkills = (lines) => {
  if (!lines.length) return [];
  const combined = lines.join(' ');
  return combined
    .split(/[,•\-]/)
    .map((skill) => cleanLine(skill))
    .filter((skill) => skill.length > 1)
    .slice(0, 20);
};

const chunkByBlankLines = (lines) => {
  const chunks = [];
  let current = [];

  lines.forEach((line) => {
    if (!line.trim()) {
      if (current.length) {
        chunks.push(current);
        current = [];
      }
      return;
    }
    current.push(line.trim());
  });

  if (current.length) {
    chunks.push(current);
  }

  return chunks;
};

const buildExperienceEntries = (lines) => {
  if (!lines.length) return [];
  const chunks = chunkByBlankLines(lines);

  return chunks.slice(0, 6).map((chunk) => ({
    role: chunk[0] || '',
    organization: chunk[1] || '',
    duration: chunk.find((line) => /\d{4}/.test(line)) || '',
    summary: chunk.slice(2).join(' '),
  }));
};

const buildEducationEntries = (lines) => {
  if (!lines.length) return [];
  const chunks = chunkByBlankLines(lines);

  return chunks.slice(0, 5).map((chunk) => ({
    institution: chunk[0] || '',
    degree: chunk[1] || '',
    duration: chunk.find((line) => /\d{4}/.test(line)) || '',
    summary: chunk.slice(2).join(' '),
  }));
};

const findFirstMatch = (pattern, text) => {
  if (!text) return '';
  const match = text.match(pattern);
  return match ? match[0] : '';
};

const dedupeSkills = (skills = []) => {
  const seen = new Set();
  return skills.filter((skill) => {
    const lower = skill.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
};

const parseContactBlock = (lines) => {
  const blockLimit = Math.min(lines.length, 12);
  const block = lines.slice(0, blockLimit);
  const joined = block.join(' \n ');

  const email = findFirstMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, joined);
  const phone = findFirstMatch(/\+?\d[\d\s().-]{7,}/, joined);
  const linkedinUrl = findFirstMatch(/(?:https?:\/\/)?[\w.-]*linkedin\.com\/[\w\/-]+/i, joined);
  const websites = Array.from(joined.matchAll(/https?:\/\/[^\s]+/gi)).map((match) => match[0]);

  const headline = block[1] && !SECTION_HEADER_SET.has(block[1].toLowerCase()) ? block[1] : '';
  const locationCandidate = block.find((line) => line.includes(',') && !line.toLowerCase().includes('linkedin'));

  return {
    headline,
    location: locationCandidate || '',
    email,
    phone,
    linkedinUrl,
    websites,
  };
};

const parseLinkedInPdf = (rawText = '') => {
  const text = (rawText || '').replace(/\u00a0/g, ' ').trim();
  if (!text) {
    return {
      confidence: 0,
      skills: [],
    };
  }

  const lines = splitLines(text);
  const sections = findSectionIndices(lines);
  const contactInfo = parseContactBlock(lines);

  const nameLine = lines[0] || '';
  const [firstName, ...restName] = nameLine.split(' ').filter(Boolean);
  const lastName = restName.join(' ');

  const summaryLines = sliceSection(lines, 'about', sections);
  const summary = summaryLines.join(' ').trim();

  const skillsSection = sliceSection(lines, 'skills', sections);
  const skills = dedupeSkills(parseSkills(skillsSection));

  const experienceSection = sliceSection(lines, 'experience', sections);
  const experience = buildExperienceEntries(experienceSection);

  const educationSection = sliceSection(lines, 'education', sections);
  const education = buildEducationEntries(educationSection);

  const confidenceScore = [firstName, contactInfo.headline, summary, skills.length ? 'skills' : '']
    .filter(Boolean)
    .length;

  return {
    name: nameLine,
    firstName: firstName || '',
    lastName: lastName || '',
    headline: contactInfo.headline,
    location: contactInfo.location,
    email: contactInfo.email,
    phone: contactInfo.phone,
    linkedinUrl: contactInfo.linkedinUrl,
    websites: contactInfo.websites,
    summary,
    skills,
    experience,
    education,
    confidence: confidenceScore,
  };
};

module.exports = {
  parseLinkedInPdf,
};
