import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-900 border-b border-gray-200 pb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="my-4 text-gray-700 leading-8">{children}</p>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside my-4 space-y-1 text-gray-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside my-4 space-y-1 text-gray-700">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-7">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-4 text-gray-500 italic">{children}</blockquote>
        ),
        // インラインコード (`code`)
        code: ({ className, children, ...props }) => {
          const isBlock = !!className;
          return isBlock ? (
            <code className={`${className} text-sm`} {...props}>{children}</code>
          ) : (
            <code className="bg-gray-100 text-red-600 text-sm px-1.5 py-0.5 rounded font-mono" {...props}>
              {children}
            </code>
          );
        },
        // コードブロック (```lang)
        pre: ({ children }) => (
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto text-sm leading-6">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200 text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-gray-50 border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 px-4 py-2 text-gray-700">{children}</td>
        ),
        hr: () => <hr className="my-8 border-gray-200" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
