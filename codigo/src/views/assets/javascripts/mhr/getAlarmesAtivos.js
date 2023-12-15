
var arrayAlarmes = []

cookies = document.cookie.jwt

async function removeObjectById(array, id) {
    try {
        // Find the index of the object with the given id
        let index = array.findIndex(obj => obj.id_historico_alarmes == id);
        console.log(array);
        console.log(id);
        console.log("index: " + index);
        // If the object with the given id is found, remove it
        if (index !== -1) {
            // Use await to ensure the splice operation completes before proceeding
            array.splice(index, 1);
            console.log(`Object with id ${id} removed successfully.`);
        } else {
            console.log(`Object with id ${id} not found in the array.`);
        }
        console.log(array); // Log the array after removal
    } catch (error) {
        console.error('Error removing object:', error);
    }
}

async function getAlarmesAtivos() {
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/alarmesAtivos', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
        let alarmes = await response.json() // await response.json() // recebe um objeto { result: [{1},{2}..] }
        // console.log('getAlarmesAtivos: ' + JSON.stringify(alarmes))
        return alarmes.result
    } catch (error) {
        console.log();('Error fetching data:', error)
        return null
    }
}

async function getInfoSensores() {
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/dadosCriaTables', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
        let getInfo = response.json()
        console.log('getInfoSensores: ' + JSON.stringify(getInfo))
        return getInfo
    } catch (error) {
        console.log('Error fetching data:', error)
        return null
    }
}

async function getInfoUmAlarme(id) {
	try {
        const response = await fetch('/dadosAlarme', {
            method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'cookie': cookies
				},
			body:JSON.stringify({
				id_historico_alarmes: id
			})
        })
        let jsval = await response.json()
        console.log('getInfoUmAlarme: ' + jsval.result)
        return jsval.result
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

async function verificarAlarme(id) { // parm id do funcionario
	try {
        const response = await fetch('/verificarAlarme', {
            method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'cookie': cookies
				},
			body:JSON.stringify({
				id_historico_alarmes: id
			})
        })
        let jsval = await response.json()
        console.log('verificarAlarme: ' + jsval.result)
        return jsval.result
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

async function recebeAlarmes() {
    let alarmesAtivos = await getAlarmesAtivos()
    if (alarmesAtivos.length != arrayAlarmes.length) {
        arrayAlarmes = alarmesAtivos
        $('.list-notificacao').html('')
        let result = await getInfoSensores()
        let arraySensores = result.result
        alarmesAtivos.forEach(i => {
            let nome_sensor = (arraySensores.find(obj => obj.num_sensor == i.num_sensor)).nome
            if(i.tipo == 1){
                $('.list-notificacao').append(
    
                    '<li id-alarme="'+i.id_historico_alarmes+'">'+
                        '<a class="clearfix">'+
                            '<div class="image">'+
                                '<i class="fa fa-arrow-up bg-danger"></i>'+
                            '</div>'+
                            '<span class="title">Sensor: '+nome_sensor+'</span>'+
                            '<span class="message">Valor: '+i.valor+'</span>'+
                        '</a>'+
                    '</li>'
                )
            } else if(i.tipo == 0){
                $('.list-notificacao').append(
    
                    '<li id-alarme="'+i.id_historico_alarmes+'">'+
                        '<a class="clearfix">'+
                            '<div class="image">'+
                                '<i class="fa fa-arrow-down bg-warning"></i>'+
                            '</div>'+
                            '<span class="title">Sensor: '+nome_sensor+'</span>'+
                            '<span class="message">Valor: '+i.valor+'</span>'+
                        '</a>'+
                    '</li>'
                )
            }
        });
    
        $('.num-alarmes').html(arrayAlarmes.length)
    }
}

function modalVerificarAlarme() {
    let selectedAlert = $(this).closest('li'),
    tipo_alarme
    id = selectedAlert.attr('id-alarme')
    getInfoUmAlarme(id).then((result)=>{
        if (result != null) {
			let data_hora = new Date((result.data_alarme).replace(' ', 'T')) // formata e tira espaços vazios
            let dateString = new Intl.DateTimeFormat('pt-BR', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZone: 'America/Sao_Paulo', // time zone de são paulo
			}).format(data_hora);
            switch (result.tipo_alarme) {
                case 0:
                    tipo_alarme = 'baixo'
                    break;

                case 1:
                    tipo_alarme = 'alto'
                    break;
            
                default:
                    break;
            }
            $('#verificaNome').val(result.nome)
            $('#verificaNum').val(result.num_sensor)
            $('#verificaMin').val(result.alarme_baixo)
            $('#verificaMax').val(result.alarme_alto)
            $('#verificaValAlarme').val(result.valor_alarme)
            $('#verificaTipo').val(tipo_alarme)
            $('#verificaData').val(dateString)
            $.magnificPopup.open({
                items: {
                    src: '#modalVerificarAlarme',
                    type: 'inline'
                },
                preloader: false,
                modal: true,
            });
            $('#verificarAlarme').click(function () {
                verificarAlarme(id).then((result)=>{
                    // console.log(result)
                    if(result == true){
                        removeObjectById(arrayAlarmes, id).then((result)=>{
                            $('li[id-alarme="' + id + '"]').remove();
                            $('.num-alarmes').html(arrayAlarmes.length)
                        })
                    }
                })
            })
        }
    })
}

$(function ( $ ){
    recebeAlarmes()
    setInterval(recebeAlarmes, 2000)
	$('.list-notificacao').on('click', '.clearfix', modalVerificarAlarme); // Use event delegation to handle the click event for dynamically added rows - ChatGPT
})