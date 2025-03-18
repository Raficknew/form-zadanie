import { useRef, useState } from "react";

export const Range = ({
  age,
  setAge,
}: {
  age: number;
  setAge: (num: number) => void;
}) => {
  const rangeRef = useRef<HTMLInputElement>(null);
  const [thumbPosition, setThumbPosition] = useState(0);
  function handleChangeOfRange(number: number) {
    setAge(number);

    if (rangeRef.current) {
      const meter =
        (number - +rangeRef.current.min) * (+rangeRef.current.max - 0);
      const denominator = +rangeRef.current.max - +rangeRef.current.min;
      const result = meter / denominator;

      setThumbPosition(result);
    }
  }

  return (
    <div className="flex flex-col gap-[2px]">
      <label htmlFor="age" className="text-foreground font-medium">
        Age
      </label>
      <div className="flex justify-between *:text-[#000853] *:text-xs">
        <p className="ml-1">8</p> <p>100</p>
      </div>
      <div className="relative">
        <input
          ref={rangeRef}
          defaultValue={age}
          onChange={(e) => handleChangeOfRange(+e.target.value)}
          min={8}
          max={100}
          name="age"
          type="range"
          className="accent-[#761BE4] w-full"
          required
        />
        <div
          style={{
            left: `${thumbPosition}%`,
          }}
          className="flex absolute bottom-[-25px]  justify-center items-center w-[37px] h-[31px] bg-white text-xs *:text-[#761BE4] rounded-sm border border-[#CBB6E5]"
        >
          {age}
        </div>
      </div>
    </div>
  );
};
