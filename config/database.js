var mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb://scrumpoker:Scrumpoker12@kamino.mongodb.umbler.com:42852/scrumpoker', { useNewUrlParser: true });
//module.exports = mongoose.connect('mongodb://localhost:27017/scrumpoker', { useNewUrlParser: true });
