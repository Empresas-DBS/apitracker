const OrderDatabase = require('../database/order.database');

class PedidoService {
    constructor() {
        this.order_database = new OrderDatabase();
    }

    async revisarPedido(nroRuta, nroPedido, idEstado = 1) {
        let result = {};
        try {
            if (nroRuta !== "" && nroPedido !== "") {
                const sql = "UPDATE oc_order_ruta_pedidos SET revisar=" + idEstado + " WHERE order_ruta_id =" + nroRuta + " AND order_id=" + nroPedido;
                const resp = await this.order_database.exec(sql);

                if (resp.affectedRows > 0) {
                    result = {
                        estado: "actualizado",
                        cantRegistros: resp.affectedRows,
                        status: 200
                    }
                } else {
                    result = {
                        estado: "ADR Error - No se pudo actualizar la revisión",
                        cantRegistros: resp.affectedRows,
                        status: 400
                    }
                }
            }
            else if (nroRuta === "" && nroPedido === "") {
                result = {
                    estado: "ADR Error - No se ingresó la ruta ni el pedido",
                    cantRegistros: 0,
                    status: 400
                }
            }
            else if (nroRuta === "") {
                result = {
                    estado: "No ingresó el ID de la ruta",
                    cantRegistros: 0,
                    status: 400
                }
            } else if (nroPedido === "") {
                result = {
                    estado: "No ingresó el ID del pedido",
                    cantRegistros: 0,
                    status: 400
                }
            }
        } catch (error) {
            result = {
                estado: "ADR Error - " + error.code + " - " + error.sqlMessage,
                cantRegistros: 0,
                status: 400
            }
        } finally {
            return result;
        }
    }

    async obtenerPedidoRuta(nroPedido, nroRuta) {
        let result = {};
        try {
            if (nroPedido !== "" && nroRuta !== "") {
                const sql = "SELECT ru.order_ruta_id AS nroRuta, oc.order_id AS nroPedido, oc.entity_id AS entityId,ru.id_despachador AS idTransportista, DATE_FORMAT(oc.date_added, '%d-%m-%Y %H:%i') AS fechaCompra,oc.order_status_id AS statusOrder," +
                    "oc.shipping_address_1 AS direccion, TRIM(oc.firstname) AS nombreCliente, oc.shipping_company AS rutCliente, telephone AS telefonoCliente," +
                    "CONCAT(UCASE(LEFT(oc.shipping_zone, 1)), LCASE(SUBSTRING(oc.shipping_zone, 2))) AS comuna, " +
                    "CASE WHEN rp.revisar = 1 THEN 'Revisado' ELSE 'Revisar' END AS estadoRevision " +
                    "FROM oc_order_ruta ru " +
                    "INNER JOIN oc_order_ruta_pedidos rp ON ru.order_ruta_id = rp.order_ruta_id " +
                    "INNER JOIN oc_order oc ON rp.order_id = oc.order_id " +
                    "INNER JOIN oc_order_status oc_s ON oc.order_status_id = oc_s.order_status_id " +
                    "WHERE oc.order_id=" + nroPedido +" "+
                    "AND ru.order_ruta_id = "+nroRuta;

                result = await this.order_database.exec(sql);
            }else{
                result = {};
            }
        } catch (error) {
            result = {
                estado: "ADR Error - " + error.code,
                status: 400
            }
        } finally {
            return result;
        }

    }

    async entregarPedido(nroPedido) {
        let result = {};
        try {
            if(nroPedido !== ""){
                const sql = "UPDATE oc_order SET order_status_id = 20 WHERE order_id='" + nroPedido + "'";
    
                const resp = await this.order_database.exec(sql);
    
                if (resp.affectedRows > 0) {
    
                    const hoy = new Date();
                    const fecha_hoy = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();
                    const sql = "INSERT INTO oc_order_history (order_id, order_status_id, notify, comment, date_added, username) VALUES ('" + nroPedido + "',20,1, 'PEDIDO ENTREGADO','" + fecha_hoy + "',0)";
                    const resp = await this.order_database.exec(sql);
    
                    if (resp.affectedRows > 0) {
                        result = {
                            estado: "actualizado",
                            cantRegistros: resp.affectedRows,
                            status: 200
                        }
                    } else {
                        result = {
                            estado: "ADR Error - No se puede ingresar el registro de entrega",
                            cantRegistros: resp.affectedRows,
                            status: 400
                        }
                    }
                } else {
                    result = {
                        estado: "ADR Error - no se pudo actualizar",
                        cantRegistros: resp.affectedRows,
                        status: 400
                    }
                }
            }
        } catch (error) {
            result = {
                estado: "ADR Error - " + error.code + " - " + error.sqlMessage,
                status: 400
            }
        } finally {
            return result;
        }
    }

}

module.exports = PedidoService;