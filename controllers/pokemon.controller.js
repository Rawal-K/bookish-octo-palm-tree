const redis = require("redis");
const axios = require("axios");
const bodyParser = require("body-parser");
const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);
const { checkCache, clearCache } = require('../helpers/redisCacheHelper.js');




exports.findOne = async (req, res) => {
        try {
                const { id } = req.params;
                let response = await checkCache(id);
                if(response === 1){
                        const pokemonApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                        const pokemon = pokemonApi.data;
                        const responseData = {}
                        responseData.name = pokemon.species.name;
                        responseData.image = pokemon.sprites.other.dream_world.front_default;
                        responseData.weight = pokemon.weight;
                        responseData.abilities = pokemon.abilities;
                        redis_client.setex(id, 3600, JSON.stringify(responseData));
                        response = responseData;
                }
                return res.json(response);
        }catch (error) {
                console.log(error);
                return res.status(500).json(error);
        }
};


exports.update = async (req, res) => {
        try{
                const { id } = req.params;
                const pokemonApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const pokemon = pokemonApi.data;
                const response = {};
                response.name = "updated Pokemon";
                response.image = pokemon.sprites.other.dream_world.front_default;
                response.weight = "updated Weight";
                response.abilities = "updated Abilities";
                await clearCache(id);
                return res.json(response);
        }catch(error){
                console.log(error);
                return res.status(500).json(error);
        }
};

