const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de usuario
require("../models/Usuarios")
const Usuario = mongoose.model("Usuario")

module.exports = function(passport){

    passport.use(new localStrategy({ usernameField: 'email', passwordField:"senha" }, (email, senha, done) => {
        Usuario.findOne({ email: email }).then(usuario => {
            if (!usuario) {
                return done(null, false, { message: "Esta conta não existe" });
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if (batem) {
                    return done(null, usuario);
                }
                return done(null, false, { message: "Senha incorreta" });
            });
        }).catch(err => done(err));
    }));
     
    //GUARDA OS DADOS NA SESSÃO
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then(usuario => {
            done(null, usuario);
        }).catch(err => done(err, null));
    });
}