// fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
//     .then( response => response.json())
//     .then( data => console.log( data ));


const closePopup = [...document.querySelectorAll('.popup-close')];
const cancelPopup = [...document.querySelectorAll('.popup-cancel')]

closePopup.forEach((element) => {
	element.addEventListener('click', (e) => {
		element.closest('.popup-wrapper').classList.toggle('hidden');
	})
});

cancelPopup.forEach((element) => {
	element.addEventListener('click', (e) => {
		e.preventDefault();
		element.closest('.popup-wrapper').classList.toggle('hidden');
	})
});


const addHallPopupButton = document.getElementById('add-hall-button');
const addHallPopup = document.getElementById('add-hall');
const addHallForm = document.getElementById('popup-hall-form');
const hallName = document.getElementById('hall-name');
const submitHallButton = document.getElementById('create-hall');
const hallsListWrapper = document.querySelector('.admin-halls__wrapper');
const hallsList = document.createElement('ul');
const inputRows = document.getElementById('rows');
const inputSeats = document.getElementById('columns');

hallsListWrapper.insertBefore(hallsList, addHallPopupButton);
hallsList.classList.add('admin-halls__list');

function renderHallsList () {
	fetch('https://shfe-diplom.neto-server.ru/alldata')
		.then( (response) => response.json())
		.then( (data) => {
			hallsList.innerHTML = "";
			let hallsInfo = data.result.halls;
			hallsInfo.forEach((element) => {
				hallsList.insertAdjacentHTML('beforeend', 
					`<li class="admin-halls__list-item" id="hall${element.id}">
						<p class="admin-halls__item-text">${element.hall_name}</p>
						<button class="admin-delete-button_halls admin-delete-button"></button>
					</li>`
					)
			});
			const deleteHallButton = [...document.querySelectorAll('.admin-delete-button_halls')];
			deleteHall(deleteHallButton);
			renderHallSwitch (document.querySelector('.hall-switch__buttons_configuration'));
			renderHallSwitch (document.querySelector('.hall-switch__buttons_launch'));
			renderHallSwitch (document.querySelector('.hall-switch__buttons_prices'));
			renderFilmsList();
		});
	
};

function deleteHall (buttonArray) {
		buttonArray.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const hallId = element.closest('.admin-halls__list-item').id.slice(4);

				// console.log(hallId);
				fetch( `https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
	    			method: 'DELETE',
				})
				    .then( response => response.json())
				    .then( data => {
				    	console.log( data );
				    	renderHallsList();
					});
				})	
		})
};

function getHallSeats (hall) {
	fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const hallItems = data.result.halls;
			configActiveHall = hallItems.find(x => x.id === hall);
			hallConfig = configActiveHall.hall_config;
			inputRows.value = hallConfig.length;
			inputSeats.value = hallConfig[0].length;
			// console.log(hallConfig);
			renderHallSeats();
			hallInput();
		})
}

function hallInput () {
	inputRows.addEventListener('input', (e) => {
		if (!/\D/.test(inputRows.value)) {
			if (inputSeats.value) {
				hallConfig = [];
				// console.log(hallConfig);
				for (let i = 0; i < inputRows.value; i++) {
					hallConfig.push([]);
					for (let x = 0; x < inputSeats.value; x++) {
						hallConfig[i].push('standart');
						// console.log(hallConfig);
					}
				}
				setTimeout(() => {
					renderHallSeats();
				}, 2000)
			}
		}
	});

	inputSeats.addEventListener('input', (e) => {
		// console.log(hallConfig);
		if (!/\D/.test(inputSeats.value)) {
			if (inputRows.value) {
				hallConfig = []
				for (let i = 0; i < inputRows.value; i++) {
					hallConfig.push([]);
					for (let x = 0; x < inputSeats.value; x++) {
						hallConfig[i].push('standart');
						// console.log(hallConfig);
					}
				}
				setTimeout(() => {
					renderHallSeats();
				}, 2000)
				
			}
		}
	});
}

function saveHallSeats () {
	// const configConfirm = document.getElementById('create-config');
	// const configCancel = document.getElementById('cancel-config');
	const placeCount = hallConfig[0].length;
	const rowCount = hallConfig.length;
	const params = new FormData();
	params.set('rowCount', rowCount);
	params.set('placeCount', placeCount);
	params.set('config', JSON.stringify(hallConfig));

	fetch(`https://shfe-diplom.neto-server.ru/hall/${configActiveHall.id}`, {
			method: 'POST',
			body: params
		})
			.then( response => response.json())
		    .then( data => console.log( data ))
}

