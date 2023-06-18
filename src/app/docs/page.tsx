// "use client";
// import React from "react";
// import Test from "../tutor-docs/test.mdx";
// import { s } from "../mdx-components";
// // import { useMDXComponents } from "../mdx-components";

// type Props = {};

// export default function Docs({}: Props) {
//   // const cm = useMDXComponents({});
//   console.log(Test);

//   return (
//     <div className="bg-[#1B1D20] h-full flex-1">
//       <div className="mt-14 max-w-4xl mx-auto">

//         <Test components={s} />
//       </div>
//     </div>
//   );
// }
"use client";
import React from "react";
import DOCS from "./main-docs.mdx";
import { mdxComponents } from "../mdx-components";
import { cx } from "../utils/cs";
import GridOpts from "../components/GridOpts";
// import { useMDXComponents } from "../mdx-components";

type Props = {};

const actions = [
  {
    title: "Assignments",
    href: "/docs/assignments",
    desc: "Docs on assignments",
  },
  {
    title: "Exams",
    href: "/docs/exams",
    desc: "Docs on exams and marking",
  },
];

export default function Docs({}: Props) {
  return (
    <div className="h-full flex-1">
      <div className="mt-14 max-w-4xl mx-auto">
        <GridOpts actions={actions} />
        <div className="prose mx-auto max-w-4xl">
          <DOCS components={mdxComponents} />
        </div>
      </div>
    </div>
  );
}
