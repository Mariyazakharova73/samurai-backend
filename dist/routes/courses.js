"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesRouter = exports.getCourseViewModel = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares/middlewares");
const courses_1 = require("../repositories/courses");
const utils_1 = require("../utils");
const getCourseViewModel = (course) => {
    return {
        id: course.id,
        title: course.title,
    };
};
exports.getCourseViewModel = getCourseViewModel;
const titleValidation = (0, express_validator_1.body)("title")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Длина от 3 до 15 символов");
const getCoursesRouter = (db) => {
    const router = express_1.default.Router();
    router.get("/", (req, res) => {
        let filteredCourses = courses_1.coursesRepository.findCourses(req.query.title);
        res.json(filteredCourses);
    });
    router.get("/:id", (req, res) => {
        const course = courses_1.coursesRepository.findProductById(+req.params.id);
        if (!course) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(course);
    });
    router.post("/", titleValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
        // if (!req.body.title || !req.body.title.trim()) {
        //   res.status(HTTP_STATUSES.BAD_REQUEST_400).send({ message: "title is required" });
        //   return;
        // }
        let createdCourse = courses_1.coursesRepository.createCourse(req.body.title);
        res.status(utils_1.HTTP_STATUSES.CREATED_201).json(createdCourse);
    });
    router.delete("/:id", (req, res) => {
        courses_1.coursesRepository.deleteProduct(+req.params.id);
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    router.put("/:id", titleValidation, middlewares_1.inputValidationMiddleware, (req, res) => {
        // if (!req.body.title) {
        //   res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        //   return;
        // }
        const course = courses_1.coursesRepository.updateProduct(+req.params.id, req.body.title);
        if (!course) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(utils_1.HTTP_STATUSES.NO_CONTENT_204).json(course);
    });
    return router;
};
exports.getCoursesRouter = getCoursesRouter;
