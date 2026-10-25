export type ThemeId =
  | "black"
  | "sky"
  | "stars"
  | "dawn"
  | "horizon"
  | "roses"
  | "olive"
  | "sand"
  | "pine"
  | "plum"
  | "mist"
  | "sea"
  | "desert"
  | "cosmos"
  | "peaks"
  | "lake"
  | "jungle"
  | "wine"
  | "subhah"
  | "firdaus"
  | "amethyst"
  | "amber"
  | "jade"
  | "ember"
  | "ivory"
  | "copper"
  | "night";
export type FontId = "clear" | "soft" | "book" | "even" | "crimson";
export type TapVoice = "soft" | "wood" | "drop" | "stone" | "glass" | "bead" | "clay" | "breath" | "sand" | "water";
export type SoundId = "off" | "on";
export type LangId = "ru" | "en" | "ar" | "id" | "tr" | "ur";
export type OrbId = "plain" | "glow" | "pearl" | "line" | "double" | "soft" | "dot" | "crescent" | "kaaba" | "shahada";

export type DayLog = { total: number; by: Record<string, number> };

export type DayArchive = { at: number; key: string; log: DayLog };

export type RewardArchive = {
  at: number;
  total: number;
  xp: number;
  quranLetters: number;
  byDhikr: Record<string, number>;
  days: Record<string, DayLog>;
  bestDay: number;
  celebrated: number[];
};

export type ZikrState = {
  total: number;
  quranLetters: number;
  xp: number;
  byDhikr: Record<string, number>;
  days: Record<string, DayLog>;
  goal: number;
  mode: string;
  pool: string[];
  sound: SoundId;
  voice: TapVoice;
  volume: number;
  vibrate: boolean;
  showWisdom: boolean;
  arabicOptIn: boolean;
  theme: ThemeId;
  themeChosen: boolean;
  font: FontId;
  fontChosen: boolean;
  lang: LangId;
  country: string;
  orb: OrbId;
  questUnder: boolean;
  screenTap: boolean;
  starFlow: boolean;
  orbit: boolean;
  galaxy: boolean;
  rain: boolean;
  achievements: number[];
  celebrated: number[];
  chainIndex: number;
  chainProgress: number;
  activeQuestId: string | null;
  questStep: number;
  questStepProgress: number;
  questBonus: number;
  doneToday: Record<string, string>;
  displayName: string;
  publicId: string;
  publicBoard: boolean;
  wisdomStep: number;
  bestDay: number;
  lastDhikrId: string;
  countGen: number;
  dayCut: boolean;
  dayArchive: DayArchive | null;
  rewardArchive: RewardArchive | null;
};

export type TapResult = {
  dhikrId: string;
  newAchievements: number[];
  levelUp: number | null;
  chainDone: number | null;
  chainFinishedAll: boolean;
  questDoneTitle: string | null;
  questDonePoints: number;
  questAdvanced: boolean;
  dailies: string[];
  beatRecord: boolean;
};
