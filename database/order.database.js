const mysql = require('mysql');

class OrderDatabase {
    constructor(){
        this.db = mysql.createConnection({
            host: '207.246.78.100',
            user: 'Dbs.2014,',
            password: 'P4dYyCv9ew9wnxQe',
            database:'oc3'
        })
    }

    exec(sql){
        return new Promise((resolve, reject) => {
            this.db.query(sql, (err, result)=>{
                if(err){reject(err);}
                else{resolve(JSON.parse(JSON.stringify((result.length==1) ? result[0] : result)));}
            });
        });
    }
}

module.exports = OrderDatabase