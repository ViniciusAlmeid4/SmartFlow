let cookies = document.cookie.jwt

async function getData() {
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/dadosHistoricos', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
		let result = await response.json()
		console.log(JSON.stringify(result))
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
    valCalcSensor
	// console.log(result)
	sens.forEach((val, index) => {
        switch (val.tipo) {

            case 0:
                tipoCreatingTable = 'Tensão'
                valCalcSensor = ((val.valor * val.valor_maximo) / 1023).toFixed(2)
                break;

            case 1:
                tipoCreatingTable = 'Corrente'
                valCalcSensor = ((val.valor * val.valor_maximo) / 1023).toFixed(2)
                break;

            case 2:
                tipoCreatingTable = 'Nível'
                valCalcSensor =val.valor + ' ('+((val.valor * 100) / val.valor_maximo).toFixed(2)+'%)'
                break;

            default:
                break;
        }
		data_hora = new Date((val.data_hora).replace(' ', 'T')) // formata e tira espaços vazios
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
			'<tr class="gradeA">'+ 
                '<td>'+dateString+'</td>'+
                '<td>'+val.nome+'</td>'+
                '<td>'+val.num_sensor+'</td>'+
                '<td>'+tipoCreatingTable+'</td>'+
                '<td>'+valCalcSensor+'</td>'+
            '</tr>'
		)
	})
}

$(function ( $ ){
    getData()
	criaTable().then((result)=>{
        var datatableInit = function() {
            $('#datatable-default').dataTable();
        };
        $(function() {
            datatableInit();
        });
    })
})