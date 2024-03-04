const addSessionPopup = document.getElementById('add-session');
const addSessionForm = document.getElementById('popup-session-form');
const addSessionPopupButton = document.getElementById('create-session');
const sessionsList = document.querySelector('.admin-sessions__halls-list');
const submitSessionButton = document.getElementById('create-session');
const hallSelect = document.getElementById('hall-select');
const filmSelect = document.getElementById('movie-select');
const timeInput = document.getElementById('time-select');

submitSessionButton.addEventListener('click', (e) => {
	e.preventDefault();

	const params = new FormData(addSessionForm);

	data.addSession(params);
})

function renderSessionsList (halls, seances) {
	sessionsList.innerHTML = "";
	halls.forEach((element) => {
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

	const hallTimelines = [...sessionsList.children];
	const filmCards = [...document.querySelectorAll('.admin-sessions__movie-list-item')];

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

	seances.forEach((element, index) => {
		const seanceHall = hallTimelines.find((x) => x.id.slice(12) == element.seance_hallid);
		if (seanceHall) {
			const seanceFilm = filmCards.find((x) => x.id.slice(4) == element.seance_filmid);

			if (seanceFilm) {
				const seanceTime = element.seance_time.replace(':', '');
				const seanceItem = document.createElement('div');
				seanceHall.children.item(1).appendChild(seanceItem);
				seanceItem.classList.add('admin-sessions__session-wrapper');
				seanceItem.id = element.id
				seanceItem.setAttribute('data-time',seanceTime)
				seanceItem.insertAdjacentHTML('beforeend', 
					`<div class="admin-sessions__session">
						<p class="admin-sessions__session-title">${filmItems.find((x) => x.id === element.seance_filmid).film_name}</p>
					</div>
					<p class="admin-sessions__session-time">${element.seance_time}</p>`)
				seanceItem.setAttribute('draggable', 'true');

				const fullTimeline = 100;
				const workDuration = 1440;
				const seanceWidth = (filmItems.find((x) => x.id === element.seance_filmid).film_duration) * (fullTimeline / workDuration);
				let seanceHour;
				if (seanceTime.slice(0, -3) == 0) {
					seanceHour = +seanceTime.slice(1, -2)
				} else {
					seanceHour = +seanceTime.slice(0, -2);
				}

				const seanceStart = +(seanceHour + (seanceTime.slice(2) / 60)) * 60;

				seanceItem.style.width = seanceWidth + '%';
				seanceItem.style.left = seanceStart * (fullTimeline / workDuration) + '%';

				const bgColor = window.getComputedStyle(seanceFilm).backgroundColor;
				seanceItem.style.background = bgColor;
			}

		}
	})

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
			e.dataTransfer.setData("text/plain", e.target.id);
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

			const transferData = e.dataTransfer.getData("text");

			data.deleteSession(transferData);
		})		
	})
}