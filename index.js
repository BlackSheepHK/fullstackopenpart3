const express = require("express");
var morgan = require('morgan')
const app = express();
const PORT = process.env.PORT || 3001

const morganConfig = (tokens, req, res) => {
	const postData = (req.method==="POST") ? JSON.stringify(req.body) : ''
	return [
	  tokens.method(req, res),
	  tokens.url(req, res),
	  tokens.status(req, res),
	  tokens.res(req, res, 'content-length'), '-',
	  tokens['response-time'](req, res), 'ms',
	  postData
	].join(' ')
}

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(morganConfig))

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/info", (request, response) => {
	response.send(`<p>Phonebook has info for ${persons.length || 0} people</p>
    <p>${Date()}</p>`);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number missing",
		});
	} else if (persons.map(person => person.name).includes(body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	const person = {
		id: Math.floor(Math.random() * 10000000),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});