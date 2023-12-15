var sensores, criaSensores
var arraysSensoresHystory = Array()
var sens
var maxHistoryLength = 125 // Maximum length of the history array
let cookies = document.cookie.jwt

async function getVal() {
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
		return result
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

async function getSensores() { // parm id do funcionario
	try {
        const response = await fetch('/dadosCriaSensores', {
            method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'cookie': cookies
				},
			body:JSON.stringify({
				tipo: 0
			})
        })
        const jsval = await response.json()
        criaSensores = jsval.result
        // console.log(criaSensores)
        return criaSensores
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

async function criaCharts() {
	sens = await getSensores()
	if (!sens) {
		return 0
	}
	// console.log(result)
	sens.forEach((val, index) => {
		$('#rowSensores').append(
			'<div class="col-md-2">'+
				'<section class="panel">'+
					'<header class="panel-heading">'+
						'<div class="panel-actions">'+
							'<a class="fa fa-caret-down"></a>'+
						'</div>'+

						'<h2 class="panel-title">'+val.nome+'</h2>'+
					'</header>'+
					'<div class="panel-body">'+
						
						'<div class="chart chart-md" id="'+val.num_sensor+'"></div>'+

					'</div>'+
				'</section>'+
			'</div>'
		)
	})
	// console.log(arraysSensoresHystory.length);
}



async function update() {
	let result = await getVal()
	if (!result) {
		console.log(result)
		return 0
	}
	result.forEach((val, index) => {
		// console.log('sensores:', val)
		// console.log('valor AWS:', val.valor)
		// console.log(criaSensores)
		criaSensores.forEach((valS, indexS)=>{
			if(val.num_sensor==valS.num_sensor){
				// console.log(result)
				if (!arraysSensoresHystory[val.num_sensor]) {
					// Initialize the array with null values
					arraysSensoresHystory[val.num_sensor] = Array.from({ length: maxHistoryLength }, () => null);
				}
				if (val.valor !== undefined) {
					let valCalcSensor = (valS.valor_maximo * val.valor) / 1023
					arraysSensoresHystory[val.num_sensor].push(valCalcSensor);
				}
				// Keep the history array length within the specified maximum
				if (arraysSensoresHystory[val.num_sensor].length > maxHistoryLength) {
					arraysSensoresHystory[val.num_sensor] = arraysSensoresHystory[val.num_sensor].slice(arraysSensoresHystory[val.num_sensor].length - maxHistoryLength)
				}
				// Prepare data for the plot from the history array
				var data = arraysSensoresHystory[val.num_sensor].map(function (value, arrayIndex) {
					return [arrayIndex, value]
				})
				// Initialize or update the Flot chart
				var chartId = (val.num_sensor).toString(); // Convert index to string for the chart ID
				// Try to find the existing chart by ID
				var existingChart = $('#' + chartId).data('plot');
				if (!existingChart) {
					// If the chart doesn't exist, initialize it
					$.plot('#' + chartId, [data], {
						colors: ['#f55353'],
						series: {
							lines: {
								show: true,
								fill: true,
								lineWidth: 1,
								fillColor: {
									colors: [{
										opacity: 0.45
									}, {
										opacity: 0.45
									}]
								}
							},
							points: {
								show: false
							},
							shadowSize: 0
						},
						grid: {
							borderColor: 'rgba(0,0,0,0.1)',
							borderWidth: 1,
							labelMargin: 15,
							backgroundColor: 'transparent'
						},
						yaxis: {
							min: 0,
							max: valS.valor_maximo,
							color: 'rgba(0,0,0,0.1)'
						},
						xaxis: {
							show: false
						}
					});
				} else {
					// If the chart exists, update it
					existingChart.setData([data]);
					existingChart.setupGrid();
					existingChart.draw();
				}
			}
		})
	});
}

(function ($) {
    'use strict'
	criaCharts()
	// getVal()
    setInterval(update, 500)
})(jQuery)