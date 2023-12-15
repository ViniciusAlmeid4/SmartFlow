import { pool } from "./db.js";

async function getSensoresUsuario (reqBody, decodedToken) { // + um param --nome_usuario-- + join sensor com usuario
    // faz a query de id_usuario com o nome do cookie e dps joga o id na query de baixo
    // ou coloca o id junto nos cookies e só puxa
    const query = {
        text: 'SELECT s.nome, num_sensor, valor_maximo FROM sensores s JOIN usuario u ON s.id_usuario = u.id JOIN alarmes a ON s.padrao_alarme = a.id WHERE s.status = true AND s.tipo = $1 AND u.nome_usuario = $2;', 
        values: [reqBody.tipo, decodedToken.name],
        rowMode: 'json' // formato que as rows são entregues
    }
    try {
        let Sensores = await pool.query(query)
        // console.log('deu o select')
        // console.log(Sensores.rows)
        return{
            "result": true,
            "sensores": Sensores.rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function getQuaisSensoresUsuario(decodedToken) {
    // Use parameterized query to avoid SQL injection
    const query = {
        text: 'SELECT s.num_sensor FROM sensores s JOIN usuario u ON s.id_usuario = u.id WHERE s.status = true AND u.nome_usuario = $1;',
        values: [decodedToken.name], // Pass the value as an array
        rowMode: 'json', // formato que as rows são entregues
    };
    try {
        let Sensores = await pool.query(query);
        // console.log('deu o select')
        // console.log(Sensores.rows)
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
  

async function getNumSensoresUsuarioAtivos (nome_usuario) { // + um param --nome_usuario-- + join sensor com usuario
    const query = {
        text: 'SELECT count(s.nome) FROM sensores s JOIN usuario u ON s.id_usuario = u.id WHERE s.status = true AND u.nome_usuario = $1;',
        values: [nome_usuario],
        rowMode: 'json' // formato que as rows são entregues
    }
    try {
        let Sensores = await pool.query(query)
        // console.log('deu o select')
        console.log(Sensores.rows)
        return{
            "result": true,
            "sensores": Sensores.rows
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
    getSensoresUsuario,
    getNumSensoresUsuarioAtivos,
    getQuaisSensoresUsuario
}