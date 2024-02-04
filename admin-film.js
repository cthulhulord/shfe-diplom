const addFilmPopupButton = document.getElementById('add-movie-button');
const addFilmPopup = document.getElementById('add-movie');
const addFilmForm = document.getElementById('popup-movie-form');
const filmNameInput = document.getElementById('movie-title');
const filmLengthInput = document.getElementById('movie-length');
const filmDescInput = document.getElementById('movie-description');
const filmCountryInput = document.getElementById('movie-country');
const submitFilmButton = document.getElementById('create-film');
const uploadPosterButton = document.getElementById('upload-poster');
const filmsList = document.querySelector('.admin-sessions__movie-list');

addFilmPopupButton.addEventListener('click', (e) => {
	addFilmPopup.classList.toggle('hidden');
})

submitFilmButton.addEventListener('click', (e) => {
	e.preventDefault();

	filmsList.innerHTML = "";

	const params = new FormData(addFilmForm);

	data.addFilm(params)

})

function renderFilmsList (filmItems) {

	filmsList.innerHTML = "";
	filmItems.forEach((element) => {
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

	const deleteFilmButton = [...document.querySelectorAll('.admin-delete-button_sessions')];
	const filmCards = [...document.querySelectorAll('.admin-sessions__movie-list-item')];

	filmCards.forEach((element, index) => {
		element.addEventListener('dragstart', (e) => {	
			console.log('dragstart')				
			dragged = element;
		})

		element.addEventListener('dragend', (e) => {
			dragged = null;
		})
	});

	renderSessionsList(hallItems, seanceItems);
	deleteFilm(deleteFilmButton);

};

function deleteFilm (buttonArray) {
	buttonArray.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const filmId = element.closest('.admin-sessions__movie-list-item').id.slice(4);

				data.deleteFilm(filmId);				
				})	
		})
}