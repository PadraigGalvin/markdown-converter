
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
  // Strong text - double underscores or stars
  {
    // Match anything wrapped by double underscores or stars
    pattern: /(__|\*\*)(.+?)\1/gm,
    html: '<strong>$2</strong>',
    wiki: "'''$2'''",
  },
  // Emphasized text - single underscores or stars
  {
    // Match anything wrapped by single underscores or stars
    pattern: /(_|\*)(.+?)\1/gm,
    html: '<em>$2</em>',
    wiki: "''$2''",
  },
  // Heading 1 to 6 - hashes on own line
  {
    // Match one to six hashes with optional trailing hashes and whitespace
    pattern: /^(\#{1,6})(?!\#)[ \t]*(.+?)[ \t]*(?:\#+)?[ \t]*$/gm,
    html: (match, hashes, text) => {
      const level = hashes.length;
      // Newlines ensures seperation from paragraphs
      return `\n<h${level}>${text}</h${level}>\n`;
    },
    wiki: (match, hashes, text) => {
      const tag = '='.repeat(hashes.length);
      return `${tag} ${text} ${tag}`;
    },
  },
  // Paragraph - double newline
  {
    pattern: /\s*(.*?)\s*(?:(\r|\r?\n){2})/gs,
    html: (match, p1) => {
      // Don't wrap headers in paragraphs (invalid HTML)
      if (/^(?:<h\d>)(.*)(?:<\/h\d>)$/.test(p1)) {
        return p1;
      }
      return `<p>${p1}</p>`;
    },
    wiki: '$1\n\n',
  },
];

/**
 * Available destination formats
 *
 * Each rule above must have a corresponding renderer.
 */
const FORMAT_HTML = 'html';
const FORMAT_WIKI = 'wiki';

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
  if (format !== FORMAT_HTML && format !== FORMAT_WIKI) {
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

  const buttonRenderHtml = document.getElementById('render-html');
  const buttonRenderWiki = document.getElementById('render-wiki');

  // Set default format
  let outputFormat = FORMAT_HTML;
  buttonRenderHtml.disabled = true;

  // Pass input to outup
  function display() {
    let content = render(input.value, outputFormat);
    // Preserve fromatting for text based format
    if (outputFormat === FORMAT_WIKI) {
      content = `<pre>${content}</pre>`;
    }
    output.innerHTML = content;
  }

  // Autofocus on input for usability
  input.focus();

  // Automatically refresh rendered content when typing
  input.addEventListener('keyup', display);

  // Switch output format to HTML
  buttonRenderHtml.addEventListener('click', () => {
    buttonRenderHtml.disabled = true;
    buttonRenderWiki.disabled = false;
    outputFormat = FORMAT_HTML;
    display();
  });

  // Switch output format to MediaWiki
  buttonRenderWiki.addEventListener('click', () => {
    buttonRenderHtml.disabled = false;
    buttonRenderWiki.disabled = true;
    outputFormat = FORMAT_WIKI;
    display();
  });
});
