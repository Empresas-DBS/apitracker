const OrderDatabase = require('../database/order.database');

class RutaService {

    constructor() {
        this.order_database = new OrderDatabase();
    }

    async listarPedidos(nroRuta) {
        let result = [];
        try {
            if (nroRuta !== "") {
                const sql = "SELECT  " +
                    "ru.order_ruta_id AS nroRuta, " +
                    "oc.order_id AS nroPedido, " +
                    "ru.id_despachador AS idTransportista, " +
                    "oc.shipping_address_1 AS direccion, " +
                    "CONCAT(UCASE(LEFT(oc.shipping_zone, 1)), " +
                    "LCASE(SUBSTRING(oc.shipping_zone, 2))) AS comuna, " +
                    "CASE " +
                    "WHEN rp.revisar = 1 THEN 'Revisado' " +
                    "ELSE 'Revisar' " +
                    "END AS estadoRevision " +
                    "FROM " +
                    "oc_order_ruta ru " +
                    "INNER JOIN " +
                    "oc_order_ruta_pedidos rp ON ru.order_ruta_id = rp.order_ruta_id " +
                    "INNER JOIN " +
                    "oc_order oc ON rp.order_id = oc.order_id " +
                    "INNER JOIN " +
                    "oc_order_status oc_s ON oc.order_status_id = oc_s.order_status_id " +
                    "WHERE " +
                    "ru.order_ruta_id = " + nroRuta;

                result = await this.order_database.exec(sql);
            } else {
                result = {
                    estado: "ADR Error - No se ingreso el Nro de ruta",
                    status: 400
                }
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

    async cambiarEstadoRuta(nroRuta, idEstado = 3) {
        let result = {};
        try {
            if (nroRuta !== "") {
                const sql = "UPDATE oc_order_ruta SET order_ruta_status_id=" + idEstado + " WHERE order_ruta_id = " + nroRuta;
                //console.log(sql);
                const resp = await this.order_database.exec(sql);
                //console.log(result);
                if (resp.affectedRows > 0) {
                    result = {
                        estado: "Actualizado",
                        cantRegistros: resp.affectedRows,
                        status: 200
                    }
                } else {
                    result = {
                        estado: "ADR Error - No se pudo actualizar la ruta",
                        cantRegistros: resp.affectedRows,
                        status: 400
                    }
                }
            } else {
                result = {
                    estado: "No se pudo actualizar",
                    cantRegistros: 0,
                    status: 200
                }
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

    async finalizarRuta(nroRuta) {
        let result = {};

        try {
            if (nroRuta !== "") {
                const sql = "UPDATE oc_order_ruta SET order_ruta_status_id = 4 WHERE order_ruta_id = " + nroRuta;

                const resp = await this.order_database.exec(sql);


                if (resp.affectedRows > 0) {
                    result = {
                        estado: "actualizado",
                        cantRegistros: resp.affectedRows,
                        status: 200
                    }
                } else {
                    result = {
                        estado: "ADR Error - No se pudo actualizar la ruta",
                        cantRegistros: resp.affectedRows,
                        status: 400
                    }
                }
            } else {
                result = {
                    estado: "No se ingresó el ID de la ruta"
                }
            }
        } catch (error) {
            result = {
                estado: "ADR Error - " + error.code + " - " + error.sqlMessage,
                cantRegistros: resp.affectedRows,
                status: 400
            }
        } finally {
            return result;
        }
    }

    async revisarRuta(nroRuta, idEstado = 1) {
        let result = {};

        try {
            if (nroRuta !== "") {
                const sql = "UPDATE oc_order_ruta SET revisar = " + idEstado + " WHERE order_ruta_id = " + nroRuta;
                const resp = await this.order_database.exec(sql);
                //console.log(resp.affectedRows);
                if (resp.affectedRows > 0) {
                    result = {
                        estado: "actualizado",
                        cantRegistros: resp.affectedRows,
                        status: 200
                    }
                } else {
                    result = {
                        estado: "ADR Error - No se pudo actualizar la ruta",
                        cantRegistros: resp.affectedRows,
                        status: 400
                    }
                }
            } else {
                result = {
                    estado: "No se ingresó el ID de la ruta"
                }
            }
        } catch (error) {
            result = {
                estado: "ADR Error - " + error.code + " - " + error.sqlMessage,
                cantRegistros: resp.affectedRows,
                status: 400
            }
        } finally {
            return result;
        }
    }
}

module.exports = RutaService;