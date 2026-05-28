const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuarios");
const passport = require("passport")

//CAMPO DE REGISTRO PARA O FORMULARIO
router.get('/registro', function(req, res) {
    res.render("usuarios/registro");
});

router.get('/login', function(req, res) {
    res.render("usuarios/login");
}); 

router.get('/', function(req, res) {
    res.render("usuarios/index");
}); 
//ROTA QUE SALVA OS DADOS DO FORMULARIO
router.post("/registrar", async (req, res) => {

    let erros = [];

    const { nome, email, senha, senha2 } = req.body;

    // =========================
    // VALIDAÇÃO DO NOME
    // =========================
    if (!nome || nome.trim() === "") {
        erros.push({ msg: "Nome é obrigatório" });
    } else if (nome.length < 3) {
        erros.push({ msg: "O nome deve ter pelo menos 3 caracteres" });
    }

    // =========================
    // VALIDAÇÃO DO EMAIL
    // =========================
    if (!email || email.trim() === "") {
        erros.push({ msg: "Email é obrigatório" });
    } else if (!email.includes("@")) {
        erros.push({ msg: "Email inválido" });
    }

    // =========================
    // VALIDAÇÃO DA SENHA
    // =========================
    if (!senha) {
        erros.push({ msg: "Senha é obrigatória" });
    } else if (senha.length < 6) {
        erros.push({ msg: "A senha deve ter pelo menos 6 caracteres" });
    }

    if (senha !== senha2) {
        erros.push({ msg: "As senhas não coincidem" });
    }

    // =========================
    // SE HOUVER ERROS → FLASH
    // =========================
    if (erros.length > 0) {

        erros.forEach(erro => {
            req.flash("error_msg", erro.msg);
        });

        return res.redirect("/usuarios/registro");
    }

    // =========================
    // VERIFICAR EMAIL EXISTENTE
    // =========================
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
        req.flash("error_msg", "Já existe uma conta com este email");
        return res.redirect("/usuarios/registro");
    }

    try {

        // =========================
        // HASH SENHA
        // =========================
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        // =========================
        // CRIAR USUÁRIO
        // =========================
        const novoUsuario = new Usuario({
            nome,
            email,
            senha: hash,
            eAdmin:1
        });

        await novoUsuario.save();

        req.flash("success_msg", "Conta criada com sucesso!");
        res.redirect("/usuarios/login");

    } catch (err) {

        console.log(err);
        req.flash("error_msg", "Erro interno ao criar conta");
        res.redirect("/usuarios/registro");
    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next);
});

// DE LOGOUT/SAIR
router.get('/logout', (req, res, next) => {

    req.logout(function(err) {

        if(err){
            return next(err)
        }
        req.flash("success_msg", "Deslogado com sucesso")
        res.redirect('/')

    })

})
module.exports = router;