"use client";

import React from "react";
import ASS1 from "./ASS1.mdx";
import { mdxComponents } from "@/app/mdx-components";

type Props = {};

export default function page({}: Props) {
  return (
    <div>
      <div className="prose mx-auto max-w-4xl">
        <ASS1 components={mdxComponents} />
      </div>
    </div>
  );
}
