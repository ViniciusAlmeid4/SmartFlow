'use strict'

let usuarios

let $tableBody = $('#table')

window.onload = () => {
	getUsuarios()
}

async function getUsuarios() {
	// pega os dados de usuario entregues pelo back
	const response = await fetch('/dadosUsuarios',
		{
			method: 'GET'
		})
	usuarios = await response.json() // recebe um objeto { result: [{1},{2}..] }
	return usuarios.result
}

function criaLinhas(){
	let auxGrupo
	getUsuarios().then((result) => {
		result.forEach(i => {
			if (i.grupo == 0) {
				auxGrupo = 'Operador';
			} else if (i.grupo == 1) {
				auxGrupo = 'Manutenção';
			} else if (i.grupo == 2) {
				auxGrupo = 'Administrador';
			}
			$tableBody.append(
				'<tr class="gradeX" id="'+i.id+'">'+
					'<td id="usuario">'+i.nome_usuario+'</td>'+
					'<td id="senha">••••••••••</td>'+
					'<td id="nome">'+i.nome_completo+'</td>'+
					'<td id="email">'+i.email+'</td>'+
					'<td id="grupo">'+auxGrupo+'</td>'+
					'<td class="actions">'+
						'<a class="on-default edit-row"><i class="fa fa-pencil"></i></a>'+
						'<a class="on-default remove-row"><i class="fa fa-trash-o"></i></a>'+
					'</td>'+
				'</tr>'
			)
		})
	})
}

function editaUsuario (){
	let selectedRow = $(this).closest('tr'),
		valGrupo,
		usuario = selectedRow.children('#usuario').html(),
		grupo = selectedRow.children('#grupo').html()
	$('#alteraSenhaUsuario').val(usuario) // passa o usuario direto pro forms de atualização pra garantir q é o msm, ainda que ele escreva algo no campo usuario!!
	$('#atualizaNomeUsuario').val(usuario)
	$('#atualizaNome').val(selectedRow.children('#nome').html())
	$('#atualizaEmail').val(selectedRow.children('#email').html())
	if (grupo == 'Operador') {
		valGrupo = 0;
	} else if (grupo == 'Manutenção') {
		valGrupo = 1;
	} else if (grupo == 'Administrador') {
		valGrupo = 2;
	}
	$('#atualizaGrupo').val(valGrupo)
	$.magnificPopup.open({
		items: {
			src: '#modalAtualizaUsuario',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#updateUsuario').click(function () {
		let nome_completo = $('#atualizaNome').val(),
			novo_nome_usuario = $('#atualizaNomeUsuario').val(),
			valido = 0
		if ( novo_nome_usuario == '' ) {
			$('#atualizaNomeUsuario').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#atualizaNomeUsuario').parent().parent().removeClass('has-error')
		}
		if ( nome_completo == '' ) {
			$('#atualizaNome').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#atualizaNome').parent().parent().removeClass('has-error')
		}
		if (valido == 0) {
			$('.form-group').removeClass('has-error')
			const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
				nome_usuario: usuario,
				novo_nome_usuario: $('#atualizaNomeUsuario').val(),
				nome_completo: $('#atualizaNome').val(),
				email: $('#atualizaEmail').val(),
				grupo: $('#atualizaGrupo').val()
			};
			const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
				method: 'PUT',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify(update),
			};
			fetch('/alteraUsuario', options).then(data => {
				if (!data.ok) {		// faz verificações e entrega se der erros, caso não, entrega o que foi passado no body
					throw Error(data.status);
				}
				return data.json();
			}).then(update => {
				location.reload()	// reseta a página para garantir q as novas configs sejam atualizadas no front
				console.log(update);
			}).catch(e => {
				console.log(e);
			});
		}
	})
}

function alterarSenha() {
	$.magnificPopup.open({
		items: {
			src: '#modalAlteraSenha',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#updateSenha').click(function () {
		let nome_usuario = $('#alteraSenhaUsuario').val(),
			senha = $('#alteraSenha').val(),
			nova_senha = $('#alteraNovaSenha').val(),
			confirma_nova_senha = $('#alteraNovaConfirmaSenha').val(),
			valido = 0
		if ( senha == '' ) {
			$('#alteraSenha').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#alteraSenha').parent().parent().removeClass('has-error')
		}
		if ( nova_senha == '' ) {
			$('#alteraNovaSenha').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#alteraNovaSenha').parent().parent().removeClass('has-error')
		}
		if ( confirma_nova_senha == '') {
			$('#alteraNovaConfirmaSenha').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#alteraNovaConfirmaSenha').parent().parent().removeClass('has-error')
		}
		if (valido == 0) {
			$('.form-group').removeClass('has-error')
			if(nova_senha!=confirma_nova_senha){
				alert('Confirme se as novas senhas estão escritas corretamente')
			}else{
				const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
					nome_usuario: nome_usuario,
					senha: senha,
					nova_senha: nova_senha
				};
				const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
					method: 'PUT',
					headers: {
					'Content-Type': 'application/json',
					},
					body: JSON.stringify(update),
				};
				fetch('/alteraSenhaUsuario', options).then(data => {
					if (!data.ok) {		// faz verificações e entrega se der erros, caso não, entrega o que foi passado no body
						throw Error(data.status);
					}
					return data.json();
				}).then(update => {
	
					if (update.result == true) {
						alert('Tudo certo!!!!')
						location.reload()
					} else {
						alert('tente novamente!')
					}
					console.log(update);
				}).catch(e => {
					console.log(e);
				});
			}
		}
	})
}

