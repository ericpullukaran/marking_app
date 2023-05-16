"use client";
import React, { ChangeEvent } from "react";

import { useSyncedLocalStorage as useLocalStorage } from "./utils/useSyncedLocalStorage";
import MarkingApp from "./marking/MarkingApp";

type Props = {};

export default function index({}: Props) {
  const [jsonFileContent, setJsonFileContent] = useLocalStorage(
    "marking_schema",
    {}
  );
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
          localStorage.setItem("marking_schema", JSON.stringify(result));
        } catch (error) {
          console.error("Error occurred while parsing JSON file:", error);
        }
      }
    };

    reader.readAsText(file);
  };
  return (
    <div className="flex-1 bg-[#1B1D20]">
      {JSON.stringify(jsonFileContent) === "{}" && (
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mt-6 mb-2">
              Upload marking schema here
            </h2>

            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input w-full max-w-xs"
            />
          </div>
        </div>
      )}

      {JSON.stringify(jsonFileContent) !== "{}" && (
        <div>
          <MarkingApp schema={jsonFileContent} />
        </div>
      )}
      {JSON.stringify(jsonFileContent) !== "{}" && (
        <div className="w-full py-8 grid place-content-center">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => {
              setJsonFileContent({});
              localStorage.setItem("marking_schema", JSON.stringify({}));
              localStorage.removeItem("formValues");
              localStorage.removeItem("selectValues");
              localStorage.removeItem("milestoneCommentsHistory");
            }}
          >
            Reset Everything
          </button>
        </div>
      )}
    </div>
  );
}
