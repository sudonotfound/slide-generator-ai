const fs = require("node:fs");
const path = require("node:path");
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const schemaDirectory = path.resolve(__dirname, "..", "..", "schemas");

function loadSchema(fileName) {
  return JSON.parse(fs.readFileSync(path.join(schemaDirectory, fileName), "utf8"));
}

function createValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const schemas = [
    "presentation-context.schema.json",
    "assumptions.schema.json",
    "narrative-plan.schema.json",
    "slide-document.schema.json"
  ];
  for (const schema of schemas) {
    ajv.addSchema(loadSchema(schema), schema);
  }
  return ajv;
}

function loadAndValidate(filePath) {
  const absolutePath = path.resolve(filePath);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const ajv = createValidator();
  const validate = ajv.getSchema("slide-document.schema.json") || ajv.compile(loadSchema("slide-document.schema.json"));

  if (!validate(document)) {
    const details = validate.errors
      .map((error) => `${error.instancePath || "/"} ${error.message}`)
      .join("\n");
    throw new Error(`Slide document validation failed:\n${details}`);
  }
  return document;
}

function validateAgainstSchema(value, schemaFile, label) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(loadSchema(schemaFile));
  if (!validate(value)) {
    const details = validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("\n");
    throw new Error(`${label} validation failed:\n${details}`);
  }
}

function loadDesignPackage(packagePath) {
  const directory = path.resolve(packagePath);
  const templatePath = path.join(directory, "template.json");
  const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
  validateAgainstSchema(template, "presentation-template.schema.json", "Presentation template");
  const foundationPath = path.resolve(path.dirname(templatePath), template.designFoundation);
  const foundation = JSON.parse(fs.readFileSync(foundationPath, "utf8"));
  validateAgainstSchema(foundation, "design-foundation.schema.json", "Design foundation");
  const supportedLayouts = new Set(["cover-hero", "message", "two-column", "process", "closing"]);
  const supportedComponents = new Set(["slide-heading", "body-text", "quote", "card-grid", "process-diagram", "bullet-list", "code-block"]);
  for (const [layout, contract] of Object.entries(template.pageTemplates)) {
    if (!supportedLayouts.has(layout)) throw new Error(`Unsupported page template in current renderer: ${layout}`);
    for (const component of contract.allowedComponents) {
      if (!supportedComponents.has(component)) throw new Error(`Unsupported component in current renderer: ${component}`);
    }
  }
  return { directory, template, foundation };
}

function loadDesignPackageForDocument(document, documentPath) {
  const reference = document.meta && document.meta.designPackage;
  if (!reference) return undefined;
  return loadDesignPackage(path.resolve(path.dirname(path.resolve(documentPath)), reference));
}

function validateDocumentAgainstDesign(document, designPackage) {
  if (!designPackage) return;
  const { template } = designPackage;
  for (const [index, slide] of document.slides.entries()) {
    const page = template.pageTemplates[slide.pageTemplate];
    if (!page) throw new Error(`Slide ${slide.id}: unknown page template "${slide.pageTemplate}"`);
    for (const region of Object.keys(slide.regions)) {
      if (!page.regions.includes(region)) throw new Error(`Slide ${slide.id}: region "${region}" is not allowed by ${slide.pageTemplate}`);
    }
    const visit = (node) => {
      if (!page.allowedComponents.includes(node.component)) {
        throw new Error(`Slide ${slide.id}: component "${node.component}" is not allowed by ${slide.pageTemplate}`);
      }
      (node.children || []).forEach(visit);
    };
    Object.values(slide.regions).flat().forEach(visit);
    if (index > 0 && template.rules?.maxConsecutiveSamePageTemplate) {
      let run = 1;
      for (let prior = index - 1; prior >= 0 && document.slides[prior].pageTemplate === slide.pageTemplate; prior -= 1) run += 1;
      if (run > template.rules.maxConsecutiveSamePageTemplate) {
        throw new Error(`Slide ${slide.id}: ${run} consecutive ${slide.pageTemplate} slides exceed template limit`);
      }
    }
  }
}

module.exports = { loadAndValidate, loadDesignPackage, loadDesignPackageForDocument, validateAgainstSchema, validateDocumentAgainstDesign };
