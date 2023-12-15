import { pool } from "./db.js";
function dateNow() {
	let now = new Date();
	let timeZone = { timeZone: 'America/Sao_Paulo' };
	
	// Format the date components
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const day = String(now.getDate()).padStart(2, '0');
	
	// Format the time components
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
  
	// Create the formatted timestamp string
	let formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	
	return formattedTimestamp;
}

async function getAlarmesNumSensor() {
    try {
        const query = {
            text: 'SELECT s.num_sensor, a.alarme_alto, a.alarme_baixo, a.valor_maximo, s.tipo FROM alarmes a JOIN sensores s ON a.id=s.padrao_alarme',
            rowMode: 'json' // formato que as rows são entregues
        }
        let alarmes = await pool.query(query)
        // console.log('deu o select')
        let result = alarmes.rows
        // console.log(result)
        return{
            result
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function salvaHistAlarme(alarme) {
    try {
        const query = {
            text: 'INSERT INTO historico_alarmes(num_sensor_alarme, valor_alarme, tipo_alarme, verificado, data_alarme) VALUES($1, $2, $3, false, $4) RETURNING id_historico_alarmes',
            values: [alarme.num_sensor, alarme.valor, alarme.tipo, dateNow()],
            rowMode: 'json' // formato que as rows são entregues
        }
        let id = await pool.query(query)
        // console.log('deu o select')
        let result = id.rows[0]
        return{
            result
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function getInfoUmAlarme(dadosInfoAlarme) {
    try {
        const query = {
            text: 'SELECT s.num_sensor, s.nome, a.alarme_alto, a.alarme_baixo, h.valor_alarme, h.tipo_alarme, h.data_alarme FROM alarmes a JOIN sensores s ON a.id=s.padrao_alarme JOIN historico_alarmes h ON h.num_sensor_alarme = s.num_sensor JOIN usuario u ON s.id_usuario=u.id WHERE h.id_historico_alarmes = $1 AND u.nome_usuario=$2',
            values: [dadosInfoAlarme.id_historico_alarmes, dadosInfoAlarme.nome_usuario],
            rowMode: 'json' // formato que as rows são entregues
        }
        let id = await pool.query(query)
        // console.log('deu o select')
        let result = id.rows[0]
        console.log(result)
        return{
            result
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function putAlarmeVerificado(id) {
    try {
        const query = {
            text: 'UPDATE historico_alarmes SET verificado = true WHERE id_historico_alarmes = $1',
            values: [id],
            rowMode: 'json' // formato que as rows são entregues
        }
        let result = await pool.query(query)
        // console.log('deu o select')
        return{
            "result": true,
            "response": result
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function getAlarmes24h(decodedToken) {
    try {
        const query = {
            text: 'SELECT count(id_historico_alarmes) FROM alarmes a JOIN sensores s ON a.id=s.padrao_alarme JOIN historico_alarmes h ON h.num_sensor_alarme = s.num_sensor JOIN usuario u ON s.id_usuario=u.id WHERE u.nome_usuario=$1',
            values: [decodedToken.name],
            rowMode: 'json' // formato que as rows são entregues
        }
        let result = await pool.query(query)
        // console.log('deu o select')
        let count = result.rows[0].count
        console.log(count)
        return count
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}


export {
    getAlarmesNumSensor,
    salvaHistAlarme,
    getInfoUmAlarme,
    putAlarmeVerificado,
    getAlarmes24h
}