function cadastraUsuario (){
	$.magnificPopup.open({
		items: {
			src: '#modalCadastraUsuario',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#cadastrarUsuario').click(function () {
		let nome_usuario = $('#cadastraNomeUsuario').val(),
			senha = $('#cadastraSenha').val(),
			nome_completo = $('#cadastraNome').val(),
			email = $('#cadastraEmail').val(),
			grupo = $('#cadastraGrupo').val(),
			confirma_senha = $('#cadastraConfirmaSenha').val(),
			valido = 0
		if ( nome_usuario == '' ) {
			$('#cadastraNomeUsuario').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraNomeUsuario').parent().parent().removeClass('has-error')
		}
		if ( senha == '' ) {
			$('#cadastraSenha').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraSenha').parent().parent().removeClass('has-error')
		}
		if ( nome_completo == '' ) {
			$('#cadastraNome').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraNome').parent().parent().removeClass('has-error')
		}
		if ( confirma_senha == '') {
			$('#cadastraConfirmaSenha').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraConfirmaSenha').parent().parent().removeClass('has-error')
		}
		if (valido == 0) {
			$('.form-group').removeClass('has-error')
			if (senha!=confirma_senha) {
				alert('Confirme se as novas senhas estão escritas corretamente')
			} else {
				const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
					nome_usuario: nome_usuario,
					senha: senha,
					nome_completo: nome_completo,
					email: email,
					grupo: grupo
				};
				const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
					method: 'POST',
					headers: {
					'Content-Type': 'application/json',
					},
					body: JSON.stringify(update),
				};
				fetch('/cadastraUsuario', options).then(data => {
					if (!data.ok) {		// faz verificações e entrega se der erros, caso não, entrega o que foi passado no body
						throw Error(data.status);
					}
					return data.json();
				}).then(update => {
					location.reload()	// reseta a página para garantir q as novas configs sejam atualizadas no front
					console.log(update);
				}).catch(e => {
					console.log(e);
				});
			}
		}
	})
}

function deletaUsuario (){

	let selectedRow = $(this).closest('tr')
	let delUsuario = selectedRow.children('#usuario').html()

	$('#deletaIdUsuario').val(selectedRow.attr('id'))
	$('#deletaNomeUsuario').val(delUsuario)
	$('#deletaNome').val(selectedRow.children('#nome').html())
	$('#deletaEmail').val(selectedRow.children('#email').html())
	$('#deletaGrupo').val(selectedRow.children('#grupo').html())

	$.magnificPopup.open({
		items: {
			src: '#modalDeletaUsuario',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});

	$('#deletarUsuario').click(function () {

		const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
			nome_usuario: delUsuario,
		};
		
		const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
			method: 'delete',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify(update),
		};
		
		fetch('/deletaUsuario', options).then(data => {
			if (!data.ok) {		// faz verificações e entrega se der erros, caso não, entrega o que foi passado no body
				alert(Error);				
				throw Error(data.status);
			}
			return data.json();
		}).then(update => {
			location.reload()	// reseta a página para garantir q as novas configs sejam atualizadas no front
			console.log(update);
		}).catch(e => {
			alert(e);
			console.log(e);
		});
	})
}

$(function ( $ ){

	criaLinhas()
	
	$tableBody.on('click', '.edit-row', editaUsuario) // Use event delegation to handle the click event for dynamically added rows - ChatGPT

	$tableBody.on('click', '.remove-row', deletaUsuario) // Use event delegation to handle the click event for dynamically added rows - ChatGPT

	$('#updateSenha').click(alterarSenha)

	$('#addToTable').click(cadastraUsuario)

	$('.modal-dismiss').click(() => {
		$('.form-group').removeClass('has-error')
	})

	$('#btReset').click(() => {
		location.reload() // -- jeito errado eu acho
	})

})