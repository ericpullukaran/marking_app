"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCopy } from "./useCopy";
import { visit } from "unist-util-visit";
import { useHydrated } from "./use-hydrated";
import { saveAs } from "file-saver";
import { cx } from "./cs";

/**
 * Shows `bottom` when `toggled` is true, otherwise shows `top`.
 *
 * Yoinked and slightly changed from https://github.com/soorria/soorria.com/blob/main/src/components/mdx/utils.tsx#L68-L92
 */
const ToggleSlide = ({
  top,
  bottom,
  toggled,
}: {
  top: ReactNode;
  bottom: ReactNode;
  toggled: boolean;
}) => {
  return (
    <span className="inline-grid overflow-hidden">
      <span
        className={cx(
          "col-start-1 row-start-1 transition-transform",
          toggled && "-translate-y-full"
        )}
      >
        {top}
      </span>
      <span
        className={cx(
          "col-start-1 row-start-1 transition-transform",
          !toggled && "translate-y-full"
        )}
      >
        {bottom}
      </span>
    </span>
  );
};

export default function SyntaxHighlight({
  className,
  children,
  ...rest
}: {
  className: string;
  children: ReactNode;
}) {
  const [copy, copied] = useCopy();
  const [download, downloaded] = useCopy();
  const hydrated = useHydrated();
  const pre = useRef<HTMLPreElement>(null);
  const cont = useRef<HTMLDivElement>(null);
  const cBlock = useRef<HTMLElement>(null);
  const [showFullCode, setShowFullCode] = useState(true);

  const getCodeLinesFromPre = (
    pre: HTMLPreElement | undefined | null
  ): string => {
    if (!pre) return "";

    const firstCodeChild = Array.from(pre.children).find(
      (el: Element) => el.tagName === "CODE"
    );
    if (!firstCodeChild) return pre.innerText;

    return Array.from(firstCodeChild.children)
      .map((line) => (line as HTMLElement).innerText || "")
      .join("\n");
  };

  const handleCopyClick = () => {
    copy(getCodeLinesFromPre(pre.current));
  };

  const handleDownloadClick = () => {
    download(getCodeLinesFromPre(pre.current));
    if (hasTitle && cont.current) {
      const fileName = (cont.current.parentNode?.firstChild as Element)
        .textContent;
      const blob = new Blob([getCodeLinesFromPre(pre.current)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${fileName}`);
    }
  };

  const [hasTitle, setHasTitle] = useState(false);

  useEffect(() => {
    setHasTitle(
      cont.current?.parentNode?.firstChild
        ? (cont.current.parentNode.firstChild as Element).hasAttribute(
            "data-rehype-pretty-code-title"
          )
        : false
    );
  }, []);

  const hasLines = cBlock.current?.hasAttribute("data-line-numbers");
  useEffect(() => {
    setShowFullCode(
      cBlock.current?.hasAttribute("data-line-numbers") ? false : true
    );
  }, []);

  return (
    <div
      ref={cont}
      className={`relative bg-teal-800 p-2 rounded-xl ${
        hasTitle ? "rounded-tl-none" : ""
      }`}
    >
      {hydrated && (
        <div className="absolute z-30 flex gap-3 items-center top-0 right-0 m-7 mb-2">
          <button
            onClick={handleCopyClick}
            className="btn btn-sm btn-outline btn-accent p-2 rounded-lg"
          >
            <ToggleSlide top="Copied!" bottom="Copy" toggled={!copied} />
          </button>
          {hasTitle && (
            <button
              onClick={handleDownloadClick}
              className="btn btn-sm btn-accent rounded-lg"
            >
              <ToggleSlide
                top={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                }
                bottom={
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
                }
                toggled={!downloaded}
              />
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <pre
          ref={pre}
          className={`bg-[#1B1D20] py-4 rounded-md overflow-x-auto ${
            showFullCode ? "" : "h-32 overflow-y-scroll"
          }`}
        >
          {hydrated && !showFullCode && (
            <div className="absolute bottom-0 py-2 bg-white/5 w-full flex justify-center ">
              <button
                onClick={() => setShowFullCode(true)}
                className="btn btn-accent btn-sm"
              >
                expand
              </button>
            </div>
          )}
          <code
            ref={cBlock}
            {...(children as any).props}
            className="bg-transparent block"
          />
        </pre>
      </div>
    </div>
  );
}
