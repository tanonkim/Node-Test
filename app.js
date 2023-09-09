const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const dataSource = require("./models/appDataSource");
const routes = require("./routes");
const baseResponse = require("./utils/baseResponse");

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.log(`Initialize Error ${error}`);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(routes);
app.use(baseResponse);

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
