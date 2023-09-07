import { Course, db } from "../db/db";
import { CourseViewModel } from "../models/courseViewModel";

export const getCourseViewModel = (course: Course): CourseViewModel => {
  return {
    id: course.id,
    title: course.title,
  };
};

export const coursesRepository = {
  findCourses(title: string | null | undefined) {
    if (title) {
      let foundCourses = db.courses.filter((c) => c.title.indexOf(title as string) > -1);
      return foundCourses.map((dbCourse) => {
        return getCourseViewModel(dbCourse);
      });
    } else {
      return db.courses.map((dbCourse) => {
        return getCourseViewModel(dbCourse);
      });
    }
  },
  createCourse(title: string) {
    const createdCourse: Course = {
      id: +new Date(),
      title: title,
      studentsCount: 0,
    };
    db.courses.push(createdCourse);
    return getCourseViewModel(createdCourse);
  },
  findProductById(id: number) {
    const course = db.courses.find((c) => c.id === id);
    if (course) {
      return getCourseViewModel(course);
    }
  },
  updateProduct(id: number, title: string) {
    let course = db.courses.find((c) => c.id === id);
    if (course) {
      course.title = title;
    }

    return course;
  },

  deleteProduct(id: number) {
    db.courses = db.courses.filter((c) => c.id !== id);
  },
};
