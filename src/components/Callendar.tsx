import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from "date-fns";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WORKOUT_TIMES = ["12:00", "14:00", "16:30", "18:30", "20:00"];

interface FreeDay {
  date: string;
  type: string;
  name: string;
}

export const Callendar = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  freeDays,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  freeDays: FreeDay[] | undefined;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedTime: string;
  setSelectedTime: (value: string) => void;
}) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startDayIndex = (getDay(firstDayOfMonth) + 6) % 7;
  const holiday = isHolidayDay(selectedDate);

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

  return (
    <>
      <div className="flex flex-wrap justify-between pt-[32px]">
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
                  <div className="flex text-[14px] text-[#000853]" key={day}>
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
                  onClick={() => selectedTime != time && setSelectedTime(time)}
                  className={`cursor-pointer px-3 py-2 bg-white border border-[#CBB6E5] rounded-lg ${
                    selectedTime == time && "outline-[2px] outline-[#761BE4]"
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
    </>
  );
};
