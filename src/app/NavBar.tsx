import React from "react";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <div className="navbar h-20 bg-[#26262A] ">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl " href="/">
          CS6080 - Marking App
        </a>
      </div>

      <a
        href="/docs"
        className="flex-none btn bg-[#26262A] border border-[#4D4D4D] border-opacity-40 mr-4"
      >
        Docs
      </a>
    </div>
  );
}
