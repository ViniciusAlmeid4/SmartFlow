import crypto from 'crypto'

import { pool } from "./db.js"

var hash = crypto.createHash('sha256');

async function getUsuarios () {
    const query = {
        text: 'SELECT * FROM usuario;',
        rowMode: 'json' // formato que as rows são entregues
    }
    try {
        let usuarios = await pool.query(query)
        // console.log('deu o select')
        // console.log(usuarios.rows)
        return{
            "result": true,
            "usuarios": usuarios.rows
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function postUsuario(usuario) {
    try {
        console.log(JSON.stringify(usuario))
        let nome_usuario = (usuario.nome_usuario).toString(),
        senha = (usuario.senha).toString(),
        nome_completo = (usuario.nome_completo).toString(),
        email = (usuario.email).toString(),
        grupo = (usuario.grupo).toString()
        const query = {
            text: 'INSERT INTO usuario(nome_usuario, senha, nome_completo, email, grupo) VALUES ($1, $2, $3, $4, $5);',
            values: [nome_usuario, senha, nome_completo, email, grupo]
        }
        let result = await pool.query(query)
        // console.log('deu o insert')
        return {
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

async function putDadosUsuario(usuario) {
    try {
        let nome_usuario = (usuario.nome_usuario).toString(),
        novo_nome_usuario = (usuario.novo_nome_usuario),
        nome_completo = (usuario.nome_completo).toString(),
        email =(usuario.email).toString(),
        grupo = (usuario.grupo).toString()
        //                                                                                                                                                             -----  nome_usuario é um index -----
        const query ={
            text: 'UPDATE usuario SET nome_usuario = $1, nome_completo = $2, email = $3, grupo = $4 WHERE nome_usuario = $5;',
            values: [novo_nome_usuario, nome_completo, email, grupo, nome_usuario]
        }
        let result = await pool.query(query)
        // console.log('deu o update')
        return {
            "result": true,
            "res": result
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function putSenhaUsuario(usuario) {
    try {
        let nome_usuario = (usuario.nome_usuario).toString(),
        senha = (usuario.senha).toString(),
        nova_senha = (usuario.nova_senha).toString()
        //                                                                   -----  nome_usuario é um index -----
        const query = {
            text: 'UPDATE usuario SET senha = $1 WHERE nome_usuario = $2 AND senha = $3;',
            values: [nova_senha, nome_usuario, senha],
        }
        let result = await pool.query(query)
        // console.log('deu o update')
        // console.log(result)
        return {
            "result": true,
            "rowCount": result.rowCount
        }
    } catch (Error) {
        console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

async function deleteUsuario(usuario) {
    try {
        let nome_usuario = (usuario.nome_usuario).toString()
        //                                             -----  nome_usuario é um index -----
        const query = {
            text: 'DELETE FROM usuario WHERE nome_usuario = $1',
            values: [nome_usuario],
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

async function getLogin(usuario){
    try {
        let nome_usuario = (usuario.nome_usuario).toString()
        //                                                    -----  nome_usuario é um index -----
        const query = {
            text: 'SELECT nome_usuario, senha, grupo FROM usuario WHERE nome_usuario = $1;',
            values: [nome_usuario],
        }
        let loginRows = await pool.query(query)
        // console.log(loginRows.rows[0])
        if (loginRows.rows[0] === undefined) {
            return{
                "result": false
            }
        } else {            
            return {
                "result": true,
                "dados": loginRows.rows[0]
            }
        }
    } catch (Error) {
       // console.log(Error)
        return {
            "result": false,
            "error": Error
        }
    }
}

export {
    getUsuarios,
    postUsuario,
    putDadosUsuario,
    putSenhaUsuario,
    deleteUsuario,
    getLogin
}