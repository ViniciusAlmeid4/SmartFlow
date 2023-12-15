import { getNumSensoresUsuarioAtivos, getQuaisSensoresUsuario, getSensoresUsuario } from '../models/dbGraficos.js';

import jwt from 'jsonwebtoken'

import { jwtSecret } from '../services/authUsers.js';

import { qntPorMin } from '../app.js';

/*
    essas funções determinam o que as rotas vão fazer,
    além de qual resposta o backend entregará para
    o front, que entrega os dados para o cliente
    
    req - requisição feita pelo front
    res - resposta do back
*/

async function rotaGetSensoresUsuario(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getSensoresUsuario(req.body, decodedToken).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        res.status(201).json({"result": result.sensores}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

async function rotaGetNumSensoresUsuarioAtivos(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getNumSensoresUsuarioAtivos(decodedToken.name).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        res.status(201).json({"result": result.sensores[0].count}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
}

async function rotaGetQuaisSensoresUsuario(req, res) {
    let token = req.cookies.jwt
    if (!token) {
        res.status(401)
    }else{
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(401)
            } else {
                getQuaisSensoresUsuario(decodedToken).then((result)=>{
                    res.status(200).json(result)
                })
            }
        })
    }
}

async function rotaGetDadosPorMin(req, res){
    let token = req.cookies.jwt
    if (!token) {
        res.status(401)
    }else{
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(401)
            } else {
                res.status(200).json({"result": qntPorMin})
            }
        })
    }
}

export {
    rotaGetSensoresUsuario,
    rotaGetNumSensoresUsuarioAtivos,
    rotaGetQuaisSensoresUsuario,
    rotaGetDadosPorMin
}