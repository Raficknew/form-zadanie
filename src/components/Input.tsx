export const Input = ({
  label,
  name,
  onChange,
  type = "text",
  isInvalid = false,
}: {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  isInvalid?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-[2px]">
      <label htmlFor={name} className="text-foreground font-medium">
        {label}
      </label>
      <input
        onChange={onChange}
        className={
          isInvalid
            ? "text-foreground bg-[#FEECEC] border-[#ED4545] indent-[16px] focus:bg-[#FEECEC] focus:outline-[#ED4545] border h-[48px] rounded-lg"
            : "text-foreground bg-white indent-[16px] focus:bg-[#FAF9FA] focus:outline-[#761BE4] border border-[#CBB6E5] h-[48px] rounded-lg"
        }
        name={name}
        type={type}
        required
      />
    </div>
  );
};