function renderHallSeats () {
	// console.log('hello');
	const hallGrid = document.querySelector('.seat-scheme__grid');
	const hallGridCell = document.createElement('div');

	hallGrid.innerHTML = '';

	hallGrid.style.setProperty('grid-template-rows', `repeat(${hallConfig.length}, 26px)`);
	hallGrid.style.setProperty('grid-template-columns', `repeat(${hallConfig[0].length}, 26px)`);
	hallConfig.forEach((row, rowIndex) => {
		row.forEach((place, placeIndex) => {

			const hallGridCell = document.createElement('div');
			
			hallGrid.appendChild(hallGridCell);
			hallGridCell.classList.add('seat-scheme__item');
			if (place === 'standart') {
				hallGridCell.classList.add('seat-scheme__item_regular')
			} else if (place === 'vip') {
				hallGridCell.classList.add('seat-scheme__item_vip')
			};
			hallGridCell.addEventListener('click', (e) => {
				// console.log(hallGridCell.classList)
				if ([...hallGridCell.classList].includes('seat-scheme__item_regular')) {
					hallGridCell.classList.remove('seat-scheme__item_regular');
					hallGridCell.classList.add('seat-scheme__item_vip');
					hallConfig[rowIndex][placeIndex] = 'vip';
				} else if ([...hallGridCell.classList].includes('seat-scheme__item_vip')) {
					hallGridCell.classList.remove('seat-scheme__item_vip');
					hallConfig[rowIndex][placeIndex] = 'disabled'
				} else {
					hallGridCell.classList.add('seat-scheme__item_regular');
					hallConfig[rowIndex][placeIndex] = 'standart'
				}
			});
		});
	});
};

function renderHallSwitch (hallSwitchContainer) {
	fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
		.then((response) => response.json())
		.then((data) => {
			const hallItems = data.result.halls;
			// console.log(hallItems);
			hallSwitchContainer.innerHTML = '';
			hallItems.forEach((element) => {
				hallSwitchContainer.insertAdjacentHTML('beforeend', `<button class="hall-switch__button">${element.hall_name}</button>`
					)
			});
			const hallItemsRendered = [...hallSwitchContainer.children];

			hallItemsRendered[0].classList.add('hall-switch__button_active');

			let activeHallIndex = 0;
			let activeHallName = hallItemsRendered[0].textContent;
			let activeHallId = hallItems[0].id;
			// console.log(activeHallId);
			if (hallItemsRendered[0].closest('.hall-switch__buttons_configuration')) {
				getHallSeats(activeHallId)
			} else if (hallItemsRendered[0].closest('.hall-switch__buttons_prices')) {
				getHallPrices(activeHallId)
			} else if (hallItemsRendered[0].closest('.hall-switch__buttons_launch')) {
				launchInfo(activeHallId)
			};

			hallItemsRendered.forEach((element, index) => {
				element.addEventListener('click', (e) => {
					if (index !== activeHallIndex) {
						hallItemsRendered[activeHallIndex].classList.remove('hall-switch__button_active');
						element.classList.add('hall-switch__button_active');
						activeHallIndex = index;
						activeHallName = element.textContent;
						activeHallId = hallItems.find(x => x.hall_name === activeHallName).id;
						// console.log(activeHallId);
						if (element.closest('.hall-switch__buttons_configuration')) {
							inputRows.value = '';
							inputSeats.value = '';
							getHallSeats(activeHallId)
						} else if (element.closest('.hall-switch__buttons_prices')) {
							getHallPrices(activeHallId)
						} else if (element.closest('.hall-switch__buttons_launch')) {
							launchInfo(activeHallId)
						};
					}
				})
			})

		})
};


let hallConfig = [];
let configActiveHall;

renderHallsList();
renderHallSwitch (document.querySelector('.hall-switch__buttons_configuration'));
renderHallSwitch (document.querySelector('.hall-switch__buttons_launch'));
renderHallSwitch (document.querySelector('.hall-switch__buttons_prices'));

