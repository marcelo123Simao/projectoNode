const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de usuario
require("../models/Usuarios")
const Usuario = mongoose.model("Usuario")

module.exports = function(passport){

    passport.use(new localStrategy(
    { usernameField: 'email', passwordField: "senha" },
    async (email, senha, done) => {

        try {
            const usuario = await Usuario.findOne({ email });

            if (!usuario) {
                return done(null, false, { message: "Esta conta não existe" });
            }

            if (!usuario.senha) {
                return done(null, false, { message: "Senha não encontrada no banco" });
            }

            const batem = await bcrypt.compare(senha, usuario.senha);

            if (!batem) {
                return done(null, false, { message: "Senha incorreta" });
            }

            return done(null, usuario);

        } catch (err) {
            return done(err);
        }
    }
));
     
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