const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");


beforeEach(async () => {
  await Blog.deleteMany({});
  helper.initialBlogs.forEach(async (blog) => {
    let blogObject = new Blog(blog);
    await blogObject.save();
    console.log("saved");
  });
});
test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("verifies that the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((item) => {
    expect(item.id).toBeDefined();
  });

});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "javaScript",
    author: "Amir",
    url: "",
    likes: 46,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((item) => item.title);
  expect(titles).toContain("javaScript");
});


afterAll(async () => {
  await mongoose.connection.close();
});
