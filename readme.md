
Markdown Converter
==================

Simple markdown to HTML or MediaWiki format converter developed as solution to
interview test.

To run the project just download the code and open `index.html` in your browser.

Notes
-----

My research shows that most Markdown parsers tokenize the content before
rendering, much like a compiler would. Given the complexity and time required
for implementing such a solution I have chosen a simpler Regex rule based method
instead. While simpler to implement it should be noted that this method is more
sensitive, error prone and probably not suited to production use.

In choosing the technology to use I considered using Typescript and possibly
some automated testing but finally decided to work without any external
dependencies to simplify use and keep the scope minimal to improve code
readability.

Since cross browser compatibility is not a concern I have made free use of newer
JavaScript and CSS features. While it would not require much work, no effort was
made to make the site responsive either.

Development was done with Chromium 73 on Ubuntu 18.04.
