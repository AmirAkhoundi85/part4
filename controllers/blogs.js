const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
require("express-async-errors");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const { title, author, url, likes, userId } = request.body;

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: userId,
  });

  const savedBlog = await blog.save();

  const user =await User.findById(userId);
  // user.notes = user.blogs.concat(savedBlog._id);
  user.blogs.push(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { id } = request.params;
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.status(204).end();
});

module.exports = blogsRouter;
