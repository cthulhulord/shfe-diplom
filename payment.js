let data = new allData;

const ticketTitle = document.querySelector('.subheader__title');
const ticketWrapper = document.querySelector('.ticket-wrapper');
const ticketInfo = document.querySelector('.ticket-info');
const getCodeButton = document.getElementById('code-button');
const ticketHint = document.querySelector('.ticket-hint');
const qrWrapper = document.getElementById('qr1');

const hallTitle = window.localStorage.getItem('hallTitle');
const chosenSeats = JSON.parse(window.localStorage.getItem('chosenSeats'));
const filmTitle = window.localStorage.getItem('filmTitle');
const seanceId = window.localStorage.getItem('seanceId');
const seanceTime = window.localStorage.getItem('seanceTime');
const chosenDate = window.localStorage.getItem('chosenDate');

function renderPayment () {
	let totalPrice = 0;
	let placeArray = []

	chosenSeats.forEach(element => {
		totalPrice += element.coast;
		placeArray.push(`Ряд ${element.row} Место ${element.place}`);
	})

	ticketInfo.insertAdjacentHTML('beforeend', `
		<p class="ticket-info__line">На фильм: <span class="ticket-info__line-bold">${filmTitle}</span></p>
		<p class="ticket-info__line">Места: <span class="ticket-info__line-bold">${placeArray.join(', ')}</span></p>
		<p class="ticket-info__line">В зале: <span class="ticket-info__line-bold">${hallTitle}</span></p>
		<p class="ticket-info__line">Начало сеанса: <span class="ticket-info__line-bold">${seanceTime}</span></p>
		<p class="ticket-info__line">Стоимость: <span class="ticket-info__line-bold">${totalPrice}</span> рублей</p>
	`)

	getCodeButton.addEventListener('click', e => {
		e.preventDefault();

		const params = new FormData();
		params.set('seanceId', seanceId);
		params.set('ticketDate', chosenDate);
		params.set('tickets', JSON.stringify(chosenSeats));

		console.log(params.get('seanceId'));
		console.log(params.get('ticketDate'));
		console.log(params.get('tickets'));

		data.setTicket(params);
	})
}

function renderTicket() {
	getCodeButton.classList.add('hidden');
	ticketInfo.children.item(4).remove();

	ticketHint.children.item(0).textContent = 'Покажите QR-код нашему контроллеру для подтверждения бронирования.';


	const qrcode = QRCreator(`Дата: ${chosenDate}, Время:${seanceTime}, Название фильма:${filmTitle}, Зал:${hallTitle}, ${placeArray.join(', ')}, Стоимость:${totalPrice}. Билет действителен строго на свой сеанс`,
		{ mode: 4,
		  eccl: 0,
		  mask: -1,
		  image: 'png',
		  modsize: -1,
		  margin: 0
		});

	const content = (qrcode) =>{
	  return qrcode.error ?
	    `недопустимые исходные данные ${qrcode.error}`:
	     qrcode.result;
	};

	qrWrapper.appendChild(content(qrcode));
}

renderPayment();