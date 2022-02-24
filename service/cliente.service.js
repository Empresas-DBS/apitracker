const OrderDatabase = require('../database/order.database');

class ClientService {
    constructor(){
        this.order_database = new OrderDatabase();
    }

    async obtener_pedidos(id_cliente){
        const sql = "";
        const resp = await this.order_database.exec(sql);
        return resp;
    }
}

module.exports = ClientService;
