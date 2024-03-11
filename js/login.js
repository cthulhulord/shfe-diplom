const loginPopup = document.querySelector('.login')
const main = document.querySelector('.admin-index')
const loginForm = document.getElementById('login')
const login = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('signin');

loginButton.addEventListener('click', (e) => {
	e.preventDefault();

	fetch( 'https://shfe-diplom.neto-server.ru/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			login: login.value,
			password: password.value
		})
	})
    .then( (response) => response.json())
    .then( (data) => {
    	console.log( data );
    	if (data.success) {
    		window.open('admin.html', '_self');
    	}
    });
})	

