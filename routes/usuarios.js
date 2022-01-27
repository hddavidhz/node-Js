const express = require('express');
const Joi = require('joi');
const route = express.Router();

const usuarios =[
    {id:1, nombre:'harold'},
    {id:2, nombre:'liliana'},
    {id:3, nombre:'sebastian'},
    {id:4, nombre:'valentina'},
    {id:4, nombre:'David'}
];

route.get('/',  (req, res) => {
    res.send(usuarios)
});

route.get('/:id', (req, res) =>{
    
    let usuario = buscarUsuario(req.params.id);

    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }else
        res.send(usuario);
    
})

route.post('/', (req, res) => {

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

route.put('/:id', (req, res) =>{
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

route.delete('/:id', (req, res) =>{
    let usuario = buscarUsuario(req.params.id);

    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }
    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)
    res.status(200).send(usuario);
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

module.exports=route;