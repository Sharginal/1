// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Прелоадер
    setTimeout(function() {
        document.getElementById('preloader').style.display = 'none';
    }, 1000);

    // Анимации при прокрутке
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Проверяем при загрузке страницы
    checkIfInView();
    
    // Проверяем при прокрутке
    window.addEventListener('scroll', checkIfInView);
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            
            // Обновляем активный пункт меню
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Обновление активного пункта меню при прокрутке
    window.addEventListener('scroll', function() {
        let current = '';
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
           if (window.scrollY >= sectionTop - 200) {
    current = section.getAttribute('id');
}

        });
        
        document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    });
    
    // Переключатель темы
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon i');
    
    // Проверяем сохраненную тему
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // Обработка отправки формы
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо за ваше сообщение! Я свяжусь с вами в ближайшее время.');
            this.reset();
        });
    }
    
    // Улучшенная анимация глаз, следящих за курсором
    const irises = document.querySelectorAll('.iris');
    const head = document.querySelector('.head');
    let isInViewport = false;
    let idleTimer;
    let lastMouseMoveTime = Date.now();
    
    // Функция для проверки, находится ли элемент в видимой области
    function checkIfInViewport() {
        if (!head) return false;
        const rect = head.getBoundingClientRect();
        return (
            rect.top >= -rect.height &&
            rect.left >= -rect.width &&
            rect.bottom <= (window.innerHeight + rect.height) &&
            rect.right <= (window.innerWidth + rect.width)
        );
    }
    
    // Функция для случайного моргания
    function randomBlink() {
        if (!isInViewport) return;
        
        const eyelids = document.querySelectorAll('.eyelid');
        const randomEye = Math.floor(Math.random() * 2);
        
        // Добавляем класс для анимации моргания
        eyelids[randomEye * 2].style.animation = 'none';
        eyelids[randomEye * 2 + 1].style.animation = 'none';
        
        // Форсируем перерисовку
        void eyelids[randomEye * 2].offsetWidth;
        void eyelids[randomEye * 2 + 1].offsetWidth;
        
        // Запускаем анимацию
        eyelids[randomEye * 2].style.animation = 'blinkTop 0.2s forwards';
        eyelids[randomEye * 2 + 1].style.animation = 'blinkBottom 0.2s forwards';
        
        // Возвращаем исходную анимацию
        setTimeout(() => {
            eyelids[randomEye * 2].style.animation = 'blinkTop 5s infinite';
            eyelids[randomEye * 2 + 1].style.animation = 'blinkBottom 5s infinite';
        }, 200);
    }
    
    // Запускаем случайное моргание каждые 3-7 секунд
    setInterval(() => {
        if (Math.random() > 0.5) {
            randomBlink();
        }
    }, Math.random() * 4000 + 3000);
    
    // Отслеживание движения мыши для глаз
    document.addEventListener('mousemove', function(e) {
        if (!head || !isInViewport) return;
        
        lastMouseMoveTime = Date.now();
        clearInterval(idleTimer);
        
        const headRect = head.getBoundingClientRect();
        const headCenterX = headRect.left + headRect.width / 2;
        const headCenterY = headRect.top + headRect.height / 2;
        
        // Вычисляем расстояние от центра головы до курсора
        const deltaX = e.clientX - headCenterX;
        const deltaY = e.clientY - headCenterY;
        
        // Нормализуем расстояние для плавного движения глаз
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.min(window.innerWidth, window.innerHeight) / 3;
        const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
        
        // Вычисляем угол между центром головы и курсором
        const angle = Math.atan2(deltaY, deltaX);
        
        // Максимальное смещение зрачка (в пикселях)
        const maxEyeMove = 5;
        
        // Применяем смещение к зрачкам
        irises.forEach(iris => {
            const moveX = Math.cos(angle) * normalizedDistance * maxEyeMove;
            const moveY = Math.sin(angle) * normalizedDistance * maxEyeMove;
            
            iris.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Запускаем таймер для случайных движений при бездействии
        startIdleMovement();
    });
    
    // Функция для запуска случайных движений глаз при бездействии
    function startIdleMovement() {
        clearInterval(idleTimer);
        idleTimer = setInterval(() => {
            // Если прошло менее 3 секунд с последнего движения мыши, не делаем ничего
            if (Date.now() - lastMouseMoveTime < 3000) return;
            
            if (!isInViewport) return;
            
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = Math.random() * 0.7; // 0-70% от максимального движения
            
            const moveX = Math.cos(randomAngle) * randomDistance * 5;
            const moveY = Math.sin(randomAngle) * randomDistance * 5;
            
            irises.forEach(iris => {
                iris.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }, 2000);
    }
    
    // Проверяем видимость при прокрутке
    window.addEventListener('scroll', function() {
        isInViewport = checkIfInViewport();
    });
    
    // Начальная проверка видимости и запуск случайных движений
    isInViewport = checkIfInViewport();
    startIdleMovement();
});

try {
    // Код, который может вызвать ошибку
} catch (error) {
    console.error("Произошла ошибка:", error);
}


document.addEventListener('DOMContentLoaded', function() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const textArray = JSON.parse(element.dataset.text);
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentText = textArray[textIndex];
            
            if (isDeleting) {
                // Удаление текста
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Печать текста
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            // Если закончили печатать текст
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1000; // Пауза перед удалением
            } 
            // Если закончили удалять текст
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typingSpeed = 500; // Пауза перед печатью нового текста
            }
            
            setTimeout(type, typingSpeed);
        }
        
        type();
    });
});
