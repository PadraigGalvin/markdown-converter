
const FORMAT_HTML = 'html';

/**
 * Translation rules
 *
 * These rules will be applied to the Markdown content in order so more specific
 * rules should be applied first.
 *
 * Pattern and render for chosen format are passed directly to "replace" method
 * so pattern can be string or regex and render can be string or function.
 */
const rules = [
  // Strong text - double underscore
  {
    // Match anything wrapped by double underscores
    pattern: /__(.+?)__/gm,
    html: '<strong>$1</strong>',
  },
  // Strong text - double stars
  {
    // Match anything wrapped by double stars
    pattern: /\*\*(.+?)\*\*/gm,
    html: '<strong>$1</strong>',
  },
  // Emphasized text - single underscores
  {
    // Match anything wrapped by single underscores
    pattern: /_(.+?)_/gm,
    html: '<em>$1</em>',
  },
  // Emphasized text - single stars
  {
    // Match anything wrapped by single stars
    pattern: /\*(.+?)\*/gm,
    html: '<em>$1</em>',
  },
  // Heading 1 - single hash
  {
    // Match exactly one hash with optional trailing hashes and whitespace
    pattern: /^\#(?!\#)[ \t]*(.+?)[ \t]*(?:\#+)?[ \t]*$/gm,
    html: '<h1>$1</h1>',
  },
  // Heading 2 - double hash
  {
    // Match exactly two hashes with optional trailing hashes and whitespace
    pattern: /^\#{2}(?!\#)[ \t]*(.+?)[ \t]*(?:\#+)?[ \t]*$/gm,
    html: '<h2>$1</h2>',
  },
  // Heading 3 - triple hash
  {
    // Match exactly three hashes with optional trailing hashes and whitespace
    pattern: /^\#{3}(?!\#)[ \t]*(.+?)[ \t]*(?:\#+)?[ \t]*$/gm,
    html: '<h3>$1</h3>',
  },
  // Paragraph - double newline
  {
    pattern: /(.*?)(?:(\r|\r?\n){2})/gs,
    html: '<p>$1</p>',
  },
];

/**
 * Escape HTML
 *
 * Use browser to escape HTML by injecting it into a DOM element and taking it
 * out again.
 */
function escapeHtml(unsafe){
  const text = document.createTextNode(unsafe);
  const p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

/**
 * Render Markdown
 *
 * Converts Markdown to requested format.
 */
function render(markdown, format) {
  if (format !== FORMAT_HTML) {
    throw new Error('Unable to render unknown format');
  }

  // Results should contain at least one paragraph
  markdown += '\n\n';

  // Recursively apply each rule to content
  return rules.reduce((content, rule) => {
    return content.replace(rule.pattern, rule[format]);
  }, escapeHtml(markdown));
}

// Wait for document to finish loading
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  // Autofocus on input for usability
  input.focus();

  // Automatically refresh rendered content when typing
  input.addEventListener('keyup', () => {
    output.innerHTML = render(input.value, FORMAT_HTML);
  });
});
