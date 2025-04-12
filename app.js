// app.js
import { auth, signOut } from './firebase.js';

let userData = {};

function initializeApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        try {
            window.Telegram.WebApp.ready(() => {
                userData = window.Telegram.WebApp.initDataUnsafe.user || {};
                localStorage.setItem('userData', JSON.stringify(userData));
            });
        } catch (e) {
            console.error('Ошибка инициализации Telegram WebApp:', e);
        }
    }

    // Проверка авторизации
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'auth.html';
        }
    });
}

document.querySelectorAll('img').forEach(img => {
    img.ondragstart = (event) => event.preventDefault();
});

initializeApp();

const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.querySelector('.search-input');
const notFoundCard = document.getElementById('notFoundCard');

// Переключение вкладок
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('active')) return;

        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        item.classList.add('active');
        const tabId = item.id.replace('Tab', 'ContentTab');
        document.getElementById(tabId).classList.add('active');

        const mainContent = document.getElementById('mainContent');
        mainContent.classList.add('fade-out');
        setTimeout(() => {
            mainContent.classList.remove('fade-out');
        }, 300);

        if (item.id !== 'mainTab') {
            searchInput.value = '';
            notFoundCard.classList.remove('active');
        }
    });
});

// Логика поиска
searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() !== '') {
        notFoundCard.classList.add('active');
    } else {
        notFoundCard.classList.remove('active');
    }
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() === '') {
        notFoundCard.classList.remove('active');
    }
});

// Обработчик выхода
document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'auth.html';
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
});