const express = require("express");
var morgan = require("morgan");
const Person = require("./models/person");
const app = express();
const PORT = process.env.PORT || 3001;
const morganConfig = (tokens, req, res) => {
	const postData = req.method === "POST" ? JSON.stringify(req.body) : "";
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, "content-length"),
		"-",
		tokens["response-time"](req, res),
		"ms",
		postData,
	].join(" ");
};
const errorHandler = (error, request, response, next) => {
	console.error(error.message);
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}
	next(error);
};

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(morganConfig));
app.use(errorHandler);

app.get("/info", (request, response) => {
	Person.find({}).then((persons) => {
		response.send(`<p>Phonebook has info for ${persons.length || 0} people</p>
			<p>${Date()}</p>`);
	});
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findById(id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		console.log("name or number missing");
		return response.status(400).json({
			error: "name or number missing",
		});
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number,
	});

	newPerson.save().then((result) => {
		console.log(`added ${body.name} number ${body.number} to phonebook`);
		response.json(result);
	});
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((result) => {
			response.json(result);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findByIdAndDelete(id)
		.then((result) => response.status(204).end())
		.catch((error) => next(error));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// let persons = [
// 	{
// 		id: "1",
// 		name: "Arto Hellas",
// 		number: "040-123456",
// 	},
// 	{
// 		id: "2",
// 		name: "Ada Lovelace",
// 		number: "39-44-5323523",
// 	},
// 	{
// 		id: "3",
// 		name: "Dan Abramov",
// 		number: "12-43-234345",
// 	},
// 	{
// 		id: "4",
// 		name: "Mary Poppendieck",
// 		number: "39-23-6423122",
// 	},
// ];
