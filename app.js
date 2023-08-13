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

app.get("/users/posts/:id", async (req, res) => {
  const { id } = req.params;

  const rows = await dataSource.query(
    `SELECT u.id    as userId,
    u.profile_image as userProfileImage,
    p.id            as postingId,
    p.image_url     as postingImageUrl,
    p.content       as postingContent
    FROM users      as u
    LEFT JOIN posts as p
    ON u.id = p.user_id
    WHERE u.id = ${id}
    `
  );

  const postArr = (rows) => {
    for (let i = 0; i < rows.length; i++) {
      delete rows[i].userId;
      delete rows[i].userProfileImage;
    }
    return rows;
  };

  res.status(200).json({
    data: {
      userId: rows[0].userId,
      userProfileImage: rows[0].userProfileImage,
      postings: postArr(rows),
    },
  });
});

app.patch("/users/:userId/posts/:postId", async (req, res) => {
  const { userId, postId } = req.params;
  const { content } = req.body;

  await dataSource.query(
    `
    UPDATE posts
    SET content = ?
    WHERE user_id = ?
      and id = ?
    `,
    [content, userId, postId]
  );

  const rows = await dataSource.query(
    `
    SELECT p.user_id as userId, u.name, p.id as postingId, p.title as postingTitle, p.content as postingContent
    FROM posts as p
         LEFT JOIN users u ON p.user_id = u.id
    WHERE user_id = ?
      and p.id = ?
    `,
    [userId, postId]
  );
  res.status(200).json({ data: rows });
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  const postInfoQuery = await dataSource.query(
    `
    SELECT *
    FROM posts
    WHERE id = ?
    `,
    [id]
  );

  const postInfo = postInfoQuery[0];

  if (postInfo) {
    await dataSource.query(
      `
      DELETE
      FROM posts
      WHERE id = ?
      `,
      [id]
    );
    res.status(200).json({ message: `${postInfo.id} Deleted` });
  } else {
    res.status(404).json({ message: `Post with ID ${id} not found` });
  }
});

const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
