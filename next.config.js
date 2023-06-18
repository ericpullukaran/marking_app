/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

const rehypePrettyCode = require("rehype-pretty-code");

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: "dracula",
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty
    // lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push("line--highlighted");
  },
  onVisitHighlightedWord(node, id) {
    node.properties.className = ["word"];

    if (id) {
      // If the word spans across syntax boundaries (e.g. punctuation), remove
      // colors from the child nodes.
      if (node.properties["data-rehype-pretty-code-wrapper"]) {
        node.children.forEach((childNode) => {
          childNode.properties.style = "";
        });
      }

      node.properties.style = "";
      node.properties["data-word-id"] = id;
    }
  },
};

const withMDX = require("@next/mdx")({
  // options: { rehypePlugins: [[rehypePrettyCode, { theme: "one-dark-pro" }]] },
  options: {
    remarkPlugins: [],
    rehypePlugins: [[rehypePrettyCode, options]],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});
module.exports = withMDX(nextConfig);
