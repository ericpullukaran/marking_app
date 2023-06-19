import type { MDXComponents } from "mdx/types";
// import CodeBlock from "./utils/CodeBlock";
import SyntaxHighlight from "./utils/SyntaxHighlighting";
import Link from "next/link";

// export function useMDXComponents(components: MDXComponents): MDXComponents {
//   return {
//     h1: ({ children }) => (
//       <h1 className="text-4xl font-bold mb-4">{children}</h1>
//     ),
//     h2: ({ children }) => (
//       <h2 className="text-3xl font-bold mb-3">{children}</h2>
//     ),
//     h3: ({ children }) => (
//       <h3 className="text-2xl font-semibold mb-3">{children}</h3>
//     ),
//     // p: ({ children }) => <p className="text-md mb-2">{children}</p>,
//     // @ts-ignore
//     pre: SyntaxHighlight,
//     // code: ({ children }) => (
//     //   <code className="p-1 bg-gray-700 rounded-md text-accent">{children}</code>
//     // ),
//     ...components,
//   };
// }

export const mdxComponents: MDXComponents = {
  // h1: ({ children }) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
  // h2: ({ children }) => <h2 className="text-3xl font-bold mb-3">{children}</h2>,
  // h3: ({ children }) => (
  //   <h3 className="text-2xl font-semibold mb-3">{children}</h3>
  // ),
  // p: ({ children }) => <p className="text-md mb-2">{children}</p>,
  // @ts-ignore
  pre: SyntaxHighlight,
  code: ({ children }) => (
    <code className="p-1 bg-gray-700 rounded-md text-accent">{children}</code>
  ),
  a: ({
    // separated because it's causing type errors with next/link
    ref,
    ...props
  }) =>
    props.href && props.href.startsWith("/") ? (
      <Link {...props} href={props.href} />
    ) : (
      <a {...props} ref={ref} />
    ),
};
