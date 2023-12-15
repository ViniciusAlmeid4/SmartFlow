let cookies = document.cookie.jwt,
maxSensores

async function getSensoresAtivos() { // parm id do funcionario
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/dadosNumSensoresAtivos', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
        return response.json()
    } catch (error) {
        console.log('Error fetching data:', error)
        return null
    }
}

async function getAlarmesAtivos24h() { // parm id do funcionario
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/alarmes24h', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
        return response.json()
    } catch (error) {
        console.log('Error fetching data:', error)
        return null
    }
}

async function getDadosPorMim() {
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/dadosPorMin', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
        return response.json()
    } catch (error) {
        console.log('Error fetching data:', error)
        return null
    }
}

async function getInfoSensores() { // parm id do funcionario
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
        return response.json()
    } catch (error) {
        console.log('Error fetching data:', error)
        return null
    }
}

async function getSensores() {
    try {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/msgAWS', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
		let result = await response.json()
		// console.log(JSON.stringify(result))
        // console.log(result)
		return result
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

async function infoDash() {
    let qntSnsAtivos = await getSensoresAtivos()
    let qntPorMin = await getDadosPorMim()
    let alarmes24h = await getAlarmesAtivos24h()
    console.log(alarmes24h.result)
    $('#qntDispAtivos').html(qntSnsAtivos.result)
    $('#qntSensoresPorMin').html(qntPorMin.result)
    $('#alarmes-24hrs').html(alarmes24h.result)
}

async function criaTables() {
    let result = await getInfoSensores()
    let arraySensores = result.result
    arraySensores.forEach((val, index) => {
        console.log(val.tipo)
        if(val.tipo == 0){
            $('#tbodyTensao').append(
                '<tr id="' + val.num_sensor + '" tipo="Tensao">'+
                    '<td class="td-index nome_sensor">' + val.nome + '</td>' +
                    '<td class="td-index">' + val.num_sensor + '</td>' +
                    '<td class="valorSensor td-index" max-val="'+val.valor_maximo+'"></td>' +
                '</tr>'
            )
        }
        if(val.tipo == 1){
            $('#tbodyCorrente').append(
                '<tr id="' + val.num_sensor + '" tipo="Corrente">'+
                    '<td class="td-index nome_sensor">' + val.nome + '</td>' +
                    '<td class="td-index">' + val.num_sensor + '</td>' +
                    '<td class="valorSensor td-index" max-val="'+val.valor_maximo+'"></td>' +
                '</tr>'
            )
        }
        if(val.tipo == 2){
            $('#tbodyNivel').append(
                '<tr id="' + val.num_sensor + '" tipo="Nivel">'+
                    '<td class="td-index nome_sensor">' + val.nome + '</td>' +
                    '<td class="td-index">' + val.num_sensor + '</td>' +
                    '<td class="valorSensor td-index" max-val="'+val.valor_maximo+'"></td>' +
                '</tr>'
            )
        }
    })
}

async function update() {
    let sensores = await getSensores();
    sensores.forEach(i => {
        let trTable = $('#'+i.num_sensor)
        if(trTable){
            let valMax = trTable.children('.valorSensor').attr('max-val')
            if (trTable.attr('tipo') == 'Nivel') {
                let valorConvertido = ((i.valor * 100) / valMax).toFixed(2)
                trTable.children('.valorSensor').html(valorConvertido);
            } else {
                let valorConvertido = ((i.valor * valMax) / 1023).toFixed(2)
                trTable.children('.valorSensor').html(valorConvertido);
            }
        }
    });
}

(function ($) {
    'use strict';
    infoDash();
    criaTables();
    setInterval(update, 500);
})(jQuery);
