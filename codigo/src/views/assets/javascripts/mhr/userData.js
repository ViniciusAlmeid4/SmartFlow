async function getCookies() {
    try {
        let cookies = document.cookie.jwt
        let headers = new Headers({
            'Content-Type': 'application/json',
            'cookie': cookies
        })
        const response = await fetch('/dadosCookieUsuario', {
            method: 'GET',
            credentials: 'include',
            headers: headers
        })
        dadosCookie = await response.json()
        // console.log('dados: ' + JSON.stringify(dadosCookie))
        return dadosCookie
    } catch (error) {
        console.log();('Error fetching data:', error)
        return null
    }
}

$(function ( $ ){
    try {
        getCookies().then((result) => {
            if (result != 0) {
                $('#usuario').html(result.usuario)
                $('#grupo').html(result.grupo)
            }
        })
    } catch (error) {
        console.log(error)
    }
})