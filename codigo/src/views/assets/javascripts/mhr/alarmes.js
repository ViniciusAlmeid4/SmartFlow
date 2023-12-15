'use strict'

let cookies = document.cookie.jwt

let $tableBody = $('#table')

async function getAlarmes() {
	try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/dadosAlarmes', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
		let result = await response.json()
		// console.log(JSON.stringify(result))
		return result.result
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

function criaLinhas(){
	getAlarmes().then((result) => {
		result.forEach(i => {
			$tableBody.append(
				'<tr class="gradeX" id="'+i.id+'">'+
					'<td id="nome">'+i.nome+'</td>'+
					'<td id="valorMax">'+i.valor_maximo+'</td>'+
					'<td id="alarmeAlto">'+i.alarme_alto+'</td>'+
					'<td id="alarmeBaixo">'+i.alarme_baixo+'</td>'+
					'<td class="actions">'+
						'<a class="on-default edit-row"><i class="fa fa-pencil"></i></a>'+
						'<a class="on-default remove-row"><i class="fa fa-trash-o"></i></a>'+
					'</td>'+
				'</tr>'
			)
		})
	}).catch((error)=>{
		console.log(error);
	})
}

function editaSensores (){
	let selectedRow = $(this).closest('tr'),
	id
	id = selectedRow.attr('id')
    $('#atualizaNome').val(selectedRow.children('#nome').html())
	$('#atualizaValMax').val(selectedRow.children('#valorMax').html())
	$('#atualizaAlarmeAlto').val(selectedRow.children('#alarmeAlto').html())
	$('#atualizaAlarmeBaixo').val(selectedRow.children('#alarmeBaixo').html())
	$.magnificPopup.open({
		items: {
			src: '#modalAtualizaAlarme',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#updateAlarme').click(function () {
		let nome = $('#atualizaNome').val(),
		valMax = $('#atualizaValMax').val(),
		almAlto = $('#atualizaAlarmeAlto').val(),
		almBaixo = $('#atualizaAlarmeBaixo').val(),
		valido = 0
		if ( nome == '' ) {
			$('#atualizaNome').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#atualizaNome').parent().parent().removeClass('has-error')
		}
		if ( valMax == '') {
			$('#atualizaValMax').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#atualizaValMax').parent().parent().removeClass('has-error')
		}
		if ( almAlto == '') {
			$('#atualizaAlarmeAlto').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#atualizaAlarmeAlto').parent().parent().removeClass('has-error')
		}
        if ( almBaixo == '') {
			$('#atualizaAlarmeBaixo').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#atualizaAlarmeBaixo').parent().parent().removeClass('has-error')
		}
		if (valido == 0) {
			$('.form-group').removeClass('has-error')
			const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
				id: id,
				nome: nome,
				valMax: valMax,
				almAlto: almAlto,
				almBaixo: almBaixo
			};
			console.log(update)
			let headers = new Headers({
				'Content-Type': 'application/json',
				'cookie': cookies
			})
			const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
				method: 'PUT',
				headers: headers,
				credentials: 'include',
				body: JSON.stringify(update)
			};
			fetch('/alteraAlarme', options).then(data => {
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

function cadastraAlarme (){
	$.magnificPopup.open({
		items: {
			src: '#modalCadastraAlarme',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#cadastrarAlarme').click(function () {
		let nome = $('#cadastraNome').val(),
		valMax = $('#cadastraValMax').val(),
		almAlto = $('#cadastraAlarmeAlto').val(),
		almBaixo = $('#cadastraAlarmeBaixo').val(),
		valido = 0
		if ( nome == '' ) {
			$('#cadastraNome').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraNome').parent().parent().removeClass('has-error')
		}
		if ( valMax == '') {
			$('#cadastraValMax').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraValMax').parent().parent().removeClass('has-error')
		}
		if ( almAlto == '') {
			$('#cadastraAlarmeAlto').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraAlarmeAlto').parent().parent().removeClass('has-error')
		}
        if ( almBaixo == '') {
			$('#cadastraAlarmeBaixo').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraAlarmeBaixo').parent().parent().removeClass('has-error')
		}
		if (valido == 0) {
			$('.form-group').removeClass('has-error')
			const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
				nome: nome,
				valMax: valMax,
				almAlto: almAlto,
				almBaixo: almBaixo
			};
			let headers = new Headers({
				'Content-Type': 'application/json',
				'cookie': cookies
			})
			console.log(update)
			const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
				method: 'POST',
				headers: headers,
				credentials: 'include',
				body: JSON.stringify(update)
			};
			fetch('/cadastraAlarme', options).then(data => {
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

function deletaUsuario (){

	let selectedRow = $(this).closest('tr'),
	id

	id = selectedRow.attr('id')
	$('#deletaNome').val(selectedRow.children('#nome').html())
	$('#deletaValMax').val(selectedRow.children('#valorMax').html())
	$('#deletaAlarmeAlto').val(selectedRow.children('#alarmeAlto').html())
	$('#deletaAlarmeBaixo').val(selectedRow.children('#alarmeBaixo').html())

	$.magnificPopup.open({
		items: {
			src: '#modalDeletaAlarme',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});

	$('#deletarAlarme').click(function () {

		const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
			id: id
		};
		
		let headers = new Headers({
			'Content-Type': 'application/json',
			'cookie': cookies
		})

		const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
			method: 'DELETE',
			headers: headers,
			credentials: 'include',
			body: JSON.stringify(update)
		};
		
		fetch('/deletaAlarme', options).then(data => {
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

	$tableBody.on('click', '.edit-row', editaSensores); // Use event delegation to handle the click event for dynamically added rows - ChatGPT
	
	
    $tableBody.on('click', '.remove-row', deletaUsuario); // Use event delegation to handle the click event for dynamically added rows - ChatGPT
	
    $('#addToTable').click(cadastraAlarme)

	criaLinhas()
    
	$('.modal-dismiss').click(() => {
		$('.form-group').removeClass('has-error')
	})
	
	$('#btReset').click(() => {
		location.reload() // -- jeito errado eu acho
	})
	
})