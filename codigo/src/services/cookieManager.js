import jwt from 'jsonwebtoken'

import { jwtSecret } from './authUsers.js';

async function dadosCookies(req, res) {
    let token = req.cookies.jwt
    // console.log(token)
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                console.log('erro ver')
                return 0
            } else {
                // console.log(decodedToken)
                if (decodedToken.role == 0) {
                    // console.log('0')
                    res.json({
                        "grupo": "operador",
                        "usuario": decodedToken.name
                    })
                } else if (decodedToken.role == 1) {
                    // console.log('1')
                    res.status(200).json({
                        "grupo": "manutenção",
                        "usuario": decodedToken.name
                    })
                } else if (decodedToken.role == 2) {
                    // console.log('2')
                    res.status(200).json({
                        "grupo": "administrador",
                        "usuario": decodedToken.name
                    })
                } else {
                    // console.log('??')
                    return res.status(400).json({
                        "grupo": "??",
                        "usuario": "algo deu errado"
                    })
                }
            }
        })
    } else {
        // console.log('deu ruim d nv')
        return res.status(400).json({
            "grupo": "??",
            "usuario": "algo deu errado"
        })
    }
}
    
export {
    dadosCookies
}