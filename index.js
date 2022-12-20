const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (req, res) => JSON.stringify(req.body));

const app = express();
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    visible: true,
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    visible: true,
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    visible: true,
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    visible: true,
    id: 4,
  },
  {
    name: "Huzaifa",
    number: "03070153646",
    visible: true,
    id: 5,
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((per) => per.id == id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((per) => per.id != id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!(person.name && person.number)) {
    res.status(400).json({
      error: "name or number missing",
    });
  } else if (persons.find((per) => per.name == person.name)) {
    res.status(400).json({
      error: "Name must be unique.",
    });
  } else {
    person.id = Math.max(...persons.map((person) => person.id)) + 1;
    person.visible = true;
    persons.push(person);
    res.json(person);
  }
});

app.get("/info", (req, res) => {
  res.send(`
        <p>Phonebook currently holds information for ${
          persons.length
        } people.</p>
        <p>${new Date()}</p>
    `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/`);
});