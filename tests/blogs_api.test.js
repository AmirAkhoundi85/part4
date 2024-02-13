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

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test("update a blog post successfully", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];
  const updatedLikes = blogToUpdate.likes + 5;

  const updatedBlog = {
    title: "Updated Blog",
    author: "Updated Author",
    url: "http://updated-url.com",
    likes: updatedLikes,
  };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlogInDb = blogsAtEnd.find(
    (blog) => blog.id === blogToUpdate.id
  );

  expect(updatedBlogInDb.title).toBe(updatedBlog.title);
  expect(updatedBlogInDb.author).toBe(updatedBlog.author);
  expect(updatedBlogInDb.url).toBe(updatedBlog.url);
  expect(updatedBlogInDb.likes).toBe(updatedLikes);
});

afterAll(async () => {
  await mongoose.connection.close();
});
