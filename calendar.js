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

	

	calendarItems.forEach(element => {
			element.classList.remove('nav__item-active');
			element.classList.remove('nav__item-red');
		})

	if (isCalendarSwitched === 0) {
		calendarItems[0].classList.add('nav__item-active');
		let activeDate = 0;

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
			dateItem.setDate(date.getDate() + 6);
			isCalendarSwitched = 1;
			e.target.innerHTML = '';
			calendarItems[0].innerHTML = '';
			renderCalendar(dateItem);
		})

	} else {
		calendarItems[1].classList.add('nav__item-active');
		let activeDate = 1;
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
			dateItem.setDate(date.getDate() - 6);
			isCalendarSwitched = 0;
			e.target.innerHTML = '';
			calendarItems[calendarItems.length - 1].innerHTML = '';
			renderCalendar(dateItem);
		})
	}
}

renderCalendar(today);