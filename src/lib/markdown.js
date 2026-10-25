const { renderPresentation } = require("../design-system/technical-clean");

function generateMarkdown(document, designPackage) {
  return renderPresentation(document, designPackage);
}

module.exports = { generateMarkdown };
