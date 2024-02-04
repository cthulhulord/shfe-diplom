const pricesConfirm = document.getElementById('create-prices');
const pricesCancel = document.getElementById('cancel-prices');
const inputPriceStandart = document.getElementById('price-regular');
const inputPriceVip = document.getElementById('price-vip');

let hallPrices = [];
let pricesActiveHall;

function getHallPrices (hall) {
	pricesActiveHall = hallItems.find(x => x.id === hall);
	hallPrices = [pricesActiveHall.hall_price_standart, pricesActiveHall.hall_price_vip];
	renderHallPrices();
	priceInput();
}

function renderHallPrices () {
	inputPriceStandart.value = hallPrices[0];
	inputPriceVip.value = hallPrices[1];
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

function saveHallPrices () {
	const priceStandart = hallPrices[0];
	const priceVip = hallPrices[1];
	const params = new FormData();
	params.set('priceStandart', priceStandart);
	params.set('priceVip', priceVip);
	data.savePrices(params);
}

pricesConfirm.addEventListener('click', saveHallPrices);