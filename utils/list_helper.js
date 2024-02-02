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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
