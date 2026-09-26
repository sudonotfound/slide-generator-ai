const { renderPresentation } = require("../design-system/technical-clean");

function generateMarkdown(document) {
  return renderPresentation(document);
}

module.exports = { generateMarkdown };
