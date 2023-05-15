import { FieldArray, FieldArrayItem } from "houseform";
import React from "react";
import MilestoneField, { MilestoneComment } from "./MilestoneField";
import { StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  groupName: string;
  idx_group: number;
  milestones: {
    milestone_name: string;
    milestone_comments: string[];
    criteria: {
      criteria_name: string;
      mark: number;
    }[];
  }[];
  comments: string;
};

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
  multiValueRemove(base, props) {
    return {
      ...base,
      backgroundColor: "rgb(255 255 255 / .5)",
      borderRadius: 3,
    };
  },
};

export const milestoneComments: readonly MilestoneComment[] = [
  { value: "Good job!", label: "Good job!" },
];

export default function GroupField({
  groupName,
  idx_group,
  milestones,
  comments,
}: Props) {
  return (
    <div className="card bg-[#26262A] border border-[#4D4D4D] border-opacity-40 overflow-hidden px-2">
      <FieldArrayItem<typeof milestones>
        key={groupName}
        name={`groups[${idx_group}].milestones`}
        initialValue={milestones}
        resetWithValue={milestones.map((milestone) => ({
          ...milestone,
          milestone_comments: ["test"],
        }))}
      >
        {({ value, setValue, onBlur, errors }) => (
          <div key={groupName} className="">
            <h1 className="text-9xl opacity-[3%] font-bold mb-6 absolute -left-2 -top-4">
              {groupName}
            </h1>

            <FieldArray<{
              milestone_name: string;
              milestone_comments: string[];
              criteria: {
                criteria_name: string;
                mark: number;
              }[];
            }>
              name={`groups[${idx_group}].milestones`}
              initialValue={value}
            >
              {({ value: milestone_vals }) => (
                <>
                  {milestone_vals.map(
                    (
                      { criteria, milestone_name, milestone_comments },
                      idx_milestone
                    ) => (
                      <div key={milestone_name}>
                        <MilestoneField
                          criteria={criteria}
                          milestone_name={milestone_name}
                          milestone_comments={milestone_comments}
                          idx_group={idx_group}
                          idx_milestone={idx_milestone}
                        />
                      </div>
                    )
                  )}
                </>
              )}
            </FieldArray>
          </div>
        )}
      </FieldArrayItem>
      <div className="p-5">
        <h1 className="text-lg font-bold mb-2">Additional Comments</h1>
        <FieldArrayItem<string>
          name={`groups[${idx_group}].comments`}
          initialValue={comments}
          resetWithValue="test"
        >
          {({ value, setValue, onBlur, errors }) => (
            <div>
              <input
                className="textarea bg-[#202023] border-2 border-[#4D4D4D] border-opacity-60 w-full min-h-16"
                value={value}
                onBlur={onBlur}
                onChange={(e) => setValue(e.target.value)}
                placeholder={groupName + " comments"}
              />
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </FieldArrayItem>
      </div>
    </div>
  );
}
