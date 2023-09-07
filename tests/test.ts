import request from "supertest";
import { app } from "../src/app";
import { CourseCreateModel } from "../src/models/courseCreateModel";
import { CourseUpdateModel } from "../src/models/courseUpdateModel";
import { HTTP_STATUSES } from "../src/utils";

describe("/course", () => {
  beforeAll(async () => {
    await request(app).delete("/test/data");
  });

  it("should return 200 and empty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("should return 404 for not existing course", async () => {
    await request(app).get("/courses/10").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not create course with incorrect input data", async () => {
    const data: CourseCreateModel = { title: "" };
    await request(app).post("/courses").send(data).expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  let createdCourse: any = null;

  it("should create course with correct input data", async () => {
    const data: CourseCreateModel = { title: "new title" };

    const createResponse = await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse = createResponse.body;
    expect(createdCourse).toEqual({ title: data.title, id: expect.any(Number) });

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, [createdCourse]);
  });

  it("should not update course with incorrect input data", async () => {
    const data: CourseUpdateModel = { title: "" };
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse);
  });

  it("should update course with correct input model", async () => {
    const data: CourseUpdateModel = { title: "update title" };
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK_200, { ...createdCourse, title: data.title });
  });

  it("should delete both courses", async () => {
    const data = { title: "update title" };
    await request(app)
      .delete(`/courses/${createdCourse.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get(`/courses/${createdCourse.id}`).expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });
});
