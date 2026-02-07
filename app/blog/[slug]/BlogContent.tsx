"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 pb-2 border-b border-purple-100">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-bold text-gray-800 mt-6 mb-2">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-bold text-gray-800">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-600">{children}</em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-purple-500 hover:text-purple-600 underline underline-offset-2 transition-colors"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-purple-200 pl-4 my-4 text-gray-500 italic">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            const lang = className?.replace("language-", "") || "";
            return (
              <div className="relative mb-4">
                {lang && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-800 rounded-bl">
                    {lang}
                  </div>
                )}
                <code className="block bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre">
                  {children}
                </code>
              </div>
            );
          }
          return (
            <code className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <div className="mb-4">{children}</div>,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-purple-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-gray-200 px-3 py-2 text-left font-bold text-gray-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 px-3 py-2 text-gray-600">
            {children}
          </td>
        ),
        hr: () => <hr className="my-8 border-purple-100" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
