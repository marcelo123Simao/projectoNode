//CARREGANDO MODULOS
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const usuario = require('./routes/usuarios');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require("./models/postagem")
const Postagem = mongoose.model("Postagem")
require("./models/Categoria")
const Categoria= mongoose.model("Categoria")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")
//CONFIGURAÇÕES
app.use(session({
    secret: 'simao',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

//MIDDLEWARE DAS VARIAVEIS GLOBAIS 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error =req.flash("error")
    res.locals.user = req.user || null;
    next();
});

//BODYPARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//CONFIGURAÇÃO DO HANDLEBARS
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        ifEquals: function(a, b, options) {
            if(a.toString() === b.toString()) {
                return options.fn(this)
            }
            return options.inverse(this)
        }
    }
}));
app.set('view engine', 'handlebars');

// C0NEXAÕ DO BANCO DE DADOS COM MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI)
.then(() => {
    console.log("Conectado ao MongoDB");
})
.catch((err) => {
    console.log("Erro ao se conectar ao MongoDB: " + err);
});

//PUBLIC
app.use(express.static(path.join(__dirname, 'public')));
//MIDDLEWARE
app.use((req, res, next) => {
    console.log("Middleware funcionando");
    next();
});

//ROTAS ADMIN
app.use('/admin', admin);

//ROTAS USUARIO
app.use('/usuarios', usuario);

// ROTA DA PAGINA AO CLICAR NO BOTÃO DO LEIA MAIS DA POSTAGENS
app.get('/leiaMais/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug })
         .lean()
        .then((postagem) => {
            if (postagem) { 
                res.render("postagem/index", { postagem: postagem });
            } else {
                req.flash("error_msg", "Postagem não encontrada.");
                res.redirect("/");
            }
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao buscar a postagem.");
            res.redirect("/");
        });
});

//ROTA DA PAGINA INICIAL 
app.get('/', (req, res) => {
    Postagem.find()
        .populate("categoria")
        .sort({ date: -1 })
        .lean()
        .then((postagems) => {
            console.log("POSTAGENS:", postagems); // 👈 TESTE
            res.render("index", { postagems });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).redirect("/404");
        });
});

//ROTA PARA A EXIBIÇÃO DAS CATEGORIAS
app.get('/categorias', function(req, res){
    Categoria.find().lean()
        .then((categorias) => {
            res.render("categorias/index", { categorias: categorias });
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias.");
            res.redirect("/");
        });
});
//ROTA QUE BUSCAS OS POSTE DAS CATEGORIAS
app.get('/categorias/:slug', function(req, res){

    Categoria.findOne({ slug: req.params.slug }).lean()
    .then((categorias) => {

        if(!categorias){
            req.flash("error_msg", "Categoria não encontrada.");
            return res.redirect("/");
        }

        return Postagem.find({ categoria: categorias._id }).lean()
        .then((postagem) => {

            res.render("categorias/postagens", {
                postagem: postagem,
                categorias: categorias
            });

        });

    })
    .catch((err) => {
        console.log(err);
        req.flash("error_msg", "Erro ao carregar categoria.");
        res.redirect("/");
    });

});

// ROTA 404 (sempre no final)
app.use(function(req, res, next){
    res.status(404).render("404");
});

//OUTROS CONEXÃOES
const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log("Servidor rodando na porta " + PORT);
});