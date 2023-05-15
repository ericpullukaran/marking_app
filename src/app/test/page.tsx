"use client";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select, { MultiValue, StylesConfig } from "react-select";
import { Formik, Field, Form } from "formik";
import { useSyncedLocalStorage as useLocalStorage } from "../utils/useSyncedLocalStorage";

type Props = {};

export interface MilestoneComment {
  value: string;
  label: string;
}

const selectStyles: StylesConfig<MilestoneComment, true> = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "#2C2C30",
    borderColor: "#4D4D4D",
    borderRadius: 8,
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    color: "white",
    "::placeholder": {
      color: "white",
    },
    "::selection": {
      backgroundColor: "transparent",
    },
    caretColor: "white",
  }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: "rgb(255 255 255 / .5)",
      borderRadius: 3,
    };
  },
  multiValueRemove: (base, props) => {
    return {
      ...base,
      backgroundColor: "rgb(255 255 255 / .5)",
      borderRadius: 3,
    };
  },
};

const milestoneComments: readonly MilestoneComment[] = [
  { value: "Good job!", label: "Good job!" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" },
];

export default function index({}: Props) {
  const schema = {
    group2: {
      milestone1: {
        criteria: ["Login: User can login", "Register: User can register"],
      },
      milestone2: {
        criteria: [
          "Login: Login form displayed with username/password/submit",
          "Login: User can login",
        ],
      },
    },
    group1: {
      Testing: {
        criteria: ["Login: Login form displayed ", "Login: User can login"],
      },
    },
  };

  const schemaArray = Object.keys(schema).map((groupName) => {
    const milestones = Object.keys(schema[groupName]).map((milestoneName) => {
      return {
        name: milestoneName,
        criteria: schema[groupName][milestoneName].criteria,
      };
    });

    return {
      name: groupName,
      milestones,
    };
  });

  const initialFormValues = schemaArray.map((group, groupIndex) => ({
    group_name: group.name,
    comments: "",
    milestones: group.milestones.map((milestone, milestoneIndex) => ({
      milestone_name: milestone.name,
      milestone_comments: [""],
      criteria: milestone.criteria.map((criterion, criterionIndex) => ({
        criteria_name: criterion,
        mark: 0,
      })),
    })),
  }));

  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectValues, setSelectValues] = useLocalStorage(
    "selectValues",
    initialFormValues.map((group) => group.milestones.map(() => ["Good Job!"]))
  );

  const [formValues, setFormValues] = useLocalStorage(
    "formValues",
    initialFormValues
  );

  const handleChange = (
    selected: MilestoneComment[],
    groupIndex: number,
    milestoneIndex: number
  ) => {
    const newSelectValues = [...selectValues];
    newSelectValues[groupIndex][milestoneIndex] = selected.map((s) => s.value);
    setSelectValues(newSelectValues);
  };

  useEffect(() => {
    if (formValues) {
      setDataLoaded(true);
    }
  }, [formValues]);

  return (
    <>
      {isDataLoaded && (
        <main className="prose flex flex-col items-center justify-between p-24 bg-[#1B1D20]">
          <h1>Marking Schema</h1>
          <Formik
            initialValues={{ groups: formValues }}
            onSubmit={(values) => {
              const combinedValues = values.groups.map((group, groupIndex) => ({
                ...group,
                milestones: group.milestones.map(
                  (milestone, milestoneIndex) => ({
                    ...milestone,
                    milestone_comments:
                      selectValues[groupIndex][milestoneIndex],
                  })
                ),
              }));

              // Save form values to local storage
              setFormValues(values.groups);

              console.log(combinedValues);
            }}
          >
            {({ resetForm }) => (
              <Form className="w-[80%] flex flex-col gap-8">
                {initialFormValues.map((group, groupIndex) => (
                  <div
                    key={group.group_name}
                    className="card bg-[#26262A] border border-[#4D4D4D] border-opacity-40 overflow-hidden px-2"
                  >
                    <h2 className="text-9xl opacity-[3%] font-bold mb-6 absolute -left-2 -top-4">
                      {group.group_name}
                    </h2>

                    {group.milestones.map((milestone, milestoneIndex) => (
                      <div
                        key={milestone.milestone_name}
                        className={`bg-[#2C2C30] ${
                          milestoneIndex === 0 ? "mt-24" : ""
                        } mx-4 rounded-xl relative mb-6 border border-[#4D4D4D] border-opacity-40`}
                      >
                        <h3 className="text-lg font-semibold mb-3 pt-4 pl-4">
                          {milestone.milestone_name}
                        </h3>

                        {milestone.criteria.map((criterion, criterionIndex) => (
                          <div
                            key={criterion.criteria_name}
                            className={`${
                              criterionIndex % 2 === 0
                                ? "bg-white bg-opacity-[2%]"
                                : ""
                            } px-4 py-2 pb-4`}
                          >
                            <label className="mt-2 mb-2 text-sm font-extralight">
                              {criterion.criteria_name}
                            </label>
                            <br />
                            <Field
                              type="number"
                              className="mt-2 input bg-[#202023] border-2 border-[#4D4D4D] border-opacity-60 w-24"
                              name={`groups[${groupIndex}].milestones[${milestoneIndex}].criteria[${criterionIndex}].mark`}
                            />
                          </div>
                        ))}
                        <div className="px-3 pb-3">
                          <div className="text-md font-bold mt-2 ml-2 mb-1">
                            Milestone Comments
                          </div>
                          <CreatableSelect
                            className="rounded-lg"
                            instanceId="select-box"
                            defaultValue={selectValues[groupIndex][
                              milestoneIndex
                            ].map((mc) => ({
                              value: mc,
                              label: mc,
                            }))}
                            styles={selectStyles}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: "#797979",
                                primary: "black",
                                neutral0: "#4D4D4D",
                              },
                            })}
                            isMulti
                            options={milestoneComments}
                            onChange={(selected) =>
                              handleChange(selected, groupIndex, milestoneIndex)
                            }
                          />
                        </div>
                      </div>
                    ))}
                    <div className="relative p-5">
                      <h2 className="text-lg font-bold mb-2">
                        Additional Comments
                      </h2>
                      <Field
                        name={`groups[${groupIndex}].comments`}
                        className="textarea bg-[#202023] border-2 border-[#4D4D4D] border-opacity-60 w-full min-h-16"
                        placeholder={`Enter comments for ${group.group_name}`}
                      />
                    </div>
                  </div>
                ))}
                <button type="submit">Submit</button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm(); // Resets Formik form
                    localStorage.removeItem("formValues");
                  }}
                >
                  Reset
                </button>
              </Form>
            )}
          </Formik>
        </main>
      )}
    </>
  );
}
