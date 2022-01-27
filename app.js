const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const Joi = require('joi');
const app = express();
const morgan = require('morgan');
const config = require('config');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//Configuracion de entornos

console.log('Aplicacion: ' + config.get('nombre'))
console.log('Base de datos server ' +  config.get('configDb.host'))

//Uso de un middleware de tercero - Morgan
if(app.get('env') == 'development'){
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado...');
    inicioDebug('Morgan esta habilitado...')
}

//Trabajos con  las base de datos

dbDebug('conectando con la bd...')

const usuarios =[
    {id:1, nombre:'harold'},
    {id:2, nombre:'liliana'},
    {id:3, nombre:'sebastian'},
    {id:4, nombre:'valentina'},
    {id:4, nombre:'David'}
];

app.get('/api/usuarios',  (req, res) => {
    res.send(usuarios)
});

app.get('/api/usuarios/:id', (req, res) =>{
    
    let usuario = buscarUsuario(req.params.id);

    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }else
        res.send(usuario);
    
})

app.post('/api/usuarios', (req, res) => {

    const {error, value} = validarUsuario(req.body.nombre);

    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.status(201).send(usuario)
    }else{
        res.status(400).send(error.message);
        return;
    }
});

app.put('/api/usuarios/:id', (req, res) =>{
    let usuario = buscarUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }
    
    const {error, value} = validarUsuario(req.body.nombre)
    if(error){
        res.status(400).send(error.message);
        return;
    }
     usuario.nombre = value.nombre;
     res.send(usuario);
})

app.delete('/api/usuarios/:id', (req, res) =>{
    let usuario = buscarUsuario(req.params.id);

    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }
    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)
    res.status(200).send(usuario);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el perto ${port}`);
})

function buscarUsuario(id){
    let usuario = usuarios.find(u => u.id === parseInt(id));
    return usuario;
}

function validarUsuario(value){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({nombre: value}));
}