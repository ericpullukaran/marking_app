"use client";

import React, { ChangeEvent, useContext, useState } from "react";
import { MarkingSchemaContext } from "./MarkingSchemaContext";

type Props = {};

export default function NavBar({}: Props) {
  const context = useContext(MarkingSchemaContext);
  if (!context) {
    return <>"Loading..."</>;
  }
  const { markingSchema, updateMarkingSchema } = context;

  const [jsonFileContent, setJsonFileContent] = useState<Record<
    string,
    unknown
  > | null>(markingSchema);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target !== null) {
        try {
          const result = JSON.parse(event.target.result as string);
          setJsonFileContent(result);
          updateMarkingSchema(result);
          localStorage.setItem("marking_schema", JSON.stringify(result));
          console.log(result);
        } catch (error) {
          console.error("Error occurred while parsing JSON file:", error);
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="navbar bg-base-100 h-20">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">
          CS6080 - Marking App
        </a>
      </div>
      <div className="flex-none">
        <input
          type="file"
          onChange={handleFileUpload}
          className="file-input w-full max-w-xs"
        />
      </div>
    </div>
  );
}
