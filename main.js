const loginButton = document.getElementById('login')

loginButton.addEventListener('click', (e) => {
	e.preventDefault();

	window.open('login.html', '_self')
})

const filmCards = document.querySelector('.client__index');
const seanceSeats = document.querySelector('.client__hall');
const paymentWindow = document.querySelector('.client__payment');
const calendarWrapper = document.querySelector('.nav');
const calendar = document.querySelector('.nav__list');
const calendarItems = [...document.querySelectorAll('.nav__item')];
const today = new Date();
const hallConfig = document.querySelector('.client__hall');
const hallSeanceInfo = document.querySelector('.session__info');
const hallGrid = document.querySelector('.hall__grid');
const hallGridLegendStandart = document.getElementById('legend-standart');
const hallGridLegendVip = document.getElementById('legend-vip');
const bookingButton = document.querySelector('.booking__button');
const ticketTitle = document.querySelector('.subheader__title');
const ticketWrapper = document.querySelector('.ticket-wrapper');
const ticketInfo = document.querySelector('.ticket-info');
const getCodeButton = document.getElementById('code-button');
const ticketHint = document.querySelector('.ticket-hint');
const qrWrapper = document.getElementById('qr1');

let isCalendarSwitched = 0;
let todayDate = new Date(today);
let	chosenDate = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

