/**
 * Markdown converter library
 *
 * Assigns itself to global scope and exposes render function and constants for
 * available destination formats.
 */
(function () {
  // External interface
  const markdown = {};

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
    // Heading 1 - triple equals underline
    {
      // Match any line followed by three or more equal signs
      pattern: /^(.+)(?:\r|\r?\n)={3,}$/gm,
      // Newlines ensures seperation from paragraphs
      html: '\n<h1>$1</h1>\n',
      wiki: '= $1 =',
    },
    // Heading 2 - triple dash underline
    {
      // Match any line followed by three or more dashes
      pattern: /^(.+)(?:\r|\r?\n)-{3,}$/gm,
      // Newlines ensures seperation from paragraphs
      html: '\n<h2>$1</h2>\n',
      wiki: '== $1 ==',
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
   * Available destination formats
   *
   * Each rule above must have a corresponding renderer.
   */
  markdown.FORMAT_HTML = 'html';
  markdown.FORMAT_WIKI = 'wiki';

  /**
   * Render Markdown
   *
   * Converts Markdown to requested format.
   */
  markdown.render = (md, format) => {
    if (format !== markdown.FORMAT_HTML && format !== markdown.FORMAT_WIKI) {
      throw new Error('Unable to render unknown format');
    }

    // Results should contain at least one paragraph
    md += '\n\n';

    // Recursively apply each rule to content
    return rules.reduce((content, rule) => {
      return content.replace(rule.pattern, rule[format]);
    }, escapeHtml(md));
  };

  window.markdown = markdown;
}());
