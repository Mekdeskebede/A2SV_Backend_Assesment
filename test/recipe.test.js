const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongoose-memory-server");
const app = require("../app"); // Your Express app
const Recipe = require("../models/recipe");
const User = require("../models/user");

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a test user and login to get a token
  const user = await User.create({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password",
  });
  userId = user._id;
  const response = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password" });
  token = response.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Recipe CRUD Operations", () => {
  let recipeId;

  test("Create a new recipe", async () => {
    const response = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Recipe",
        ingredients: [{ ingredientName: "Flour", quantity: "2 cups" }],
        instructions: "Mix and bake.",
        preparationTime: 30,
      });

    expect(response.status).toBe(201);
    expect(response.body.recipe).toHaveProperty("title", "Test Recipe");
    recipeId = response.body.recipe._id;
  });

  test("Get all recipes", async () => {
    const response = await request(app).get("/recipes");
    expect(response.status).toBe(200);
    expect(response.body.recipes).toBeInstanceOf(Array);
  });

  test("Get a specific recipe by ID", async () => {
    const response = await request(app).get(`/recipes/${recipeId}`);
    expect(response.status).toBe(200);
    expect(response.body.recipe).toHaveProperty("title", "Test Recipe");
  });

  test("Update a recipe", async () => {
    const response = await request(app)
      .put(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Recipe",
        ingredients: [{ ingredientName: "Sugar", quantity: "1 cup" }],
        instructions: "Mix and cook.",
        preparationTime: 45,
      });

    expect(response.status).toBe(200);
    expect(response.body.updatedRecipe).toHaveProperty(
      "title",
      "Updated Recipe"
    );
  });

  test("Delete a recipe", async () => {
    const response = await request(app)
      .delete(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const deletedRecipe = await Recipe.findById(recipeId);
    expect(deletedRecipe).toBeNull();
  });
});
