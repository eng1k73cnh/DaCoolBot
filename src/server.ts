import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import express from "express";
import cors from "cors";

// Own API
const app = express();

// Allow CORS
app.use(cors());

app.get("/", (req, res) => {
	const rest = new REST({ version: "9" }).setToken(process.env.TOKEN),
		fetchUser = async id => rest.get(Routes.user(id));

	if (!req.query.id) return res.send("No ID provided");
	// Return user info
	fetchUser(req.query.id)
		.then(user => res.send(user))
		.catch(err => res.send(err));
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
	console.log("Server started");
});
