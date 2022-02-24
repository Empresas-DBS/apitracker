const express = require('express');
const fs = require('fs');
const https = require('https');
const routerApi = require('./routes/api/v1');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const cors = require('cors');

const app = express();

app.use(cors());

const port = 3005;

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-w5bwi949.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'http://localhost:3000/',
  issuer: 'https://dev-w5bwi949.us.auth0.com/',
  algorithms: ['RS256']
});

//jwt tiene que pasar para enviar el result
//app.use(jwtCheck);

//recibir información de tipo JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola mi server en Expres');
});

//TODO: llevar a servicio magento
/*
app.get('/orders', async (req, res) => {
    const orders = await magento.getOrders();
    //console.log(orders);
    res.json(orders);
});

app.get('/orders/:id/shipment/', async (req, res) => {
    const { id } = req.params;
    const order = await magento.getOrderShip(id)
    res.json(order);
})
*/


/*
app.post('/orders/shipment/complete', async (req, res) => {
});
*/

console.log(routerApi)

try {
    routerApi(app);
} catch (error) {
    console.log(error);
}


const httpsOptions = {
    cert: fs.readFileSync('dbs.crt'),
    key: fs.readFileSync('dbs.key')
}

https.createServer(httpsOptions,app).listen(port, () => {
    console.log(`Escuchando el puerto: ${port}`);
});

/*
app.listen(port, () => {
    console.log(`Escuchando el puerto: ${port}`);
})
*/