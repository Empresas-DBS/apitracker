const axios = require('axios');
const { response } = require('express');
const PedidoService = require('./pedido.service');

const baseUrl = 'https://mcstaging.dbs.cl/rest/V1/orders'

const getOrders = () => {
    const filtros = 'searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=pending&fields=items[increment_id,entity_id,status,extension_attributes[shipping_assignments[shipping]]]';
    let resp = axios.get(`${baseUrl}?${filtros}`,
        {
            headers: {
                'Authorization': 'Bearer 9yb5ehn4w0tmyud8i6rpnx5a30e17kdb'
            }
        }
    ).then((res) => {
        const orden = res.data.items.map((order) => {
            //const productos = order.
            let direccion = "Unspecified";
            let comuna = "Unspecified";
            let region = "Unspecified";

            if (order.extension_attributes.shipping_assignments[0].shipping.hasOwnProperty('address')) {
                direccion = order.extension_attributes.shipping_assignments[0].shipping.address.street[0];
                comuna = order.extension_attributes.shipping_assignments[0].shipping.address.city;
                region = order.extension_attributes.shipping_assignments[0].shipping.address.region;
            }/* else {
                console.log(order.entity_id);
            }*/

            return {
                'entity_id': order.entity_id,
                'direccion': direccion,
                'comuna': comuna,
                'region': region
            }
        })
        return {
            'status': res.status,
            'pedidos': orden
        };
    }).catch((err) => {
        console.log(err);
    });

    return resp;
}

const getOrderShip = (id) => {
    const filtros = 'fields=increment_id,entity_id,status,extension_attributes[shipping_assignments[shipping]]';

    let resp = axios.get(`${baseUrl}/${id}?${filtros}`,
        {
            headers: {
                'Authorization': 'Bearer 9yb5ehn4w0tmyud8i6rpnx5a30e17kdb'
            }
        }
    ).then((res) => {
        const order = res.data;

        if (order.extension_attributes.shipping_assignments[0].shipping.hasOwnProperty('address')) {
            direccion = order.extension_attributes.shipping_assignments[0].shipping.address.street[0];
            comuna = order.extension_attributes.shipping_assignments[0].shipping.address.city;
            region = order.extension_attributes.shipping_assignments[0].shipping.address.region;
        }

        return {
            'entity_id': order.entity_id,
            'direccion': direccion,
            'nombre': order.extension_attributes.shipping_assignments[0].shipping.address.firstname + ' ' + order.extension_attributes.shipping_assignments[0].shipping.address.lastname
        }
    }).catch((err) => {
        console.log(err);
    });
    //console.log(resp);
    return resp;
}

const postEnRutaDespacho = (entity_id)=>{
    var data = JSON.stringify({
        "entity": {
            "entity_id": entity_id,
            "state": "complete",
            "status": "complete_enrutaconempresad"
        }
    });

    let resp = axios.post(`${baseUrl}`, data, {
        headers: {
            'Authorization': 'Bearer 9yb5ehn4w0tmyud8i6rpnx5a30e17kdb',
            'Content-Type': 'application/json',
            'Cookie': 'PHPSESSID=5d8482d0e21b586fe4cf28416691b946;'
        },
    })
    .then(function (response) {
        return {estado: "El pedido volvió a En Ruta", status:200};
    })
    .catch(function (error) {
        //console.log(error);
        return {estado: "Magento error - no se pudo volver a Listo para despacho", status:401};
    });

    return resp;
}

//TODO: Generar log para errores - (Backend, SQL, Volumen Docker)
const postEntregarPedido = (entityId, nroPedido) => {
    var data = JSON.stringify({
        "entity": {
            "entity_id": entityId,
            "state": "complete",
            "status": "complete_entregado"
        }
    });

    let resp = axios.post(`${baseUrl}`, data, {
        headers: {
            'Authorization': 'Bearer 9yb5ehn4w0tmyud8i6rpnx5a30e17kdb',
            'Content-Type': 'application/json',
            'Cookie': 'PHPSESSID=5d8482d0e21b586fe4cf28416691b946;'
        },
    })
    .then(async function (response) {
        //console.log(JSON.stringify(response.data));
        const pedidoService = new PedidoService();
        const result = await pedidoService.entregarPedido(nroPedido);

        if(result.estado === "ADR Error - no se pudo actualizar"){
            const message = await postEnRutaDespacho(entityId);
            return [result, message];
        }else{
            return result;
        }
    })
    .catch(function (error) {
        console.log(error);
        const message = {estado: "Magento error - no se pudo actualizar", cantRegistros: 0, status:401};
        return message;
    });

    return resp;
}

module.exports = {
    getOrders,
    getOrderShip,
    postCompleteOrder: postEntregarPedido
}