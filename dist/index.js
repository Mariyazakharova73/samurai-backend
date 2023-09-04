"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3001;
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
let db = {
    courses: [
        { id: 0, title: "front" },
        { id: 1, title: "back" },
        { id: 3, title: "testback" },
        { id: 4, title: "testfront" },
    ],
};
exports.app.get("/courses", (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter((c) => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
exports.app.get("/courses/:id", (req, res) => {
    const course = db.courses.find((c) => c.id === +req.params.id);
    if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(course);
});
exports.app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = { id: +new Date(), title: req.body.title };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});
exports.app.delete("/courses/:id", (req, res) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const course = db.courses.find((c) => c.id === +req.params.id);
    if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    course.title = req.body.title;
    res.status(HTTP_STATUSES.NO_CONTENT_204).json(course);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
// import express, { Request, Response } from "express";
// const HTTP_STATUSES = {
//   OK_200: 200,
//   CREATED_201: 201,
//   NO_CONTENT_204: 204,
//   BAD_REQUEST_400: 400,
//   NOT_FOUND_404: 404,
// };
// const app = express();
// const port = process.env.PORT || 4000;
// const jsonBodyMiddleware = express.json();
// app.use(jsonBodyMiddleware);
// let products = [
//   { id: 0, title: "tomato" },
//   { id: 1, title: "orange" },
// ];
// const addresses = [
//   { id: 0, value: "ad1" },
//   { id: 1, value: "ad1" },
// ];
// app.get("/products", (req: Request, res: Response) => {
//   if (req.query.title) {
//     let searchString = req.query.title.toString();
//     res.send(products.filter((p) => p.title.indexOf(searchString) > -1));
//   } else {
//     res.send(products);
//   }
// });
// app.post("/products", (req, res) => {
//   if (!req.body.title) {
//     res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
//     return;
//   }
//   const createdProduct = { id: +new Date(), title: req.body.title };
//   products.push(createdProduct);
//   res.status(HTTP_STATUSES.CREATED_201).json(createdProduct);
// });
// app.get("/products/:id", (req: Request, res: Response) => {
//   let product = products.find((p) => p.id === +req.params.id);
//   if (!product) {
//     res.send(HTTP_STATUSES.NOT_FOUND_404);
//   }
//   res.send(product);
// });
// app.delete("/products/:id", (req: Request, res: Response) => {
//   products = products.filter((p) => p.id !== +req.params.id);
//   res.send(HTTP_STATUSES.NO_CONTENT_204);
// });
// app.put("/products/:id", (req, res) => {
//   if (!req.body.title) {
//     res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
//     return;
//   }
//   const product = products.find((c) => c.id === +req.params.id);
//   if (!product) {
//     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
//     return;
//   }
//   product.title = req.body.title;
//   res.status(HTTP_STATUSES.NO_CONTENT_204).json(product);
// });
// app.get("/addresses", (req: Request, res: Response) => {
//   res.send(addresses);
// });
// app.get("/addresses/:id", (req: Request, res: Response) => {
//   let adress = addresses.find((a) => a.id === +req.params.id);
//   if (!adress) {
//     res.send(HTTP_STATUSES.NOT_FOUND_404);
//   }
//   res.send(adress);
// });
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
