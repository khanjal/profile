#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function loadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error('Failed to read JSON at', p, err.message);
    process.exit(3);
  }
}

const skillsPath = path.resolve(__dirname, '../src/app/data/skills.json');
const experiencesPath = path.resolve(__dirname, '../src/app/data/experiences.json');

const skills = loadJSON(skillsPath);
const experiences = loadJSON(experiencesPath);

const skillNames = new Set(
  skills.map((s) => {
    if (!s) return '';
    if (typeof s === 'string') return s.trim().toLowerCase();
    if (typeof s.name === 'string') return s.name.trim().toLowerCase();
    return String(s).trim().toLowerCase();
  })
);

const missing = new Map();

for (const exp of experiences) {
  const expTitle = exp.company || exp.title || exp.name || '<unknown experience>';
  if (!Array.isArray(exp.skills)) continue;
  for (const sk of exp.skills) {
    const name = (sk || '').toString().trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (!skillNames.has(key)) {
      if (!missing.has(name)) missing.set(name, new Set());
      missing.get(name).add(expTitle);
    }
  }
}

if (missing.size === 0) {
  console.log('OK: All experience skills exist in src/app/data/skills.json');
  process.exit(0);
}

console.error('Missing skills detected:');
for (const [skill, exps] of missing) {
  console.error(`- ${skill}: used in ${[...exps].join('; ')}`);
}
console.error(`\nTotal missing skills: ${missing.size}`);
process.exit(2);
