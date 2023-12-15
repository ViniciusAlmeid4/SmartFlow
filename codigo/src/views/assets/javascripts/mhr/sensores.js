'use strict'

let cookies = document.cookie.jwt

let $tableBody = $('#table')

function dateNow() {
	let now = new Date();
	let timeZone = { timeZone: 'America/Sao_Paulo' };
	
	// Format the date components
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const day = String(now.getDate()).padStart(2, '0');
	
	// Format the time components
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
  
	// Create the formatted timestamp string
	let formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	
	return formattedTimestamp;
}

async function getSensores() {
	// pega os dados de sensores entregues pelo back
	const response = await fetch('/dadosSensores', 
		{
			method: 'GET'
		})
	
	let sensores = await response.json() // recebe um objeto { result: [{1},{2}..] }
	return sensores.result
}

async function getUsuarios() {
	// pega os dados de sensores entregues pelo back
	const response = await fetch('/dadosUsuarios', 
		{
			method: 'GET'
		})
	let usuarios = await response.json() // recebe um objeto { result: [{1},{2}..] }
	return usuarios.result
}

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
	let data_hora,
	tipoCreatingTable
	getSensores().then((result) => {
		result.forEach(i => {
			data_hora = new Date((i.data_hora).replace(' ', 'T')) // formata e tira espaços vazios
			switch (i.tipo) {
				case 0:
					tipoCreatingTable = 'Tensão'
					break;

				case 1:
					tipoCreatingTable = 'Corrente'
					break;

				case 2:
					tipoCreatingTable = 'Nível'
					break;

				default:
					break;
			}
			const dateString = new Intl.DateTimeFormat('pt-BR', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZone: 'America/Sao_Paulo', // time zone de são paulo
			}).format(data_hora);
			$tableBody.append(
				'<tr class="gradeX" id="'+i.id+'">'+
					'<td id="ultimaAtualizacao">'+dateString+'</td>'+
					'<td id="tipo">'+tipoCreatingTable+'</td>'+
					'<td id="numeroSensor">'+i.num_sensor+'</td>'+
					'<td id="nome">'+i.nome+'</td>'+
					'<td id="status">'+i.status+'</td>'+
					'<td id="usuarioResponsavel" value="'+i.id_usuario+'">'+i.nome_usuario+'</td>'+
					'<td id="padraoAlarme" value="'+i.id_alarme+'">'+i.nome_padrao_alarme+'</td>'+
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

function criaSelects() {
	// criar rota para puchar os usuarios e ids
	getUsuarios().then((resultUs) => {
		resultUs.forEach(i => {

			$('.select-users').append(
				'<option value="'+i.id+'">'+i.nome_usuario+'</option>'
			)
		})
	}).catch((error)=>{
		console.log(error);
	})
	getAlarmes().then((resultAl)=>{

		resultAl.forEach(i => {

			$('.select-alerts').append(
				'<option value="'+i.id+'">'+i.nome+'</option>'
			)

		})
	}).catch((error)=>{
		console.log(error);
	})
}

function editaSensores (){
	let selectedRow = $(this).closest('tr'),
	id,
	valTipo = 4
	let tipoEdita = selectedRow.children('#tipo').html()
	console.log(tipoEdita);
	if (tipoEdita == 'Tensão') {
		valTipo = 0
	} else if (tipoEdita == 'Corrente') {
		valTipo = 1
	} else if (tipoEdita == 'Nível') {
		valTipo = 2
	}
	console.log(valTipo)
	$('#atualizaTipo').val(valTipo)
	if(selectedRow.children('#status').html() == 'true' ){
		$('#atualizaStatus').val(1)
	}else{
		$('#atualizaStatus').val(0)
	}
	id = selectedRow.attr('id')
	$('#atualizaNumeroSensor').val(selectedRow.children('#numeroSensor').html())
	$('#atualizaNome').val(selectedRow.children('#nome').html())
	$('#atualizaUsuario').val(selectedRow.children('#usuarioResponsavel').attr('value'))
	$('#atualizaAlarme').val(selectedRow.children('#padraoAlarme').attr('value'))
	$.magnificPopup.open({
		items: {
			src: '#modalAtualizaSensor',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#updateSensor').click(function () {

		let tipo = $('#atualizaTipo').val(),
		numSns = $('#atualizaNumeroSensor').val(),
		usuarioResponsavel = $('#atualizaUsuario').val(),
		padraoAlarme = $('#atualizaAlarme').val(),
		valido = 0

		if ( tipo == '' ) {
			$('#atualizaTipo').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#atualizaTipo').parent().parent().removeClass('has-error')
		}

		if ( numSns == '' ) {
			$('#atualizaNumeroSensor').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#atualizaNumeroSensor').parent().parent().removeClass('has-error')
		}

		if ( usuarioResponsavel == '' ) {
			$('#atualizaUsuario').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#atualizaUsuario').parent().parent().removeClass('has-error')
		}

		if ( padraoAlarme == '' ) {
			$('#atualizaAlarme').parent().parent().addClass('has-error')
			valido = 1
		}else{
			$('#atualizaAlarme').parent().parent().removeClass('has-error')
		}

		if (valido == 0) {

			$('.form-group').removeClass('has-error')

			const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
				id: id,
				tipo: $('#atualizaTipo').val(),
				nome: $('#atualizaNome').val(),
				status: $('#atualizaStatus').val(),
				usuario: $('#atualizaUsuario').val(),
				sensor: $('#atualizaNumeroSensor').val(),
				padrao_alarme: $('#atualizaAlarme').val(),
				date: dateNow()
			};

			const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
				method: 'PUT',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify(update),
			};

			fetch('/alteraSensor', options).then(data => {
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

function cadastraSensor (){
	$.magnificPopup.open({
		items: {
			src: '#modalCadastraSensor',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#cadastrarSensor').click(function () {
		let tipo = $('#cadastraTipo').val(),
		nome = $('#cadastraNome').val(),
		status = $('#cadastraStatus').val(),
		usuario = $('#cadastraUsuario').val(),
		sensor = $('#cadastraNumeroSensor').val(),
		padrao_alarme = $('#cadastraAlarme').val(),
		date = dateNow(),
		valido = 0
		if(status == 1){
			status = true
		}else{
			status = false
		}
		if ( tipo == '' ) {
			$('#cadastraTipo').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraTipo').parent().parent().removeClass('has-error')
		}
		if ( usuario == '') {
			$('#cadastraUsuario').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraUsuario').parent().parent().removeClass('has-error')
		}
		if ( sensor == '') {
			$('#cadastraNumeroSensor').parent().parent().addClass('has-error')
			valido = 1
		} else {
			$('#cadastraNumeroSensor').parent().parent().removeClass('has-error')
		}
		if ( padrao_alarme == null) {
			$('#cadastraAlarme').parent().parent().parent().addClass('has-error')
			valido = 1
			var result = confirm("Ainda não existe um padrão de alarme cadastrado, deseja cadastrar um?");
			if (result === true) {
				// User clicked OK
				window.location.href = "http://127.0.0.1:8080/alarmes.html"
			}
		} else {
			$('#cadastraAlarme').parent().parent().removeClass('has-error')
		}
		console.log(padrao_alarme)
		if (valido == 0) {
			$('.form-group').removeClass('has-error')
			const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
				tipo: tipo,
				nome: nome,
				status: status,
				usuario: usuario,
				sensor: sensor,
				padrao_alarme: padrao_alarme,
				date: date
			};
			const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify(update),
			};
			fetch('/cadastraSensor', options).then(data => {
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
	id = selectedRow.attr('id')
	$('#deletaTipo').val(selectedRow.children('#tipo').html())
	$('#deletaNumeroSensor').val(selectedRow.children('#numeroSensor').html())
	$('#deletaNome').val(selectedRow.children('#nome').html())
	$('#deletaStatus').val(selectedRow.children('#status').html())
	$('#deletaUsuario').val(selectedRow.children('#usuarioResponsavel').attr('value'))
	$('#deletaAlarme').val(selectedRow.children('#padraoAlarme').attr('value'))
	$.magnificPopup.open({
		items: {
			src: '#modalDeletaSensor',
			type: 'inline'
		},
		preloader: false,
		modal: true,
	});
	$('#deletarUsuario').click(function () {
		const update = {	// Pega os valores de cada sensor entregue pelo node-red e salva no obj Update
			id: id,
		};
		const options = {	// define as opções da requisição, importante lembrar do JSON.stringfy() no update, se não o obj JSON não passa e o body vai vazio
			method: 'delete',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify(update),
		};
		fetch('/deletaSensor', options).then(data => {
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
	criaLinhas()
	criaSelects()
	$('#addToTable').click(cadastraSensor)
	$('.modal-dismiss').click(() => {
		$('.form-group').removeClass('has-error')
	})
	$('#btReset').click(() => {
		location.reload() // -- jeito errado eu acho
	})
})