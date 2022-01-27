const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const usuarios = require('./routes/usuarios')
const app = express();
const morgan = require('morgan');
const config = require('config');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

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



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el perto ${port}`);
})