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
// import useLocalStorage from "./utils/useSyncedLocalStorage";
import { useCopy } from "./utils/useCopy";
import CopyFields from "./CopyFields";
import { useLocalStorage } from "usehooks-ts";

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
  milestone_comments: string[];
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

export default function Home() {
  const context = useContext(MarkingSchemaContext);
  const [localStorage, setLocalStorage] = useLocalStorage("mark_values", []);
  const [clear, setClear] = useState(false);

  if (!context) {
    return <>Loading...</>;
  }
  const { markingSchema, updateMarkingSchema } = context;

  if (!context.markingSchema) {
    return <>Loading...</>;
  }

  const initFormVal = Object.entries(markingSchema).map(
    ([groupName, groupData], idx_group) => ({
      group_name: groupName,
      comments: "",
      milestones: Object.entries(groupData).map(
        ([milestone_name, milestone_data]) => ({
          milestone_name,
          milestone_comments: ["Good Job!"],
          criteria: milestone_data.criteria.map((c) => ({
            criteria_name: c,
            mark: -1,
          })),
        })
      ),
    })
  );

  const initValue = () => {
    return initFormVal;
    if (Array.isArray(localStorage) && !localStorage.length) {
      return initFormVal;
    } else {
      console.log("init using localstorage", typeof localStorage);
      if (typeof localStorage === "string") {
        return JSON.parse(localStorage as any);
      } else {
        return localStorage;
      }
    }
  };

  // this is the value of the form ref.current.value
  return (
    <main className="prose flex flex-col items-center justify-between p-24 bg-[#1B1D20]">
      <Form
        onSubmit={(values: FormValues) => {
          console.log("Form was submitted with: ", values);
        }}
      >
        {({ isValid, errors, submit, value, errorsMap, reset }) => (
          <form
            className="w-[80%] flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
            >
              Submit
            </button>
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
              initialValue={initValue()}
              resetWithValue={Object.entries(markingSchema).map(
                ([groupName, groupData], idx_group) => ({
                  group_name: groupName,
                  comments: "",
                  milestones: Object.entries(groupData).map(
                    ([milestone_name, milestone_data]) => ({
                      milestone_name,
                      milestone_comments: ["b!"],
                      criteria: milestone_data.criteria.map((c) => ({
                        criteria_name: c,
                        mark: 123,
                      })),
                    })
                  ),
                })
              )}
            >
              {({ value: groups, setValues }) => {
                console.log(
                  "This is getting saved to ls",
                  JSON.stringify(groups) as any
                );

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
            <CopyFields isValid={isValid} value={value} />
          </form>
        )}
      </Form>
    </main>
  );
}
