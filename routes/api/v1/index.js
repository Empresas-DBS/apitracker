const express = require('express');
const carriersRouter = require('./transportista.router');
const pedidosRouter = require('./pedidos.router');
const rutaRouter = require('./rutas.router');

function routerApi(app){
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/transportistas', carriersRouter);
    router.use('/pedidos', pedidosRouter);
    router.use('/rutas', rutaRouter);
}

module.exports = routerApi;