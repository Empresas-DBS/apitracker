const OrderDatabase = require('../database/order.database');

class TransportistaService {
    constructor() {
        this.order_database = new OrderDatabase();
    }

    async obtenerTransportista(idTransportista) {
        let result = {}
        try {
            if (idTransportista !== "") {
                const sql = "SELECT user_id, username, firstname, lastname, email FROM oc_user WHERE user_group_id = 16 AND user_id = '" + idTransportista + "' AND courier_id = 2";
                result = await this.order_database.exec(sql);
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

    async listarTransportistas() {
        let result = [];
        try {
            const sql = "SELECT user_id, username, firstname, lastname, email FROM oc_user WHERE user_group_id = 16 AND courier_id = 2";
            result = await this.order_database.exec(sql);
        } catch (error) {
            result = {
                estado: "ADR Error - " + error.code,
                status: 400
            }
        } finally {
            return result;
        }
    }

    async obtenerRutas(idTransportista) {
        let result = [];
        try {
            if (idTransportista !== "") {
                const sql = "SELECT  " +
                    "RU.idRuta AS 'nroRuta', " +
                    "RU.nroPedidos, " +
                    "CASE WHEN revisar=0 THEN 'Pendiente' ELSE 'Revisada' END AS estadoRevision " +
                    "FROM " +
                    "(SELECT  " +
                    "oc_ru.order_ruta_id AS 'idRuta', " +
                    "COALESCE((SELECT  " +
                    "COUNT(rup_sub.revisar) " +
                    "FROM " +
                    "oc_order_ruta ru_sub " +
                    "INNER JOIN oc_order_ruta_pedidos rup_sub ON rup_sub.order_ruta_id = ru_sub.order_ruta_id " +
                    "INNER JOIN oc_order or_sub ON or_sub.order_id = rup_sub.order_id " +
                    "WHERE " +
                    "rup_sub.order_ruta_id = oc_ru.order_ruta_id " +
                    "AND ru_sub.id_despachador = oc_ru.id_despachador " +
                    "AND rup_sub.revisar = 1 " +
                    "GROUP BY ru_sub.order_ruta_id), 0) AS 'estadoRevision', " +
                    "COALESCE((SELECT  " +
                    "COUNT(*) " +
                    "FROM " +
                    "oc_order_ruta ru_sub " +
                    "INNER JOIN oc_order_ruta_pedidos rup_sub ON rup_sub.order_ruta_id = ru_sub.order_ruta_id " +
                    "INNER JOIN oc_order or_sub ON or_sub.order_id = rup_sub.order_id " +
                    "WHERE " +
                    "rup_sub.order_ruta_id = oc_ru.order_ruta_id " +
                    "AND ru_sub.id_despachador = oc_ru.id_despachador " +
                    "GROUP BY ru_sub.order_ruta_id), 0) AS 'nroPedidos', " +
                    "oc_ru.revisar " +
                    "FROM " +
                    "oc_order_ruta oc_ru " +
                    "INNER JOIN oc_order_ruta_pedidos rup ON rup.order_ruta_id = oc_ru.order_ruta_id " +
                    "INNER JOIN oc_order orc ON orc.order_id = rup.order_id " +
                    "WHERE " +
                    "oc_ru.order_ruta_status_id = 2 " +
                    "AND oc_ru.id_despachador = " + idTransportista + " " +
                    "GROUP BY oc_ru.order_ruta_id " +
                    "ORDER BY oc_ru.order_ruta_id DESC) AS RU " +
                    "WHERE 1 = 1 ";
                //console.log(sql);
                result = await this.order_database.exec(sql);
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
}

module.exports = TransportistaService