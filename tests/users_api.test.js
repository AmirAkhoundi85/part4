const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);
describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("1234", 10);
    const user = new User({
      name: "Amir",
      username: "Amir12",
      password: passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with valid username and password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "123456",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with missing username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "John Doe",
      password: "password123",
    };

    const res = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body).toHaveProperty(
      "error",
      "User validation failed: username: Path `username` is required."
    );
  });

  test("creation fails with missing password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "john_doe",
      name: "John Doe",
    };

    const res = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body).toHaveProperty("error", "Password is required");
  });

  test("creation fails with too short username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ab",
      name: "John Doe",
      password: "password123",
    };

    const res = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body).toHaveProperty(
      "error",
      "User validation failed: username: Path `username` (`"+newUser.username +"`) is shorter than the minimum allowed length (3)."
    );
  });

  test("creation fails with too short password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "john_doe",
      name: "John Doe",
      password: "pw",
    };

    const res = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body).toHaveProperty(
      "error",
      "Password must have at least 3 characters"
    );
  });

  test("creation fails with non-unique username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Amir12", // Already exists in the database
      name: "John Doe",
      password: "password123",
    };

    const res = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
    expect(res.body).toHaveProperty(
      "error",
      "User validation failed: username: Error, expected `username` to be unique. Value: `" + newUser.username+ "`"
    );
  });
});
