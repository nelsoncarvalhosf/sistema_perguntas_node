const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/',(req,res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas => {
        res.render('index',{
            perguntas: perguntas
        })
    })
})

app.get('/perguntar',(req,res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta',(req,res) => {
    titulo = req.body.titulo
    descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id',(req,res) => {
    id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: id}
            }).then(respostas => {
                res.render('pergunta',{
                    pergunta:pergunta,
                    respostas:respostas 
                })
            })
        } else {
            res.redirect('/')
        }
    })

})

app.post('/salvarresposta',(req,res) => {
    perguntaId = req.body.perguntaId
    descricao = req.body.descricao
    Resposta.create({
        perguntaId: perguntaId,
        descricao: descricao
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId)
    })
})


app.listen(3000)