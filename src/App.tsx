import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Input } from "./components/Input";
import { Range } from "./components/Range";
import { FileUpload } from "./components/FileUpload";
import { Callendar } from "./components/Callendar";
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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [freeDays, setFreeDays] = useState<FreeDay[]>();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

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

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false) {
      setInValidEmail(true);
    } else {
      setEmail(email);
      setInValidEmail(false);
    }
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

    console.log(formData);

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
          <Header title="Personal Info" />
          <div className="flex flex-col gap-[24px]">
            <Input
              label="First Name"
              name="name"
              onChange={(e) => setTimeout(() => setName(e.target.value), 1000)}
            />

            <Input
              label="Last Name"
              name="surname"
              onChange={(e) =>
                setTimeout(() => setSurName(e.target.value), 1000)
              }
            />

            <div className="flex flex-col gap-[8px]">
              <Input
                label="Email Address"
                name="email"
                onChange={(e) =>
                  setTimeout(() => validateEmail(e.target.value), 1500)
                }
                isInvalid={inValidEmail !== "" && inValidEmail !== false}
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

            <Range age={age} setAge={setAge} />

            <FileUpload
              fileName={fileName}
              setFileName={setFileName}
              setFile={setFile}
            />
          </div>
        </div>

        <div className="pt-[48px]">
          <Header title="Your workout" />
          <Callendar
            setSelectedTime={setSelectedTime}
            setSelectedDate={setSelectedDate}
            setCurrentDate={setCurrentDate}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            freeDays={freeDays}
            currentDate={currentDate}
          />
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