(function() {
    const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];

    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();

function renderCalendar (date) {
	let todayDate = new Date(date)	
	
	let dateItem = new Date(todayDate)

	let activeDate = 0;

	calendarItems.forEach(element => {
			element.classList.remove('nav__item-active');
			element.classList.remove('nav__item-red');
		})

	if (isCalendarSwitched === 0) {
		calendarItems[0].classList.add('nav__item-active');

		renderFilmCards();
		for (let i = 0; i < (calendarItems.length - 1); i++) {
			calendarItems[i].innerHTML = '';
			chosenDate = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;

			const dayName = document.createElement('p');
			const dayNumber = document.createElement('p');
			dayName.classList.add('date__day');
			dayNumber.classList.add('date__number');
			if (today.getDate() === dateItem.getDate()) {
				dayName.textContent = `Сегодня`;
				dayNumber.textContent = `${dateItem.getDayName()},${dateItem.getDate()}`;
			} else {
				dayName.textContent = `${dateItem.getDayName()},`;
				dayNumber.textContent = dateItem.getDate();			
			}
			if (dateItem.getDay() === 0 || dateItem.getDay() === 6) {
				calendarItems[i].classList.add('nav__item-red')
			}
			calendarItems[i].setAttribute('data-date', `${dateItem.getFullYear()}-${dateItem.getMonth() + 1}-${dateItem.getDate()}`)
			calendarItems[i].appendChild(dayName);
			calendarItems[i].appendChild(dayNumber);
			dateItem.setDate(dateItem.getDate() + 1);

			calendarItems[i].addEventListener('click', e => {
				if (i !== activeDate) {
					calendarItems[activeDate].classList.remove('nav__item-active');
					calendarItems[i].classList.add('nav__item-active');
					chosenDate = calendarItems[i].dataset.date;
					activeDate = i;
					renderFilmCards();
				}
			})

		}
		calendarItems[calendarItems.length - 1].insertAdjacentHTML('beforeend', '<p href="" class="date__link date__switch">></p>');
		calendarItems[calendarItems.length - 1].addEventListener('click', e => {
			dateItem.setDate(date.getDate() + 7);
			isCalendarSwitched = 1;
			e.target.innerHTML = '';
			calendarItems[0].innerHTML = '';
			renderCalendar(dateItem);
		})

	} else {
		calendarItems[1].classList.add('nav__item-active');
		renderFilmCards();
		for (let i = 1; i < calendarItems.length; i++) {
			calendarItems[i].innerHTML = '';

			const dayName = document.createElement('p');
			const dayNumber = document.createElement('p');
			dayName.classList.add('date__day');
			dayNumber.classList.add('date__number');
			dayName.textContent = `${dateItem.getDayName()},`;
			dayNumber.textContent = dateItem.getDate();			
			
			if (dateItem.getDay() === 0 || dateItem.getDay() === 6) {
				calendarItems[i].classList.add('nav__item-red')
			}
			calendarItems[i].setAttribute('data-date', `${dateItem.getFullYear()}-${dateItem.getMonth() + 1}-${dateItem.getDate()}`)
			calendarItems[i].appendChild(dayName);
			calendarItems[i].appendChild(dayNumber);
			dateItem.setDate(dateItem.getDate() + 1);
			chosenDate = calendarItems[1].dataset.date;

			calendarItems[i].addEventListener('click', e => {
				if (i !== activeDate) {
					calendarItems[activeDate].classList.remove('nav__item-active');
					calendarItems[i].classList.add('nav__item-active');
					chosenDate = calendarItems[i].dataset.date;
					activeDate = i;
					renderFilmCards();
				}
			})

		}
		calendarItems[0].insertAdjacentHTML('beforeend', '<p href="" class="date__link date__switch"><</p>');
		calendarItems[0].addEventListener('click', e => {
			dateItem.setDate(date.getDate() - 7);
			isCalendarSwitched = 0;
			e.target.innerHTML = '';
			calendarItems[calendarItems.length - 1].innerHTML = '';
			renderCalendar(dateItem);
		})
	}

	
}



function renderFilmCards () {
	fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
	    .then( response => response.json())
	    .then( data => {

	    	console.log( data );
	    	filmCards.innerHTML = "";
	    	let filmsInfo = data.result.films;
	    	let hallsInfo = data.result.halls;
	    	let seancesInfo = data.result.seances;

	    	filmsInfo.forEach((element, index) => {
	    		const filmArticle = document.createElement('article');
	    		filmArticle.classList.add('movie');
	    		filmArticle.id = 'film'+element.id
	    		filmCards.appendChild(filmArticle);
	    		filmArticle.insertAdjacentHTML('beforeend',`
	    			<div class="movie__info">
						<img src="${element.film_poster}" alt="" class="movie__image">
						<div class="movie__description">
							<h2 class="movie__title">${element.film_name}</h2>
							<p class="movie__synopsis">${element.film_description}</p>
							<div class="movie__data">
								<p class="movie__length">${element.film_duration} минут</p>
								<p class="movie__country">${element.film_origin}</p>
							</div>
						</div>
					</div>
					<div class="movie__schedule">

					</div>
    			`)

    			const filmSchedule = [...document.querySelectorAll('.movie__schedule')];

    			

    			const filmSeances = []
    			const filmHalls = []

	    		seancesInfo.map((item) => {
		    		const seanceFilm = item.seance_filmid;
		    		if (seanceFilm === element.id) {
		    			filmSeances.push(item);
		    		}
		    		
	    		})

	    		hallsInfo.forEach((item, hallIndex) => {
	    			if (!item.hall_open == 0) {
		    			if (filmSeances.some((e) => e.seance_hallid === item.id)) {
		    				filmSchedule[index].insertAdjacentHTML('beforeend',`
		    					<div class="movie-halls" data-id="${item.id}" data-open="1">
									<h3 class="movie-halls__title">${item.hall_name}</h3>
									<ul class="movie-halls__times">
									</ul>
								</div>
	    					`)
		    			}
	    			}
	    		})

    		renderFilmSeances(element, filmSeances, hallsInfo);
			});
		})
}

function renderFilmSeances (film, filmSeances, hallsInfo) {
	const filmCard = [...document.querySelectorAll('.movie')];
	filmSeances.forEach((element) => {
		const currentFilm = filmCard.find((e) => e.id.slice(4) == element.seance_filmid);
		const currentFilmHalls = [...currentFilm.children.item(1).children];
		const currentHall = currentFilmHalls.find((e) => e.dataset.id == element.seance_hallid);
		if (currentHall) {
			const movieTime = document.createElement('li');
			movieTime.classList.add('movie-halls__time');
			if (chosenDate == todayDateString) {
				const time = new Date();
				const timeString = `${time.getHours()}${time.getMinutes()}`
				if (timeString > element.seance_time.replace(':', '')) {
					movieTime.classList.add('movie-halls__time-disabled')
				}
			}
			movieTime.setAttribute('data-time', element.seance_time.replace(':', ''))
			movieTime.textContent = element.seance_time;

			if (![...movieTime.classList].includes('movie-halls__time-disabled')) {
				movieTime.addEventListener('click', e => {
					filmCards.classList.add('hidden');
					calendarWrapper.classList.add('hidden');
					loginButton.classList.add('hidden');
					seanceSeats.classList.remove('hidden');
					renderSeanceConfig(element, film, hallsInfo);
				})
			}

			currentHall.children.item(1).appendChild(movieTime);
		};
	})

	const hallTimes = [...document.querySelectorAll('.movie-halls__times')];
	hallTimes.forEach(element => {
		const hallTime = [...element.children]
		hallTime.sort((a,b) => {
			return a.dataset.time - b.dataset.time
		})

		hallTime.forEach(item => {
			element.appendChild(item);
		})
	})
}


function renderSeanceConfig (seance, film, hallsInfo) {
	fetch( `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seance.id}&date=${chosenDate}` )
	    .then( response => response.json())
	    .then( data => {
	    	hallGrid.innerHTML = ''
	    	const currentHall = hallsInfo.find((e) => e.id === seance.seance_hallid);
	    	const hallTitle = currentHall.hall_name;
	    	const hallConfig = data.result;
	    	let chosenSeats = [];

	    	hallSeanceInfo.insertAdjacentHTML('beforeend', `
	    		<p class="session__title">${film.film_name}</p>
				<p class="session__time">Начало сеанса: ${seance.seance_time}</p>
				<p class="session__hall">${hallTitle}</p>
    		`);

    		hallGrid.style.setProperty('grid-template-rows', `repeat(${hallConfig.length}, 20px)`);
			hallGrid.style.setProperty('grid-template-columns', `repeat(${hallConfig[0].length}, 20px)`);



			hallConfig.forEach((row, rowIndex) => {
				row.forEach((place, placeIndex) => {

					const hallGridCell = document.createElement('div');
					
					hallGrid.appendChild(hallGridCell);
					hallGridCell.classList.add('hall__seat');
					if (place === 'standart') {
						hallGridCell.classList.add('hall__seat-free')
					} else if (place === 'vip') {
						hallGridCell.classList.add('hall__seat-vip')
					} else if (place === 'taken') {
						hallGridCell.classList.add('hall__seat-occupied')
					};
					hallGridCell.addEventListener('click', (e) => {
						if ([...hallGridCell.classList].includes('hall__seat-free') && ![...hallGridCell.classList].includes('hall__seat-chosen')) {
							hallGridCell.classList.add('hall__seat-chosen');
							chosenSeats.push({
								row: rowIndex + 1,
								place: placeIndex + 1,
								coast: currentHall.hall_price_standart,
							});
						} else if ([...hallGridCell.classList].includes('hall__seat-vip') && ![...hallGridCell.classList].includes('hall__seat-chosen')) {
							hallGridCell.classList.add('hall__seat-chosen');
							chosenSeats.push({
								row: rowIndex + 1,
								place: placeIndex + 1,
								coast: currentHall.hall_price_vip,
							});
						} else if ([...hallGridCell.classList].includes('hall__seat-chosen')) {
							hallGridCell.classList.remove('hall__seat-chosen');
							for (let i = 0; i < chosenSeats.length; i++) {
								const row = rowIndex + 1;
								const place = placeIndex + 1;
								if (chosenSeats[i].row == row && chosenSeats[i].place == place) {
									chosenSeats.splice(i, 1);
									break;
								}
							}
						}
					});
				});
			});

			hallGridLegendStandart.textContent = `Свободно (${currentHall.hall_price_standart}руб)`;
			hallGridLegendVip.textContent = `Свободно VIP (${currentHall.hall_price_vip}руб)`;

			bookingButton.addEventListener('click', e => {
				e.preventDefault();

				if (!chosenSeats.length == 0) {
					seanceSeats.classList.add('hidden');
					paymentWindow.classList.remove('hidden');
					renderPayment(seance, chosenDate, film, currentHall, chosenSeats)
				} else {
					alert('Выберите места');
				}
			})

	});
};

function renderPayment (seance, date, film, hall, chosenSeats) {
	let totalPrice = 0;
	let placeArray = []

	chosenSeats.forEach(element => {
		totalPrice += element.coast;
		placeArray.push(`Ряд ${element.row} Место ${element.place}`);
	})

	ticketInfo.insertAdjacentHTML('beforeend', `
		<p class="ticket-info__line">На фильм: <span class="ticket-info__line-bold">${film.film_name}</span></p>
		<p class="ticket-info__line">Места: <span class="ticket-info__line-bold">${placeArray.join(', ')}</span></p>
		<p class="ticket-info__line">В зале: <span class="ticket-info__line-bold">${hall.hall_name}</span></p>
		<p class="ticket-info__line">Начало сеанса: <span class="ticket-info__line-bold">${seance.seance_time}</span></p>
		<p class="ticket-info__line">Стоимость: <span class="ticket-info__line-bold">${totalPrice}</span> рублей</p>
	`)

	getCodeButton.addEventListener('click', e => {
		e.preventDefault();

		const params = new FormData();
		params.set('seanceId', seance.id);
		params.set('ticketDate', date);
		params.set('tickets', JSON.stringify(chosenSeats));

		console.log(params.get('seanceId'));
		console.log(params.get('ticketDate'))
		console.log(params.get('tickets'))

		fetch('https://shfe-diplom.neto-server.ru/ticket', {

			method: 'POST',

			body: params

			// body: {
			// 	seanceId: seance.id,
			// 	ticketDate: '2024-01-16',
			// 	tickets: [{row:2, place:4, coast:3500,}],
		})
			.then( response => response.json())
			.then( data => {
				console.log(data);
				if (data.success) {
					getCodeButton.classList.add('hidden');
					ticketInfo.children.item(4).remove();

					ticketHint.children.item(0).textContent = 'Покажите QR-код нашему контроллеру для подтверждения бронирования.';


					const qrcode = QRCreator(`Дата: ${date}, Время:${seance.seance_time}, Название фильма:${film.film_name}, Зал:${hall.hall_name}, ${placeArray.join(', ')}, Стоимость:${totalPrice}. Билет действителен строго на свой сеанс`,
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
			})

	})

}

renderCalendar(today);