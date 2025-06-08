const totalDays = 105;

const today = new Date();
today.setHours(0, 0, 0, 0);

const jsDay = today.getDay();
const daysSinceMonday = (jsDay + 6) % 7;

const startDate = new Date(today);
startDate.setDate(today.getDate() - daysSinceMonday);
startDate.setHours(0, 0, 0, 0);

const checkedDays = Array.from({ length: totalDays }, (_, index) => {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + index);
  return {
    status: false,
    date: date,
  };
});

interface Routine {
  name: string;
  streak: number;
  color: string;
  lastCheckedDate?: string;
  checkedDays: day[];
  days: number;
  startDate: Date;
  buttonColor: string;
  iconname: string;
  archivated: boolean;
  changeIcon: boolean;
  github: boolean;
  amount: number;
  checkedToday: number;
  todos: Todo[];
  todoschecked: number;
  selectedDays: string[];
  category: string;
}

interface day {
  status: boolean;
  date: Date;
}

interface Todo {
  name: string;
  lastCheckedDate?: string;
  buttoncolor: string;
}

const colorScheme = "dark";

const routines: Routine[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Routine ${i + 1}`,
  streak: 0,
  color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
  lastCheckedDate: "",
  checkedDays: JSON.parse(JSON.stringify(checkedDays)), // Deep copy to avoid reference issues
  days: totalDays,
  startDate: new Date(startDate),
  buttonColor: colorScheme === "dark" ? "#1e293b" : "#1e40af",
  iconname: "check-circle",
  archivated: false,
  changeIcon: false,
  github: false,
  amount: 1,
  checkedToday: 0,
  todos: [
    {
      name: `Todo A`,
      buttoncolor: "#1e40af",
    },
    {
      name: `Todo B`,
      buttoncolor: "#1e40af",
    },
  ],
  todoschecked: 0,
  selectedDays: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
  category: `Category ${i + 1}`,
}));

export default routines;
