import request from "supertest";
import { app } from "../src/index";

describe("courses", () => {
  it("should return 200 and empty array", async () => {
    await request(app).get("/courses").expect(200, []);
  });
});
