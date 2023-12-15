async function postLogin(user) {
    const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
        nome_usuario: user.nome_usuario,
        senha: user.senha,
    };
    const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
    };
    // console.log(update)
    fetch('/login', options).then(data => {
        if (data.status == 400) {	
            if ($('#text-invalid').html() != '<p class="text-left" style="color: red;">Dados inválidos!!</p>') {
                let $paragrafoErro = $('<p class="text-left" style="color: red;">Dados inválidos!!</p>')
                $('#text-invalid').html($paragrafoErro)
            }
        } else {
            window.location.href = "/";
        }
    }).catch(e => {
        console.log(e);
    });
}

async function login() {
    let user = {
        nome_usuario: $('#username').val(),
        senha: $('#password').val()
    }
    postLogin(user)
}

$(function ( $ ){
    $('#btnSignin').click(login)
})