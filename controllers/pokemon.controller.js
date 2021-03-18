const redis = require("redis");
const axios = require("axios");
const bodyParser = require("body-parser");
const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);
const { checkCache, clearCache } = require('../helpers/redisCacheHelper.js');
const ResponseObject = require('../helpers/responseObjectClass');
const responseObject = new ResponseObject();
const AppError = require('../helpers/appError');


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
		let returnObj = responseObject.create({
			code: 200,
			success: true,
			data: response,
			message: 'Pokemon has been fetched successfully'
		});
                return res.send(returnObj);
        }catch (error) {
		return next(new AppError(error.message, 500));
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
		const returnObj = responseObject.create({
			code: 200,
			success: true,
			data: response,
			message: 'Pokemon has been updated successfully'
		});
                return res.json(returnObj);
        }catch(error){
		return next(new AppError(err.message, 500));
        }
};

