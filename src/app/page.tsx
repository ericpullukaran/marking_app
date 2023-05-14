"use client";

import {
  Field,
  FieldArray,
  FieldArrayItem,
  Form,
  FormInstance,
} from "houseform";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { MarkingSchemaContext } from "./MarkingSchemaContext";
import GroupField from "./GroupField";
import useLocalStorage from "./utils/useSyncedLocalStorage";

export type Milestone = {
  criteria: string[];
};

export type Group = {
  [key: string]: Milestone;
};

export type MarkingComments = {
  [key: string]: Group;
};

type FormCriteria = {
  criteria_name: string;
  mark: number;
};

type FormMilestones = {
  milestone_name: string;
  criteria: FormCriteria[];
};
type FormGroups = {
  group_name: string;
  comments: string;
  milestones: FormMilestones[];
};
type FormValues = {
  groups: FormGroups[];
};

const extractMarks = (formValues: FormValues): number[] => {
  const marks: number[] = [];

  formValues.groups.forEach((group) => {
    group.milestones.forEach((milestone) => {
      milestone.criteria.forEach((criteria) => {
        marks.push(criteria.mark);
      });
    });
  });

  return marks;
};

function copyListToClipboard(list: number[]): void {
  const listString = list.join("\n");
  navigator.clipboard
    .writeText(listString)
    .then(() => {
      console.log("List copied to clipboard");
    })
    .catch((error) => {
      console.error("Failed to copy list to clipboard:", error);
    });
}

export default function Home() {
  const context = useContext(MarkingSchemaContext);
  const [localStorage, setLocalStorage] = useLocalStorage("mark_values", []);

  if (!context) {
    return <>Loading...</>;
  }

  const { markingSchema, updateMarkingSchema } = context;
  if (!context.markingSchema) {
    return <>Loading...</>;
  }
  // this is the value of the form ref.current.value
  return (
    <main className="prose flex flex-col items-center justify-between p-24 bg-[#1B1D20]">
      <Form
        onSubmit={(values: FormValues) => {
          console.log("Form was submitted with: ", values);
          console.log(extractMarks(values));
          copyListToClipboard(extractMarks(values));
        }}
      >
        {({ isValid, errors, submit, value, errorsMap }) => (
          <form
            className="w-[80%] flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <FieldArray<{
              group_name: string;
              comments: string;
              milestones: {
                milestone_name: string;
                milestone_comments: string[];
                criteria: { criteria_name: string; mark: number }[];
              }[];
            }>
              name={`groups`}
              initialValue={
                localStorage.length !== 0
                  ? localStorage
                  : Object.entries(markingSchema).map(
                      ([groupName, groupData], idx_group) => ({
                        group_name: groupName,
                        comments: "",
                        milestones: Object.entries(groupData).map(
                          ([milestone_name, milestone_data]) => ({
                            milestone_name,
                            milestone_comments: ["Good Job!"],
                            criteria: milestone_data.criteria.map((c) => ({
                              criteria_name: c,
                              mark: 9,
                            })),
                          })
                        ),
                      })
                    )
              }
            >
              {({ value: groups }) => {
                // setLocalStorage([...groups]);
                console.log("groups", groups);

                setLocalStorage(JSON.stringify(groups) as any);
                return (
                  <>
                    {groups.map(
                      (
                        { group_name: groupName, comments, milestones },
                        idx_group
                      ) => {
                        return (
                          <GroupField
                            key={groupName}
                            groupName={groupName}
                            idx_group={idx_group}
                            milestones={milestones}
                            comments={comments}
                          />
                        );
                      }
                    )}
                  </>
                );
              }}
            </FieldArray>
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    </main>
  );
}
