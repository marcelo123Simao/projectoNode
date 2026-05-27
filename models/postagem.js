const mongoose = require('mongoose');
//const { router } = require('../routes/admin');
//const Categoria = require('./Categoria');
const Schema = mongoose.Schema;

const PostagemSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    descricao:{
        type: String,
        required: true,
    },
    conteudo:{
        type: String,
        required: true,
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Postagem', PostagemSchema);

