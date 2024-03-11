const addHallPopupButton = document.getElementById('add-hall-button');
const addHallPopup = document.getElementById('add-hall');
const addHallForm = document.getElementById('popup-hall-form');
const hallName = document.getElementById('hall-name');
const submitHallButton = document.getElementById('create-hall');
const hallsListWrapper = document.querySelector('.admin-halls__wrapper');
const hallsList = document.createElement('ul');

hallsListWrapper.insertBefore(hallsList, addHallPopupButton);
hallsList.classList.add('admin-halls__list');

function renderHallsList (hallsInfo) {
	hallsList.innerHTML = "";
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
	renderHallSwitch (document.querySelector('.hall-switch__buttons_configuration'), hallsInfo);
	renderHallSwitch (document.querySelector('.hall-switch__buttons_launch'), hallsInfo);
	renderHallSwitch (document.querySelector('.hall-switch__buttons_prices'), hallsInfo);
	// renderFilmsList();	
};

function deleteHall (buttonArray) {
		buttonArray.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const hallId = element.closest('.admin-halls__list-item').id.slice(4);

				data.deleteHall(hallId);
			});
		})
};

function renderHallSwitch (hallSwitchContainer, hallsInfo) {
	hallSwitchContainer.innerHTML = '';
	hallsInfo.forEach((element) => {
		hallSwitchContainer.insertAdjacentHTML('beforeend', `<button class="hall-switch__button">${element.hall_name}</button>`
			)
	});
	const hallItemsRendered = [...hallSwitchContainer.children];

	hallItemsRendered[0].classList.add('hall-switch__button_active');

	let activeHallIndex = 0;
	let activeHallName = hallItemsRendered[0].textContent;
	let activeHallId = hallsInfo[0].id;
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
				activeHallId = hallsInfo.find(x => x.hall_name === activeHallName).id;
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
};

addHallPopupButton.addEventListener('click', (e) => {
	addHallPopup.classList.remove('hidden');
});

submitHallButton.addEventListener('click', (e) => {
	e.preventDefault();

	hallsList.innerHTML = "";

	data.addHall();
});