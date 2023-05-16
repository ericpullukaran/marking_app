"use client";
// @ts-ignore
import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { debounce } from "lodash";

import { useSyncedLocalStorage as useLocalStorage } from "../utils/useSyncedLocalStorage";
import MilestoneCommentsSelect from "../components/MilestoneCommentsSelect";
import { extractComments, extractMarks } from "../CopyFields";
import { useCopy } from "../utils/useCopy";
import CopyMarks from "../components/CopyMarks";
import CopyComments from "../components/CopyComments";

type Props = {
  schema: any;
};

export interface MilestoneComment {
  value: string;
  label: string;
}

export default function MarkingApp({ schema }: Props) {
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
      milestone_comments: [],
      criteria: milestone.criteria.map(
        (criterion: any, criterionIndex: number) => ({
          criteria_name: criterion,
          mark: 0,
        })
      ),
    })),
  }));

  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectedMSComments, setSelectedMSValues] = useLocalStorage(
    "selectValues",
    initialFormValues.map((group) => group.milestones.map(() => []))
  );
  const [
    milestoneCommentsHistory,
    setMilestoneCommentsHistory,
    clearMilestoneCommentsHistory,
  ] = useLocalStorage(
    "milestoneCommentsHistory",
    initialFormValues.map((group) => group.milestones.map(() => []))
  );

  const [formValues, setFormValues, clearFormValues] = useLocalStorage(
    "formValues",
    initialFormValues
  );

  const [copyMarks, copiedMarks] = useCopy();
  const [copyComments, copiedComments] = useCopy();
  const handleChange = (
    selected: MilestoneComment[],
    groupIndex: number,
    milestoneIndex: number
  ) => {
    const newSelectValues = [...selectedMSComments];
    const newMilestoneCommentsHistory = [...milestoneCommentsHistory];

    newSelectValues[groupIndex][milestoneIndex] = selected.map(
      (s) => s.value
    ) as any;

    // Create a set to only keep unique comments
    const uniqueComments = new Set([
      ...newMilestoneCommentsHistory[groupIndex][milestoneIndex],
      ...(selected.map((s) => s.value) as never[]),
    ]);

    // Convert the set back to an array
    newMilestoneCommentsHistory[groupIndex][milestoneIndex] =
      Array.from(uniqueComments);

    setSelectedMSValues(newSelectValues);
    setMilestoneCommentsHistory(newMilestoneCommentsHistory);
  };

  useEffect(() => {
    if (formValues) {
      setDataLoaded(true);
    }
  }, [formValues]);

  const cv = formValues.map((group, groupIndex) => ({
    ...group,
    milestones: group.milestones.map((milestone, milestoneIndex) => ({
      ...milestone,
      milestone_comments: selectedMSComments[groupIndex][milestoneIndex],
    })),
  }));

  return (
    <>
      {isDataLoaded && (
        <main className="prose flex flex-col items-center pt-16 justify-between bg-[#1B1D20]">
          <Formik
            initialValues={{ groups: formValues }}
            onSubmit={(values) => {
              const combinedValues = values.groups.map((group, groupIndex) => ({
                ...group,
                milestones: group.milestones.map(
                  (milestone, milestoneIndex) => ({
                    ...milestone,
                    milestone_comments:
                      selectedMSComments[groupIndex][milestoneIndex],
                  })
                ),
              }));

              // Save form values to local storage
              setFormValues(combinedValues);
            }}
          >
            {({ resetForm, values, touched, setTouched }) => {
              const saveValues = debounce(() => {
                const combinedValues = values.groups.map(
                  (group, groupIndex) => ({
                    ...group,
                    milestones: group.milestones.map(
                      (milestone, milestoneIndex) => ({
                        ...milestone,
                        milestone_comments:
                          selectedMSComments[groupIndex][milestoneIndex],
                      })
                    ),
                  })
                );

                // Save form values to local storage
                setFormValues(combinedValues);
              }, 500); // Debounce time in ms

              useEffect(() => {
                saveValues();
              }, [values]); // Re-run the effect when 'values' changes

              return (
                <Form className="w-[80%] max-w-2xl flex flex-col gap-8 relative">
                  {cv.map((group, groupIndex) => (
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

                          {milestone.criteria.map(
                            (criterion: any, criterionIndex: number) => (
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
                            )
                          )}
                          <div className="px-3 pb-3">
                            <div className="text-md font-bold mt-2 ml-2 mb-1">
                              Milestone Comments
                            </div>
                            <MilestoneCommentsSelect
                              handleChange={handleChange}
                              groupIndex={groupIndex}
                              milestoneIndex={milestoneIndex}
                              milestone={milestone}
                              milestoneCommentsHistory={
                                milestoneCommentsHistory
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
                  <button
                    className="btn btn-outline btn-accent"
                    type="button"
                    onClick={() => {
                      setFormValues(initialFormValues);
                      setSelectedMSValues(
                        initialFormValues.map((group) =>
                          group.milestones.map(() => [])
                        )
                      );
                      resetForm({ values: { groups: initialFormValues } }); // Resets Formik form
                    }}
                  >
                    Clear Form
                  </button>
                  <CopyMarks
                    handleCopying={() =>
                      copyMarks(extractMarks(formValues).join("\n"))
                    }
                    copiedMarks={copiedMarks}
                  />

                  <CopyComments
                    handleCopying={() =>
                      copyComments(extractComments(formValues).join("\n"))
                    }
                    copiedComments={copiedComments}
                  />
                </Form>
              );
            }}
          </Formik>
        </main>
      )}
    </>
  );
}
