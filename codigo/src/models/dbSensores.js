import { pool } from "./db.js";

async function getSensores () {
    const query = {
        text: 'SELECT s.id, s.data_hora, s.tipo, s.num_sensor, s.nome, s.status, u.nome_usuario, s.id_usuario, a.id as id_alarme, a.nome as nome_padrao_alarme FROM sensores s JOIN usuario u ON s.id_usuario = u.id JOIN alarmes a ON s.padrao_alarme = a.id;',
        rowMode: 'json' // formato que as rows são entregues
    }
    try {
        let Sensores     = await pool.query(query)
        // console.log('deu o select')
        // console.log(Sensores.rows)
        return{
            "result": true,
            "Sensores": Sensores.rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function postSensor(Sensor) {
    try {
        let tipo = (Sensor.tipo).toString(),
        nome = (Sensor.nome).toString(),
        status = (Sensor.status).toString(),
        usuario = (Sensor.usuario).toString(),
        sensor = (Sensor.sensor).toString(),
        padrao_alarme = (Sensor.padrao_alarme).toString(),
        date = (Sensor.date).toString()
        let verifica = await verificaJaCadastrado(usuario, sensor)
        if(verifica){
            const query = {
                text: 'INSERT INTO sensores(data_hora, tipo, num_sensor, nome, status, id_usuario, padrao_alarme) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                values: [date, tipo, sensor, nome, status, usuario, padrao_alarme]
            }
            let result = await pool.query(query)
            // console.log('deu o insert')
            return {
                "result": true
            }
        }
        return {
            "result": false,
            "error": "já cadastrado"
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function putSensor(Sensor) {
    try {
        let id = (Sensor.id).toString(),
        tipo = (Sensor.tipo).toString(),
        nome = (Sensor.nome).toString(),
        status = (Sensor.status).toString(),
        usuario = (Sensor.usuario).toString(),
        sensor = (Sensor.sensor).toString(),
        padrao_alarme = (Sensor.padrao_alarme).toString(),
        date = (Sensor.date).toString()
        let verifica = await verificaJaCadastradoAtt(usuario, sensor, id)
        if(verifica){
            const query = {
                text: 'UPDATE Sensores SET tipo = $1, nome = $2, status = $3, id_usuario = $4, num_sensor = $5, padrao_alarme = $6, data_hora = $7 WHERE id = $8;',
                values: [tipo, nome, status, usuario, sensor, padrao_alarme, date, id]
            }
            let result = await pool.query(query)
            // console.log('deu o update')
            return {
                "result": true,
                "res": result
            }
        }
        return {
            "result": false,
            "error": "já cadastrado"
        }  
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function deleteSensor(Sensor) {
    try {
        let id = (Sensor.id).toString()
        //                                   -----  id é uma primary key -----
        const query = {
            text: 'DELETE FROM Sensores WHERE id = $1;',
            values: [id]
        }
        let deletedRows = await pool.query(query)
        // console.log('deu o delete')
        return {
            "result":true,
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function verificaJaCadastrado(usuario, num_sensor) {
    const query = {
        text: 'SELECT count(id_usuario) FROM Sensores WHERE id_usuario = $1 AND num_sensor = $2;',
        values: [usuario, num_sensor],
        rowMode: 'json'
    }
    try {
        let verificacao = await pool.query(query)
        console.log(verificacao)
        if(verificacao.rows[0].count < 1)
            return true
        return false
    } catch (Error) {
        console.log(Error)
        return false
    }
}

async function verificaJaCadastradoAtt(usuario, num_sensor, id) {
    const query = {
        text: 'SELECT count(id_usuario) FROM Sensores WHERE id_usuario = $1 AND num_sensor = $2 AND id != $3;',
        values: [usuario, num_sensor, id],
        rowMode: 'json'
    }
    try {
        let verificacao = await pool.query(query)
        console.log(verificacao)
        if(verificacao.rows[0].count < 1)
            return true
        return false
    } catch (Error) {
        console.log(Error)
        return false
    }
}

export {
    getSensores,
    postSensor,
    putSensor,
    deleteSensor
}