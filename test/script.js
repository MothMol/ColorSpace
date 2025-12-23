document.addEventListener('DOMContentLoaded', function () {
    document.body.style.zoom = "0.65";

    // ИНИЦИАЛИЗАЦИЯ ФОНОВОЙ МУЗЫКИ ДЛЯ СТРАНИЦЫ ТЕСТА
    window.backgroundMusic = {
        audio: null,
        currentTrack: null,
        tracks: [
            '../music/трек1.mp3',
            '../music/трек2.mp3',
            '../music/трек3.mp3',
            '../music/трек4.mp3',
            '../music/трек5.mp3'
        ],
        volume: 0.5,
        isPlaying: false,
        userInteracted: false,

        // Инициализация музыки
        init: function () {
            console.log('Инициализация фоновой музыки на странице теста...');

            // Восстанавливаем состояние из localStorage
            this.loadState();

            // Продолжаем музыку с главной страницы
            this.continueMusicFromMainPage();

            // Создаем плавающую кнопку
            this.createFloatingButton();
        },

        // Загрузка сохраненного состояния
        loadState: function () {
            try {
                const savedState = localStorage.getItem('backgroundMusicState');
                const isEnabled = localStorage.getItem('backgroundMusicEnabled') === 'true';

                if (savedState && isEnabled) {
                    const state = JSON.parse(savedState);
                    console.log('Загружено сохраненное состояние музыки:', state);

                    if (state.track && this.tracks.includes(state.track)) {
                        this.currentTrack = state.track;
                        this.volume = state.volume || 0.5;
                        this.userInteracted = true;
                    }
                }
            } catch (e) {
                console.error('Не удалось загрузить состояние музыки:', e);
            }
        },

        // Продолжение музыки с главной страницы
        continueMusicFromMainPage: function () {
            const savedState = localStorage.getItem('backgroundMusicState');
            if (savedState) {
                try {
                    const state = JSON.parse(savedState);
                    if (state.isPlaying && state.track) {
                        console.log('Продолжаем воспроизведение музыки с главной страницы');
                        this.playTrack(state.track, true); // Восстанавливаем время
                    }
                } catch (e) {
                    console.error('Ошибка при восстановлении музыки:', e);
                }
            }
        },

        // Создание плавающей кнопки
        createFloatingButton: function () {
            // Проверяем, не создана ли уже кнопка
            if (document.getElementById('floating-music-button')) return;

            const musicButton = document.createElement('button');
            musicButton.id = 'floating-music-button';

            // Используем изображение вместо текста
            const noteImg = document.createElement('img');
            noteImg.src = '../music/img/нота.png';
            noteImg.style.cssText = 'width: 24px; height: 24px;';
            noteImg.alt = 'Включить музыку';
            musicButton.appendChild(noteImg);

            musicButton.title = 'Включить фоновую музыку';
            musicButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: rgba(115, 99, 87, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            musicButton.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
            });

            musicButton.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            });

            musicButton.addEventListener('click', () => {
                if (!this.userInteracted) {
                    this.userInteracted = true;
                    this.startMusic();
                    // Меняем иконку на старт
                    const startImg = document.createElement('img');
                    startImg.src = '../music/img/старт.png';
                    startImg.style.cssText = 'width: 24px; height: 24px;';
                    startImg.alt = 'Пауза';
                    musicButton.innerHTML = '';
                    musicButton.appendChild(startImg);
                    musicButton.title = 'Пауза';
                } else {
                    this.togglePlayback();
                    // Меняем иконку в зависимости от состояния
                    const imgSrc = this.audio.paused ? '../music/img/старт.png' : '../music/img/пауза.png';
                    const imgAlt = this.audio.paused ? 'Воспроизвести' : 'Пауза';
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.style.cssText = 'width: 24px; height: 24px;';
                    img.alt = imgAlt;
                    musicButton.innerHTML = '';
                    musicButton.appendChild(img);
                    musicButton.title = imgAlt;
                }

                // Анимация нажатия
                musicButton.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    musicButton.style.transform = 'scale(1)';
                }, 200);
            });

            document.body.appendChild(musicButton);

            // Обновляем иконку при загрузке, если музыка уже играет
            setTimeout(() => {
                if (this.audio && !this.audio.paused) {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = '../music/img/пауза.png';
                    pauseImg.style.cssText = 'width: 24px; height: 24px;';
                    pauseImg.alt = 'Пауза';
                    musicButton.innerHTML = '';
                    musicButton.appendChild(pauseImg);
                    musicButton.title = 'Пауза';
                }
            }, 500);
        },

        // Начало воспроизведения музыки
        startMusic: function () {
            console.log('Запуск музыки на странице теста...');

            // Проверяем сохраненное состояние
            const savedTrack = this.getSavedTrack();

            if (savedTrack && this.tracks.includes(savedTrack)) {
                this.playTrack(savedTrack, true);
            } else {
                this.playRandomTrack();
            }

            // Обновляем иконку плавающей кнопки
            const musicButton = document.getElementById('floating-music-button');
            if (musicButton) {
                const startImg = document.createElement('img');
                startImg.src = '../music/img/старт.png';
                startImg.style.cssText = 'width: 24px; height: 24px;';
                startImg.alt = 'Пауза';
                musicButton.innerHTML = '';
                musicButton.appendChild(startImg);
                musicButton.title = 'Пауза';
            }
        },

        // Получение сохраненного трека
        getSavedTrack: function () {
            try {
                const savedState = localStorage.getItem('backgroundMusicState');
                if (savedState) {
                    const state = JSON.parse(savedState);
                    return state.track;
                }
            } catch (e) {
                console.error('Ошибка при чтении сохраненного трека:', e);
            }
            return null;
        },

        // Получение сохраненного времени
        getSavedTime: function () {
            try {
                const savedState = localStorage.getItem('backgroundMusicState');
                if (savedState) {
                    const state = JSON.parse(savedState);
                    return state.time || 0;
                }
            } catch (e) {
                console.error('Ошибка при чтении сохраненного времени:', e);
            }
            return 0;
        },

        // Сохранение состояния
        saveState: function () {
            if (!this.audio || !this.currentTrack) return;

            const state = {
                track: this.currentTrack,
                time: this.audio.currentTime,
                volume: this.audio.volume,
                isPlaying: !this.audio.paused
            };

            try {
                localStorage.setItem('backgroundMusicState', JSON.stringify(state));
                localStorage.setItem('backgroundMusicEnabled', 'true');
                console.log('Состояние музыки сохранено');
            } catch (e) {
                console.error('Не удалось сохранить состояние музыки:', e);
            }
        },

        // Воспроизведение случайного трека
        playRandomTrack: function () {
            console.log('Воспроизведение случайного трека...');

            let availableTracks = [...this.tracks];
            if (this.currentTrack) {
                availableTracks = availableTracks.filter(track => track !== this.currentTrack);
            }

            if (availableTracks.length === 0) availableTracks = this.tracks;

            const randomIndex = Math.floor(Math.random() * availableTracks.length);
            const track = availableTracks[randomIndex];

            this.playTrack(track);
        },

        // Воспроизведение трека
        playTrack: function (trackPath, restoreTime = false) {
            console.log(`Загрузка трека: ${trackPath}`);

            // Останавливаем текущее воспроизведение
            if (this.audio) {
                this.audio.pause();
                this.audio = null;
            }

            // Создаем новый аудиоэлемент
            this.audio = new Audio(trackPath);
            this.audio.volume = this.volume;
            this.audio.loop = false;
            this.currentTrack = trackPath;

            // Восстанавливаем время, если нужно
            if (restoreTime) {
                const savedTime = this.getSavedTime();
                if (savedTime > 0) {
                    this.audio.currentTime = savedTime;
                    console.log(`Восстановлено время: ${savedTime} сек.`);
                }
            }

            // Обработчики событий
            this.audio.addEventListener('play', () => {
                console.log(`Начало воспроизведения: ${trackPath}`);
                this.isPlaying = true;
                this.saveState();

                // Обновляем иконку плавающей кнопки
                const musicButton = document.getElementById('floating-music-button');
                if (musicButton) {
                    const startImg = document.createElement('img');
                    startImg.src = '../music/img/старт.png';
                    startImg.style.cssText = 'width: 24px; height: 24px;';
                    startImg.alt = 'Пауза';
                    musicButton.innerHTML = '';
                    musicButton.appendChild(startImg);
                    musicButton.title = 'Пауза';
                }
            });

            this.audio.addEventListener('pause', () => {
                console.log('Пауза');
                this.isPlaying = false;
                this.saveState();

                // Обновляем иконку плавающей кнопки
                const musicButton = document.getElementById('floating-music-button');
                if (musicButton) {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = '../music/img/пауза.png';
                    pauseImg.style.cssText = 'width: 24px; height: 24px;';
                    pauseImg.alt = 'Воспроизвести';
                    musicButton.innerHTML = '';
                    musicButton.appendChild(pauseImg);
                    musicButton.title = 'Воспроизвести';
                }
            });

            this.audio.addEventListener('ended', () => {
                console.log('Трек закончился, переключаем...');
                this.playNextTrack();
            });

            this.audio.addEventListener('error', (e) => {
                console.error(`Ошибка загрузки трека ${trackPath}:`, e);
                console.log('Пробуем следующий трек...');
                this.playNextTrack();
            });

            // Пытаемся воспроизвести
            this.playAudio();
        },

        // Попытка воспроизведения
        playAudio: function () {
            if (!this.audio) return;

            const playPromise = this.audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Музыка успешно запущена');
                    })
                    .catch(error => {
                        console.warn('Ошибка воспроизведения:', error.name);

                        if (error.name === 'NotAllowedError') {
                            console.log('Ждем взаимодействия пользователя...');
                        }
                    });
            }
        },

        // Следующий трек
        playNextTrack: function () {
            if (!this.currentTrack) {
                this.playRandomTrack();
                return;
            }

            const currentIndex = this.tracks.indexOf(this.currentTrack);
            let nextIndex = currentIndex + 1;
            if (nextIndex >= this.tracks.length) nextIndex = 0;

            this.playTrack(this.tracks[nextIndex]);
        },

        // Переключение воспроизведения/паузы
        togglePlayback: function () {
            if (!this.audio) {
                this.startMusic();
                return;
            }

            if (this.audio.paused) {
                this.audio.play()
                    .then(() => {
                        console.log('Воспроизведение возобновлено');
                    })
                    .catch(error => {
                        console.error('Ошибка возобновления:', error);
                    });
            } else {
                this.audio.pause();
                console.log('Пауза');
            }

            this.saveState();
        }
    };

    // Добавляем CSS для анимации пульсации
    const musicStyles = document.createElement('style');
    musicStyles.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        #floating-music-button:hover {
            animation: pulse 1s infinite !important;
        }
    `;
    document.head.appendChild(musicStyles);

    // Инициализируем музыку после загрузки страницы
    setTimeout(() => {
        window.backgroundMusic.init();
    }, 500);

    // Данные теста
    const questions = [
        {
            text: "КАК ВЫ ПРИНИМАЕТЕ РЕШЕНИЯ?",
            options: [
                "Быстро и напористо",
                "Через интерес и азарт",
                "Опираясь на оптимизм и ясность",
                "Холодно и стратегически",
                "Спокойно и с заботой о себе и других",
                "Интуитивно и мягко",
                "Рассудительно и логично",
                "Глубоко анализируя",
                "Под влиянием вдохновения",
                "Учитывая чувства и комфорт",
                "Через опыт и привычку",
                "Нейтрально, объективно"
            ]
        },
        {
            text: "В ДРУЖБЕ ДЛЯ ВАС ВАЖНЕЕ ВСЕГО…",
            options: [
                "Прямота и сила связи",
                "Совместные приключения",
                "Радость и смех",
                "Надёжность и серьёзность",
                "Забота и поддержка",
                "Гармония",
                "Спокойствие и ясность",
                "Глубина и мудрость",
                "Эмоциональная близость",
                "Тёплое отношение",
                "Верность и стабильность",
                "Уважение границ и баланс"
            ]
        },
        {
            text: "КАКОЕ ВРЕМЯ СУТОК ВАМ БЛИЖЕ?",
            options: [
                "Раннее энергичное утро",
                "Яркое активное утро",
                "Солнечный полдень",
                "Поздняя глубокая ночь",
                "Спокойный дневной свет",
                "Мягкий морской полдень",
                "Голубые сумерки",
                "Тёмный насыщенный вечер",
                "Творческая ночь",
                "Уютный рассвет",
                "Тёплый осенний полдень",
                "Пасмурное спокойное утро"
            ]
        },
        {
            text: "КАКАЯ ПОГОДА ВАС ОТРАЖАЕТ?",
            options: [
                "Жаркое солнце",
                "Тёплый ветер",
                "Светлый солнечный день",
                "Густая ночь или темнота",
                "Тёплый дождь",
                "Морской бриз",
                "Чистое голубое небо",
                "Гроза",
                "Туман или дымка",
                "Мягкая облачность",
                "Прохладная стабильная погода",
                "Серность без дождя"
            ]
        },
        {
            text: "ЧТО ВЫ ДЕЛАЕТЕ, КОГДА УСТАЕТЕ?",
            options: [
                "Начинаю активно двигаться",
                "Ищу новые впечатления",
                "Смотрю что-то весёлое",
                "Ухожу в уединение",
                "Провожу время с природой или близкими",
                "Включаю музыку или воду",
                "Ухожу в тишину",
                "Прописываю планы",
                "Творю",
                "Окутываюсь уютом",
                "Перехожу на привычные дела",
                "Становлюсь максимально спокойным и нейтральным"
            ]
        },
        {
            text: "КАКАЯ СУПЕРСИЛА ВАМ ПОДХОДИТ?",
            options: [
                "Поток огненной энергии",
                "Сила перемен и вдохновения",
                "Яркость и излучение света",
                "Управление тенью",
                "Энергия исцеления",
                "Контроль воды",
                "Управление воздухом",
                "Видение будущего",
                "Иллюзии и фантазия",
                "Сила тепла и эмоций",
                "Непробиваемая устойчивость",
                "Полный самоконтроль и фокус"
            ]
        },
        {
            text: "КАК ВЫ ВЕДЕТЕ СЕБЯ В КОНФЛИКТЕ?",
            options: [
                "Говорю прямо и сильно",
                "Быстро вспыхиваю",
                "Стараюсь видеть хорошее",
                "Включаю холодную логику",
                "Примиряю",
                "Сглаживаю мягкими эмоциями",
                "Действую рассудительно",
                "Анализирую причины конфликта",
                "Превращаю спор в обсуждение",
                "Стараюсь сохранить гармонию",
                "Ухожу в молчание",
                "Сохраняю нейтралитет"
            ]
        },
        {
            text: "КАК ВЫ УЧИТЕСЬ НОВОМУ?",
            options: [
                "Погружаюсь с энтузиазмом",
                "Ищу интересные подходы",
                "С позитивным настроем",
                "Системно и последовательно",
                "С заботой о процессе",
                "Интуитивно и плавно",
                "Логически структурируя",
                "Глубоко исследую тему",
                "Через вдохновение и творчество",
                "С комфортом и поддержкой",
                "Методично и стабильно",
                "Объективно и беспристрастно"
            ]
        },
        {
            text: "ВАША ГЛАВНАЯ ЖИЗНЕННАЯ ЦЕЛЬ?",
            options: [
                "Достижение и влияние",
                "Свобода и приключения",
                "Счастье и радость",
                "Власть и контроль",
                "Гармония и помощь другим",
                "Душевное равновесие",
                "Знание и понимание",
                "Мудрость и проницательность",
                "Творчество и самовыражение",
                "Любовь и близость",
                "Стабильность и безопасность",
                "Баланс и объективность"
            ]
        },
        {
            text: "КАК ВЫ ОТДЫХАЕТЕ?",
            options: [
                "Активный спорт или движение",
                "Путешествия и новые места",
                "Весёлые мероприятия",
                "В одиночестве с книгой или фильмом",
                "На природе или с близкими",
                "У воды или с музыкой",
                "В тишине и спокойствии",
                "За интеллектуальными занятиями",
                "За творческими проектами",
                "В уютной домашней атмосфере",
                "За привычными хобби",
                "В состоянии полного покоя"
            ]
        },
        {
            text: "ЧТО ДЛЯ ВАС УСПЕХ?",
            options: [
                "Лидерство и признание",
                "Свобода самовыражения",
                "Радость и удовлетворение",
                "Контроль и влияние",
                "Гармония в отношениях",
                "Душевный комфорт",
                "Ясность и понимание",
                "Глубокие знания",
                "Творческая реализация",
                "Эмоциональное благополучие",
                "Стабильность и надёжность",
                "Объективная оценка достижений"
            ]
        },
        {
            text: "КАК ВЫ ПРОЯВЛЯЕТЕ ЗАБОТУ?",
            options: [
                "Защитой и действием",
                "Вдохновением и поддержкой",
                "Позитивом и вниманием",
                "Прагматичной помощью",
                "Эмпатией и пониманием",
                "Мягкостью и тактичностью",
                "Рациональным советом",
                "Мудрым наставничеством",
                "Творческим подходом",
                "Теплом и нежностью",
                "Надёжностью и постоянством",
                "Сбалансированной поддержкой"
            ]
        }
    ];

    // Функция для прокрутки наверх
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Переменные для управления тестом
    let currentQuestion = 0;
    let answers = [];
    let questionsContainer, backBtn, nextBtn, resultDiv, restartBtn, questionCounter;

    function initializeTest() {
        questionsContainer = document.getElementById('questions-container');
        backBtn = document.getElementById('back-btn');
        nextBtn = document.getElementById('next-btn');
        resultDiv = document.getElementById('result');
        restartBtn = document.getElementById('restart-btn');
        questionCounter = document.querySelector('.question-counter .number');

        // Создаем вопросы
        createQuestions();

        // Показываем первый вопрос
        showQuestion(currentQuestion);

        // Назначаем обработчики событий
        backBtn.addEventListener('click', goToPreviousQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);
        if (restartBtn) {
            restartBtn.addEventListener('click', restartTest);
        }
    }

    function createQuestions() {
        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = `question ${index === 0 ? 'active' : ''}`;
            questionElement.innerHTML = `
                <h2 class="question-title">${question.text}</h2>
                <div class="options">
                    ${question.options.map((option, optionIndex) => `
                        <label class="option">
                            <input type="radio" name="question-${index}" value="${optionIndex}">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            questionsContainer.appendChild(questionElement);
        });
    }

    function showQuestion(index) {
        // Скрываем все вопросы
        document.querySelectorAll('.question').forEach((question, i) => {
            question.classList.remove('active', 'exit');
            if (i === index) {
                setTimeout(() => question.classList.add('active'), 50);
            }
        });

        // Обновляем счетчик вопросов
        questionCounter.textContent = index + 1;

        // Обновляем состояние кнопок
        backBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.textContent = index === questions.length - 1 ? 'Узнать результат' : 'Далее';

        // Восстанавливаем выбранный ответ, если он есть
        if (answers[index] !== undefined) {
            const radio = document.querySelector(`input[name="question-${index}"][value="${answers[index]}"]`);
            if (radio) radio.checked = true;
        }
    }

    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            document.querySelectorAll('.question')[currentQuestion].classList.add('exit');
            setTimeout(() => {
                currentQuestion--;
                showQuestion(currentQuestion);
            }, 300);
        }
        scrollToTop();
    }

    function goToNextQuestion() {
        const selectedOption = document.querySelector(`input[name="question-${currentQuestion}"]:checked`);

        if (!selectedOption) {
            alert('Пожалуйста, выберите ответ');
            return;
        }

        // Сохраняем ответ
        answers[currentQuestion] = parseInt(selectedOption.value);

        if (currentQuestion < questions.length - 1) {
            document.querySelectorAll('.question')[currentQuestion].classList.add('exit');
            setTimeout(() => {
                currentQuestion++;
                showQuestion(currentQuestion);
            }, 300);
        } else {
            showResults();
        }
        scrollToTop();
    }

    function showResults() {
        // Подсчитываем результаты
        const colorCounts = new Array(12).fill(0);
        answers.forEach(answer => {
            if (answer !== undefined) {
                colorCounts[answer]++;
            }
        });

        // Находим цвет с максимальным количеством ответов
        let maxCount = 0;
        let resultColorIndex = 0;

        colorCounts.forEach((count, index) => {
            if (count > maxCount) {
                maxCount = count;
                resultColorIndex = index;
            }
        });

        saveResultAndRedirect(resultColorIndex);
    }

    function saveResultAndRedirect(colorIndex) {
        // Сохраняем результат в localStorage
        localStorage.setItem('testResult', colorIndex);

        // Сохраняем состояние музыки перед переходом
        if (window.backgroundMusic && window.backgroundMusic.audio) {
            window.backgroundMusic.saveState();
        }

        // Перенаправляем на страницу результатов
        window.location.href = 'result/index.html';

        // Прокрутка наверх
        scrollToTop();
    }

    // Функция для прокрутки к следующему результату
    function scrollToNextResult(nextSection) {
        const currentSection = document.querySelector('.ksa:hover');
        let nextElement;

        if (nextSection === 'influence') {
            nextElement = document.querySelectorAll('.ksa')[1]; // Второй блок
        } else if (nextSection === 'music') {
            nextElement = document.querySelectorAll('.ksa')[2]; // Третий блок
        }

        if (nextElement) {
            nextElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function restartTest() {
        // Сбрасываем переменные
        currentQuestion = 0;
        answers = [];

        // Скрываем результат и показываем вопросы
        resultDiv.classList.remove('show');
        setTimeout(() => {
            resultDiv.style.display = 'none';
            questionsContainer.style.display = 'block';
            backBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            nextBtn.textContent = 'Далее';

            // Сбрасываем все выбранные ответы
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });

            // Показываем первый вопрос
            showQuestion(currentQuestion);
        }, 500);
        scrollToTop();
    }

    // Функция для анимаций кнопок и навигации теста
    function initTestAnimations() {
        // Добавляем CSS transitions
        const style = document.createElement('style');
        style.textContent = `
            .btn-next, .btn-back, .restart-btn, .link-text {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }
            
            .results-option {
                transition: background-color 0.2s ease;
            }
            
            .results-option:hover {
                background-color: #f5f5f5;
            }
        `;
        document.head.appendChild(style);

        // Навигационные ссылки
        const navLinks = document.querySelectorAll('.link-text');
        navLinks.forEach(link => {
            const originalColor = link.style.color || '#42383C';
            const originalTransform = link.style.transform || 'translateY(0)';

            link.addEventListener('mouseenter', function () {
                this.style.color = '#736357';
                this.style.transform = 'translateY(-3px)';
            });

            link.addEventListener('mouseleave', function () {
                this.style.color = originalColor;
                this.style.transform = originalTransform;
            });
        });

        // Кнопки теста
        const testButtons = document.querySelectorAll('.btn-next, .btn-back, .restart-btn');
        testButtons.forEach(button => {
            const originalBgColor = getComputedStyle(button).backgroundColor;
            const originalTransform = button.style.transform || 'translateY(0)';
            const originalColor = getComputedStyle(button).color;

            button.addEventListener('mouseenter', function () {
                if (this.classList.contains('restart-btn')) {
                    this.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                } else {
                    this.style.backgroundColor = '#6e6557';
                }
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 20px rgba(115, 99, 87, 0.3)';
            });

            button.addEventListener('mouseleave', function () {
                this.style.backgroundColor = originalBgColor;
                this.style.transform = originalTransform;
                this.style.boxShadow = 'none';
            });
        });
    }

    // Инициализация всех компонентов теста
    initializeTest();
    initTestAnimations();
});