import express from 'express'

import { rotaGetUsuarios, rotaInsertUsuario, rotaPutDadosUsuario, rotaPutSenhaUsuario, rotaDeleteUsuario } from './controllers/controllerUsuario.js';

import { rotaGetDadosPorMin, rotaGetNumSensoresUsuarioAtivos, rotaGetSensoresUsuario } from './controllers/controllerGraficos.js'; // rotaGetQuaisSensoresUsuario, 

import { rotaGetSensores, rotaInsertSensor, rotaPutSensor, rotaDeleteSensor } from './controllers/controllerSensores.js';

import { login, logout, verificaPermissãoUsuario, verificaUsuarioLogado } from './services/authUsers.js'; // , teste, testeCookie

import { dadosCookies } from './services/cookieManager.js';

import { rotaGetDadosHistoricos, rotaGetHistAlarmes, rotaGetQuaisSensoresTable } from './controllers/controllerTables.js';

import { middleGetAlarmeNumSensor, rotaDeleteAlarmes, rotaGetAlarmes24h, rotaGetDadosAlarmes, rotaGetInfoUmAlarme, rotaGetQuaisAlarmesUsuario, rotaPostAlarmes, rotaPutAlarmes, rotaPutAlarmeVerificado } from './controllers/controllerAlarmes.js';

import { resetAlarmes } from './services/verificaAlarmes.js';

const router = express.Router()


/////  Rotas de Arquivos Importantes

router.use( '/assets/javascripts/alarmes-historicos.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/alarmes.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/charts-aws.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/current-aws.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/dados-historicos.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/full-screan.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/getAlarmesAtivos.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/index.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/level-aws.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/modals.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/sensores.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/tables-aws.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/userData.js' , verificaUsuarioLogado )

router.use( '/assets/javascripts/usuarios.js' , verificaUsuarioLogado )


/////  Entrega Dados Usuario

router.get( '/dadosCookieUsuario' , dadosCookies )


/////  Front

router.get( '/alarmes-historicos.html', verificaUsuarioLogado )

router.get( '/alarmes.html', verificaPermissãoUsuario )

router.get( '/charts-corrente.html', verificaUsuarioLogado )

router.get( '/charts-nivel.html', verificaUsuarioLogado )

router.get( '/charts-tensao.html', verificaUsuarioLogado )

router.get( '/dados-historicos.html', verificaUsuarioLogado )

router.get( '/index.html', verificaUsuarioLogado )

router.get( '/', verificaUsuarioLogado )

router.get( '/page-401.html', verificaUsuarioLogado )

router.get( '/sensores.html', verificaPermissãoUsuario )

router.get( '/usuarios.html', verificaPermissãoUsuario )



/////  Usuários

router.get( '/dadosUsuarios', rotaGetUsuarios )             // mostra todos os usuarios do banco

router.post( '/cadastraUsuario', rotaInsertUsuario )          // cadastra um usuario no banco

router.put( '/alteraUsuario', rotaPutDadosUsuario )         // altera email, grupo e nome_completo de um usuario

router.put( '/alteraSenhaUsuario', rotaPutSenhaUsuario )    // altera a senha de um usuario

router.delete( '/deletaUsuario', rotaDeleteUsuario )        // deleta um usuario


/////  Sensores

router.get( '/dadosSensores', verificaUsuarioLogado , rotaGetSensores )             // mostra todos os sensores do banco

router.post( '/cadastraSensor', rotaInsertSensor )          // cadastra um sensor no banco

router.put( '/alteraSensor', rotaPutSensor )         // altera dados de um sensor

router.delete( '/deletaSensor', rotaDeleteSensor )        // deleta um sensor


/////  Alarmes

router.get( '/dadosAlarmes', rotaGetDadosAlarmes )

router.post( '/cadastraAlarme', rotaPostAlarmes )

router.put( '/alteraAlarme', rotaPutAlarmes )

router.delete( '/deletaAlarme', rotaDeleteAlarmes )

router.get( '/alarmesAtivos', rotaGetQuaisAlarmesUsuario )

router.post( '/dadosAlarme', rotaGetInfoUmAlarme )

router.post( '/verificarAlarme', rotaPutAlarmeVerificado )

router.get( '/alarmes24h', rotaGetAlarmes24h )


/////  Graficos && tables

router.get( '/dadosCriaTables', rotaGetQuaisSensoresTable )

router.post( '/dadosCriaSensores', rotaGetSensoresUsuario )

router.get( '/dadosNumSensoresAtivos', rotaGetNumSensoresUsuarioAtivos )

router.get( '/dadosHistoricos', rotaGetDadosHistoricos )

router.get( '/dadosPorMin', rotaGetDadosPorMin )

router.get( '/alarmesHistoricos', rotaGetHistAlarmes )


/////  Login

router.post( '/login', login )

router.get( '/logout', logout )


export { router }