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
