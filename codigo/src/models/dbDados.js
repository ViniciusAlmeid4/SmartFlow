import { pool } from "./db.js";

///////////////////////

//      -- function to get the current timestamp --

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

//////////////////////

async function insertDadosSensores(sensores) {
    sensores.forEach((val, index) => {
        insertDados(index, val)
    });
    // Use parameterized query to avoid SQL injection
    async function insertDados(num_sensor, valor) {
        const query = {
            text: 'INSERT INTO dadossensores(data_hora, num_sensor, valor) VALUES ($1,$2,$3);',
            values: [dateNow(), num_sensor, valor], // Pass the value as an array
            rowMode: 'json', // formato que as rows são entregues
        };
        try {
            let Sensores = await pool.query(query)
            console.log(query.values)
            return 0 
        } catch (error) {
            console.log(error)
            return 0
        }
    }
}

export {
    insertDadosSensores
}