const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;
  blogs.forEach((item) => {
    sum += item.likes;
  });
  return sum;
};

const favoriteBlog = (blogs) => {
  if (!blogs || !blogs.length) {
    return null;
  }
  const likesArray = blogs.map((item) => item.likes); // [3, 5, 10]
  let max = Math.max(...likesArray);
  let result = blogs.find((blog) => blog.likes === max); //

  return result;
};


const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null; // Handle empty array case
  }

  const blogCountByAuthor = {};

  for (const blog of blogs) {
    const author = blog.author;
    if (blogCountByAuthor[author]) {
      blogCountByAuthor[author]++;
    } else {
      blogCountByAuthor[author] = 1;
    }
  }

  let mostBlogsAuthor = "";
  let maxBlogs = -1;

  for (const author in blogCountByAuthor) {
    if (blogCountByAuthor[author] > maxBlogs) {
      maxBlogs = blogCountByAuthor[author];
      mostBlogsAuthor = author;
    }
  }

  const result = {
    author: mostBlogsAuthor,
    blogs: maxBlogs,
  };

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
