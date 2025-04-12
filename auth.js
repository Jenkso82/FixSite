// auth.js
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db } from './firebase.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

function resetFormInputs(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
        input.type = input.id.includes('password') ? 'password' : input.type;
    });
    // Сбрасываем ошибки
    form.querySelectorAll('.tooltip.error').forEach(error => {
        error.classList.remove('active');
        error.textContent = '';
    });
}

function toggleLogin() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    resetFormInputs(loginForm);
}

function toggleRegister() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    resetFormInputs(registerForm);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = input.nextElementSibling;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    eyeIcon.querySelector('.eye-open').style.display = isPassword ? 'none' : 'block';
    eyeIcon.querySelector('.eye-closed').style.display = isPassword ? 'block' : 'none';
}

function hideCookie() {
    const cookieCard = document.getElementById('cookie-card');
    cookieCard.style.opacity = '0';
    cookieCard.style.transform = 'translate(-50%, -60%)';
    setTimeout(() => {
        cookieCard.style.display = 'none';
    }, 300);
}

function toggleTheme() {
    const body = document.body;
    const themeSwitcher = document.getElementById('theme-switcher');
    if (body.classList.contains('dark-theme')) {
        body.style.animation = 'fadeInLight 0.5s ease-in-out forwards';
        body.classList.remove('dark-theme');
        themeSwitcher.textContent = 'Темная тема';
        setTimeout(() => body.style.animation = '', 500);
    } else {
        body.style.animation = 'fadeInDark 0.5s ease-in-out forwards';
        body.classList.add('dark-theme');
        themeSwitcher.textContent = 'Светлая тема';
        setTimeout(() => body.style.animation = '', 500);
    }
}

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('active');
}

function clearErrors(formId) {
    const form = document.getElementById(formId);
    form.querySelectorAll('.tooltip.error').forEach(error => {
        error.classList.remove('active');
        error.textContent = '';
    });
}

function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

function validateLoginForm(email, password) {
    let isValid = true;
    clearErrors('login-form');

    if (!email) {
        showError('login-email-error', 'Введите email');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('login-email-error', 'Используйте только @gmail.com адрес');
        isValid = false;
    }

    if (!password) {
        showError('login-password-error', 'Введите пароль');
        isValid = false;
    } else if (password.length < 6) {
        showError('login-password-error', 'Пароль должен быть не менее 6 символов');
        isValid = false;
    }

    return isValid;
}

function validateRegisterForm(username, email, password) {
    let isValid = true;
    clearErrors('register-form');

    if (!username) {
        showError('register-username-error', 'Введите логин');
        isValid = false;
    } else if (username.length < 3) {
        showError('register-username-error', 'Логин должен быть не менее 3 символов');
        isValid = false;
    }

    if (!email) {
        showError('register-email-error', 'Введите email');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('register-email-error', 'Используйте только @gmail.com адрес');
        isValid = false;
    }

    if (!password) {
        showError('register-password-error', 'Введите пароль');
        isValid = false;
    } else if (password.length < 6) {
        showError('register-password-error', 'Пароль должен быть не менее 6 символов');
        isValid = false;
    }

    return isValid;
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!validateRegisterForm(username, email, password)) {
        vibrate();
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Сохраняем данные пользователя в Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date()
        });

        alert('Регистрация успешна!');
        window.location.href = 'index.html'; // Переход на главную страницу
    } catch (error) {
        vibrate();
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError('register-email-error', 'Этот email уже зарегистрирован');
                break;
            case 'auth/invalid-email':
                showError('register-email-error', 'Некорректный email');
                break;
            default:
                showError('register-email-error', 'Ошибка регистрации: ' + error.message);
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!validateLoginForm(email, password)) {
        vibrate();
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Вход успешен!');
        window.location.href = 'index.html'; // Переход на главную страницу
    } catch (error) {
        vibrate();
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                showError('login-password-error', 'Неверный email или пароль');
                break;
            case 'auth/invalid-email':
                showError('login-email-error', 'Некорректный email');
                break;
            default:
                showError('login-email-error', 'Ошибка входа: ' + error.message);
        }
    }
}

window.onload = function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    resetFormInputs(loginForm);
    resetFormInputs(registerForm);

    document.querySelector('#to-register').addEventListener('click', (e) => {
        e.preventDefault();
        toggleRegister();
    });

    document.querySelector('#to-login').addEventListener('click', (e) => {
        e.preventDefault();
        toggleLogin();
    });

    document.querySelectorAll('.eye-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const inputId = icon.previousElementSibling.id;
            togglePassword(inputId);
        });
    });

    document.querySelector('.accept-button').addEventListener('click', hideCookie);

    document.getElementById('theme-switcher').addEventListener('click', toggleTheme);

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', vibrate);
    });

    // Обработчики форм
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
};