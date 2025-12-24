// Прокрутка наверх при загрузке страницы
window.scrollTo(0, 0);

// Масштабирование страницы
document.addEventListener('DOMContentLoaded', function () {
    document.body.style.zoom = "0.85";
});

// Основная функция
document.addEventListener('DOMContentLoaded', function () {

    // ФОНОВАЯ МУЗЫКА 
    window.backgroundMusic = {
        audio: null,
        currentTrack: null,
        tracks: [
            'music/трек1.mp3',
            'music/трек2.mp3',
            'music/трек3.mp3',
            'music/трек4.mp3',
            'music/трек5.mp3'
        ],
        volume: 0.5,
        isPlaying: false,
        userInteracted: false,

        // Инициализация музыки
        init: function () {
            console.log('Инициализация фоновой музыки...');
            this.loadState();
            this.createStartButton();
            this.setupInteractionListeners();
            window.addEventListener('beforeunload', () => this.saveState());
        },

        // Создание кнопки запуска музыки
        createStartButton: function () {
            const existingMusicButton = document.getElementById('music-button');
            if (existingMusicButton) {
                existingMusicButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!this.userInteracted) {
                        this.userInteracted = true;
                        this.startMusic();
                    } else {
                        this.togglePlayback();
                    }

                    existingMusicButton.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        existingMusicButton.style.transform = 'scale(1)';
                    }, 200);
                });

                existingMusicButton.title = 'Кликните, чтобы включить фоновую музыку';
            } else {
                this.createFloatingButton();
            }
        },

        // Создание плавающей кнопки
        createFloatingButton: function () {
            const musicButton = document.createElement('button');
            musicButton.id = 'floating-music-button';

            const noteImg = document.createElement('img');
            noteImg.src = 'music/img/нота.png';
            noteImg.style.cssText = 'width: 24px; height: 24px;';
            noteImg.alt = 'Включить музыку';
            noteImg.margin ='auto';
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
                    const startImg = document.createElement('img');
                    startImg.src = 'music/img/старт.png';
                    startImg.style.cssText = 'width: 24px; height: 24px;';
                    startImg.alt = 'Пауза';
                    startImg.margin = 'auto';
                    musicButton.innerHTML = '';
                    musicButton.appendChild(startImg);
                    musicButton.title = 'Пауза';
                } else {
                    this.togglePlayback();
                    const imgSrc = this.audio.paused ? 'music/img/старт.png' : 'music/img/пауза.png';
                    const imgAlt = this.audio.paused ? 'Воспроизвести' : 'Пауза';
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.style.cssText = 'width: 24px; height: 24px;';
                    img.alt = imgAlt;
                    musicButton.innerHTML = '';
                    musicButton.appendChild(img);
                    musicButton.title = imgAlt;
                }

                musicButton.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    musicButton.style.transform = 'scale(1)';
                }, 200);
            });

            document.body.appendChild(musicButton);

            setTimeout(() => {
                if (this.audio && !this.audio.paused) {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = 'music/img/пауза.png';
                    pauseImg.style.cssText = 'width: 24px; height: 24px;';
                    pauseImg.alt = 'Пауза';
                    musicButton.innerHTML = '';
                    musicButton.appendChild(pauseImg);
                    musicButton.title = 'Пауза';
                }
            }, 100);
        },

        // Настройка обработчиков взаимодействия
        setupInteractionListeners: function () {
            const interactionEvents = ['click', 'keydown', 'mousedown', 'touchstart'];

            interactionEvents.forEach(eventType => {
                document.addEventListener(eventType, () => {
                    if (!this.userInteracted) {
                        this.userInteracted = true;
                        console.log('Пользователь взаимодействовал с документом');
                    }
                }, { once: true });
            });

            document.addEventListener('click', (e) => {
                if (e.target.closest('.colorButton')) {
                    if (!this.userInteracted) {
                        this.userInteracted = true;
                        this.startMusic();
                        const musicButton = document.getElementById('floating-music-button');
                        if (musicButton) {
                            const startImg = document.createElement('img');
                            startImg.src = 'music/img/старт.png';
                            startImg.style.cssText = 'width: 24px; height: 24px;';
                            startImg.alt = 'Пауза';
                            musicButton.innerHTML = '';
                            musicButton.appendChild(startImg);
                            musicButton.title = 'Пауза';
                        }
                    }
                }
            });
        },

        // Начало воспроизведения музыки
        startMusic: function () {
            console.log('Запуск музыки после взаимодействия пользователя...');

            const savedTrack = this.getSavedTrack();

            if (savedTrack && this.tracks.includes(savedTrack)) {
                this.playTrack(savedTrack, true);
            } else {
                this.playRandomTrack();
            }

            const musicButton = document.getElementById('floating-music-button');
            if (musicButton) {
                const startImg = document.createElement('img');
                startImg.src = 'music/img/старт.png';
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

        // Загрузка состояния
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

            if (this.audio) {
                this.audio.pause();
                this.audio = null;
            }

            this.audio = new Audio(trackPath);
            this.audio.volume = this.volume;
            this.audio.loop = false;
            this.currentTrack = trackPath;

            if (restoreTime) {
                const savedTime = this.getSavedTime();
                if (savedTime > 0) {
                    this.audio.currentTime = savedTime;
                    console.log(`Восстановлено время: ${savedTime} сек.`);
                }
            }

            this.audio.addEventListener('play', () => {
                console.log(`Начало воспроизведения: ${trackPath}`);
                this.isPlaying = true;
                this.saveState();

                const musicButton = document.getElementById('floating-music-button');
                if (musicButton) {
                    const startImg = document.createElement('img');
                    startImg.src = 'music/img/старт.png';
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

                const musicButton = document.getElementById('floating-music-button');
                if (musicButton) {
                    const pauseImg = document.createElement('img');
                    pauseImg.src = 'music/img/пауза.png';
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

                            if (!this.userInteracted) {
                                this.showMusicHint();
                            }
                        }
                    });
            }
        },

        // Показать подсказку
        showMusicHint: function () {
            const hint = document.createElement('div');
            hint.id = 'music-hint';
            hint.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: rgba(115, 99, 87, 0.95);
                color: white;
                padding: 12px 18px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                z-index: 9998;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: pulse 2s infinite;
                max-width: 250px;
                text-align: center;
                backdrop-filter: blur(5px);
            `;

            const noteImg = document.createElement('img');
            noteImg.src = 'music/img/нота.png';
            noteImg.style.cssText = 'width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; filter: invert(1);';
            noteImg.alt = 'Нота';

            hint.innerHTML = '';
            hint.appendChild(noteImg);
            hint.appendChild(document.createTextNode(' Нажмите здесь'));
            hint.appendChild(document.createElement('br'));
            hint.appendChild(document.createTextNode('чтобы включить фоновую музыку'));

            hint.addEventListener('click', () => {
                this.userInteracted = true;
                this.playAudio();
                hint.remove();
            });

            document.body.appendChild(hint);

            setTimeout(() => {
                if (document.body.contains(hint)) {
                    hint.remove();
                }
            }, 15000);
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
        },

        // Остановка музыки
        stop: function () {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.isPlaying = false;
            }
            localStorage.setItem('backgroundMusicEnabled', 'false');
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
        
        #music-hint {
            animation: pulse 2s infinite !important;
        }
        
        #floating-music-button:hover {
            animation: pulse 1s infinite !important;
        }
    `;
    document.head.appendChild(musicStyles);

    // Инициализируем музыку после загрузки страницы
    setTimeout(() => {
        window.backgroundMusic.init();
    }, 1000);

    // Проверка существования изображений по умолчанию
    console.log("Проверка изображений по умолчанию:");
    const defaultImages = [
        'images/тест/что будет/Без/личность.jpg',
        'images/тест/что будет/Без/влияние.jpg',
        'images/тест/что будет/Без/музыка.jpg'
    ];

    defaultImages.forEach(imgPath => {
        const img = new Image();
        img.onload = function () {
            console.log(`✓ Изображение найдено: ${imgPath}`);
        };
        img.onerror = function () {
            console.error(`✗ Изображение не найдено: ${imgPath}`);
        };
        img.src = imgPath;
    });

    // ТЕМЫ!!!
    const colorThemes = {
        "ОРАНЖЕВЫЙ": {
            bgGradient: ['#FFD7AB', '#FFD7AB', '#E3AE85'],
            accentColor: '#DD9166',
            resultImages: {
                личность: 'images/тест/что будет/Оранжевый/личность.jpg',
                влияние: 'images/тест/что будет/Оранжевый/влияние.jpg',
                музыка: 'images/тест/что будет/Оранжевый/музыка.jpg',
                цветы: 'images/тест/что будет/Оранжевый/цветы.png',
                верх: 'images/тест/что будет/Оранжевый/ленты/верх.png',
                низ: 'images/тест/что будет/Оранжевый/ленты/низ.png'
            }
        },
        "КРАСНЫЙ": {
            bgGradient: ['#C98A8A', '#B87375', '#984245'],
            accentColor: '#E27D7D',
            resultImages: {
                личность: 'images/тест/что будет/Красный/личность.jpg',
                влияние: 'images/тест/что будет/Красный/влияние.jpg',
                музыка: 'images/тест/что будет/Красный/музыка.jpg',
                цветы: 'images/тест/что будет/Красный/цветы.png',
                верх: 'images/тест/что будет/Красный/ленты/верх.png',
                низ: 'images/тест/что будет/Красный/ленты/низ.png'
            }
        },
        "БОРДОВЫЙ": {
            bgGradient: ['#B77F83', '#996567', '#673232'],
            accentColor: '#964E4E',
            resultImages: {
                личность: 'images/тест/что будет/Бордовый/личность.jpg',
                влияние: 'images/тест/что будет/Бордовый/влияние.jpg',
                музыка: 'images/тест/что будет/Бордовый/музыка.jpg',
                цветы: 'images/тест/что будет/Бордовый/цветы.png',
                верх: 'images/тест/что будет/Бордовый/ленты/верх.png',
                низ: 'images/тест/что будет/Бордовый/ленты/низ.png'
            }
        },
        "ЖЁЛТЫЙ": {
            bgGradient: ['#FAEDCD', '#FAEDC9', '#EDD9A2'],
            accentColor: '#F7C977',
            resultImages: {
                личность: 'images/тест/что будет/Желтый/личность.jpg',
                влияние: 'images/тест/что будет/Желтый/влияние.jpg',
                музыка: 'images/тест/что будет/Желтый/музыка.jpg',
                цветы: 'images/тест/что будет/Желтый/цветы.png',
                верх: 'images/тест/что будет/Желтый/ленты/верх.png',
                низ: 'images/тест/что будет/Желтый/ленты/низ.png'
            }
        },
        "РОЗОВЫЙ": {
            bgGradient: ['#FBE0DB', '#EABEBD', '#D49A9A'],
            accentColor: '#F9AAAB',
            resultImages: {
                личность: 'images/тест/что будет/Розовый/личность.jpg',
                влияние: 'images/тест/что будет/Розовый/влияние.jpg',
                музыка: 'images/тест/что будет/Розовый/музыка.jpg',
                цветы: 'images/тест/что будет/Розовый/цветы.png',
                верх: 'images/тест/что будет/Розовый/ленты/верх.png',
                низ: 'images/тест/что будет/Розовый/ленты/низ.png'
            }
        },
        "БИРЮЗОВЫЙ": {
            bgGradient: ['#C0D5D7', '#B3CEC8', '#8EAAAF'],
            accentColor: '#87CCBE',
            resultImages: {
                личность: 'images/тест/что будет/Бирюзовый/личность.jpg',
                влияние: 'images/тест/что будет/Бирюзовый/влияние.jpg',
                музыка: 'images/тест/что будет/Бирюзовый/музыка.jpg',
                цветы: 'images/тест/что будет/Бирюзовый/цветы.png',
                верх: 'images/тест/что будет/Бирюзовый/ленты/верх.png',
                низ: 'images/тест/что будет/Бирюзовый/ленты/низ.png'
            }
        },
        "ЗЕЛЁНЫЙ": {
            bgGradient: ['#E3E4DE', '#CACFBA', '#7E8C74'],
            accentColor: '#879354',
            resultImages: {
                личность: 'images/тест/что будет/Зеленый/личность.jpg',
                влияние: 'images/тест/что будет/Зеленый/влияние.jpg',
                музыка: 'images/тест/что будет/Зеленый/музыка.jpg',
                цветы: 'images/тест/что будет/Зеленый/цветы.png',
                верх: 'images/тест/что будет/Зеленый/ленты/верх.png',
                низ: 'images/тест/что будет/Зеленый/ленты/низ.png'
            }
        },
        "ФИОЛЕТОВЫЙ": {
            bgGradient: ['#E4C5D3', '#C0A9C0', '#9D86B1'],
            accentColor: '#BC9FE2',
            resultImages: {
                личность: 'images/тест/что будет/Фиолетовый/личность.jpg',
                влияние: 'images/тест/что будет/Фиолетовый/влияние.jpg',
                музыка: 'images/тест/что будет/Фиолетовый/музыка.jpg',
                цветы: 'images/тест/что будет/Фиолетовый/цветы.png',
                верх: 'images/тест/что будет/Фиолетовый/ленты/верх.png',
                низ: 'images/тест/что будет/Фиолетовый/ленты/низ.png'
            }
        },
        "СИНИЙ": {
            bgGradient: ['#E0EAF4', '#D0DEF1', '#A4B8D2'],
            accentColor: '#90A2DD',
            resultImages: {
                личность: 'images/тест/что будет/Синий/личность.jpg',
                влияние: 'images/тест/что будет/Синий/влияние.jpg',
                музыка: 'images/тест/что будет/Синий/музыка.jpg',
                цветы: 'images/тест/что будет/Синий/цветы.png',
                верх: 'images/тест/что будет/Синий/ленты/верх.png',
                низ: 'images/тест/что будет/Синий/ленты/низ.png'
            }
        },
        "СЕРЫЙ": {
            bgGradient: ['#AAA5A3', '#8D8A89', '#636161'],
            accentColor: '#CBCBC9',
            resultImages: {
                личность: 'images/тест/что будет/Серый/личность.jpg',
                влияние: 'images/тест/что будет/Серый/влияние.jpg',
                музыка: 'images/тест/что будет/Серый/музыка.jpg',
                цветы: 'images/тест/что будет/Серый/цветы.png',
                верх: 'images/тест/что будет/Серый/ленты/верх.png',
                низ: 'images/тест/что будет/Серый/ленты/низ.png'
            }
        },
        "КОРИЧНЕВЫЙ": {
            bgGradient: ['#AE9B8E', '#A39185', '#90796C'],
            accentColor: '#8B7965',
            resultImages: {
                личность: 'images/тест/что будет/Коричневый/личность.jpg',
                влияние: 'images/тест/что будет/Коричневый/влияние.jpg',
                музыка: 'images/тест/что будет/Коричневый/музыка.jpg',
                цветы: 'images/тест/что будет/Коричневый/цветы.png',
                верх: 'images/тест/что будет/Коричневый/ленты/верх.png',
                низ: 'images/тест/что будет/Коричневый/ленты/низ.png'
            }
        },
        "ЧЁРНЫЙ": {
            bgGradient: ['#626060', '#626060', '#2B2B2B'],
            accentColor: '#606060',
            resultImages: {
                личность: 'images/тест/что будет/Черный/личность.jpg',
                влияние: 'images/тест/что будет/Черный/влияние.jpg',
                музыка: 'images/тест/что будет/Черный/музыка.jpg',
                цветы: 'images/тест/что будет/Черный/цветы.png',
                верх: 'images/тест/что будет/Черный/ленты/верх.png',
                низ: 'images/тест/что будет/Черный/ленты/низ.png'
            }
        }
    };

    // Переменные для хранения состояния
    let selectedButton = null;
    let selectedTheme = null;

    // Инициализация синтезатора речи
    let speechSynthesis = window.speechSynthesis;
    let voices = [];
    let isSpeechEnabled = true;

    // Функция для инициализации голосов
    function initSpeechSynthesis() {
        speechSynthesis.onvoiceschanged = function () {
            voices = speechSynthesis.getVoices();
            console.log("Доступные голоса:", voices.length);

            const russianVoices = voices.filter(voice =>
                voice.lang.includes('ru') || voice.name.includes('Russian')
            );

            if (russianVoices.length > 0) {
                console.log("Найден русский голос:", russianVoices[0].name);
            } else {
                console.warn("Русский голос не найден.");
                isSpeechEnabled = false;
            }
        };

        if (!speechSynthesis) {
            console.warn("Браузер не поддерживает синтез речи");
            isSpeechEnabled = false;
        }
    }

    // Функция для озвучивания текста
    function speakText(text, lang = 'ru-RU') {
        if (!isSpeechEnabled) return;

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const russianVoices = voices.filter(voice =>
            voice.lang.includes('ru') || voice.name.includes('Russian')
        );

        if (russianVoices.length > 0) {
            utterance.voice = russianVoices[0];
        }

        utterance.onstart = function () {
            console.log("Начало речи:", text);
        };

        utterance.onend = function () {
            console.log("Конец речи");
        };

        utterance.onerror = function (event) {
            console.error("Ошибка синтеза речи:", event);
        };

        speechSynthesis.speak(utterance);
    }

    // Функция для озвучивания выбранного цвета
    function speakSelectedColor(colorName) {
        const text = `Поменять оформление на ${colorName.toLowerCase()}`;
        speakText(text);
    }

    // Функция для применения темы
    function applyTheme(themeName, isPreview = false) {
        const theme = colorThemes[themeName];
        if (!theme) return;

        // Применяем градиент фона
        document.querySelector('.body').style.background =
            `linear-gradient(${theme.bgGradient[0]}, ${theme.bgGradient[1]}, ${theme.bgGradient[2]})`;

        // Применяем акцентный цвет к wot-text
        const wotTextElements = document.querySelectorAll('.wot-text, .postsKSA');
        wotTextElements.forEach(element => {
            element.style.color = theme.accentColor;
        });

        // Обновляем изображения результатов и цветов
        updateResultImages(themeName);

        // Если это не предпросмотр, а окончательное применение
        if (!isPreview) {
            // Сохраняем выбранную тему в localStorage
            localStorage.setItem('selectedTheme', themeName);
            localStorage.setItem('themeData', JSON.stringify(theme));

            // СИНХРОНИЗАЦИЯ ДЛЯ СТРАНИЦЫ РЕЗУЛЬТАТОВ
            // Сохраняем специальный флаг для синхронизации
            localStorage.setItem('themeSynced', 'true');
            
            // Обновляем ссылку на тест с параметром темы
            updateTestLink(themeName);

            // Озвучиваем подтверждение изменения цвета
            if (isSpeechEnabled) {
                setTimeout(() => {
                    speakText(`Оформление изменено на ${themeName.toLowerCase()}`);
                }, 300);
            }
        }
    }

    // Функция для загрузки сохраненной темы
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && colorThemes[savedTheme]) {
            // Применяем сохраненную тему
            applyTheme(savedTheme, false);

            // Обновляем текст выбранного цвета
            const colorNameElement = document.getElementById('selected-color-text');
            if (colorNameElement) {
                colorNameElement.textContent = savedTheme;
                colorNameElement.style.color = colorThemes[savedTheme].accentColor;
            }

            // Находим и выделяем соответствующую кнопку
            const colorButtons = document.querySelectorAll('.colorButton');
            colorButtons.forEach(button => {
                if (button.getAttribute('data-color-name') === savedTheme) {
                    button.style.transform = 'scale(1.05)';
                    selectedButton = button;
                    selectedTheme = savedTheme;
                }
            });
        } else {
            // Если нет сохраненной темы, устанавливаем изображения по умолчанию
            setDefaultResultImages();
        }
    }

    // Функция для установки изображений по умолчанию
    function setDefaultResultImages() {
        console.log("Установка изображений по умолчанию");

        const imagesToUpdate = [
            { selector: '.result1', image: 'images/тест/что будет/Без/личность.jpg' },
            { selector: '.result2', image: 'images/тест/что будет/Без/влияние.jpg' },
            { selector: '.result3', image: 'images/тест/что будет/Без/музыка.jpg' },
            { selector: '.flower', image: 'images/тест/что будет/Без/цветы.png' },
            { selector: '.lineTop', image: 'images/тест/что будет/Без/ленты/верх.png' },
            { selector: '.lineBottom', image: 'images/тест/что будет/Без/ленты/низ.png' }
        ];

        imagesToUpdate.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                console.log(`Пытаемся установить: ${item.image}`);

                const tempImg = new Image();

                tempImg.onload = function () {
                    console.log(`Изображение загружено: ${item.image}`);
                    element.style.backgroundImage = `url('${item.image}')`;
                };

                tempImg.onerror = function () {
                    console.error(`Не удалось загрузить изображение по умолчанию: ${item.image}`);
                    const altPath = item.image.replace('тест/что будет/Без/', '');
                    console.log(`Пробуем альтернативный путь: ${altPath}`);

                    const altImg = new Image();
                    altImg.onload = function () {
                        element.style.backgroundImage = `url('${altPath}')`;
                    };
                    altImg.onerror = function () {
                        console.error("Альтернативный путь тоже не сработал");
                        element.style.backgroundImage = 'none';
                    };
                    altImg.src = altPath;
                };

                tempImg.src = item.image;
            }
        });
    }

    // Функция для обновления изображений результатов
    function updateResultImages(themeName) {
        const theme = colorThemes[themeName];
        if (!theme || !theme.resultImages) {
            console.warn(`Тема ${themeName} не найдена или нет изображений`);
            setDefaultResultImages();
            return;
        }

        console.log(`Обновление изображений для темы: ${themeName}`, theme.resultImages);

        const mainImagesToUpdate = [
            { element: '.result1', key: 'личность', fallback: 'images/тест/что будет/Без/личность.jpg' },
            { element: '.result2', key: 'влияние', fallback: 'images/тест/что будет/Без/влияние.jpg' },
            { element: '.result3', key: 'музыка', fallback: 'images/тест/что будет/Без/музыка.jpg' },
            { element: '.flower', key: 'цветы', fallback: 'images/тест/что будет/Без/цветы.png' },
            { element: '.lineTop', key: 'верх', fallback: 'images/тест/что будет/Без/ленты/верх.png' },
            { element: '.lineBottom', key: 'низ', fallback: 'images/тест/что будет/Без/ленты/низ.png' }
        ];

        mainImagesToUpdate.forEach(item => {
            const element = document.querySelector(item.element);
            if (element) {
                console.log(`Попытка загрузки: ${theme.resultImages[item.key]}`);

                const tempImg = new Image();

                tempImg.onload = function () {
                    console.log(`Изображение загружено: ${theme.resultImages[item.key]}`);
                    element.style.backgroundImage = `url('${theme.resultImages[item.key]}')`;
                };

                tempImg.onerror = function () {
                    console.warn(`Не удалось загрузить изображение: ${theme.resultImages[item.key]}`);
                    console.log(`Используем fallback: ${item.fallback}`);
                    element.style.backgroundImage = `url('${item.fallback}')`;

                    const fallbackImg = new Image();
                    fallbackImg.onerror = function () {
                        console.error(`Fallback изображение тоже не найдено: ${item.fallback}`);
                        element.style.backgroundImage = 'none';
                    };
                    fallbackImg.src = item.fallback;
                };

                tempImg.src = theme.resultImages[item.key];
            } else {
                console.warn(`Элемент не найден: ${item.element}`);
            }
        });
    }

    // Функция для обновления ссылки на тест с параметром темы
    function updateTestLink(themeName) {
        const testLink = document.querySelector('.testButton');
        if (testLink) {
            const currentHref = testLink.getAttribute('href');
            const baseHref = currentHref.split('?')[0];
            testLink.setAttribute('href', `${baseHref}?theme=${encodeURIComponent(themeName)}`);
        }
    }

    // Функция для сброса всех тем и возврата к начальному состоянию
    function resetToDefaultTheme() {
        console.log("Сброс темы к начальному состоянию");

        // Сбрасываем градиент фона к первоначальному
        document.querySelector('.body').style.background =
            'linear-gradient(#F9F1ED, #DCD2C7)';

        // Сбрасываем цвет текстов
        const wotTextElements = document.querySelectorAll('.wot-text, .postsKSA');
        wotTextElements.forEach(element => {
            element.style.color = '';
        });

        // Устанавливаем изображения по умолчанию с абсолютными путями
        const result1 = document.querySelector('.result1');
        const result2 = document.querySelector('.result2');
        const result3 = document.querySelector('.result3');
        const flower = document.querySelector('.flower');
        const lineTop = document.querySelector('.lineTop');
        const lineBottom = document.querySelector('.lineBottom');

        if (result1) {
            result1.style.backgroundImage = "url('images/тест/что будет/Без/личность.jpg')";
            console.log("Изображение 1 сброшено");
        }
        if (result2) {
            result2.style.backgroundImage = "url('images/тест/что будет/Без/влияние.jpg')";
            console.log("Изображение 2 сброшено");
        }
        if (result3) {
            result3.style.backgroundImage = "url('images/тест/что будет/Без/музыка.jpg')";
            console.log("Изображение 3 сброшено");
        }
        if (flower) {
            flower.style.backgroundImage = "url('images/тест/что будет/Без/цветы.png')";
            console.log("Цветы сброшены");
        }
        if (lineTop) {
            lineTop.style.backgroundImage = "url('images/тест/что будет/Без/ленты/верх.png')";
            console.log("Верхняя лента сброшена");
        }
        if (lineBottom) {
            lineBottom.style.backgroundImage = "url('images/тест/что будет/Без/ленты/низ.png')";
            console.log("Нижняя лента сброшена");
        }

        // Сбрасываем выбранный цвет в текстовом поле
        const colorNameElement = document.getElementById('selected-color-text');
        if (colorNameElement) {
            colorNameElement.textContent = 'ВЫБЕРИТЕ';
            colorNameElement.style.color = '';
        }

        // Сбрасываем выделение кнопок цвета
        const colorButtons = document.querySelectorAll('.colorButton');
        colorButtons.forEach(button => {
            button.style.transform = 'scale(1)';
        });

        // Сбрасываем выделенную кнопку темы
        selectedButton = null;
        selectedTheme = null;

        // Очищаем localStorage
        localStorage.removeItem('selectedTheme');
        localStorage.removeItem('themeData');
        localStorage.removeItem('themeSynced'); // Удаляем флаг синхронизации

        // Обновляем ссылку на тест (убираем параметр темы)
        const testLink = document.querySelector('.testButton');
        if (testLink) {
            const currentHref = testLink.getAttribute('href');
            const baseHref = currentHref.split('?')[0];
            testLink.setAttribute('href', baseHref);
        }

        // Показываем уведомление
        showNotification("Все темы сброшены. Возврат к начальному состоянию.", 'info');

        // Озвучиваем сброс
        if (isSpeechEnabled) {
            setTimeout(() => {
                speakText("Все темы сброшены");
            }, 500);
        }

        console.log("Все темы сброшены, изображения должны быть восстановлены");
    }

    // Генерация цветных кнопок
    function generateColorButtons() {
        const colors = [
            { name: "оранж", displayName: "ОРАНЖЕВЫЙ", textColor: "#DD9166", row: "firstRow", top: "top-559", bgColor: "#DD9166" },
            { name: "красный", displayName: "КРАСНЫЙ", textColor: "#E27D7D", row: "firstRow", top: "top-656", bgColor: "#E27D7D" },
            { name: "бордовый", displayName: "БОРДОВЫЙ", textColor: "#964E4E", row: "firstRow", top: "top-761", bgColor: "#964E4E" },
            { name: "желтый", displayName: "ЖЁЛТЫЙ", textColor: "#F7C977", row: "secondRow", top: "top-559", bgColor: "#F7C977" },
            { name: "розовый", displayName: "РОЗОВЫЙ", textColor: "#F9AAAB", row: "secondRow", top: "top-656", bgColor: "#F9AAAB" },
            { name: "бирюзовый", displayName: "БИРЮЗОВЫЙ", textColor: "#87CCBE", row: "secondRow", top: "top-761", bgColor: "#87CCBE" },
            { name: "зеленый", displayName: "ЗЕЛЁНЫЙ", textColor: "#879354", row: "thirdRow", top: "top-559", bgColor: "#BECC96" },
            { name: "фиолетовый", displayName: "ФИОЛЕТОВЫЙ", textColor: "#BC9FE2", row: "thirdRow", top: "top-656", bgColor: "#BC9FE2" },
            { name: "синий", displayName: "СИНИЙ", textColor: "#90A2DD", row: "thirdRow", top: "top-761", bgColor: "#90A2DD" },
            { name: "серый", displayName: "СЕРЫЙ", textColor: "#CBCBC9", row: "fourthRow", top: "top-559", bgColor: "#CBCBC9" },
            { name: "коричневый", displayName: "КОРИЧНЕВЫЙ", textColor: "#8B7965", row: "fourthRow", top: "top-656", bgColor: "#8B7965" },
            { name: "черный", displayName: "ЧЁРНЫЙ", textColor: "#606060", row: "fourthRow", top: "top-761", bgColor: "#606060" }
        ];

        const container = document.getElementById('color-buttons-container');

        colors.forEach(color => {
            const button = document.createElement('button');
            button.className = `colorButton ${color.row} ${color.top}`;
            button.setAttribute('data-color-name', color.displayName);
            button.setAttribute('data-text-color', color.textColor);

            button.style.backgroundImage = `url(images/кнопкиЦвет/${color.name}.jpg)`;
            button.style.boxShadow = `0 5px 25px ${color.bgColor}80`;

            button.addEventListener('mouseenter', function () {
                this.style.animation = 'pulse 2s ease-in-out infinite';
                this.style.transform = 'scale(1.03)';
            });

            button.addEventListener('mouseleave', function () {
                this.style.animation = 'none';
                if (this !== selectedButton) {
                    this.style.transform = 'scale(1)';
                }
            });

            button.addEventListener('click', function () {
                const themeName = this.getAttribute('data-color-name');
                console.log(`Предпросмотр темы: ${themeName}`);

                applyTheme(themeName, true);

                if (isSpeechEnabled) {
                    setTimeout(() => {
                        speakSelectedColor(themeName);
                    }, 100);
                }

                if (window.backgroundMusic && !window.backgroundMusic.userInteracted) {
                    window.backgroundMusic.userInteracted = true;
                    window.backgroundMusic.startMusic();
                }
            });

            container.appendChild(button);
        });
    }

    // Функция для слайдера текстов
    function initTextSlider() {
        const circles = document.querySelectorAll('.circle');
        const textElement = document.getElementById('text-content');
        const nextButton = document.getElementById('next-button');

        let currentIndex = 0;

        const texts = [
            `Альбина, Соня и Катя <br> 
            рады приветствовать вас <br>
            на нашем сайте, созданном <br>
            в рамках изучения дисциплины <br>
            "инструментальные средства <br>
            разработки ПО".`,

            `Наш проект создан,<br> 
            в первую очередь,<br> 
            для творческого самовыражения <br> 
            и эстетического удовольствия, <br> 
            а уже затем —<br>
            как вспомогательный инструмент<br>
            для дизайнеров и художников.`,

            `Откройте для себя <br> 
           разнообразие стилей! <br> 
            Выберите готовое оформление <br> 
            или пройдите тест, <br> 
            по результатам которого<br>
            оформление будет изменено.<br> <br>Приятного просмотра! 🌸`
        ];

        function updateDisplay() {
            circles.forEach(circle => {
                circle.classList.remove('active');
            });

            circles[currentIndex].classList.add('active');
            textElement.innerHTML = texts[currentIndex];
        }

        nextButton.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % 3;
            updateDisplay();

            if (window.backgroundMusic && !window.backgroundMusic.userInteracted) {
                window.backgroundMusic.userInteracted = true;
                window.backgroundMusic.startMusic();
            }
        });

        circles.forEach((circle, index) => {
            circle.addEventListener('click', function () {
                currentIndex = index;
                updateDisplay();
            });
        });

        updateDisplay();
    }

    // Функция для смены цвета
    function initColorChanger() {
        const colorButtons = document.querySelectorAll('.colorButton');
        const colorNameElement = document.getElementById('selected-color-text');
        const confirmColorButton = document.getElementById('confirm-color-button');

        colorButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (selectedButton) {
                    selectedButton.style.transform = 'scale(1)';
                }

                this.style.transform = 'scale(1.05)';
                selectedButton = this;

                const colorName = this.getAttribute('data-color-name');
                const textColor = this.getAttribute('data-text-color');

                colorNameElement.textContent = colorName;
                colorNameElement.style.color = textColor;
                selectedTheme = colorName;

                if (isSpeechEnabled) {
                    setTimeout(() => {
                        speakSelectedColor(colorName);
                    }, 100);
                }

                console.log(`Выбрана тема: ${colorName}`);
            });
        });

        confirmColorButton.addEventListener('click', function () {
            if (selectedTheme) {
                console.log(`Применение темы: ${selectedTheme}`);

                applyTheme(selectedTheme, false);

                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    showNotification(`Оформление изменено на "${selectedTheme}"`, 'success');
                }, 150);
            } else {
                showNotification("Пожалуйста, выберите цвет сначала!", 'warning');
            }
        });
    }

    // Функция для инициализации кнопки clear с плавной анимацией
    function initClearButton() {
        const clearButton = document.getElementById('clear-button');

        if (clearButton) {
            const originalBgColor = '#FFFFFF';
            const originalTextColor = '#42383C';

            clearButton.addEventListener('mouseenter', function () {
                this.style.backgroundColor = '#736357';
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 15px rgba(115, 99, 87, 0.25)';

                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = '#FFFFFF';
                }
            });

            clearButton.addEventListener('mouseleave', function () {
                this.style.backgroundColor = originalBgColor;
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';

                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = originalTextColor;
                }
            });

            clearButton.addEventListener('mousedown', function () {
                this.style.transform = 'translateY(-1px) scale(0.98)';
            });

            clearButton.addEventListener('mouseup', function () {
                this.style.transform = 'translateY(-3px)';
            });

            clearButton.addEventListener('click', function () {
                this.style.transform = 'translateY(0) scale(0.96)';

                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = '#FFFFFF';
                }

                setTimeout(() => {
                    resetToDefaultTheme();

                    this.style.transform = 'translateY(0)';
                    this.style.backgroundColor = originalBgColor;

                    if (buttonText) {
                        buttonText.style.color = originalTextColor;
                    }
                }, 300);
            });
        }
    }

    // Функция для добавления анимаций ко всем кнопкам
    function initButtonAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .Button, .buttonKS, .buttonA, .link-text, .clearButton {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }
            
            .colorButton {
                transition: all 0.3s ease-in-out !important;
            }
            
            .result1, .result2, .result3, .flower, .lineTop, .lineBottom {
                transition: background-image 0.5s ease-in-out !important;
            }
            
            .clearButton .button-text {
                transition: color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }
            
            @keyframes pulse {
                0% { 
                    transform: scale(1); 
                    box-shadow: 0 5px 25px rgba(0,0,0,0.1);
                }
                50% { 
                    transform: scale(1.03); 
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                }
                100% { 
                    transform: scale(1); 
                    box-shadow: 0 5px 25px rgba(0,0,0,0.1);
                }
            }
        `;
        document.head.appendChild(style);

        const mainButtons = document.querySelectorAll('.Button');
        mainButtons.forEach(button => {
            const originalBgColor = button.style.backgroundColor || '#FFFFFF';
            const originalTransform = button.style.transform || 'translateY(0)';

            button.addEventListener('mouseenter', function () {
                this.style.backgroundColor = '#736357';
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 20px rgba(115, 99, 87, 0.3)';
                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = '#FFFFFF';
                    buttonText.style.transition = 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            });

            button.addEventListener('mouseleave', function () {
                this.style.backgroundColor = originalBgColor;
                this.style.transform = originalTransform;
                this.style.boxShadow = 'none';
                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = '#42383C';
                }
            });
        });

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
    }

    // Функция для показа уведомлений
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `custom-notification custom-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;

        const colors = {
            success: '#7b8e7fff',
            warning: '#dac27bff',
            info: '#7fb4bcff',
            error: '#a75f66ff'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Инициализация всех функций
    initSpeechSynthesis();
    generateColorButtons();
    initTextSlider();
    initButtonAnimations();
    initClearButton();
    loadSavedTheme();

    // Инициализируем цветной меню
    setTimeout(initColorChanger, 100);
});