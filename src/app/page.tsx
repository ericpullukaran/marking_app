"use client";

import { Field, FieldArray, FieldArrayItem, Form } from "houseform";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { TypeOf, z } from "zod";
import {
  MarkingSchemaContext,
  MarkingSchemaContextProps,
} from "./MarkingSchemaContext";

export type Milestone = {
  criteria: string[];
};

export type Group = {
  [key: string]: Milestone;
};

export type MarkingComments = {
  [key: string]: Group;
};

const fetchData = () =>
  Promise.resolve({
    Group2: {
      milestone3: {
        criteria: ["username/password/submit", "Login: User can login"],
      },
      milestone4: {
        criteria: ["Error: Erbutton.)"],
      },
    },
    Group1: {
      milestone2: {
        criteria: ["username/password/submit", "Login: User can login"],
      },
      milestone1: {
        criteria: ["criteria1", "criteria2"],
      },
    },
    Group3: {
      testing: {
        criteria: ["username/password/submit", "Login: User can login"],
      },
    },
  });

export default function Home() {
  const context = useContext(MarkingSchemaContext);
  if (!context) {
    return "Loading...";
  }
  const { markingSchema, updateMarkingSchema } = context;
  if (!markingSchema) {
    return "Loading...";
  }
  console.log(markingSchema);

  return (
    <main className="prose flex flex-col items-center justify-between p-24 bg-[#1B1D20]">
      <Form
        onSubmit={(values) => {
          alert("Form was submitted with: " + JSON.stringify(values));
          console.log(values);
        }}
      >
        {({ isValid, errors, submit, value, errorsMap }) => (
          <form
            className="w-[80%] flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Submitting", value, errorsMap, isValid);

              submit();
            }}
          >
            {Object.entries(markingSchema).map(
              ([groupName, groupData], idx_group) => {
                return (
                  <div
                    key={groupName}
                    className="card bg-[#26262A] border border-[#4D4D4D] border-opacity-40 overflow-hidden px-2"
                  >
                    <h1 className="text-9xl opacity-[3%] font-bold mb-6 absolute -left-2">
                      {groupName}
                    </h1>

                    <FieldArray<{
                      milestone_name: string;
                      criteria: { criteria_name: string; mark: number }[];
                    }>
                      name={`${groupName}.milestones`}
                      initialValue={Object.entries(groupData).map(
                        ([milestone_name, milestone_data]) => ({
                          milestone_name,
                          criteria: milestone_data.criteria.map((c, index) => ({
                            criteria_name: c,
                            mark: 0,
                            criteria_index: index,
                          })),
                        })
                      )}
                    >
                      {({ value: milestone_vals }) => (
                        <>
                          <div
                            className="tooltip tooltip-open"
                            data-tip="hello"
                          >
                            <div className="badge badge-outline badge-accent absolute right-3 top-3">
                              {groupName}
                            </div>
                          </div>
                          {milestone_vals.map(
                            ({ criteria, milestone_name }, idx_milestone) => (
                              <FieldArrayItem<typeof criteria>
                                key={milestone_name}
                                name={`${groupName}.milestones[${idx_milestone}].criteria`}
                                initialValue={criteria}
                              >
                                {({ value, setValue, onBlur, errors }) => (
                                  <div
                                    className={`bg-[#2C2C30] ${
                                      idx_milestone === 0 ? "mt-24" : ""
                                    } mx-4 rounded-xl relative mb-6 border border-[#4D4D4D] border-opacity-40`}
                                    key={milestone_name}
                                  >
                                    <h2 className="text-lg font-semibold mb-3 pt-4 pl-4">
                                      {milestone_name}
                                    </h2>
                                    <FieldArray<{
                                      mark: number;
                                      criteria_name: string;
                                    }>
                                      name={`${groupName}.milestones[${idx_milestone}].criteria.values`}
                                      initialValue={value}
                                    >
                                      {({ value: values }) => (
                                        <>
                                          {values.map(
                                            (
                                              { criteria_name, mark },
                                              index
                                            ) => {
                                              return (
                                                <FieldArrayItem<number>
                                                  key={index}
                                                  name={`${groupName}.milestones[${idx_milestone}].criteria.values[${index}].mark`}
                                                  onSubmitValidate={z
                                                    .number()
                                                    .min(0, "dont even ask")}
                                                  initialValue={mark}
                                                >
                                                  {({
                                                    value,
                                                    setValue,
                                                    onBlur,
                                                    errors,
                                                  }) => (
                                                    <div
                                                      className={`${
                                                        index % 2 === 0
                                                          ? "bg-white bg-opacity-[2%]"
                                                          : ""
                                                      } px-4 py-2 pb-4`}
                                                    >
                                                      <h4 className="mt-2 mb-2 text-sm font-extralight">
                                                        {criteria_name}
                                                      </h4>
                                                      <input
                                                        className="input bg-[#202023] border-2 border-[#4D4D4D] border-opacity-60 w-24"
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChange={(e) =>
                                                          setValue(
                                                            Number(
                                                              e.target.value
                                                            )
                                                          )
                                                        }
                                                        placeholder={
                                                          criteria_name
                                                        }
                                                        type="number"
                                                      />
                                                      <button
                                                        className="ml-2 btn btn-outline border-2 border-[#4D4D4D] border-opacity-60 btn-sm"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          setValue(0.5);
                                                        }}
                                                        tabIndex={-1}
                                                      >
                                                        0.5
                                                      </button>
                                                      <button
                                                        className="ml-2 btn btn-outline border-2 border-[#4D4D4D] border-opacity-60 btn-sm"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          setValue(0.75);
                                                        }}
                                                        tabIndex={-1}
                                                      >
                                                        0.75
                                                      </button>
                                                      <button
                                                        className="ml-2 btn btn-outline border-2 border-[#4D4D4D] border-opacity-60 btn-sm"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          setValue(1);
                                                        }}
                                                        tabIndex={-1}
                                                      >
                                                        1
                                                      </button>
                                                      {errors.map((error) => (
                                                        <p key={error}>
                                                          {error}
                                                        </p>
                                                      ))}
                                                    </div>
                                                  )}
                                                </FieldArrayItem>
                                              );
                                            }
                                          )}
                                        </>
                                      )}
                                    </FieldArray>
                                  </div>
                                )}
                              </FieldArrayItem>
                            )
                          )}
                        </>
                      )}
                    </FieldArray>
                    <div className="p-5">
                      <h1 className="text-xl font-bold mb-2">Comments</h1>
                      <Field name={`${groupName}.comments`}>
                        {({ value, setValue, onBlur, errors }) => (
                          <div>
                            <input
                              className="textarea bg-[#202023] border-2 border-[#4D4D4D] border-opacity-60 w-full min-h-16"
                              value={value}
                              onBlur={onBlur}
                              onChange={(e) => setValue(e.target.value)}
                              placeholder={groupName}
                            />
                            {errors.map((error) => (
                              <p key={error}>{error}</p>
                            ))}
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>
                );
              }
            )}
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    </main>
  );
}
