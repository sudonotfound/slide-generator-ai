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

module.exports = { loadAndValidate };
