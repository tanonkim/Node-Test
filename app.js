const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const dataSource = require("./models/appDataSource");
const routes = require("./routes");

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
app.use(routes);

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
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

app.post("/likes/:userId/:postId", async (req, res) => {
  const { userId, postId } = req.params;

  const favorite = await dataSource.query(
    `
    SELECT EXISTS(SELECT *
      FROM likes
      WHERE user_id = ?
        AND post_id = ?) as 'LIKED'
  `,
    [userId, postId]
  );

  if (favorite[0].LIKED == 0) {
    await dataSource.query(
      `
      INSERT INTO likes(user_id, post_id)
      VALUES (?, ?)
    `,
      [userId, postId]
    );
    res.status(200).json({ message: "likeCreated" });
  } else {
    await dataSource.query(
      `
      DELETE
      FROM likes
      WHERE user_id = ? and post_id = ?
    `,
      [userId, postId]
    );
    res.status(201).json({ message: "likesDeleted" });
  }
});

const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
