import { FieldArray, FieldArrayItem } from "houseform";
import React from "react";
import CriteriaField from "./CriteriaField";
import CreatableSelect from "react-select/creatable";
import Select, { MultiValue, StylesConfig } from "react-select";
import { MarkingComments } from "./page";

type Props = {
  criteria: {
    criteria_name: string;
    mark: number;
  }[];
  milestone_name: string;
  milestone_comments: string[];
  idx_group: number;
  idx_milestone: number;
};

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

export default function MilestoneField({
  criteria,
  milestone_name,
  milestone_comments,
  idx_group,
  idx_milestone,
}: Props) {
  return (
    <div>
      <div
        className={`bg-[#2C2C30] ${
          idx_milestone === 0 ? "mt-24" : ""
        } mx-4 rounded-xl relative mb-6 border border-[#4D4D4D] border-opacity-40`}
        key={milestone_name}
      >
        <h2 className="text-lg font-semibold mb-3 pt-4 pl-4">
          {milestone_name}
        </h2>

        <FieldArrayItem<typeof criteria>
          name={`groups[${idx_group}].milestones[${idx_milestone}].criteria`}
          initialValue={criteria}
        >
          {({ value }) => (
            <FieldArray<{
              mark: number;
              criteria_name: string;
            }>
              name={`groups[${idx_group}].milestones[${idx_milestone}].criteria`}
              initialValue={value}
            >
              {({ value: values }) => (
                <>
                  {values.map(({ criteria_name, mark }, idx_criteria) => {
                    return (
                      <CriteriaField
                        key={idx_criteria}
                        idx_criteria={idx_criteria}
                        criteria_name={criteria_name}
                        idx_milestone={idx_milestone}
                        idx_group={idx_group}
                        mark={mark}
                      />
                    );
                  })}
                </>
              )}
            </FieldArray>
          )}
        </FieldArrayItem>
        <div className="px-3 pb-3">
          <div className="text-md font-bold mt-2 ml-2 mb-1">
            Milestone Comments
          </div>
          <FieldArrayItem<string[]>
            name={`groups[${idx_group}].milestones[${idx_milestone}].milestone_comments`}
            initialValue={milestone_comments}
          >
            {({ value, setValue, onBlur, errors }) => (
              <CreatableSelect
                className="rounded-lg"
                defaultValue={milestone_comments.map((mc) => ({
                  value: mc, // assuming mc is a string
                  label: mc, // assuming mc is a string
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
                options={[
                  ...milestone_comments.map((mc) => ({
                    value: mc,
                    label: mc,
                  })),
                  ...milestoneComments,
                ]}
                onChange={(selected) => setValue(selected.map((s) => s.value))}
              />
            )}
          </FieldArrayItem>
        </div>
      </div>
    </div>
  );
}
