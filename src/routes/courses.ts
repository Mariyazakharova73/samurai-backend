import express, { Response } from "express";
import { body } from "express-validator";
import { Course, DBType } from "../db/db";
import { inputValidationMiddleware } from "../middlewares/middlewares";
import { CourseCreateModel } from "../models/courseCreateModel";
import { CourseUpdateModel } from "../models/courseUpdateModel";
import { CourseViewModel } from "../models/courseViewModel";
import { CoursesQueryModel } from "../models/getCoursesQueryModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { coursesRepository } from "../repositories/courses";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { HTTP_STATUSES } from "../utils";

export const getCourseViewModel = (course: Course): CourseViewModel => {
  return {
    id: course.id,
    title: course.title,
  };
};

const titleValidation = body("title")
  .trim()
  .isLength({ min: 3, max: 15 })
  .withMessage("Длина от 3 до 15 символов");

export const getCoursesRouter = (db: DBType) => {
  const router = express.Router();
  router.get("/", (req: RequestWithQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
    let filteredCourses = coursesRepository.findCourses(req.query.title);

    res.json(filteredCourses);
  });

  router.get(
    "/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
      const course = coursesRepository.findProductById(+req.params.id);

      if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.json(course);
    }
  );

  router.post(
    "/",
    titleValidation,
    inputValidationMiddleware,
    (req: RequestWithBody<CourseCreateModel>, res: Response) => {
      // if (!req.body.title || !req.body.title.trim()) {
      //   res.status(HTTP_STATUSES.BAD_REQUEST_400).send({ message: "title is required" });
      //   return;
      // }

      let createdCourse = coursesRepository.createCourse(req.body.title);

      res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
    }
  );

  router.delete("/:id", (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
    coursesRepository.deleteProduct(+req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  router.put(
    "/:id",
    titleValidation,
    inputValidationMiddleware,
    (req: RequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>, res: Response) => {
      // if (!req.body.title) {
      //   res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      //   return;
      // }

      const course = coursesRepository.updateProduct(+req.params.id, req.body.title);

      if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.status(HTTP_STATUSES.NO_CONTENT_204).json(course);
    }
  );
  return router;
};
