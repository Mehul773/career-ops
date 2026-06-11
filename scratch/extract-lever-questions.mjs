import fs from 'fs';
import { parse } from 'node-html-parser';

const html = fs.readFileSync('C:\\Users\\Pramukh\\.gemini\\antigravity\\brain\\148df311-7277-4558-a82e-6dfde74c0b16\\.system_generated\\steps\\246\\content.md', 'utf8');
const root = parse(html);

const questions = root.querySelectorAll('.application-question .text');
questions.forEach((q, i) => {
  console.log(`Q${i+1}: ${q.text.trim()}`);
});
