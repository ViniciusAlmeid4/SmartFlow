import { padrao_alarme } from '../controllers/controllerAlarmes.js';

import { salvaHistAlarme } from '../models/dbHistAlarme.js';

var alarmesAtivos = []

function findObj(arrayObj, value) {
    return arrayObj.find(obj => obj.num_sensor == value)
}

async function removeObjectById(array, id) {
    try {
        // Find the index of the object with the given id
        let index = array.findIndex(obj => obj.id_historico_alarmes == id);
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

// 0 = baixo  &&  1 = alto

function validaAlarme(sensor) {
    let jaExiste = findObj(alarmesAtivos, sensor.num_sensor)
    if (!jaExiste) {
        let padrao =  findObj(padrao_alarme, sensor.num_sensor)
        if (padrao) {
            if(sensor.valor >= padrao.alarme_alto){
                if (padrao.tipo != 2) {

                    sensor.valor = ((padrao.valor_maximo * sensor.valor) / 1023).toFixed(2)

                }
                // salva no banco e entregar o id para salvar no alarmesAtivos
                let alarme = {"num_sensor": sensor.num_sensor, "tipo": 1, "valor": sensor.valor}
                salvaHistAlarme(alarme).then((result)=>{
                    alarme.id_historico_alarmes = result.result.id_historico_alarmes
                }).finally(()=>{
                    alarmesAtivos.push(alarme)
                    console.log(JSON.stringify(alarmesAtivos))
                })
            }
            if (sensor.valor <= padrao.alarme_baixo) {
                // salva no banco e entregar o id para salvar no alarmesAtivos
                let alarme = {"num_sensor": sensor.num_sensor, "tipo": 0, "valor": sensor.valor}
                salvaHistAlarme(alarme).then((result)=>{
                    alarme.id_historico_alarmes = result.result.id_historico_alarmes
                }).finally(()=>{
                    alarmesAtivos.push(alarme) // "id": oq vem do banco
                    console.log(JSON.stringify(alarmesAtivos))
                })
            }
        }
    }else{
        let padrao =  findObj(padrao_alarme, sensor.num_sensor)
        if (padrao) {
            if(sensor.valor >= padrao.alarme_alto){
                // salva no banco
                let alarme = {"num_sensor": sensor.num_sensor, "tipo": 1, "valor": sensor.valor}
                salvaHistAlarme(alarme)
            }

            if (sensor.valor <= padrao.alarme_baixo) {
                // salva no banco
                let alarme = {"num_sensor": sensor.num_sensor, "tipo": 0, "valor": sensor.valor}
                salvaHistAlarme(alarme)
            }
        }
    }
}

function alarmeVerificado(id_historico_alarmes) {
    removeObjectById(alarmesAtivos, id_historico_alarmes)
}

function resetAlarmes() {
    alarmesAtivos = []
}

export {
    alarmesAtivos,
    validaAlarme,
    resetAlarmes,
    alarmeVerificado
}