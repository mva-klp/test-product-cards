const btns = document.querySelectorAll('.order-btn');
const closeBtn = document.querySelector('.modal-close-button');
const modal = document.querySelector('.modal');

const form = document.querySelector('form');
const inputs = document.querySelectorAll('.field-input');
const file = document.querySelector('.file-input');

for (let btn of btns) { 
	btn.addEventListener("click", () => {
		modal.classList.remove('modal-close');
		setCurrentDate();
	});
};

closeBtn.addEventListener("click", () => {
	modal.classList.add('modal-close');
	form.reset();
	formClean();
});


function formClean () {
	const elements = document.querySelectorAll('input');
	for(let elem of elements) {
		elem.nextElementSibling.textContent ='';
	}
}

//Валидация
function showError(input) {
	if(input.validity.valueMissing) {
		// Если поле пустое,
		// отображаем следующее сообщение об ошибке
		input.nextElementSibling.textContent = 'Поле не заполнено!';
	}else if (input.name === 'name'){
		if(input.validity.tooShort) {
			// Если содержимое слишком короткое,
			// отображаем следующее сообщение об ошибке
			input.nextElementSibling.textContent = `Имя должно быть более ${ input.minLength } знаков. Вы ввели ${ input.value.length }.`;
		}
	}else if (input.name === 'email'){
		if(input.validity.patternMismatch) {
			// Если поле содержит не email-адрес,
			// отображаем следующее сообщение об ошибке
			input.nextElementSibling.textContent = 'Поле должно содержать email адрес';
		}
	}else if (input.name === 'phone'){
		if(input.validity.patternMismatch) {
			// Если поле содержит не email-адрес,
			// отображаем следующее сообщение об ошибке
			input.nextElementSibling.textContent = 'Введите телефон в формате +71231234567';
		}
	}
}

//Устанавливаем патерн для проверки почты
document.querySelector('input[type="email"]').pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

//Устанавливаем в форме текущую дату по умолчанию и минимальную дату как текущую
function setCurrentDate () {
	const date = document.querySelector('input[type="date"]');
	date.valueAsDate = new Date();
	date.min = date.value;
}

//флаг проверки валидации формы
let isValid = false;

//проверяем все поля формы с вводом с классом field-input во время ввода на валидность
for(let input of inputs) {
	input.addEventListener('input', () => {
		if (input.validity.valid) {
			// Если на момент валидации какое-то сообщение об ошибке уже отображается,
			// если поле валидно, удаляем сообщение
			input.nextElementSibling.textContent = ''; // Сбросить содержимое сообщения
			isValid = true;
		} else {
			// Если поле не валидно, показываем правильную ошибку
			showError(input);
			isValid = false;
		}
	})
}
//проверка валидности прикрепления файлов. не более dataset.maxFiles
file.addEventListener('change', () => {
	if(file.value && file.files.length <=2 ){
		file.nextElementSibling.textContent = ''; // Сбросить содержимое сообщения
		isValid = true;
	} else {
		file.nextElementSibling.textContent = `Кол-во файлов должно быть не больше ${ file.dataset.maxFiles }. Вы выбрали ${ file.files.length }.`;
		isValid = false;
	}
});

function formValidate() {

	if (!file.value) {
		file.nextElementSibling.textContent = 'Вы не прикрепили ни одного файла'; // Сбросить содержимое сообщения
		isValid = false;
	}

	for(let input of inputs) {
		if(input.validity.valueMissing) {
			// Если поле пустое,
			// отображаем следующее сообщение об ошибке
			input.nextElementSibling.textContent = 'Поле не заполнено!';
			input.classList.add('invalid');
		} else {
			input.classList.remove('invalid');
		}
	}
};

function serializeForm(formNode) {
  return new FormData(formNode);
}

function onSuccess(formNode) {
  alert('Ваша заявка отправлена!');
	form.reset();
  formNode.classList.toggle('modal-close');
}

function onError(error) {
  alert(error.message);
}

async function sendData(data) {
  return await fetch('https://echo.htmlacademy.ru/', {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    body: data,
  });
}

async function handleFormSubmit(event){
	event.preventDefault();
	formValidate();
	if (isValid){
			console.log('форма валидна');
			const data = serializeForm(event.target);
			console.log(Array.from(data.entries()));
			onSuccess(modal);
			//const { status, error } = await sendData(data);
			// if (status === 200) {
			// 	onSuccess(event.target);
			// } else {
			// 	onError(error);
			// }
		}
	else {
		console.log('форма не валидна');
	}
}

form.addEventListener('submit', handleFormSubmit);