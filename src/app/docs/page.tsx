"use client";

import React from "react";
import Test from "../test.mdx";
import { MDXProvider } from "@mdx-js/react";
import { useMDXComponents } from "../mdx-components";

type Props = {};

export default function Docs({}: Props) {
  const cm = useMDXComponents({});
  return (
    <div className="bg-[#1B1D20] h-full flex-1">
      <div className="mt-14 max-w-4xl mx-auto">
        <MDXProvider components={cm}>
          <Test />
        </MDXProvider>
      </div>
    </div>
  );
}
