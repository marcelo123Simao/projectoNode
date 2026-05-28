const express = require('express');
const router = express.Router();
exports.router = router;
const Categoria = require('../models/Categoria');
const Postagem = require("../models/postagem");
const {eAdmin} = require("../helpers/eAdmin")

//const Categoria = mongoose.model('Categorias');


router.get('/', function(req, res) {
    res.render("admin/index");
})

//rota que exine as categorias
router.get('/categorias', eAdmin, function(req, res) {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/categorias", { categorias: categorias });
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar categorias");
        res.redirect('/admin');
    });
});

//Rota que guarda as novas categorias
router.post('/categorias/nova', eAdmin, function(req, res) {
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({msg: "Nome da categoria é obrigatório!"});
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({msg: "Slug da categoria é obrigatório!"});
    }
    if(erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros});
    } else {
        const { nome, slug } = req.body;
        const novaCategoria = new Categoria({
            nome: nome,
            slug: slug
    });

        novaCategoria.save()
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!");
                res.redirect('/admin/categorias');
            })
            .catch((err) => {
                req.flash("error_msg", "Erro ao criar categoria");
                res.redirect('/admin/categorias');
            });
    }
});

//Rota do formulario de adicionar novas categorias
router.get('/categorias/add',function(req, res) {
    res.render("admin/addcategorias");
});

//Rota para editar categorias
router.get('/categorias/edit/:id', eAdmin, (req, res) => {
    Categoria.findById(req.params.id).lean().then((categoria) => {
        res.render("admin/editCategoria", { categoria: categoria });
    }).catch((err) => {
        req.flash("error_msg", "Categoria não encontrada");
        res.redirect('/admin/categorias');
    });
});

//ROTA QUE GUARDA A CATEGORIA EDITADA
router.post('/categorias/edit', eAdmin, (req, res) => {
    Categoria.findOneAndUpdate(
        { _id: req.body.id },
        { nome: req.body.nome, slug: req.body.slug }
    ).then(() => {
        req.flash("success_msg", "Categoria editada com sucesso");
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar categoria");
        res.redirect('/admin/categorias');
    });
});

//ROTA QUE DELETA AS CATEGORIAS PELO SEU ID
router.post('/categorias/deletar', async (req, res) => {
    try {
        await Categoria.findByIdAndDelete(req.body.id)
        req.flash("success_msg", "Categoria Deletada com Sucesso")
        res.redirect('/admin/categorias')
    } catch (err) {
        req.flash("error_msg", "Erro ao Deletar Categoria")
        res.redirect('/admin/categorias')
        res.render("/admin/postagem")
    }
});

//ROTA PARA MOSTRAR O FORMULARIO DE ADICIONAR NOVAS POSTAGENS 
/*router.get("/postagens/add", (req, res) => {
    Postagem.find().lean().then((postes) => { 
        console.log("Categorias:", postes)
        res.render("admin/addpostagem", { postes: postes })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})
*/

router.get("/postagens/add",(req, res) => {

    Categoria.find().lean()

    .then((categorias) => {

        console.log("Categorias:", categorias)

        res.render("admin/addpostagem", {
            categorias: categorias
        })

    })

    .catch((err) => {

        console.log(err)

        req.flash("error_msg", "Houve um erro ao carregar o formulário")

        res.redirect("/admin")

    })

})
//ROTA PARA GUARDAR AS NOVAS POSTAGENS
router.post('/postagens/nova', eAdmin, function(req, res) {
    var erros = [];
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({msg: "Nome da categoria é obrigatório!"});
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({msg: "Slug da categoria é obrigatório!"});
    }
    
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({msg: "Descriçãõ da categoria é obrigatório!"});
    }
    
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({msg: "Conteúdo da categoria é obrigatório!"});
    }
     
    if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null) {
        erros.push({msg: "Categoria da categoria é obrigatório!"});
    }

    if(erros.length > 0) {
        res.render("admin/addpostagem", {erros: erros});
    } 
    else {
        const { titulo, slug, descricao, conteudo, categoria } = req.body;
        const novaPostagem = new Postagem({
        titulo,
        slug,
        descricao,
        conteudo,
        categoria
});
     novaPostagem.save()
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!");
                res.redirect('/admin/postagens');
            })
            .catch((err) => {
                req.flash("error_msg", "Erro ao criar categoria");
                res.redirect('/admin');
            });
    }
});

//rota que exine as postagens 
router.get('/postagens', eAdmin, function(req, res) {
    Postagem.find().lean().then((posts) => {
        res.render("admin/postagem", { posts: posts });
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar a postagem");
        res.redirect('/admin');
    });
});

//Rota do formulario de editar postagens
router.get('/editpostagem/:id', eAdmin, function(req, res) {
    Postagem.findById(req.params.id).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) =>{
           res.render("admin/editpostagem", { 
               categorias: categorias, 
               postagem: postagem 
           });
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect('/admin/postagens');
        });
       
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
        res.redirect('/admin/postagens');
    });
});

router.post('/postagens/edit', eAdmin, function(req, res) {
    Postagem.findById(req.body.id).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo= req.body.conteudo
        postagem.categoria = req.body.categoria
        
          postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!");
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash("error_msg", "Erro ao editar postagem");
            res.redirect('/admin/postagens');
        });
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar a postagem");
        res.redirect('/admin');
    });
});

//ROTA QUE DELETA AS POSTAGENS PELO SEU ID
router.post('/postagem/deletar', eAdmin,  async (req, res) => {
    try {
        await Postagem.findByIdAndDelete(req.body.id)
        req.flash("success_msg", "Postagens deletada com sucesso")
        res.redirect('/admin/postagens')
    } catch (err) {
        req.flash("error_msg", "Erro ao deletar postagens")
        res.redirect('/admin/postagens')
        res.render("/admin/postagens")
    }
});

module.exports = router;