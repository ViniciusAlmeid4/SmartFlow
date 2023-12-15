class Thing{
    constructor(clientid){
        this.keyPath = '/Users/MHR-ENG11/Documents/API/src/certificados/5b39f324309cb7be1c1953464829d9d1f33859a186c46209362c6dcd143daa11-private.pem.key',
        this.certPath = '/Users/MHR-ENG11/Documents/API/src/certificados/5b39f324309cb7be1c1953464829d9d1f33859a186c46209362c6dcd143daa11-certificate.pem.crt',
        this.caPath = '/Users/MHR-ENG11/Documents/API/src/certificados/AmazonRootCA1.pem',
        this.clientId = clientid,
        this.host = 'att6878v8g95n-ats.iot.us-east-1.amazonaws.com'
    }
}

export { Thing }