const configConfirm = document.getElementById('create-config');
const configCancel = document.getElementById('cancel-config');
const pricesConfirm = document.getElementById('create-prices');
const pricesCancel = document.getElementById('cancel-prices');
const launchButton = document.getElementById('launch-button');

configConfirm.addEventListener('click', saveHallSeats);
pricesConfirm.addEventListener('click', saveHallPrices);


let hallPrices = [];
let pricesActiveHall;
const inputPriceStandart = document.getElementById('price-regular');
const inputPriceVip = document.getElementById('price-vip');

let launchActiveHall;
let isHallOpen;

launchButton.addEventListener('click', e => {
	openHall(launchActiveHall);
	launchInfo(launchActiveHall.id);
});

// console.log(inputPriceStandart)
// console.log(inputPriceVip)

function openHall (hall) {
	const params = new FormData()
	if (isHallOpen === 0) {
		params.set('hallOpen', '1')
	} else {
		params.set('hallOpen', '0')
	}
	
	fetch( `https://shfe-diplom.neto-server.ru/open/${launchActiveHall.id}`, {
			method: 'POST',
		body: params 
	})
	    .then( response => response.json())
	    .then( data => {
	    	console.log( data );
	    });

    // console.log(launchActiveHall);
    // console.log(hall);
}

function launchInfo (hall) {
	fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
		.then((response) => response.json())
		.then((data) => {
			const hallItems = data.result.halls;
			launchActiveHall = hallItems.find(x => x.id === hall);
			isHallOpen = launchActiveHall.hall_open;
			if (isHallOpen === 0) {
				launchButton.textContent = 'Открыть продажу билетов';
			} else {
				launchButton.textContent = 'Приостановить продажу билетов'
			}
		})
}

function saveHallPrices () {
	const priceStandart = hallPrices[0];
	const priceVip = hallPrices[1];
	const params = new FormData();
	params.set('priceStandart', priceStandart);
	params.set('priceVip', priceVip);
	// console.log(params)

	fetch(`https://shfe-diplom.neto-server.ru/price/${pricesActiveHall.id}`, {
			method: 'POST',
			body: params
		})
			.then( response => response.json())
		    .then( data => console.log( data ))
}

function priceInput () {
	inputPriceStandart.addEventListener('input', (e) => {
		if (!/\D/.test(inputPriceStandart.value)) {
			hallPrices[0] = inputPriceStandart.value
		}
	});

	inputPriceVip.addEventListener('input', (e) => {
		if (!/\D/.test(inputPriceVip.value)) {
			hallPrices[1] = inputPriceVip.value
		}
	});
}

function renderHallPrices () {
	inputPriceStandart.value = hallPrices[0];
	inputPriceVip.value = hallPrices[1];
	// console.log(pricesActiveHall)
}

function getHallPrices (hall) {
	fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
		.then((response) => response.json())
		.then((data) => {
			// console.log(data);
			const hallItems = data.result.halls;
			pricesActiveHall = hallItems.find(x => x.id === hall);
			hallPrices = [pricesActiveHall.hall_price_standart, pricesActiveHall.hall_price_vip];
			// console.log(hallPrices);
			renderHallPrices();
			priceInput();
		})
}

addHallPopupButton.addEventListener('click', (e) => {
	addHallPopup.classList.toggle('hidden');
});

submitHallButton.addEventListener('click', (e) => {
	e.preventDefault();

	hallsList.innerHTML = "";

	fetch( 'https://shfe-diplom.neto-server.ru/hall', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			hallName: hallName.value
		})
	})
	    .then( (response) => response.json())
	    .then( (data) => {
	    	hallName.value = '';
	    	addHallPopup.classList.toggle('hidden');
	    	renderHallsList();
	    });
})

const addFilmPopupButton = document.getElementById('add-movie-button');
const addFilmPopup = document.getElementById('add-movie');
const addFilmForm = document.getElementById('popup-movie-form');
const addSessionPopup = document.getElementById('add-session');
const addSessionForm = document.getElementById('popup-session-form');
const addSessionPopupButton = document.getElementById('create-session');



addFilmPopupButton.addEventListener('click', (e) => {
	addFilmPopup.classList.toggle('hidden');
})

