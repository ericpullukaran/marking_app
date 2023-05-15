import React from "react";
import { useCopy } from "./utils/useCopy";

type Props = {
  isValid: boolean;
  value: any;
};

const extractMarks = (formValues: any): number[] => {
  const marks: number[] = [];

  formValues.forEach((group: any) => {
    group.milestones.forEach((milestone: any) => {
      milestone.criteria.forEach((criteria: any) => {
        marks.push(criteria.mark);
      });
    });
  });

  return marks;
};

function extractComments(groups: any): string[] {
  return groups.map((group: any) => {
    let milestone_comments: string[] = [];
    // Add milestone comments
    group.milestones.forEach((milestone: any) => {
      if (milestone.milestone_comments.length > 0) {
        milestone_comments.push("[ ");
        milestone_comments.push(`${milestone.milestone_name}:`);
        milestone.milestone_comments.forEach((comment: any) => {
          milestone_comments.push(`${comment}; `);
        });
        milestone_comments.push(" ] ");
      }
    });

    let final_group_message: string = ``;
    // Add group comments
    if (group.comments) {
      final_group_message = `[ ${group.group_name} additional comments: ${group.comments} ]`;
    }
    final_group_message =
      `${milestone_comments.join(" ")} ` + final_group_message;

    return final_group_message;
  });
}

export default function CopyFields({ isValid, value }: Props) {
  const [copyMarks, copiedMarks] = useCopy();
  const [copyComments, copiedComments] = useCopy();

  const handleCopying = (
    evt: any,
    isValid: boolean,
    value: any,
    type: "marks" | "comments"
  ) => {
    if (isValid) {
      evt.preventDefault();
      let dataArray = Object.entries(value.groups)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((da) => da[1]);

      if (type === "marks") {
        copyMarks(extractMarks(dataArray).join("\n"));
      } else {
        copyComments(extractComments(dataArray).join("\n"));
      }
    }
  };

  return (
    <div>
      <button
        className="btn btn-outline fixed top-[50%] left-[3%]"
        onClick={(e) => handleCopying(e, isValid, value, "marks")}
      >
        {!copiedMarks ? (
          <svg
            fill="none"
            className="w-6 h-6 mr-2"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            ></path>
          </svg>
        ) : (
          <svg
            fill="none"
            className="w-6 h-6 mr-2"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
            ></path>
          </svg>
        )}
        Marks
      </button>
      <button
        className="btn btn-outline fixed top-[45%] left-[3%]"
        onClick={(e) => handleCopying(e, isValid, value, "comments")}
      >
        {!copiedComments ? (
          <svg
            fill="none"
            className="w-6 h-6 mr-2"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            ></path>
          </svg>
        ) : (
          <svg
            fill="none"
            className="w-6 h-6 mr-2"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
            ></path>
          </svg>
        )}
        Notes
      </button>
    </div>
  );
}
