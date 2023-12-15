import { pool } from "./db.js";

async function getQuaisSensoresTable(decodedToken) {
    try {
        // Use parameterized query to avoid SQL injection
        const query = {
            text: 'SELECT s.nome, s.num_sensor, s.tipo, a.valor_maximo FROM sensores s JOIN usuario u ON s.id_usuario = u.id JOIN alarmes a ON a.id=s.padrao_alarme WHERE u.nome_usuario = $1 AND s.status = true;',
            values: [decodedToken.name], // Pass the value as an array
            rowMode: 'json', // formato que as rows são entregues
        };
        let Sensores = await pool.query(query);
        return {
            result: true,
            sensores: Sensores.rows,
        };
    } catch (error) {
        console.log(error);
        return {
            result: false,
            error: error,
        };
    }
}

async function getDadosHistoricos(decodedToken) {
    try {
        // Use parameterized query to avoid SQL injection
        const query = {
            text: 'SELECT s.nome, s.num_sensor, s.status, s.tipo, d.data_hora, d.valor, a.valor_maximo FROM sensores s JOIN usuario u ON s.id_usuario = u.id JOIN dadossensores d ON d.num_sensor = s.num_sensor JOIN alarmes a ON a.id=s.padrao_alarme WHERE u.nome_usuario = $1;',
            values: [decodedToken.name], // Pass the value as an array
            rowMode: 'json', // formato que as rows são entregues
        };
        let Sensores = await pool.query(query);
        return {
            result: true,
            sensores: Sensores.rows,
        };
    } catch (error) {
        console.log(error);
        return {
            result: false,
            error: error,
        };
    }
}


async function getHistAlarmes(decodedToken) {
    try {
        const query = {
            text: 'SELECT h.id_historico_alarmes, s.num_sensor, s.nome, a.alarme_alto, a.alarme_baixo, h.valor_alarme, h.tipo_alarme, h.data_alarme, h.verificado FROM alarmes a JOIN sensores s ON a.id=s.padrao_alarme JOIN historico_alarmes h ON h.num_sensor_alarme = s.num_sensor JOIN usuario u ON s.id_usuario=u.id WHERE u.nome_usuario=$1',
            values: [decodedToken.name],
            rowMode: 'json' // formato que as rows são entregues
        }
        let result = await pool.query(query)
        // console.log('deu o select')
        let rows = result.rows
        console.log(rows)
        return{
            "result": rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

export{
    getQuaisSensoresTable,
    getDadosHistoricos,
    getHistAlarmes
}