const filmNameInput = document.getElementById('movie-title');
const filmLengthInput = document.getElementById('movie-length');
const filmDescInput = document.getElementById('movie-description');
const filmCountryInput = document.getElementById('movie-country');
const submitFilmButton = document.getElementById('create-film');
const uploadPosterButton = document.getElementById('upload-poster');
const filmsList = document.querySelector('.admin-sessions__movie-list');
const sessionsList = document.querySelector('.admin-sessions__halls-list');
const submitSessionButton = document.getElementById('create-session');
const hallSelect = document.getElementById('hall-select');
const filmSelect = document.getElementById('movie-select');
const timeInput = document.getElementById('time-select');




function renderFilmsList () {
	fetch('https://shfe-diplom.neto-server.ru/alldata')
		.then( (response) => response.json())
		.then( (data) => {
			filmsList.innerHTML = "";
			// console.log(data);
			let filmsInfo = data.result.films;
			filmsInfo.forEach((element) => {
				filmsList.insertAdjacentHTML('beforeend', 
					`<li class="admin-sessions__movie-list-item" id="film${element.id}" draggable="true">
						<img src="${element.film_poster}" alt="" class="admin-sessions__movie-image">
						<div class="admin-sessions__movie-info">
							<p class="admin-sessions__movie-title">${element.film_name}</p>
							<p class="admin-sessions__movie-length">${element.film_duration} минут</p>
						</div>
						<button class="admin-delete-button admin-delete-button_sessions"></button>
					</li>`
					)
				filmSelect.insertAdjacentHTML('beforeend', `<option value="${element.id}">${element.film_name}</option>`);
			});

			sessionsList.innerHTML = "";
			let hallsInfo = data.result.halls;
			hallsInfo.forEach((element) => {
				sessionsList.insertAdjacentHTML('beforeend', 
					`<li class="admin-sessions__halls-list-item" id="session-hall${element.id}">
						<h4 class="admin-sessions__halls-title">${element.hall_name}</h4>
						<div class="admin-sessions__halls-timeline">

						</div>
						<div class="admin-sessions__session-delete visually-hidden"></div>

					</li>`
					)
				hallSelect.insertAdjacentHTML('beforeend', `<option value="${element.id}">${element.hall_name}</option>`)
			});

			const deleteFilmButton = [...document.querySelectorAll('.admin-delete-button_sessions')];
			const filmCards = [...document.querySelectorAll('.admin-sessions__movie-list-item')];
			const hallTimelines = [...sessionsList.children];
			// console.log(hallTimelines);

			let dragged;

			filmCards.forEach((element, index) => {
				element.addEventListener('dragstart', (e) => {					
					dragged = element;

				})

			});
			hallTimelines.forEach((timelineElement, timelineIndex) => {
				timelineElement.addEventListener('dragover', (e) => {
					e.preventDefault();
				}, false)
				timelineElement.addEventListener('drop', (e) => {
					if (filmCards.includes(dragged)) {
						addSessionPopup.classList.toggle('hidden');

						for (let i, j = 0; i = hallSelect.options[j]; j++) {
							if (i.value == timelineElement.id.slice(12)) {
								hallSelect.selectedIndex = j;
								break;
							}
						};

						for (let i, j = 0; i = filmSelect.options[j]; j++) {
							if (i.value == dragged.id.slice(4)) {
								filmSelect.selectedIndex = j;
								break;
							}
						}

						dragged = null;
					}
				})
			})


			let seancesInfo = data.result.seances;
			seancesInfo.forEach((element, index) => {
				// console.log(element.seance_hallid)
				const seanceHall = hallTimelines.find((x) => x.id.slice(12) == element.seance_hallid);
				const seanceFilm = filmCards.find((x) => x.id.slice(4) == element.seance_filmid);
				const seanceTime = element.seance_time.replace(':', '');
				const seanceItem = document.createElement('div');
				seanceHall.children.item(1).appendChild(seanceItem);
				seanceItem.classList.add('admin-sessions__session');
				seanceItem.id = element.id
				seanceItem.setAttribute('data-time',seanceTime)
				seanceItem.insertAdjacentHTML('beforeend', 
					`<p class="admin-sessions__session-title">${filmsInfo.find((x) => x.id === element.seance_filmid).film_name}</p>
					<p class="admin-sessions__session-time">${element.seance_time}</p>`)
				seanceItem.setAttribute('draggable', 'true');

				const fullTimeline = Math.floor(sessionsList.getBoundingClientRect().width);
				// const startHour = +seanceTime.slice(-2);
				console.log(seanceTime)
				console.log(seanceTime.slice(0, -2));
				const seanceWidth = (fullTimeline * filmsInfo.find((x) => x.id === element.seance_filmid).film_duration) / 948;
				// console.log(seanceWidth);
				seanceItem.style.width = seanceWidth + 'px';
				seanceItem.style.left = ((+seanceTime.slice(0, -2) - 10) * (fullTimeline / 30)) + 'px';

				const bgColor = window.getComputedStyle(seanceFilm).backgroundColor;
				seanceItem.style.background = bgColor;
			})

			// function compare (a,b) {
			// 	a.dataset.seanceTime - 
			// }

			hallTimelines.forEach((element) => {
				const hallsTimeline = [...element.children.item(1).children];
				hallsTimeline.sort((a, b) => {
					return a.dataset.time - b.dataset.time
				})

				hallsTimeline.forEach((item) => {
					element.children.item(1).appendChild(item);
				})

			})

			const seanceBlock = [...document.querySelectorAll('.admin-sessions__session')];
			const deleteSeance = [...document.querySelectorAll('.admin-sessions__session-delete')];

			seanceBlock.forEach((element, index) => {
				const deleteButton = element.parentElement.nextElementSibling;
				element.addEventListener('dragstart', (e) => {
					deleteButton.classList.remove('visually-hidden');
					e.dataTransfer.setData("text/plain", e.target.id)
				})

				element.addEventListener('dragend', (e) => {
						e.preventDefault();
						deleteButton.classList.add('visually-hidden');
				})
			})

			deleteSeance.forEach((element, index) => {
				element.addEventListener('dragover', (e) => {
						e.preventDefault();
					})

				element.addEventListener('drop', (e) => {

					const data = e.dataTransfer.getData("text")

					fetch( `https://shfe-diplom.neto-server.ru/seance/${data}`, {
	    			method: 'DELETE',
					})
					    .then( response => response.json())
					    .then( data => {
					    	console.log( data );
					    	renderFilmsList();
						});
				})		
			})

			const fullTimeline = sessionsList.getAttribute('offsetWidth');

			deleteFilm(deleteFilmButton);
		})

};

