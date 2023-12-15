async function getVal() {
	const response = await fetch('/msgAWS/',
		{
			method: 'GET'
		})
    const jsval = await response.json()
    console.log(jsval.Tensao)
    console.log(jsval.Nivel)
    return jsval
}

function atuaizaTable() {
    getVal().then((result)=>{
        $('#T1').html(result.Tensao)
        $('#N1').html(result.Nivel)
    }).catch((error)=>{
        console.log(error)
    })
}


$(function ( $ ){
    setInterval( atuaizaTable , 250)
})