const hallConfig = document.querySelector('.client__hall');
const hallSeanceInfo = document.querySelector('.session__info');
const hallGrid = document.querySelector('.hall__grid');
const hallGridLegendStandart = document.getElementById('legend-standart');
const hallGridLegendVip = document.getElementById('legend-vip');
const bookingButton = document.querySelector('.booking__button');

const seanceId = window.localStorage.getItem('seanceId');
const seanceHallId = window.localStorage.getItem('seanceHallId');
const seanceTime = window.localStorage.getItem('seanceTime');
const filmTitle = window.localStorage.getItem('filmTitle');


console.log(currentSeance);
console.log(currentFilm);
console.log(curHall);

async function renderSeanceConfig () {
	await data.getData();
	await data.getSeanceConfig(seanceId);

	hallGrid.innerHTML = "";

	const hallsInfo = data.info.halls;
	const currentHall = hallsInfo.find((e) => e.id === seanceHallId);
	const hallTitle = currentHall.hall_name;
	const hallConfig = data.hallConfig;
	let chosenSeats = [];

	hallSeanceInfo.insertAdjacentHTML('beforeend', `
		<p class="session__title">${filmTitle}</p>
		<p class="session__time">Начало сеанса: ${seanceTime}</p>
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
			window.localStorage.setItem('chosenSeats', JSON.stringify(chosenSeats));
			window.localStorage.setItem('hallTitle', hallTitle);
			window.open('payment.html', '_self');
		} else {
			alert('Выберите места');
		}
	})
};

renderSeanceConfig();