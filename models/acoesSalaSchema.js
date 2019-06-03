var mongoose = require('mongoose');

const AcoesSalaSchema = new mongoose.Schema({
    label: String,
    value: String
})

module.exports = AcoesSalaSchema