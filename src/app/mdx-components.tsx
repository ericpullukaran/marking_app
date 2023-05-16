import type { MDXComponents } from "mdx/types";
import CodeBlock from "./utils/CodeBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mb-3">{children}</h3>
    ),
    p: ({ children }) => <p className="text-md mb-2">{children}</p>,
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    code: ({ children }) => (
      <code className="p-2 bg-gray-800 text-white rounded-md">{children}</code>
    ),
    ...components,
  };
}
