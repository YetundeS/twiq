
export const MarkdownComponents = {
  h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg font-semibold mt-3 mb-1">{children}</h4>,
  h5: ({ children }) => <h5 className="text-base font-medium mt-3 mb-1">{children}</h5>,
  h6: ({ children }) => <h6 className="text-sm font-medium mt-2 mb-1">{children}</h6>,
  p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc ml-6 my-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal ml-6 my-2">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 my-4">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children }) => {
    return inline ? (
      <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded">{children}</code>
    ) : (
      <pre className="bg-gray-900 text-gray-100 text-sm rounded-md p-4 overflow-x-auto my-4">
        <code className={className}>{children}</code>
      </pre>
    );
  },
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="my-4 border-gray-300" />,
};
