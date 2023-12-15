import { getSensores, postSensor, putSensor, deleteSensor } from '../models/dbSensores.js'
import { middleGetAlarmeNumSensor } from './controllerAlarmes.js'

/*
    essas funções determinam o que as rotas vão fazer,
    além de qual resposta o backend entregará para
    o front, que entrega os dados para o cliente
    
    req - requisição feita pelo front
    res - resposta do back
*/

async function rotaGetSensores(req, res) {
    let result = await getSensores()
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        res.status(201).json({"result": result.Sensores}) //     !! entrega como array !! { "result": [{1},{2}...] }
    } else {
        res.status(400).json({"error": result.error})
    }
}

async function rotaInsertSensor(req, res) {
    let result = await postSensor(req.body)
    // req.body tem q conter: nome_Sensor, senha_Sensor, 
    // console.log(result, req.body)      // Mostra o que vem do banco
    if (result.result == true) {
        middleGetAlarmeNumSensor()
        res.status(201).json({"dados": req.body, "result": result.result})
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }
}

async function rotaPutSensor(req, res) {
    let result = await putSensor(req.body)
    // console.log(req.body)
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        middleGetAlarmeNumSensor()
        res.status(201).json({"dados": req.body, "result": result.result})
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }

}

async function rotaDeleteSensor(req, res) {
    let result = await deleteSensor( req.body )
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        middleGetAlarmeNumSensor()
        res.status(201).json({"dados": req.body, "deletedRows": result.result})
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }
}


export {
    rotaGetSensores,
    rotaInsertSensor,
    rotaPutSensor,
    rotaDeleteSensor
}