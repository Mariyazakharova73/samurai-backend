"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
describe("/course", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).delete("/__test__/data");
    }));
    it("should return 200 and empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).get("/courses").expect(index_1.HTTP_STATUSES.OK_200, []);
    }));
    it("should return 404 for not existing course", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).get("/courses/10").expect(index_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it("should not create course with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app).post("/courses").send({ title: "" }).expect(index_1.HTTP_STATUSES.BAD_REQUEST_400);
    }));
    let createdCourse = null;
    it("should create course with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(index_1.app)
            .post("/courses")
            .send({ title: "new title" })
            .expect(index_1.HTTP_STATUSES.CREATED_201);
        createdCourse = createResponse.body;
        expect(createdCourse).toEqual({ title: "new title", id: expect.any(Number) });
        yield (0, supertest_1.default)(index_1.app).get("/courses").expect(index_1.HTTP_STATUSES.OK_200, [createdCourse]);
    }));
    it("should not update course with incorrect input data", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/courses/${createdCourse.id}`)
            .send({ title: "" })
            .expect(index_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(index_1.app)
            .get(`/courses/${createdCourse.id}`)
            .expect(index_1.HTTP_STATUSES.OK_200, createdCourse);
    }));
    it("should update course with correct input model", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .put(`/courses/${createdCourse.id}`)
            .send({ title: "update title" })
            .expect(index_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(index_1.app)
            .get(`/courses/${createdCourse.id}`)
            .expect(index_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdCourse), { title: "update title" }));
    }));
    it("should delete both courses", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .delete(`/courses/${createdCourse.id}`)
            .send({ title: "update title" })
            .expect(index_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(index_1.app).get(`/courses/${createdCourse.id}`).expect(index_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(index_1.app).get("/courses").expect(index_1.HTTP_STATUSES.OK_200, []);
    }));
});
