"use client";

import { Field, FieldArray, FieldArrayItem, Form } from "houseform";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TypeOf, z } from "zod";

interface Milestone {
  criteria: string[];
}

interface Group {
  [key: string]: Milestone;
}

interface MarkingComments {
  [key: string]: Group;
}

const fetchData = () =>
  Promise.resolve({
    Group1: {
      milestone2: {
        criteria: ["username/password/submit", "Login: User can login"],
      },
      milestone1: {
        criteria: ["criteria1", "criteria2"],
      },
    },
    // Group2: {
    //   milestone3: {
    //     criteria: ["username/password/submit", "Login: User can login"],
    //   },
    //   milestone4: {
    //     criteria: ["Error: Erbutton.)"],
    //   },
    // },
    // Group3: {
    //   testing: {
    //     criteria: ["username/password/submit", "Login: User can login"],
    //   },
    // },
  });

const initializeForm = (data: MarkingComments) => {
  const initialValues: { [key: string]: string | number } = {};
  const groupComments: { [key: string]: JSX.Element } = {};

  return { initialValues, groupComments };
};

interface Criteria {
  [criteria: string]: number;
}

interface Milestone {
  [milestone: string]: Criteria;
}

interface Marks {
  [group: string]: Milestone;
}

function getMarksFromFlattenedObject(data: Record<string, any>): Marks {
  const marks: Marks = {};

  // Process the flattened object
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (key.includes("_criteria_")) {
        // Extract group, milestone, and criteria information from the key
        const [group, rest] = key.split("_criteria_");
        const [milestone, criteria] = rest.split("_");

        // Create group object if it doesn't exist
        if (!marks[group]) {
          marks[group] = {};
        }

        // Create milestone object if it doesn't exist
        if (!marks[group][milestone]) {
          marks[group][milestone] = {};
        }

        // Assign the value to the criteria
        marks[group][milestone][criteria] = value;
      }
    }
  }

  return marks;
}

export default function Home() {
  const [data, setData] = useState<MarkingComments | null>(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  if (!data) {
    return "Loading...";
  }

  const { initialValues, groupComments } = initializeForm(data);

  console.log(initialValues, data);

  return (
    <main className="prose flex flex-col items-center justify-between p-24">
      <Form
        onSubmit={(values) => {
          alert("Form was submitted with: " + JSON.stringify(values));
          console.log(values);
          console.log(transformData(values));
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
            {Object.entries(data).map(([groupName, groupData], idx_group) => {
              return (
                <div key={groupName} className="card bg-red-500 p-5">
                  <h1 className="text-xl font-bold">{groupName}</h1>

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
                        {milestone_vals.map(
                          ({ criteria, milestone_name }, idx_milestone) => (
                            <FieldArrayItem<typeof criteria>
                              key={milestone_name}
                              name={`${groupName}.milestones[${idx_milestone}].criteria`}
                              initialValue={criteria}
                            >
                              {({ value, setValue, onBlur, errors }) => (
                                <div key={milestone_name}>
                                  <h3 className="text-md font-semibold mt-4">
                                    {milestone_name}
                                  </h3>
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
                                          ({ criteria_name, mark }, index) => {
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
                                                  <div>
                                                    {criteria_name}

                                                    <br />
                                                    <input
                                                      value={value}
                                                      onBlur={onBlur}
                                                      onChange={(e) => {
                                                        console.log(
                                                          "im getting called"
                                                        );

                                                        setValue(
                                                          Number(e.target.value)
                                                        );
                                                      }}
                                                      placeholder={
                                                        criteria_name
                                                      }
                                                      type="number"
                                                    />
                                                    {errors.map((error) => (
                                                      <p key={error}>{error}</p>
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
                  <h1 className="text-xl font-bold mb-2 mt-6">Comments</h1>
                  <Field name={`${groupName}.comments`}>
                    {({ value, setValue, onBlur, errors }) => (
                      <div>
                        <input
                          className="textarea w-full min-h-16"
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
              );
            })}
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    </main>
  );
}
