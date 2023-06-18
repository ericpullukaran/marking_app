"use client";
import GridOpts from "@/app/components/GridOpts";
import React from "react";
import FAQ from "./ASS-FAQ.mdx";
import { mdxComponents } from "@/app/mdx-components";

type Props = {};

const actions = [
  {
    title: "Ass1",
    href: "/docs/assignments/ass1",
    desc: "Assignment 1",
  },
  {
    title: "Ass2",
    href: "/docs/assignments/ass2",
    desc: "Assignment 2",
  },
  {
    title: "Ass3",
    href: "/docs/assignments/ass3",
    desc: "Assignment 3",
  },
  {
    title: "Ass4",
    href: "/docs/assignments/ass4",
    desc: "Assignment 4",
  },
];

export default function Page({}: Props) {
  return (
    <div className="bg-[#1B1D20] h-full flex-1">
      <div className="max-w-4xl mx-auto">
        <GridOpts actions={actions} />
        <div className="prose mx-auto max-w-4xl">
          <FAQ components={mdxComponents} />
        </div>
      </div>
    </div>
  );
}
