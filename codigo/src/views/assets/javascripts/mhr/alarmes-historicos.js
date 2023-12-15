let cookies = document.cookie.jwt

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

async function getData() {
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/alarmesHistoricos', {
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

async function criaTable() {
	sens = await getData()
	if (!sens) {
		return 0
	}
    let tipoCreatingTable,
    data_hora,
    dateString,
    verificado
	// console.log(result)
	sens.forEach((val, index) => {
        switch (val.tipo_alarme) {
            case 0:
                tipoCreatingTable = 'Baixo'
                break;

            case 1:
                tipoCreatingTable = 'Alto'
                break;

            default:
                break;
        }

        switch (val.verificado) {
            case false:
                verificado = '<a href="#" class="validar-alarme"><ul class="list-inline">'+
                                '<li class="list-inline-item"><i class="bi bi-circle-fill text-danger"></i></li>'+
                                '<li class="list-inline-item text-danger">NÃO</li>'+
                            '</ul></a>'
                break;
                                
            case true:
                verificado = '<ul class="list-inline">'+
                                '<li class="list-inline-item"><i class="bi bi-circle-fill text-success"></i></li>'+
                                '<li class="list-inline-item text-success">SIM</li>'+
                            '</ul>'
                break;

            default:
                break;
        }
		data_hora = new Date((val.data_alarme).replace(' ', 'T')) // formata e tira espaços vazios
        dateString = new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'America/Sao_Paulo', // time zone de são paulo
        }).format(data_hora);
		$('#rowSensores').append(
			'<tr class="gradeA" id-historico-alarmes="'+val.id_historico_alarmes+'">'+ 
                '<td class="date-alarme">'+dateString+'</td>'+
                '<td class="nome-alarme">'+val.nome+'</td>'+
                '<td class="num-sensor-alarme">'+val.num_sensor+'</td>'+
                '<td class="tipo-alarme">'+tipoCreatingTable+'</td>'+
                '<td class="alto-alarme">'+val.alarme_alto+'</td>'+
                '<td class="baixo-alarme">'+val.alarme_baixo+'</td>'+
                '<td class="valor-alarme">'+val.valor_alarme+'</td>'+
                '<td>'+verificado+'</td>'+
            '</tr>'
		)
	})
}

async function validarAlarme() {
    let selectedAlert = $(this).closest('tr')
    id = selectedAlert.attr('id-historico-alarmes')
    console.log(id)
    if (id != '') {
        $('#verificaNome').val(selectedAlert.children('.nome-alarme').html())
        $('#verificaNum').val(selectedAlert.children('.num-sensor-alarme').html())
        $('#verificaMin').val(selectedAlert.children('.baixo-alarme').html())
        $('#verificaMax').val(selectedAlert.children('.alto-alarme').html())
        $('#verificaValAlarme').val(selectedAlert.children('.valor-alarme').html())
        $('#verificaTipo').val(selectedAlert.children('.tipo-alarme').html())
        $('#verificaData').val(selectedAlert.children('.date-alarme').html())
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
                    try {
                        removeObjectById(arrayAlarmes, id).then((result)=>{
                            $('li[id-alarme="' + id + '"]').remove();
    
                            $('.num-alarmes').html(arrayAlarmes.length)
    
				            location.reload()	// reseta a página para garantir q as novas configs sejam atualizadas no front
                        })
                    } catch (error) {
                    }
                }
            })
        })
    }
}

$(function ( $ ){
    getData()
    $('#rowSensores').on('click', '.validar-alarme', validarAlarme)
	criaTable().then((result)=>{
        var datatableInit = function() {
            $('#datatable-default').dataTable();
        };
        $(function() {
            datatableInit();
        });
    })
})