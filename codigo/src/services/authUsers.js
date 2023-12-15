import { getLogin } from '../models/dbUsuarios.js'

import crypto from 'crypto'

import jwt from 'jsonwebtoken'

let jwtSecret = crypto.randomBytes(35).toString('hex') // tem q salvar como variavel global o de admin

async function verificaPermissãoUsuario(req, res, next) {
    let token = req.cookies.jwt

    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                res.redirect('/page-signin.html')
            } else {
                if (decodedToken.role != 2) {
                    res.redirect('/page-401.html')
                } else {
                    next()
                }
            }
        })
    } else {
        return res.redirect('/page-signin.html')
    }
}

async function login(req, res, next) {
    let dadosUsuario = await getLogin(req.body)
    let senha = req.body.senha
    // console.log('banco: '+JSON.stringify(dadosUsuario))
    // console.log(req.body.nome_usuario)
    console.log(senha)
    if (dadosUsuario.result !== false) {
        if (dadosUsuario.dados.senha == senha) {
            // console.log(jwtSecret)
            const maxAge = 20 * 60;
            const token = jwt.sign(
                { 
                    name: req.body.nome_usuario,
                    role: dadosUsuario.dados.grupo
                },
                jwtSecret,
                {
                    expiresIn: maxAge, // 20min in sec
                }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 20min in ms
            });
            res.redirect('/')
            // console.log(token)
        } else {
            res.status(400).json({status: false})
        }
    }else{

        res.status(400).json('Invalid user or password!')
    }
}

function verificaUsuarioLogado(req,res,next) {
    
    let token = req.cookies.jwt

    if (!token) {
        return res.redirect('/page-signin.html')
    }else{
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.redirect('/page-signin.html')
            } else {
                next()
            }
        })
    }
    
}

async function teste(req, res, next) {



}

function testeCookie(req, res, next) {
    
    let token = req.cookies.jwt

    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: decodedToken }) // criar page unauthorized!!
            } else {
                if (decodedToken.role != 2) {
                    return res.status(401).json({ message: decodedToken }) // criar page unauthorized!!
                } else {
                    next()
                }
            }
        })
    } else {
        return res.redirect('/page-signin.html')
    }
    
}

function logout(req,res){
    res.cookie('jwt', '', { maxAge: '1' })
    res.redirect('/page-signin.html')
}
    
export {
    login,
    logout,
    verificaPermissãoUsuario,
    verificaUsuarioLogado,
    testeCookie,
    teste,
    jwtSecret
}