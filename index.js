const express = require("express");
const redis = require("redis");
const axios = require("axios");
const bodyParser = require("body-parser");

const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 5000;

const redis_client = redis.createClient(port_redis);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



checkCache = (req, res, next) => {
	const { id } = req.params;
  	redis_client.get(id, (err, data) => {
    		if (err) {
      			console.log(err);
      			res.status(500).send(err);
    		}
    		
    		if (data != null) {
      			res.send(data);
    		} else {
      			next();
    		}
  	});
};

app.get("/pokemon/:id", checkCache, async (req, res) => {
	try {
    		const { id } = req.params;
    		const pokemonApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    		const pokemon = pokemonApi.data;
		const response = {};
		response.name = pokemon.species.name;
		response.image = pokemon.sprites.other.dream_world.front_default;
		response.weight = pokemon.weight;
		response.abilities = pokemon.abilities;
		redis_client.setex(id, 3600, JSON.stringify(response));
    		return res.json(response);
  	}catch (error) {
    		console.log(error);
    		return res.status(500).json(error);
  	}
});


app.listen(port, () => console.log(`Server running on Port ${port}`));
