import { format } from "date-fns";
import { useRef, useState } from "react";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function App() {
  const currentDate = new Date();
  const [inValidEmail, setInValidEmail] = useState<boolean | string>("");
  const [age, setAge] = useState(8);
  const [file, setFile] = useState("");
  const [hoverButton, setHoverButton] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const days = fetchDays();

  const handleChange = (path: string) => {
    const filePath = path;

    const fileName = filePath.split("\\").pop();

    if (fileName == null) {
      return setFile("");
    }

    setFile(fileName);
  };
  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false) {
      setInValidEmail(true);
    } else {
      setInValidEmail(false);
    }
  }

  return (
    <div className="bg-background flex justify-center h-screen w-full pt-[20px] px-[25px]">
      <form method="POST" className="flex flex-col grow max-w-[426px]">
        <div className="flex flex-col gap-[32px]">
          <h1 className="text-foreground text-2xl font-medium">
            Personal info
          </h1>
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[2px]">
              <label htmlFor="name" className="text-foreground font-medium">
                First Name
              </label>
              <input
                className="text-foreground bg-white indent-[16px] focus:bg-[#FAF9FA] focus:outline-[#761BE4] border border-[#CBB6E5] a h-[48px] rounded-lg"
                name="name"
                type="text"
                required
              />
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="surname" className="text-foreground font-medium">
                Last Name
              </label>
              <input
                className="text-foreground bg-white indent-[16px] focus:bg-[#FAF9FA] focus:outline-[#761BE4] border border-[#CBB6E5] h-[48px] rounded-lg"
                name="surname"
                type="text"
                required
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label htmlFor="email" className="text-foreground font-medium">
                Email Adress
              </label>
              <input
                className={
                  inValidEmail
                    ? "text-foreground bg-[#FEECEC] border-[#ED4545] indent-[16px] focus:bg-[#FEECEC] focus:outline-[#ED4545] border  a h-[48px] rounded-lg"
                    : "text-foreground bg-white indent-[16px] focus:bg-[#FAF9FA] focus:outline-[#761BE4] border border-[#CBB6E5] a h-[48px] rounded-lg"
                }
                name="email"
                type="text"
                onChange={(e) =>
                  setTimeout(() => validateEmail(e.target.value), 1500)
                }
                required
              />
              {inValidEmail != false && inValidEmail != "" && (
                <div className="flex gap-2 *:text-sm">
                  <img src="/error-icon.svg" alt="error-icon" />
                  <div className="*:text-[#000853]">
                    <p>Please use correct formatting.</p>
                    <p>Example: address@email.com</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-[2px]">
              <label htmlFor="age" className="text-foreground font-medium">
                Age
              </label>
              <div className="flex justify-between *:text-[#000853] *:text-xs">
                <p className="ml-1">8</p> <p>100</p>
              </div>
              <input
                defaultValue={age}
                onChange={(e) => setAge(+e.target.value)}
                min={8}
                max={100}
                name="age"
                type="range"
                className="accent-[#761BE4]"
                required
              />
              <div className="flex justify-center items-center w-[37px] h-[31px] bg-white text-xs *:text-[#761BE4] rounded-sm border border-[#CBB6E5]">
                {age}
              </div>
            </div>
            <div className="flex flex-col gap-[2px]">
              <label htmlFor="age" className="text-foreground font-medium">
                Photo
              </label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files.length > 0) {
                    handleChange(e.dataTransfer.files[0].name);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className=" flex justify-center items-center bg-white h-[96px] border border-[#CBB6E5] rounded-md cursor-pointer *:cursor-pointer"
              >
                {file ? (
                  <div className="flex items-center gap-2">
                    {file}
                    <button
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverButton(true)}
                      onMouseLeave={() => setHoverButton(false)}
                      onClick={() => {
                        if (fileInputRef.current) {
                          setFile("");
                          fileInputRef.current.value = "";
                        }
                      }}
                      type="button"
                    >
                      {hoverButton ? (
                        <img src="/delete-hover.svg" alt="delete-hover" />
                      ) : (
                        <img src="/delete-default.svg" alt="delete-default" />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex gap-2"
                    type="button"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                  >
                    <p className="underline text-[#761BE4]">Upload an Image</p>
                    <p>or drag and drop here</p>
                  </button>
                )}

                <input
                  onChange={(e) => handleChange(e.target.value)}
                  multiple={false}
                  ref={fileInputRef}
                  type="file"
                  hidden
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-[48px]">
          <h1 className="text-foreground text-2xl font-medium">Your workout</h1>
          <label>Date</label>
          <div className="bg-white h-[292px] p-6 rounded-[8px] border border-[#CBB6E5]">
            <div className="flex justify-between items-center">
              <button className="cursor-pointer" type="button">
                <img src="/arrow-left.svg" />
              </button>
              <h4>{format(currentDate, "MMMM yyyy")}</h4>
              <button className="cursor-pointer" type="button">
                <img src="/arrow-right.svg" />
              </button>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-7 gap-2 p-2">
                {WEEKDAYS.map((day) => (
                  <div className="flex text-[14px] text-[#000853]" key={day}>
                    {day[0] + day[1]}
                  </div>
                ))}
              </div>
              {days.then((holiday) => console.log(holiday))}
            </div>
          </div>
        </div>

        <button
          disabled
          onClick={() => console.log()}
          className="cursor-pointer py-[16px] text-white text-lg px-[32px] bg-[#761BE4] rounded-sm mt-[48px]"
          type="submit"
        >
          Send Application
        </button>
      </form>
    </div>
  );
}

const fetchDays = async () => {
  try {
    const response = await fetch(
      "https://api.api-ninjas.com/v1/holidays?country=PL",
      {
        method: "GET",
        headers: {
          "X-Api-Key": import.meta.env.VITE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching holidays", error);
  }
};

export default App;
