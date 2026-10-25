#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { loadAndValidate, loadDesignPackage, loadDesignPackageForDocument, validateDocumentAgainstDesign } = require("./lib/validate");
const { generateMarkdown } = require("./lib/markdown");

function printUsage() {
  console.log(`Usage:
  node src/cli.js validate <presentation.json>
  node src/cli.js validate-design <design-package-directory>
  node src/cli.js markdown <presentation.json> [--output <file>]
  node src/cli.js render <presentation.json> [--output <file>] [--markdown-output <file>] [--format html|pdf|png]

Examples:
  npm run validate
  npm run markdown
  npm run render`);
}

function readOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function defaultMarkdownPath(inputPath) {
  return path.join("dist", `${path.basename(inputPath, path.extname(inputPath))}.md`);
}

function defaultRenderPath(inputPath, format) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  return format === "png"
    ? path.join("dist", `${baseName}-images`)
    : path.join("dist", `${baseName}.${format}`);
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function writeMarkdown(document, inputPath, outputPath, designPackage) {
  const markdown = generateMarkdown(document, designPackage);
  const target = outputPath || defaultMarkdownPath(inputPath);
  ensureParent(target);
  fs.writeFileSync(target, markdown, "utf8");
  return target;
}

function marpBinary() {
  const binaryName = process.platform === "win32" ? "marp.cmd" : "marp";
  return path.resolve(__dirname, "..", "node_modules", ".bin", binaryName);
}

function renderWithMarp(markdownPath, outputPath, format) {
  const args = [markdownPath, "--output", outputPath];
  if (format === "html") args.push("--html");
  if (format === "pdf") args.push("--pdf");
  if (format === "png") args.push("--images");

  const result = spawnSync(marpBinary(), args, {
    encoding: "utf8",
    stdio: "inherit"
  });

  if (result.error) {
    throw new Error(`Marp CLI could not be started. Run npm install first. ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`Marp CLI failed with exit code ${result.status}`);
  }
}

function main() {
  const [, , command, input = "examples/sample-lt.json", ...options] = process.argv;
  if (!command || !["validate", "validate-design", "markdown", "render"].includes(command)) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (command === "validate-design") {
    const design = loadDesignPackage(input);
    console.log(`Valid design package: ${input}`);
    console.log(`Foundation: ${design.foundation.name} (${design.foundation.version})`);
    console.log(`Template: ${design.template.name} (${design.template.version})`);
    return;
  }

  const document = loadAndValidate(input);
  const designPackage = loadDesignPackageForDocument(document, input);
  validateDocumentAgainstDesign(document, designPackage);

  if (command === "validate") {
    console.log(`Valid: ${input}`);
    console.log(`Slides: ${document.slides.length}`);
    return;
  }

  if (command === "markdown") {
    const markdownPath = writeMarkdown(document, input, readOption(options, "--output"), designPackage);
    console.log(`Generated: ${markdownPath}`);
    return;
  }

  if (command === "render") {
    const markdownPath = writeMarkdown(document, input, readOption(options, "--markdown-output"), designPackage);
    console.log(`Generated: ${markdownPath}`);
    const format = readOption(options, "--format") || "html";
    if (!["html", "pdf", "png"].includes(format)) {
      throw new Error(`Unsupported format: ${format}`);
    }
    const outputPath = readOption(options, "--output") || defaultRenderPath(input, format);
    ensureParent(outputPath);
    renderWithMarp(markdownPath, outputPath, format);
    console.log(`Rendered: ${outputPath}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
