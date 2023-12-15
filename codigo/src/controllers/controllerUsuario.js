import { getUsuarios, postUsuario, putDadosUsuario, putSenhaUsuario, deleteUsuario } from '../models/dbUsuarios.js'

/*
    essas funções determinam o que as rotas vão fazer,
    além de qual resposta o backend entregará para
    o front, que entrega os dados para o cliente
    
    req - requisição feita pelo front
    res - resposta do back
*/

async function rotaGetUsuarios(req, res) {
    let result = await getUsuarios()
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        res.status(201).json({"result": result.usuarios}) //     !! entrega como array !! { "result": [{1},{2}...] }
    } else {
        res.status(400).json({"error": result.error})
    }
}

async function rotaInsertUsuario(req, res) {
    let result = await postUsuario(req.body)
    // req.body tem q conter: nome_usuario, senha_usuario, 
    // console.log(result, req.body)      // Mostra o que vem do banco
    if (result.result == true) {
        res.status(201).json({"dados": req.body, "result": result.result})
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }
    
}

async function rotaPutDadosUsuario(req, res) {
    let result = await putDadosUsuario(req.body)
    // console.log(req.body)
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        res.status(201).json({"dados": req.body, "result": result.result})
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }

}

async function rotaPutSenhaUsuario(req, res) {
    let result = await putSenhaUsuario( req.body )
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        if(result.rowCount > 0){
            res.status(201).json({"result": result.result})
        }else{
            res.status(201).json({"result": false})
        }
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }
}

async function rotaDeleteUsuario(req, res) {
    let result = await deleteUsuario( req.body )
    // console.log(result)      // Mostra o que vem do banco
    if (result.result == true) {
        res.status(201).json({"dados": req.body, "deletedRows": result.result})
    } else {
        res.status(400).json({"dados": req.body, "error": result.error})
    }
}


export {
    rotaGetUsuarios,
    rotaInsertUsuario,
    rotaPutDadosUsuario,
    rotaPutSenhaUsuario,
    rotaDeleteUsuario
}