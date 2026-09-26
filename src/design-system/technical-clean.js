const { escapeAttribute, escapeHtml } = require("../lib/escape");

const themeCss = `
:root {
  --tc-ink: #172033;
  --tc-muted: #60708a;
  --tc-accent: #2463eb;
  --tc-accent-soft: #eaf1ff;
  --tc-border: #d9e1ee;
  --tc-surface: #ffffff;
  --tc-surface-soft: #f5f8fc;
}

section {
  background: #f8fafc;
  color: var(--tc-ink);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 64px 76px;
}

section::after {
  color: var(--tc-muted);
  font-size: 14px;
}

.slide { height: 100%; display: flex; flex-direction: column; gap: 26px; }
.slide__header { display: flex; flex-direction: column; gap: 8px; }
.slide__eyebrow { color: var(--tc-accent); font-size: 18px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.slide__title { font-size: 48px; line-height: 1.1; margin: 0; letter-spacing: -.03em; }
.slide__message { color: var(--tc-muted); font-size: 22px; line-height: 1.45; margin: 0; }
.slide__main { flex: 1; min-height: 0; }
.slide__footer { color: var(--tc-muted); font-size: 15px; margin-top: auto; }
.slide--cover-hero { justify-content: center; }
.slide--cover-hero .slide__title { font-size: 64px; max-width: 900px; }
.slide--cover-hero .slide__main { flex: 0; }
.slide--closing { justify-content: center; text-align: center; }
.slide--closing .slide__title, .slide--closing .slide__message { margin-left: auto; margin-right: auto; }
.slide--message .slide__main { display: flex; flex-direction: column; justify-content: center; }
.slide--two-column .slide__main { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.slide--process .slide__main { display: flex; align-items: center; }
.region { min-width: 0; }
.region--empty { display: none; }
.body-text { font-size: 25px; line-height: 1.55; }
.body-text--small { font-size: 18px; }
.quote { border-left: 8px solid var(--tc-accent); background: var(--tc-accent-soft); border-radius: 0 16px 16px 0; color: var(--tc-ink); font-size: 34px; line-height: 1.35; margin: 0 0 24px; padding: 24px 30px; }
.card-grid { display: grid; gap: 16px; }
.card { background: var(--tc-surface); border: 1px solid var(--tc-border); border-radius: 16px; box-shadow: 0 8px 24px rgba(23, 32, 51, .06); padding: 22px 24px; }
.card__label { color: var(--tc-accent); font-size: 16px; font-weight: 700; }
.card__text { font-size: 24px; font-weight: 700; margin-top: 8px; }
.process { align-items: stretch; display: flex; gap: 14px; list-style: none; margin: 0; padding: 0; width: 100%; }
.process__step { background: var(--tc-surface); border: 1px solid var(--tc-border); border-radius: 16px; flex: 1; font-size: 23px; font-weight: 700; padding: 28px 20px; position: relative; text-align: center; }
.process__step:not(:last-child)::after { color: var(--tc-accent); content: "→"; font-size: 28px; position: absolute; right: -23px; top: 50%; }
`;

function renderHeading(node) {
  const level = node.variant === "small" ? 3 : 1;
  const className = level === 3 ? "slide__title slide__title--small" : "slide__title";
  return `<h${level} class="${className}">${escapeHtml(node.props.text || "")}</h${level}>`;
}

function renderBodyText(node) {
  const className = node.variant === "small" ? "body-text body-text--small" : "body-text";
  return `<p class="${className}">${escapeHtml(node.props.text || "")}</p>`;
}

function renderQuote(node) {
  return `<blockquote class="quote">${escapeHtml(node.props.text || "")}</blockquote>`;
}

function renderCardGrid(node) {
  const items = Array.isArray(node.props.items) ? node.props.items : [];
  const cards = items
    .map((item, index) => `<div class="card"><div class="card__label">${String(index + 1).padStart(2, "0")}</div><div class="card__text">${escapeHtml(item)}</div></div>`)
    .join("\n");
  return `<div class="card-grid">${cards}</div>`;
}

