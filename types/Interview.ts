type Question = {
  _id: string;
  title: string;
  description: string;
  link: string;
  company: string;
  type: string;
  createdAt: number;
  __v: number;
};

type Round = {
  _id: string;
  name: string;
  type: "oa" | "gd" | "technical" | "sys-design" | "hr";
  date: number;
  note: string;
  questions: Question[];
  createdAt: number;
  __v: number;
};

type Interviewee = {
  name: string;
  reg_no: string;
  batch: number;
};

type Verification = {
  status: string;
};

export type Interview = {
  verification: Verification;
  _id: string;
  interviewee: Interviewee;
  company: string;
  rounds: Round[];
  status: "ongoing" | "placed" | "not-placed";
  offer: "fte" | "intern";
  compensation: number;
  createdAt: number;
  __v: number;
};
