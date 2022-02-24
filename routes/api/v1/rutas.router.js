const express = require('express');
const RutaService = require('../../../service/ruta.service')

const router = express.Router();

router.get('/listar-pedidos', async (req, res) => {
    const { nroRuta } = req.query;
    console.log(nroRuta);
    const rutaService = new RutaService();
    const pedidos = await rutaService.listarPedidos(nroRuta);
    let status;

    if (pedidos.length == 0) {
        status = 202
    } else {
        status = 200
    }

    res.status(status).json(pedidos);
});

router.get('/cambiar-estado', async (req, res) => {
    const rutaService = new RutaService();
    const { nroRuta, idEstado } = req.query;
    const result = await rutaService.cambiarEstadoRuta(nroRuta, idEstado)
    res.status(result.status).json(result);
});

router.get('/revisar-ruta', async (req, res)=>{
    const rutaService = new RutaService();
    const { nroRuta, idEstado } = req.query;
    const result = await rutaService.revisarRuta(nroRuta, idEstado);
    res.status(result.status).json(result);
});

router.get('/finalizar-ruta-transportista', async (req, res) => {
    const rutaService = new RutaService();
    const { nroRuta } = req.query
    const result = await rutaService.finalizarRuta(nroRuta)
    res.status(result.status).json(result);
});



module.exports = router;