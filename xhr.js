class allData {

	getData() {
	    return fetch('https://shfe-diplom.neto-server.ru/alldata')
	    	.then(response => response.json())
	    	.then(data => this.info = data.result)
  	}

	getSeanceConfig (seanceId) {
		return fetch( `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${chosenDate}` )
	    .then( response => response.json())
	    .then(data => {
	    	this.hallConfig = data.result;
	    })
	}

	setTicket(params) {
		return fetch('https://shfe-diplom.neto-server.ru/ticket', {

			method: 'POST',

			body: params
		})
			.then(response => response.json())
			.then(data => {
				console.log(data)
				this.ticketSuccess = data.success
				console.log(this.ticketSuccess)
			})
	}

}