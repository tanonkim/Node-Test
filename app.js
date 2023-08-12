const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const { DataSource } = require("typeorm");

const dataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.err(`Initialize Error ${error}`);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

app.post("/users/signin", async (req, res) => {
  const { name, email, profileImage, password } = req.body;

  await dataSource.query(
    `INSERT INTO users(
      name,
      email, 
      profile_image,
      password
    ) VALUES (?, ?, ?, ?)`,
    [name, email, profileImage, password]
  );
  res.status(201).json({ message: "User_Created" });
});

app.get("/posts", async (req, res) => {
  const rows = await dataSource.query(
    `SELECT u.id, u.profile_image, p.user_id, p.image_url, content
    FROM users as u
             LEFT JOIN posts p ON u.id = p.user_id
    `
  );
  res.status(200).json({ data: rows });
});

const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
