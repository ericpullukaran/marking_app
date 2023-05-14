import { FieldArrayItem } from "houseform";
import { z } from "zod";

type Props = {
  idx_criteria: number;
  idx_group: number;
  idx_milestone: number;
  criteria_name: string;
  mark: number;
};

// CriteriaField Component
const CriteriaField = ({
  idx_criteria,
  idx_group,
  idx_milestone,
  criteria_name,
  mark,
}: Props) => {
  return (
    <FieldArrayItem<number>
      name={`groups[${idx_group}].milestones[${idx_milestone}].criteria[${idx_criteria}].mark`}
      onSubmitValidate={z.number().min(0, "dont even ask")}
      initialValue={mark}
    >
      {({ value, setValue, onBlur, errors }) => (
        <div
          className={`${
            idx_criteria % 2 === 0 ? "bg-white bg-opacity-[2%]" : ""
          } px-4 py-2 pb-4`}
        >
          <h4 className="mt-2 mb-2 text-sm font-extralight">{criteria_name}</h4>
          <input
            className="input bg-[#202023] border-2 border-[#4D4D4D] border-opacity-60 w-24"
            value={value}
            onChange={(e) => setValue(e.currentTarget.valueAsNumber)}
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
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </FieldArrayItem>
  );
};
export default CriteriaField;
