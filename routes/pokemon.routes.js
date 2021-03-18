module.exports = (app) => {
	const pokemon = require('../controllers/pokemon.controller.js');
	app.get('/pokemon/:id', pokemon.findOne);					
	app.get('/pokemon/edit/:id', pokemon.update);
}
