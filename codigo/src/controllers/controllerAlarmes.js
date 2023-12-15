import jwt from 'jsonwebtoken'

import { jwtSecret } from '../services/authUsers.js';

import { DeleteAlarmes, getDadosAlarmes, postAlarmes, putAlarmes } from '../models/dbAlarmes.js';

import { getQuaisSensoresUsuario } from '../models/dbGraficos.js';

import { alarmeVerificado, alarmesAtivos } from '../services/verificaAlarmes.js';

import { getInfoUmAlarme, putAlarmeVerificado, getAlarmesNumSensor, getAlarmes24h } from '../models/dbHistAlarme.js';

async function rotaGetDadosAlarmes(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getDadosAlarmes().then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        res.status(201).json({"result": result.alarmes}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

// Declare the global variable
let padrao_alarme = []

// Middleware function to get and update alarm data
function middleGetAlarmeNumSensor() {
    try {
        // Fetch alarm data
        getAlarmesNumSensor().then((result)=>{
            // Update the global variable
            let resultBanco = result.result
            resultBanco.forEach(i => {
                if (i.tipo != 2) {

                    i.alarme_alto = (i.alarme_alto * 1023) / i.valor_maximo
                
                    i.alarme_baixo = (i.alarme_baixo * 1023) / i.valor_maximo
                }
            });

            return resultBanco
        }).then((result)=>{
            padrao_alarme = result
            console.log(padrao_alarme)
        })
    } catch (error) {
        // Handle errors, you might want to send an error response
        console.error('Error in middleGetAlarmeNumSensor:', error)
    }
}

async function rotaPutAlarmes(req, res, next) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                putAlarmes(req.body).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        // middleGetAlarmeNumSensor()
                        res.status(201).json({"result": result.alarmes}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }

    res.status(401)
}

async function rotaPostAlarmes(req, res, next) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                postAlarmes(req.body).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        // middleGetAlarmeNumSensor()
                        res.status(201).json({"result": result.alarmes}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

async function rotaDeleteAlarmes(req, res, next) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                DeleteAlarmes(req.body).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        // middleGetAlarmeNumSensor()
                        res.status(201).json({"result": result.alarmes}) //     !! entrega como array !! { "result": [{1},{2}...] }
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

function rotaGetQuaisAlarmesUsuario(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getQuaisSensoresUsuario(decodedToken).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result == true) {
                        let arrayAlarmes = []
                        let num_sensores = result.sensores
                        num_sensores.forEach(i => {
                            let alarme = alarmesAtivos.find(obj => obj.num_sensor == i.num_sensor)

                            if (alarme) {
                                arrayAlarmes.push(alarme)
                            }
                        });
                        res.status(200).json({"result": arrayAlarmes})
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}

function rotaGetInfoUmAlarme(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                let dadosInfoAlarme = {
                    "id_historico_alarmes": req.body.id_historico_alarmes,
                    "nome_usuario": decodedToken.name
                }
                // console.log(dadosInfoAlarme)
                getInfoUmAlarme(dadosInfoAlarme).then((result)=>{
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

function rotaPutAlarmeVerificado(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                putAlarmeVerificado(req.body.id_historico_alarmes).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    alarmeVerificado(req.body.id_historico_alarmes)
                    if (result.result != false) {
                        res.status(200).json({"result": true})
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }

    res.status(401)

}

function rotaGetAlarmes24h(req, res) {
    let token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if (err) {
                res.status(401)
            } else {
                getAlarmes24h(decodedToken).then((result)=>{
                    // console.log(result)      // Mostra o que vem do banco
                    if (result.result != false) {
                        res.status(200).json({"result": result})
                    } else {
                        res.status(400).json({"error": result.error})
                    }
                })
            }
        })
    }
    res.status(401)
}


export {
    rotaGetDadosAlarmes,
    rotaPutAlarmes,
    rotaPostAlarmes,
    rotaDeleteAlarmes,
    rotaGetQuaisAlarmesUsuario,
    rotaGetInfoUmAlarme,
    rotaPutAlarmeVerificado,
    middleGetAlarmeNumSensor,
    rotaGetAlarmes24h,
    padrao_alarme
}