
// Wait for document to finish loading
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  const buttonRenderHtml = document.getElementById('render-html');
  const buttonRenderWiki = document.getElementById('render-wiki');

  // Set default format
  let outputFormat = markdown.FORMAT_HTML;
  buttonRenderHtml.disabled = true;

  // Pass input to output
  function display() {
    let content = markdown.render(input.value, outputFormat);
    // Preserve fromatting for text based format
    if (outputFormat === markdown.FORMAT_WIKI) {
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
    outputFormat = markdown.FORMAT_HTML;
    display();
  });

  // Switch output format to MediaWiki
  buttonRenderWiki.addEventListener('click', () => {
    buttonRenderHtml.disabled = false;
    buttonRenderWiki.disabled = true;
    outputFormat = markdown.FORMAT_WIKI;
    display();
  });
});
