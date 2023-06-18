"use client";

import React from "react";
import ASS3 from "./ASS3.mdx";
import { mdxComponents } from "@/app/mdx-components";

type Props = {};

export default function page({}: Props) {
  return (
    <div>
      <div className="prose mx-auto max-w-4xl">
        <ASS3 components={mdxComponents} />
      </div>
    </div>
  );
}
