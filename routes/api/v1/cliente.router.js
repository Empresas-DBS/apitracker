const express = require('express');

const ClienteService = require('../../../service/cliente.service');

const router = express.Router();
const clienteService = new ClienteService();

router.get('/obtener-pedidos', async(req, res)=>{
    const {idCliente} = req.query;
    const pedidosCliente = await clienteService.obtener_pedidos(idCliente);
    res.json(pedidosCliente);
})