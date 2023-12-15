import express from 'express'

import cors from 'cors'

import { pool, abrePool } from './models/db.js';

import { router } from './router.js'

import { Thing } from './models/AWSThing.js'

import * as awsIot from 'aws-iot-device-sdk'

import jwt from 'jsonwebtoken'

import { jwtSecret } from './services/authUsers.js';

import cookieParser from 'cookie-parser'

import { getQuaisSensoresUsuario } from './models/dbGraficos.js';

import { insertDadosSensores } from './models/dbDados.js';

import { validaAlarme } from './services/verificaAlarmes.js';

import { middleGetAlarmeNumSensor } from './controllers/controllerAlarmes.js';


const app = express()

app.use(cors())

app.use(cookieParser())

app.use(express.json())

app.use(router)

app.use(express.static('./src/views'))


try {
	abrePool(pool)
	middleGetAlarmeNumSensor()
} catch (error) {
	console.log(error);
}

///////////////////////

try {
	var caminhos = new Thing('server'),
		dados,
		countDados = 0,
		qntPorMin = '...',
		qntMsgAws = 0
	// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
	// SPDX-License-Identifier: MIT-0
	var device = awsIot.device({
	   keyPath: caminhos.keyPath,//'./src/certificados/5b39f324309cb7be1c1953464829d9d1f33859a186c46209362c6dcd143daa11-private.pem.key', // private key
	  certPath: caminhos.certPath,//'./src/certificados/5b39f324309cb7be1c1953464829d9d1f33859a186c46209362c6dcd143daa11-certificate.pem.crt', // certificado da maquina
		caPath: caminhos.caPath,//'./src/certificados/AmazonRootCA1.pem', // certificado da Amazon
	  clientId: caminhos.clientId,//'ConnectingNodeToAWS', // nome do id de conexão     ! *devem ser idivíduais, caso contrário o ultimo a se conectar é o que fica ligado a AWS* !
		  host: caminhos.host//'att6878v8g95n-ats.iot.us-east-1.amazonaws.com' // cadeia de conexão com o broker da AWS     ! *fica nas configs do AWS* !
	})
	//
	// Device is an instance returned by mqtt.Client(), see mqtt.js for full documentation.
	// 
	device
		.on('connect', function() {
			console.log('connect')
			device.subscribe('Sensores/Disp1')
			// dar subscribe na rota de alarmes que tem q estar criada no banco
			// device.publish('topic_2', JSON.stringify({ test_data: 1}));
		})
	device
		.on('message', function(topic, payload) {
			// fazer o if para dividir entre os tópicos, sensores/Disp1 e alertas/Disp1
			// já que cada um tem sua função específica
			// ver se vale mais a pena fazer a lógica de alarmes aq ou no node-red
			// as vzs dx lá só enviando os dados msm  ( +30%  +15%    -15%  -30%)
			qntMsgAws ++
			// console.log(qntMsgAws)
			dados = JSON.parse(payload) // transforma o payload, que vem em formato de buffer, em JSON
			if(countDados>59){
				insertDadosSensores(dados.sensores)
				countDados = 0
			}else{
				countDados++
			}
			// criar cadastro dos sensores em banco
			// transformar em um POST e dar a response só nos dados de cada usuário
			app.get('/msgAWS',(req,res)=>{
				let token = req.cookies.jwt
				try {
					if (!token) {
						res.status(401)
					}else{
						jwt.verify(token, jwtSecret, (err, decodedToken) => {
							if (err) {
								res.status(401)
							} else {
								getQuaisSensoresUsuario(decodedToken).then((result) => {
									try {
										let sensoresPermitidos = []
		
										result.sensores.forEach((val, index) => {
											let num_sensor = val.num_sensor,
											valor = dados.sensores[val.num_sensor]
											// console.log('num_sensor:' + num_sensor + '    valor: ' + valor);
											sensoresPermitidos.push({"num_sensor": num_sensor,"valor": valor})
										})
										res.status(200).json(sensoresPermitidos)
										
									} catch (error) {
										res.status(400)
									}
								})
							}
						})
					}
				} catch (error) {
					console.log(error)
				}
			})
			try {
				let sensores = dados.sensores
				sensores.forEach((val, index) => {
					validaAlarme({"num_sensor": index, "valor": val})
				});
			} catch (error) {
				console.log(error)
			}
		})
} catch (error) {
	console.error();
}

setInterval( () => {
	qntPorMin = qntMsgAws
	qntMsgAws = 0
	// console.log('Por min: ' + qntPorMin)
} ,59000)

///////////////////////

export { 
	app,
	qntPorMin
} 