import React from "react";
import { StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";
import { MilestoneComment } from "../marking/MarkingApp";

type Props = {
  handleChange: (
    selected: MilestoneComment[],
    groupIndex: number,
    milestoneIndex: number
  ) => void;
  groupIndex: number;
  milestoneIndex: number;
  milestone: {
    milestone_comments: never[];
    milestone_name: string;
    criteria: any;
  };
  milestoneCommentsHistory: any;
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
];

export default function MilestoneCommentsSelect({
  handleChange,
  groupIndex,
  milestoneIndex,
  milestone,
  milestoneCommentsHistory,
}: Props) {
  return (
    <div>
      <CreatableSelect
        className="rounded-lg"
        name={`groups[${groupIndex}].milestones[${milestoneIndex}].milestone_comments`}
        instanceId="select-box"
        value={milestone.milestone_comments.map((mc) => ({
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
        options={milestoneComments
          .concat(
            milestoneCommentsHistory[groupIndex][milestoneIndex].map(
              (comment: any) => ({ value: comment, label: comment })
            )
          )
          .reduce((unique: MilestoneComment[], comment: MilestoneComment) => {
            return unique.find((c) => c.value === comment.value)
              ? unique
              : [...unique, comment];
          }, [])}
        onChange={(selected) => {
          handleChange(
            selected as MilestoneComment[],
            groupIndex,
            milestoneIndex
          );
        }}
      />
    </div>
  );
}