function renderProcessDiagram(node) {
  const steps = Array.isArray(node.props.steps) ? node.props.steps : [];
  const items = steps.map((step) => `<li class="process__step">${escapeHtml(step)}</li>`).join("\n");
  return `<ol class="process">${items}</ol>`;
}

function renderBulletList(node) {
  const items = Array.isArray(node.props.items) ? node.props.items : [];
  return `<ul class="body-text">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}</ul>`;
}

function renderCodeBlock(node) {
  const language = escapeAttribute(node.props.language || "text");
  return `<pre><code class="language-${language}">${escapeHtml(node.props.code || "")}</code></pre>`;
}

const componentRegistry = {
  "slide-heading": renderHeading,
  "body-text": renderBodyText,
  quote: renderQuote,
  "card-grid": renderCardGrid,
  "process-diagram": renderProcessDiagram,
  "bullet-list": renderBulletList,
  "code-block": renderCodeBlock
};

function renderComponent(node) {
  if (!node || typeof node !== "object") throw new Error("Component node must be an object");
  const component = node.component;
  const renderer = componentRegistry[component];
  if (!renderer) {
    throw new Error(`Unknown component: ${component}. Register it in src/design-system/technical-clean.js`);
  }
  const html = renderer(node);
  const children = Array.isArray(node.children) ? node.children.map(renderComponent).join("\n") : "";
  return `${html}${children}`;
}

function renderRegion(nodes = []) {
  if (!Array.isArray(nodes) || nodes.length === 0) return "";
  return nodes.map(renderComponent).join("\n");
}

function renderHeader(slide) {
  const header = renderRegion(slide.regions.header);
  const title = header || `<h1 class="slide__title">${escapeHtml(slide.message)}</h1>`;
  return `<header class="slide__header">${title}</header>`;
}

function renderTemplate(slide) {
  const template = slide.pageTemplate;
  const title = escapeHtml(slide.message);
  const classes = `slide slide--${escapeAttribute(template)}`;
  const header = renderHeader(slide);
  const footer = "";

  switch (template) {
    case "cover-hero":
      return `<div class="${classes}">${header}<main class="slide__main">${renderRegion(slide.regions.main) || `<p class="slide__message">${title}</p>`}</main>${footer}</div>`;
    case "message":
      return `<div class="${classes}">${header}<main class="slide__main">${renderRegion(slide.regions.main)}</main>${footer}</div>`;
    case "two-column":
      return `<div class="${classes}">${header}<main class="slide__main"><div class="region">${renderRegion(slide.regions.left)}</div><div class="region">${renderRegion(slide.regions.right)}</div></main>${footer}</div>`;
    case "process":
      return `<div class="${classes}">${header}<main class="slide__main">${renderRegion(slide.regions.main)}</main>${footer}</div>`;
    case "closing":
      return `<div class="${classes}">${header}<main class="slide__main">${renderRegion(slide.regions.main)}</main>${footer}</div>`;
    default:
      throw new Error(`Unknown page template: ${template}`);
  }
}

function renderSlide(slide, index) {
  const pageClass = index === 0 ? " lead" : "";
  const notes = slide.speakerNotes ? `\n<!-- Speaker notes: ${escapeHtml(slide.speakerNotes)} -->` : "";
  return `<!-- _class: ${escapeAttribute(slide.pageTemplate)}${pageClass} -->\n${renderTemplate(slide)}${notes}`;
}

function renderTechnicalClean(document) {
  const frontMatter = [
    "---",
    "marp: true",
    "theme: default",
    "paginate: true",
    "size: 16:9",
    "---",
    `<style>${themeCss}</style>`
  ].join("\n");
  const slides = document.slides.map(renderSlide).join("\n\n---\n\n");
  return `${frontMatter}\n\n${slides}\n`;
}

const themeRegistry = {
  "lt-technical-clean": renderTechnicalClean
};

function renderPresentation(document) {
  const theme = document.meta && document.meta.theme;
  const renderer = themeRegistry[theme];
  if (!renderer) {
    throw new Error(`Unknown theme: ${theme}. Available themes: ${Object.keys(themeRegistry).join(", ")}`);
  }
  return renderer(document);
}

module.exports = {
  componentRegistry,
  renderComponent,
  renderPresentation,
  themeCss,
  themeRegistry
};