function deleteFilm (buttonArray) {
	buttonArray.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const filmId = element.closest('.admin-sessions__movie-list-item').id.slice(4);

				// console.log(filmId);
				fetch( `https://shfe-diplom.neto-server.ru/film/${filmId}`, {
	    			method: 'DELETE',
				})
				    .then( response => response.json())
				    .then( data => {
				    	console.log( data );
				    	renderFilmsList();
					});
				})	
		})
}

submitFilmButton.addEventListener('click', (e) => {
	e.preventDefault();

	filmsList.innerHTML = "";

	const params = new FormData(addFilmForm);

	fetch( 'https://shfe-diplom.neto-server.ru/film', {
		method: 'POST',

		body: params
	})
	    .then( (response) => response.json())
	    .then( (data) => {
	    	console.log(data);

	    	filmNameInput.value = '';
			filmLengthInput.value = '';
			filmDescInput.value = '';
			filmCountryInput.value = '';
			uploadPosterButton.value = '';

	    	addFilmPopup.classList.toggle('hidden');
	    	renderFilmsList();
	    })

})

renderFilmsList();

submitSessionButton.addEventListener('click', (e) => {
	e.preventDefault();

	const params = new FormData(addSessionForm);

	fetch( 'https://shfe-diplom.neto-server.ru/seance', {
		method: 'POST',

		body: params
	})
	    .then( (response) => response.json())
	    .then( (data) => {
	    	console.log(params);
	    	console.log(data);
	    	timeInput.value = '10:00';
	    	addSessionPopup.classList.toggle('hidden');
	    	renderFilmsList();
	    })
})




// function renderSessionHalls () {
// 	fetch('https://shfe-diplom.neto-server.ru/alldata')
// 		.then( (response) => response.json())
// 		.then( (data) => {
			
// 		})
// }

// renderSessionHalls();













