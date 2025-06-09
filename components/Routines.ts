const totalDays = 315;

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
  modelOpen: boolean;

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

const routines: Routine [] = [
    {
    name: "David Goggins - Can't Hurt Me",
    streak: 0,
    color: "#FF4444",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#FF6B6B",
    iconname: "dumbbell",
    archivated: false,
    changeIcon: false,
    github: false,
        modelOpen:false,

    amount: 8,
    checkedToday: 0,
    todos: [
      { name: "4:30 AM Wake Up - No Snooze", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "12 Mile Run (Fasted)", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "Gym Session: Pull-ups to Failure", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "Stretching: 2-3 Hours", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "Cold Therapy/Ice Bath", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "Mental Toughness Journal", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "Practice 40% Rule", lastCheckedDate: undefined, buttoncolor: "#FF4444" },
      { name: "8:00 PM Bed, 8h Sleep", lastCheckedDate: undefined, buttoncolor: "#FF4444" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },
  {
    name: "Jocko Willink - Navy SEAL Discipline",
    streak: 0,
    color: "#2E4057",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#4A5568",
    iconname: "arm-flex",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 7,
        modelOpen:false,

    checkedToday: 0,
    todos: [
      { name: "4:30 AM Wake Up - Immediately!", lastCheckedDate: undefined, buttoncolor: "#2E4057" },
      { name: "Workout: Pull/Push/Lift/Squat", lastCheckedDate: undefined, buttoncolor: "#2E4057" },
      { name: "Brazilian Jiu-Jitsu Training", lastCheckedDate: undefined, buttoncolor: "#2E4057" },
      { name: "Surfing (When Waves Perfect)", lastCheckedDate: undefined, buttoncolor: "#2E4057" },
      { name: "Handful of Nuts + Black Coffee", lastCheckedDate: undefined, buttoncolor: "#2E4057" },
      { name: "Record Podcast", lastCheckedDate: undefined, buttoncolor: "#2E4057" },
      { name: "Practice Extreme Ownership", lastCheckedDate: undefined, buttoncolor: "#2E4057" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },
  {
    name: "Tony Robbins - Peak Performance",
    streak: 0,
    color: "#FF8C00",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#FFA500",
    iconname: "fire",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 6,
    checkedToday: 0,
    modelOpen:false,
    todos: [
      { name: "10 Min Priming Meditation", lastCheckedDate: undefined, buttoncolor: "#FF8C00" },
      { name: "Express 3 Things of Gratitude", lastCheckedDate: undefined, buttoncolor: "#FF8C00" },
      { name: "HIIT Workout (10-15 Min)", lastCheckedDate: undefined, buttoncolor: "#FF8C00" },
      { name: "Cold Bath + Sauna", lastCheckedDate: undefined, buttoncolor: "#FF8C00" },
      { name: "Drink Power Smoothie", lastCheckedDate: undefined, buttoncolor: "#FF8C00" },
      { name: "Peak State Before Meetings", lastCheckedDate: undefined, buttoncolor: "#FF8C00" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },

  // ENTREPRENEURS & BUSINESS
  {
    name: "Jeff Bezos - Puttering Routine",
    streak: 0,
    color: "#FF9500",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#FFA500",
    iconname: "package",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 7,
    checkedToday: 0,
    todos: [
      { name: "Wake Up Slowly - No Alarm", lastCheckedDate: undefined, buttoncolor: "#FF9500" },
      { name: "Read Newspaper + Coffee", lastCheckedDate: undefined, buttoncolor: "#FF9500" },
      { name: "Breakfast with Kids", lastCheckedDate: undefined, buttoncolor: "#FF9500" },
      { name: "Wash Dishes (Puttering)", lastCheckedDate: undefined, buttoncolor: "#FF9500" },
      { name: "Check Phone - Relaxed", lastCheckedDate: undefined, buttoncolor: "#FF9500" },
      { name: "No Meetings Before 10 AM", lastCheckedDate: undefined, buttoncolor: "#FF9500" },
      { name: "Max 3 Important Decisions", lastCheckedDate: undefined, buttoncolor: "#FF9500" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    category: "Productivity"
  },
  {
    name: "Elon Musk - Mars Mission Routine",
    streak: 0,
    color: "#8E44AD",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#9B59B6",
    iconname: "rocket-launch",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 8,
    checkedToday: 0,
    todos: [
      { name: "7:00 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "Critical Emails Immediately", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "Coffee + Donut (Guilty Pleasure)", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "Post on Twitter/X", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "Plan 80-100 Hour Week", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "Tesla/SpaceX Meetings", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "Compensate Little Sleep", lastCheckedDate: undefined, buttoncolor: "#8E44AD" },
      { name: "First Principles Thinking", lastCheckedDate: undefined, buttoncolor: "#8E44AD" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Finance"
  },
  {
    name: "Warren Buffett - Reading Machine",
    streak: 0,
    color: "#2C3E50",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#34495E",
    iconname: "newspaper",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "6:45 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#2C3E50" },
      { name: "Read 6 Newspapers", lastCheckedDate: undefined, buttoncolor: "#2C3E50" },
      { name: "80% of Day Reading", lastCheckedDate: undefined, buttoncolor: "#2C3E50" },
      { name: "Drink Cherry Coke", lastCheckedDate: undefined, buttoncolor: "#2C3E50" },
      { name: "McDonald's Breakfast", lastCheckedDate: undefined, buttoncolor: "#2C3E50" },
      { name: "Play Bridge in Evening", lastCheckedDate: undefined, buttoncolor: "#2C3E50" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    category: "Productivity"
  },
  {
    name: "Tim Ferriss - 4-Hour Workweek",
    streak: 0,
    color: "#4A90E2",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#5BA0F2",
    iconname: "bookshelf",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 7,
    checkedToday: 0,
    todos: [
      { name: "Make Bed (First Achievement)", lastCheckedDate: undefined, buttoncolor: "#4A90E2" },
      { name: "10 Min Meditation", lastCheckedDate: undefined, buttoncolor: "#4A90E2" },
      { name: "5-10 Min Morning Pages", lastCheckedDate: undefined, buttoncolor: "#4A90E2" },
      { name: "5-10 Reps Exercise/Training", lastCheckedDate: undefined, buttoncolor: "#4A90E2" },
      { name: "Prepare Pu-Erh Tea", lastCheckedDate: undefined, buttoncolor: "#4A90E2" },
      { name: "High-Protein Breakfast", lastCheckedDate: undefined, buttoncolor: "#4A90E2" },
      { name: "Follow Slow-Carb Diet", lastCheckedDate: undefined, buttoncolor: "#4A90E2" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Productivity"
  },
  {
    name: "Steve Jobs - Minimalist Genius",
    streak: 0,
    color: "#34495E",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#455A70",
    iconname: "apple",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "6:00 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#34495E" },
      { name: "Meditation/Quiet Time", lastCheckedDate: undefined, buttoncolor: "#34495E" },
      { name: "Long Walk (Think Walks)", lastCheckedDate: undefined, buttoncolor: "#34495E" },
      { name: "Black Turtleneck", lastCheckedDate: undefined, buttoncolor: "#34495E" },
      { name: "Detox Diets", lastCheckedDate: undefined, buttoncolor: "#34495E" },
      { name: "Cultivate Perfectionism", lastCheckedDate: undefined, buttoncolor: "#34495E" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Productivity"
  },
  {
    name: "Mark Cuban - Shark Tank Hustle",
    streak: 0,
    color: "#E74C3C",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#F1948A",
    iconname: "shark",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "Drink Decaf Coffee", lastCheckedDate: undefined, buttoncolor: "#E74C3C" },
      { name: "Alyssa's Healthy Cookies", lastCheckedDate: undefined, buttoncolor: "#E74C3C" },
      { name: "Check Emails", lastCheckedDate: undefined, buttoncolor: "#E74C3C" },
      { name: "Watch CNBC", lastCheckedDate: undefined, buttoncolor: "#E74C3C" },
      { name: "Read 3 Hours Daily", lastCheckedDate: undefined, buttoncolor: "#E74C3C" },
      { name: "Avoid Meetings", lastCheckedDate: undefined, buttoncolor: "#E74C3C" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Finance"
  },

  // ATHLETES & SPORTS
  {
    name: "Cristiano Ronaldo - CR7 Machine",
    streak: 0,
    color: "#FFD700",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,

    startDate: new Date(startDate),
    buttonColor: "#F7DC6F",
    iconname: "soccer",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 8,
    checkedToday: 0,
    todos: [
      { name: "7:00 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "Gym: 3-4 Hours Training", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "Swimming Pool Session", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "6 Small Meals", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "Cryotherapy/Recovery", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "Ball Skills Practice", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "Family Time", lastCheckedDate: undefined, buttoncolor: "#FFD700" },
      { name: "10:30 PM Bedtime", lastCheckedDate: undefined, buttoncolor: "#FFD700" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },
  {
    name: "LeBron James - King's Recovery",
    streak: 0,
    color: "#8B008B",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
        modelOpen:false,
    startDate: new Date(startDate),
    buttonColor: "#9932CC",
    iconname: "basketball",
    archivated: false,
    changeIcon: false,
    github: false,
    amount: 7,
    checkedToday: 0,
    todos: [
      { name: "Cryotherapy Session", lastCheckedDate: undefined, buttoncolor: "#8B008B" },
      { name: "Hyperbaric Chamber", lastCheckedDate: undefined, buttoncolor: "#8B008B" },
      { name: "Cold Plunge Therapy", lastCheckedDate: undefined, buttoncolor: "#8B008B" },
      { name: "Personal Chef Meal Prep", lastCheckedDate: undefined, buttoncolor: "#8B008B" },
      { name: "Workout: Strength + Cardio", lastCheckedDate: undefined, buttoncolor: "#8B008B" },
      { name: "Aim for 12 Hours Sleep", lastCheckedDate: undefined, buttoncolor: "#8B008B" },
      { name: "Mental Coach Session", lastCheckedDate: undefined, buttoncolor: "#8B008B" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },
  {
    name: "Michael Jordan - Mamba Mentality",
    streak: 0,
    color: "#DC143C",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#F08080",
    iconname: "trophy",
    archivated: false,
        modelOpen:false,

    changeIcon: false,
    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "5:00 AM Gym Session", lastCheckedDate: undefined, buttoncolor: "#DC143C" },
      { name: "Basketball Practice (3h)", lastCheckedDate: undefined, buttoncolor: "#DC143C" },
      { name: "Cigars + Golf", lastCheckedDate: undefined, buttoncolor: "#DC143C" },
      { name: "Competitive Mindset", lastCheckedDate: undefined, buttoncolor: "#DC143C" },
      { name: "Mental Toughness Training", lastCheckedDate: undefined, buttoncolor: "#DC143C" },
      { name: "Never Accept Defeat", lastCheckedDate: undefined, buttoncolor: "#DC143C" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },
  {
    name: "Serena Williams - Tennis Queen",
    streak: 0,
    color: "#FF1493",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#FF69B4",
    iconname: "tennis",
    archivated: false,
        modelOpen:false,

    changeIcon: false,
    github: false,
    amount: 7,
    checkedToday: 0,
    todos: [
      { name: "6:00 AM Training Start", lastCheckedDate: undefined, buttoncolor: "#FF1493" },
      { name: "Cardio + Strength Training", lastCheckedDate: undefined, buttoncolor: "#FF1493" },
      { name: "Tennis Practice (2-3h)", lastCheckedDate: undefined, buttoncolor: "#FF1493" },
      { name: "Meditation/Mindfulness", lastCheckedDate: undefined, buttoncolor: "#FF1493" },
      { name: "Healthy Meal Prep", lastCheckedDate: undefined, buttoncolor: "#FF1493" },
      { name: "Recovery: Massage/Stretch", lastCheckedDate: undefined, buttoncolor: "#FF1493" },
      { name: "Positive Affirmations", lastCheckedDate: undefined, buttoncolor: "#FF1493" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Health & Fitness"
  },

  // WRITERS & CREATIVES
  {
    name: "Haruki Murakami - Writer's Zen",
    streak: 0,
    color: "#27AE60",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#2ECC71",
    iconname: "pencil",
    archivated: false,
        modelOpen:false,

    changeIcon: false,
    github: false,
    amount: 7,
    checkedToday: 0,
    todos: [
      { name: "4:00 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#27AE60" },
      { name: "Write 5-6 Hours", lastCheckedDate: undefined, buttoncolor: "#27AE60" },
      { name: "10km Run/1h Swimming", lastCheckedDate: undefined, buttoncolor: "#27AE60" },
      { name: "Swim 1500m", lastCheckedDate: undefined, buttoncolor: "#27AE60" },
      { name: "Listen to Music", lastCheckedDate: undefined, buttoncolor: "#27AE60" },
      { name: "Healthy Eating", lastCheckedDate: undefined, buttoncolor: "#27AE60" },
      { name: "9:00 PM Bedtime", lastCheckedDate: undefined, buttoncolor: "#27AE60" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Mindfulness"
  },
  {
    name: "Maya Angelou - Sacred Ritual",
    streak: 0,
    color: "#E67E22",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#F39C12",
    iconname: "pencil-box",
    archivated: false,
    changeIcon: false,
        modelOpen:false,

    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "7:00 AM Rent Hotel Room", lastCheckedDate: undefined, buttoncolor: "#E67E22" },
      { name: "Remove All Pictures from Walls", lastCheckedDate: undefined, buttoncolor: "#E67E22" },
      { name: "Yellow Pads + Thesaurus", lastCheckedDate: undefined, buttoncolor: "#E67E22" },
      { name: "Bible + Poetry Book", lastCheckedDate: undefined, buttoncolor: "#E67E22" },
      { name: "Drink Sherry", lastCheckedDate: undefined, buttoncolor: "#E67E22" },
      { name: "12:30 PM End Writing", lastCheckedDate: undefined, buttoncolor: "#E67E22" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    category: "Mindfulness"
  },
  {
    name: "Stephen King - Horror Master",
    streak: 0,
    color: "#C0392B",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#E74C3C",
    iconname: "ghost",
    archivated: false,
    changeIcon: false,
        modelOpen:false,

    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "8:00 AM at Writing Desk", lastCheckedDate: undefined, buttoncolor: "#C0392B" },
      { name: "2000 Words Daily", lastCheckedDate: undefined, buttoncolor: "#C0392B" },
      { name: "Listen to Music While Writing", lastCheckedDate: undefined, buttoncolor: "#C0392B" },
      { name: "Write Every Day", lastCheckedDate: undefined, buttoncolor: "#C0392B" },
      { name: "Take Vitamin Pill", lastCheckedDate: undefined, buttoncolor: "#C0392B" },
      { name: "Cup of Tea", lastCheckedDate: undefined, buttoncolor: "#C0392B" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Mindfulness"
  },
  {
    name: "Ernest Hemingway - Iceberg Theory",
    streak: 0,
    color: "#8B4513",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#A0522D",
    iconname: "glass-mug",
    archivated: false,
    changeIcon: false,
        modelOpen:false,

    github: false,
    amount: 7,
    checkedToday: 0,
    todos: [
      { name: "Write in Daylight", lastCheckedDate: undefined, buttoncolor: "#8B4513" },
      { name: "Standing at Desk", lastCheckedDate: undefined, buttoncolor: "#8B4513" },
      { name: "Count Words Daily", lastCheckedDate: undefined, buttoncolor: "#8B4513" },
      { name: "Stop at Emotional Peak", lastCheckedDate: undefined, buttoncolor: "#8B4513" },
      { name: "Use Pencil", lastCheckedDate: undefined, buttoncolor: "#8B4513" },
      { name: "Fishing/Sports Afternoon", lastCheckedDate: undefined, buttoncolor: "#8B4513" },
      { name: "Daiquiri in Evening", lastCheckedDate: undefined, buttoncolor: "#8B4513" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Mindfulness"
  },

  // SCIENTISTS & INNOVATORS
  {
    name: "Albert Einstein - Genius Schedule",
    streak: 0,
    color: "#4169E1",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#6495ED",
    iconname: "atom",
    archivated: false,
    changeIcon: false,
        modelOpen:false,

    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "10:00 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#4169E1" },
      { name: "Play Violin", lastCheckedDate: undefined, buttoncolor: "#4169E1" },
      { name: "Long Walks", lastCheckedDate: undefined, buttoncolor: "#4169E1" },
      { name: "Thought Experiments", lastCheckedDate: undefined, buttoncolor: "#4169E1" },
      { name: "Sailing (Windless)", lastCheckedDate: undefined, buttoncolor: "#4169E1" },
      { name: "Combinatorial Play", lastCheckedDate: undefined, buttoncolor: "#4169E1" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Learning"
  },
  {
    name: "Bill Gates - Learning Machine",
    streak: 0,
    color: "#0078D4",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#106EBE",
    iconname: "laptop",
    archivated: false,
    changeIcon: false,
        modelOpen:false,

    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "7:00 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#0078D4" },
      { name: "Hour on Treadmill + Educational Videos", lastCheckedDate: undefined, buttoncolor: "#0078D4" },
      { name: "Read for 1 Hour", lastCheckedDate: undefined, buttoncolor: "#0078D4" },
      { name: "Think Week Planning", lastCheckedDate: undefined, buttoncolor: "#0078D4" },
      { name: "Bridge Online", lastCheckedDate: undefined, buttoncolor: "#0078D4" },
      { name: "Wash Dishes (Reflection Time)", lastCheckedDate: undefined, buttoncolor: "#0078D4" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    category: "Learning"
  },
  {
    name: "Sundar Pichai - Calm Leadership",
    streak: 0,
    color: "#EA4335",
    lastCheckedDate: undefined,
    checkedDays: [...checkedDays],
    days: 105,
    startDate: new Date(startDate),
    buttonColor: "#DB4437",
    iconname: "crown",
    archivated: false,
    changeIcon: false,
        modelOpen:false,

    github: false,
    amount: 6,
    checkedToday: 0,
    todos: [
      { name: "6:30 AM Wake Up", lastCheckedDate: undefined, buttoncolor: "#EA4335" },
      { name: "Read Physical Newspaper", lastCheckedDate: undefined, buttoncolor: "#EA4335" },
      { name: "Tea + Omelet Breakfast", lastCheckedDate: undefined, buttoncolor: "#EA4335" },
      { name: "Cricket News Check", lastCheckedDate: undefined, buttoncolor: "#EA4335" },
      { name: "Walking Meetings", lastCheckedDate: undefined, buttoncolor: "#EA4335" },
      { name: "Family Dinner Priority", lastCheckedDate: undefined, buttoncolor: "#EA4335" }
    ],
    todoschecked: 0,
    selectedDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    category: "Productivity"
  },

];

export default routines;
