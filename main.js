const loginButton = document.getElementById('login')

loginButton.addEventListener('click', (e) => {
	e.preventDefault();

	window.open('login.html', '_self')
})

let data = new allData;

const filmCards = document.querySelector('.client__index');
const seanceSeats = document.querySelector('.client__hall');
const paymentWindow = document.querySelector('.client__payment');
const calendarWrapper = document.querySelector('.nav');
const calendar = document.querySelector('.nav__list');
const calendarItems = [...document.querySelectorAll('.nav__item')];
const today = new Date();

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

async function renderFilmCards () {
	await data.getData();
	filmCards.innerHTML = "";
	let filmsInfo = data.info.films;
	let hallsInfo = data.info.halls;
	let seancesInfo = data.info.seances;

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

	renderFilmSeances(element, filmSeances);
	});
}

function renderFilmSeances (film, filmSeances) {
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
					window.localStorage.setItem('seanceId', element.id);
					window.localStorage.setItem('seanceHallId', element.seance_hallid);
					window.localStorage.setItem('seanceTime', element.seance_time);
					window.localStorage.setItem('filmTitle', film.film_name);
					window.localStorage.setItem('chosenDate', chosenDate);
					console.log(window.localStorage.getItem('seanceId'))
					window.open('hall.html', '_self');
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

renderCalendar(today);