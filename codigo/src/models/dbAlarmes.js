import { pool } from "./db.js";

async function getDadosAlarmes() {
    try {
        const query = {
            text: 'SELECT * FROM alarmes;',
            rowMode: 'json' // formato que as rows são entregues
        }
        let alarmes = await pool.query(query)
        // console.log('deu o select')
        // console.log(alarmes.rows)
        return{
            "result": true,
            "alarmes": alarmes.rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function putAlarmes(alarme) {
    try {
        let id = (alarme.id).toString(),
        nome = (alarme.nome).toString(),
        valor_maximo = (alarme.valMax).toString(),
        alarme_alto = (alarme.almAlto).toString(),
        alarme_baixo = (alarme.almBaixo).toString()
        const query = {
            text: 'UPDATE alarmes SET nome=$1, valor_maximo=$2 ,alarme_alto=$3 ,alarme_baixo=$4 WHERE id=$5;',
            values: [nome, valor_maximo, alarme_alto, alarme_baixo, id],
            rowMode: 'json' // formato que as rows são entregues
        }
        let alarmes = await pool.query(query)
        // console.log('deu o select')
        // console.log(alarmes.rows)
        return{
            "result": true,
            "alarmes": alarmes.rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function postAlarmes(alarme) {
    try {
        let nome = (alarme.nome).toString(),
        valor_maximo = (alarme.valMax).toString(),
        alarme_alto = (alarme.almAlto).toString(),
        alarme_baixo = (alarme.almBaixo).toString()
        const query = {
            text: 'INSERT INTO alarmes(nome,valor_maximo,alarme_alto,alarme_baixo) VALUES ($1, $2, $3, $4);',
            values: [nome, valor_maximo, alarme_alto, alarme_baixo],
            rowMode: 'json' // formato que as rows são entregues
        }
        let alarmes = await pool.query(query)
        // console.log('deu o select')
        // console.log(alarmes.rows)
        return{
            "result": true,
            "alarmes": alarmes.rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function DeleteAlarmes(alarme) {
    try {
        let id = (alarme.id).toString()
        const query = {
            text: 'DELETE FROM alarmes WHERE id = $1',
            values: [id],
            rowMode: 'json' // formato que as rows são entregues
        }
        let alarmes = await pool.query(query)
        // console.log('deu o select')
        // console.log(alarmes.rows)
        return{
            "result": true
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

export {
    getDadosAlarmes,
    putAlarmes,
    postAlarmes,
    DeleteAlarmes
}