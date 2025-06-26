import express from "express";
// import { requestLogger } from "./middlewares/requestLogger.js";
import cors from "cors";
import morgan from "morgan";

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
// app.use(requestLogger);
app.use(morgan("tiny"));

let notes = [
  {
    id: 1,
    content: "1HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
  },
];

const generated = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send(`<h1>Hello world</h1>`);
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generated(),
  };

  notes = notes.concat(note);

  res.json(note);
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

// 路由之后处理
const unknowEndpoint = (req, res) => {
  res.status(404).send({ error: "unknow endpoint" });
};

app.use(unknowEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
