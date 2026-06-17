export interface Stat {
  id: "happyTravelers" | "countries" | "toursCompleted" | "yearsExperience";
  value: number;
  suffix?: string;
}

export const stats: Stat[] = [
  { id: "happyTravelers", value: 52000, suffix: "+" },
  { id: "countries", value: 24, suffix: "" },
  { id: "toursCompleted", value: 18600, suffix: "+" },
  { id: "yearsExperience", value: 12, suffix: "" },
];
