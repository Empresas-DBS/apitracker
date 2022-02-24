const express = require('express');
const TransportistaService = require('../../../service/transportista.service');

const router = express.Router();

router.get('/obtener-transportista', async (req, res)=>{
    const transportistaService = new TransportistaService();
    const { idTransportista } = req.query;
    const transportista = await transportistaService.obtenerTransportista(idTransportista);
    res.json(transportista);
});

router.get('/listar-transportistas', async (req, res)=>{
    const transportistaService = new TransportistaService();
    const transportista = await transportistaService.listarTransportistas();
    res.status(200).json(transportista);
});

router.get('/obtener-rutas', async (req, res) => {
    const { idTransportista } = req.query;
    const transportistaService = new TransportistaService();
    const rutas = await transportistaService.obtenerRutas(idTransportista);
    res.json(rutas);
});

module.exports = router;