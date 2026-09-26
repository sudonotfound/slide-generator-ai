const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { loadAndValidate } = require("../src/lib/validate");
const { generateMarkdown } = require("../src/lib/markdown");

const samplePath = path.resolve(__dirname, "..", "examples", "sample-lt.json");

test("sample slide document validates and renders to Marp Markdown", () => {
  const document = loadAndValidate(samplePath);
  const markdown = generateMarkdown(document);

  assert.equal(document.slides.length, 6);
  assert.match(markdown, /marp: true/);
  assert.match(markdown, /AIと一緒にLT資料を作る/);
  // Two frontmatter delimiters plus one separator between each pair of slides.
  assert.equal((markdown.match(/^---$/gm) || []).length, 7);
});

test("sample JSON remains available as a checked-in source document", () => {
  assert.equal(fs.existsSync(samplePath), true);
});
