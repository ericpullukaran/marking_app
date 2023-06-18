import saveAs from "file-saver";
import React from "react";

type Props = {
  fileName: string;
  code: string;
};

export default function FileDownload({ fileName, code }: Props) {
  const handleDownloadClick = () => {
    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${fileName}`);
  };
  return (
    <div className="btn btn-outline normal-case" onClick={handleDownloadClick}>
      <div className="mr-3">{fileName}</div>
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </div>
  );
}
