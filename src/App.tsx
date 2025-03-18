import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WORKOUT_TIMES = ["12:00", "14:00", "16:30", "18:30", "20:00"];
interface FreeDay {
  date: string;
  type: string;
  name: string;
}

function App() {
  const key = import.meta.env.VITE_API_KEY;

  const [name, setName] = useState("");
  const [surnName, setSurName] = useState("");
  const [email, setEmail] = useState("");

  const [inValidEmail, setInValidEmail] = useState<boolean | string>("");

  const [age, setAge] = useState(8);

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>();
  const [hoverButton, setHoverButton] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [freeDays, setFreeDays] = useState<FreeDay[]>();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startDayIndex = (getDay(firstDayOfMonth) + 6) % 7;
  const [selectedDate, setSelectedDate] = useState("");
  const holiday = isHolidayDay(selectedDate);
  const [selectedTime, setSelectedTime] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const rangeRef = useRef<HTMLInputElement>(null);
  const [thumbPosition, setThumbPosition] = useState(0);

  useEffect(() => {
    fetch("https://api.api-ninjas.com/v1/holidays?country=PL", {
      method: "GET",
      headers: {
        "X-Api-Key": key,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to fetch days");
        }
        return response.json();
      })
      .then((data) => setFreeDays(data))
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [key]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false) {
      setInValidEmail(true);
    } else {
      setEmail(email);
      setInValidEmail(false);
    }
  }

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

  function isAbleToWorkout(day: string): boolean {
    const freeDaysInCurrentMonth = freeDays?.filter(
      (date) => date.date.split("-")[1] === format(currentDate, "MM")
    );

    if (!freeDaysInCurrentMonth) return true;

    const isNationalDay = freeDaysInCurrentMonth?.some(
      (freeDay) =>
        freeDay.date.split("-")[2] === day &&
        freeDay.type === "NATIONAL_HOLIDAY"
    );

    return !isNationalDay;
  }

  function isHolidayDay(day: string): string {
    const freeDaysInCurrentMonth = freeDays?.filter(
      (date) => date.date.split("-")[1] === format(currentDate, "MM")
    );

    if (!freeDaysInCurrentMonth) return "";

    const holiday = freeDaysInCurrentMonth.find(
      (freeDay) => freeDay.date === day && freeDay.type === "OBSERVANCE"
    );

    return holiday ? holiday.name : "";
  }

  const isFormValid =
    name !== "" &&
    file !== null &&
    fileName !== "" &&
    surnName !== "" &&
    inValidEmail !== "" &&
    inValidEmail === false &&
    selectedDate !== "" &&
    selectedTime !== "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields");
      return;
    }

    const formData = {
      name,
      surname: surnName,
      email,
      age,
      selectedDate,
      selectedTime,
      file,
    };

    fetch("http://letsworkout.pl/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => console.log("Data sent"))
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  return (
    <div className="bg-background flex justify-center h-full w-full py-[20px] px-[25px]">
      <form
        method="POST"
        className="flex flex-col grow max-w-[426px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-[32px]">
          <h1 className="text-foreground text-2xl font-medium">
            Personal info
          </h1>
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[2px]">
              <label
                htmlFor="name"
                className="text-foreground font-medium leading-none tracking-normal"
              >
                First Name
              </label>
              <input
                onChange={(e) =>
                  setTimeout(() => setName(e.target.value), 1000)
                }
                className="text-foreground bg-white indent-[16px] focus:bg-[#FAF9FA] focus:outline-[#761BE4] border border-[#CBB6E5] h-[48px] rounded-lg"
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
                onChange={(e) =>
                  setTimeout(() => setSurName(e.target.value), 1000)
                }
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
                    ? "text-foreground bg-[#FEECEC] border-[#ED4545] indent-[16px] focus:bg-[#FEECEC] focus:outline-[#ED4545] border h-[48px] rounded-lg"
                    : "text-foreground bg-white indent-[16px] focus:bg-[#FAF9FA] focus:outline-[#761BE4] border border-[#CBB6E5] h-[48px] rounded-lg"
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
            <div className="flex flex-col gap-[2px] pt-[24px]">
              <label htmlFor="photo" className="text-foreground font-medium">
                Photo
              </label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files.length > 0) {
                    const droppedFile = e.dataTransfer.files[0];
                    setFileName(droppedFile.name);
                    setFile(droppedFile);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex justify-center items-center bg-white h-[96px] border border-[#CBB6E5] rounded-md cursor-pointer"
              >
                {fileName ? (
                  <div className="flex items-center gap-2">
                    {fileName}
                    <button
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverButton(true)}
                      onMouseLeave={() => setHoverButton(false)}
                      onClick={() => {
                        if (fileInputRef.current) {
                          setFileName("");
                          setFile(null);
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
                    <p className="hidden sm:block">or drag and drop here</p>
                  </button>
                )}

                <input
                  onChange={handleFileChange}
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
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col gap-[8px]">
              <label>Date</label>
              <div className="bg-white p-6 rounded-[8px] border border-[#CBB6E5]">
                <div className="flex justify-between items-center">
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() => {
                      setSelectedDate("");
                      setCurrentDate(subMonths(currentDate, 1));
                    }}
                  >
                    <img src="/arrow-left.svg" alt="Previous Month" />
                  </button>
                  <h4>{format(currentDate, "MMMM yyyy")}</h4>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() => {
                      setSelectedDate("");
                      setCurrentDate(subMonths(currentDate, -1));
                    }}
                  >
                    <img src="/arrow-right.svg" alt="Next Month" />
                  </button>
                </div>
                <div className="w-full">
                  <div className="grid grid-cols-7 gap-2 p-2">
                    {WEEKDAYS.map((day) => (
                      <div
                        className="flex text-[14px] text-[#000853]"
                        key={day}
                      >
                        {day[0] + day[1]}
                      </div>
                    ))}
                    {Array.from({ length: startDayIndex }).map((_, index) => (
                      <div key={`empty-${index}`} />
                    ))}
                    {daysInMonth.map((day) => {
                      const formattedDay = format(day, "yyyy-MM-dd");
                      const isSelected = selectedDate === formattedDay;
                      const ableToWorkout = isAbleToWorkout(format(day, "dd"));
                      const dayName = format(day, "EEEE");
                      const isSunday = dayName === "Sunday";

                      return (
                        <div
                          key={formattedDay}
                          onClick={() => {
                            if (ableToWorkout && !isSunday) {
                              setSelectedDate(formattedDay);
                            }
                          }}
                          className={`cursor-pointer size-8 flex justify-center items-center ${
                            isSelected
                              ? "bg-[#761BE4] text-white rounded-full size-8"
                              : ""
                          } ${
                            ableToWorkout && !isSunday
                              ? ""
                              : "text-[#898DA9] cursor-not-allowed"
                          }`}
                        >
                          <p>{format(day, "d")}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {selectedDate && holiday == "" && (
              <div className="flex flex-col gap-[8px]">
                <label>Time</label>
                <div className="flex md:flex-col flex-row gap-2 flex-wrap text-center">
                  {WORKOUT_TIMES.map((time) => (
                    <div
                      key={time}
                      onClick={() =>
                        selectedTime != time && setSelectedTime(time)
                      }
                      className={`cursor-pointer px-3 py-2 bg-white border border-[#CBB6E5] rounded-lg ${
                        selectedTime == time &&
                        "outline-[2px] outline-[#761BE4]"
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {holiday !== "" && (
            <div className="flex gap-2">
              <img src="/info-icon.svg" />
              <p className="text-foreground">{holiday}</p>
            </div>
          )}
        </div>

        <button
          disabled={!isFormValid}
          className={
            isFormValid
              ? "cursor-pointer py-[16px] text-white text-lg px-[32px] bg-[#761BE4] rounded-sm mt-[48px] hover:bg-[#6A19CD]"
              : "cursor-pointer py-[16px] text-white text-lg px-[32px] bg-[#CBB6E5] rounded-sm mt-[48px]"
          }
          type="submit"
        >
          Send Application
        </button>
      </form>
    </div>
  );
}

export default App;
