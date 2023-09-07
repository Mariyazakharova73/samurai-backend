export interface Course {
  id: number;
  title: string;
  studentsCount: number;
}

export let db: DBType = {
  courses: [
    { id: 0, title: "front", studentsCount: 10 },
    { id: 1, title: "back", studentsCount: 5 },
    { id: 3, title: "testback", studentsCount: 2 },
    { id: 4, title: "testfront", studentsCount: 8 },
  ],
};

export type DBType = { courses: Course[] };
