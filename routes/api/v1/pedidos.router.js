const express = require('express');
const PedidoService = require('../../../service/pedido.service');
const magento = require('../../../service/magento.service');
const router = express.Router();

const pedidoService = new PedidoService();

router.get('/revisar-pedido', async (req, res) => {
    const { nroRuta, nroPedido, idEstado } = req.query;
    const resp = await pedidoService.revisarPedido(nroRuta, nroPedido, idEstado);
    res.status(resp.status).json(resp);
});

router.get('/obtener-pedido-ruta', async (req, res) => {
    const { nroPedido, nroRuta } = req.query;
    const pedidos = await pedidoService.obtenerPedidoRuta(nroPedido, nroRuta);
    res.json(pedidos);
});

router.post('/entregar-pedido', async (req, res) => {
    const { nroPedido, entityId } = req.query;
    const result = await magento.postCompleteOrder(entityId, nroPedido);
    res.json(result);
});

module.exports = router;
