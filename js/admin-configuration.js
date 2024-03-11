const inputRows = document.getElementById('rows');
const inputSeats = document.getElementById('columns');
const configConfirm = document.getElementById('create-config');
const configCancel = document.getElementById('cancel-config');

let hallConfig = [];
let configActiveHall;

function getHallSeats (hall) {
	configActiveHall = hallItems.find(x => x.id === hall);
	hallConfig = configActiveHall.hall_config;
	inputRows.value = hallConfig.length;
	inputSeats.value = hallConfig[0].length;
	renderHallSeats();
	hallInput();
}

function hallInput () {
	inputRows.addEventListener('input', (e) => {
		if (!/\D/.test(inputRows.value)) {
			if (inputSeats.value) {
				hallConfig = [];
				for (let i = 0; i < inputRows.value; i++) {
					hallConfig.push([]);
					for (let x = 0; x < inputSeats.value; x++) {
						hallConfig[i].push('standart');
					}
				}
				setTimeout(() => {
					renderHallSeats();
				}, 2000)
			}
		}
	});

	inputSeats.addEventListener('input', (e) => {
		if (!/\D/.test(inputSeats.value)) {
			if (inputRows.value) {
				hallConfig = []
				for (let i = 0; i < inputRows.value; i++) {
					hallConfig.push([]);
					for (let x = 0; x < inputSeats.value; x++) {
						hallConfig[i].push('standart');
					}
				}
				setTimeout(() => {
					renderHallSeats();
				}, 2000)
				
			}
		}
	});
}

function renderHallSeats () {
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

async function saveHallSeats () {
	const placeCount = hallConfig[0].length;
	const rowCount = hallConfig.length;
	const params = new FormData();
	params.set('rowCount', rowCount);
	params.set('placeCount', placeCount);
	params.set('config', JSON.stringify(hallConfig));

	data.saveConfig(params);

}

configConfirm.addEventListener('click', saveHallSeats);

