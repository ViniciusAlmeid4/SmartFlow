import { getDadosHistoricos, getQuaisSensoresTable, getHistAlarmes } from '../models/dbTables.js';

import jwt from 'jsonwebtoken'

import { jwtSecret } from '../services/authUsers.js';

/*
    essas funções determinam o que as rotas vão fazer,
    além de qual resposta o backend entregará para
    o front, que entrega os dados para o cliente
    
    req - requisição feita pelo front
    res - resposta do back
*/

async function rotaGetQuaisSensoresTable(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getQuaisSensoresTable(decodedToken).then((result)=>{
                    console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        res.status(200).json({"result": result.sensores}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }

    res.status(401)

}

async function rotaGetDadosHistoricos(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getDadosHistoricos(decodedToken).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        res.status(200).json({"result": result.sensores}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

function rotaGetHistAlarmes(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getHistAlarmes(decodedToken).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result != false) {
                        res.status(200).json({"result": result.result})
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

export{
    rotaGetQuaisSensoresTable,
    rotaGetDadosHistoricos,
    rotaGetHistAlarmes
}