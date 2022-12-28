const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Phone = require("./Models/persons");

morgan.token("body", (request, response) => JSON.stringify(request.body));

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Phone.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Phone.findById(request.params.id)
    .then((phone) => {
      if (phone) {
        response.json(phone);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Phone.find({name: body.name}).then((result) => {
    if (result.length > 1) {
      throw "Name must be unique!"
    }
    Phone.findByIdAndUpdate(
      request.params.id, 
      person, 
      { new: true, runValidators: true, context: 'query' })
      .then((updatedPhone) => {
        response.json(updatedPhone);
      })
      .catch((error) => next(error));

  }).catch(error => next(error))
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const phone = new Phone({
    name: body.name,
    number: body.number,
  });

  phone
    .save()
    .then((savedPhone) => {
      response.json(savedPhone);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  Phone.find({}).then((result) => {
    response.send(`
          <p>Phonebook currently holds information for ${
            result.length
          } people.</p>
          <p>${new Date()}</p>
      `);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ Error: "Unknown Endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ Error: "Malformatted Id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/`);
});
