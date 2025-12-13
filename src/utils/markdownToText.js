/**
 * Converts markdown to plain text
 *
 * This is a pragmatic regex-based approach that handles common markdown syntax.
 * For more complex scenarios, consider using remark-strip-markdown.
 *
 * Handles:
 * - Code blocks (```code```)
 * - Inline code (`code`)
 * - Bold/italic (**text**, *text*, __text__, _text_)
 * - Links ([text](url))
 * - Images (![alt](url))
 * - Headers (# Header)
 * - Blockquotes (> quote)
 * - Lists (-, *, +, 1.)
 * - Horizontal rules (---, ***, ___)
 * - Strikethrough (~~text~~)
 * - Tables (| cell |)
 *
 * @param {string} markdown - Markdown string to convert
 * @returns {string} - Plain text without markdown formatting
 */
export const markdownToPlainText = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  let text = markdown;

  // Remove code blocks first (to avoid processing their contents)
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    // Extract code content without backticks
    const code = match.replace(/```(?:\w+)?\n?/g, '').trim();
    return code;
  });

  // Remove inline code but keep content
  text = text.replace(/`([^`]+)`/g, '$1');

  // Remove images (they have no text value)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // Convert links to just their text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove strikethrough but keep content
  text = text.replace(/~~([^~]+)~~/g, '$1');

  // Remove bold/italic (handle ** and __ before * and _)
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');

  // Remove headers but keep content
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove blockquotes but keep content
  text = text.replace(/^>\s+/gm, '');

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '');

  // Remove list markers but keep content
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove task list markers
  text = text.replace(/^[\s]*[-*+]\s+\[[ xX]\]\s+/gm, '');

  // Handle tables - remove table syntax but keep content
  text = text.replace(/\|/g, ' ');
  text = text.replace(/^[\s]*:?-+:?[\s]*$/gm, '');

  // Remove HTML tags (in case rehype-raw allows them)
  text = text.replace(/<[^>]+>/g, '');

  // Clean up multiple spaces
  text = text.replace(/[ \t]+/g, ' ');

  // Clean up multiple newlines (max 2 consecutive)
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim each line
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  return text.trim();
};

export default markdownToPlainText;
