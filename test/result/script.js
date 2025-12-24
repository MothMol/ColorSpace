// Основная функция при загрузке DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, инициализация страницы результатов...');

    // Устанавливаем масштаб 75%
    document.body.style.zoom = "0.75";

    // Добавляем CSS стили для аудиоплеера
    addAudioPlayerStyles();

    // Инициализируем выпадающее меню
    console.log('Инициализация выпадающего меню...');
    initResultsDropdown();

    // ПРИОРИТЕТ: РЕЗУЛЬТАТ ТЕСТА, А НЕ ТЕМА С ГЛАВНОЙ СТРАНИЦЫ
    console.log('Проверяем результат теста...');
    const resultColorIndex = localStorage.getItem('testResult');

    // Инициализируем кнопку "Далее"
    initNextButton();

    // ПЕРВЫЙ ПРИОРИТЕТ: результат теста
    if (resultColorIndex !== null) {
        const index = parseInt(resultColorIndex);
        console.log('Найден результат теста:', index);
        if (!isNaN(index) && index >= 0 && index < colors.length) {
            updateAllBlocks(index);
            console.log('Приоритет: показан результат теста');
        } else {
            console.log('Результат теста некорректен');
            // ВТОРОЙ ПРИОРИТЕТ: тема с главной страницы
            applyThemeFromMainPage();
        }
    } else {
        console.log('Результат теста не найден');
        // ВТОРОЙ ПРИОРИТЕТ: тема с главной страницы
        applyThemeFromMainPage();
    }

    // Инициализируем музыку с задержкой
    setTimeout(() => {
        console.log('Инициализация фоновой музыки...');
        if (window.backgroundMusic) {
            window.backgroundMusic.init();
        }
    }, 500);
    
    // Для отладки
    console.log('=== ДЕБАГ LOCALSTORAGE ===');
    console.log('selectedTheme:', localStorage.getItem('selectedTheme'));
    console.log('themeData:', localStorage.getItem('themeData'));
    console.log('testResult:', localStorage.getItem('testResult'));
    console.log('=== КОНЕЦ ДЕБАГА ===');
});

// Функция для применения темы с главной страницы (второй приоритет)
function applyThemeFromMainPage() {
    console.log('Применение темы с главной страницы (второй приоритет)...');
    
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedThemeData = localStorage.getItem('themeData');

    if (savedTheme && savedThemeData) {
        try {
            const theme = JSON.parse(savedThemeData);
            console.log('Тема с главной страницы загружена:', savedTheme);

            // Находим индекс цвета по имени темы
            const colorIndex = colors.findIndex(color => color.name.toUpperCase() === savedTheme);
            if (colorIndex !== -1) {
                console.log('Найден цвет по теме, индекс:', colorIndex);
                updateAllBlocks(colorIndex);
                console.log('Второй приоритет: показана тема с главной страницы');
            } else {
                console.log('Цвет не найден по теме');
                showErrorResult();
            }
        } catch (e) {
            console.error('Ошибка при применении темы с главной:', e);
            showErrorResult();
        }
    } else {
        console.log('Тема с главной страницы не найдена');
        showErrorResult();
    }
}

// Функция для добавления CSS стилей для аудиоплеера
function addAudioPlayerStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        .music-player-container {
            margin-top: 330px;
            text-align: center;
            padding: 10px;
        }
        
        .color-audio-player {
            width: 100%;
            max-width: 280px;
            margin: 0 auto;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .color-audio-player::-webkit-media-controls-panel {
            background-color: inherit;
        }
        
        .color-audio-player::-webkit-media-controls-current-time-display,
        .color-audio-player::-webkit-media-controls-time-remaining-display {
            color: inherit;
        }
        
        .audio-player-title {
            font-family: 'Stika';
            font-size: 16px;
            color: #5B524D;
            margin-bottom: 10px;
            font-style: italic;
        }
        
        .dark-audio-player {
            color: white !important;
        }
        
        .dark-audio-player::-webkit-media-controls-panel {
            background-color: rgba(0, 0, 0, 0.7) !important;
        }
        
        .dark-audio-player::-webkit-media-controls-current-time-display,
        .dark-audio-player::-webkit-media-controls-time-remaining-display {
            color: white !important;
        }
        
        .results-option {
            text-decoration: none !important;
            color: #42383C !important;
        }
        
        .results-option:hover {
            text-decoration: none !important;
            color: #42383C !important;
        }
        
        .results-option:visited {
            text-decoration: none !important;
            color: #42383C !important;
        }
        
        .flower-image {
            transition: opacity 0.5s ease;
        }
        
    `;
    document.head.appendChild(styles);
}

// Функция для создания аудиоплеера для музыки
function createAudioPlayer(audioSrc, colorHex, colorName) {
    const oldPlayerContainer = document.querySelector('.music-player-container');
    if (oldPlayerContainer) {
        oldPlayerContainer.remove();
    }

    const playerContainer = document.createElement('div');
    playerContainer.className = 'music-player-container';

    const audioPlayer = document.createElement('audio');
    audioPlayer.className = 'color-audio-player';
    audioPlayer.controls = true;
    audioPlayer.style.backgroundColor = colorHex;

    const isDarkColor = isColorDark(colorHex);
    if (isDarkColor) {
        audioPlayer.classList.add('dark-audio-player');
    }

    const source = document.createElement('source');
    source.src = audioSrc;
    source.type = 'audio/mp3';
    audioPlayer.appendChild(source);

    audioPlayer.innerHTML += 'Ваш браузер не поддерживает аудио элементы.';

    audioPlayer.addEventListener('error', function (e) {
        console.error('Ошибка загрузки аудио:', e);
    });

    audioPlayer.addEventListener('loadeddata', function () {
        console.log('Аудиофайл успешно загружен:', audioSrc);
    });

    playerContainer.appendChild(audioPlayer);

    return playerContainer;
}

// Функция для определения, является ли цвет темным
function isColorDark(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 128;
}

// Функция для инициализации кнопки "Далее"
function initNextButton() {
    const nextBtn = document.getElementById('next-category-btn');
    if (nextBtn) {
        let currentDescriptionIndex = 0;

        const descriptionTexts = [
            'Будет дано описание человека как личности в зависимости от его любимого цвета.',
            'Будет дано описание того, как определенный цвет влияет на человека.',
            'Будет дано описание жанра музыки, который ассоциируется у многих с определенным цветом.'
        ];

        function updateDescriptionText() {
            const resTextElement = document.querySelector('.resText');
            if (resTextElement) {
                resTextElement.textContent = descriptionTexts[currentDescriptionIndex];
            }
        }

        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Кнопка "Далее" нажата');

            currentDescriptionIndex = (currentDescriptionIndex + 1) % descriptionTexts.length;

            updateDescriptionText();
        });

        updateDescriptionText();

        nextBtn.style.transition = 'all 0.3s ease';
        nextBtn.style.cursor = 'pointer';

        nextBtn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
        });

        nextBtn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });

        console.log('Кнопка "Далее" инициализирована');
    } else {
        console.error('Кнопка "Далее" не найдена!');
    }
}

// Функция показа ошибки при отсутствии результата
function showErrorResult() {
    console.log('Результат не найден, показываем сообщение об ошибке');
    const resultContent = document.getElementById('result-content');
    if (resultContent) {
        resultContent.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Результат не найден</h2>
                <p>Пройдите тест, чтобы увидеть ваш результат.</p>
                <a href="../../index.html" style="color: #736357; text-decoration: underline;">Вернуться к тесту</a>
            </div>
        `;
    }
}

// ===============================
// ИНИЦИАЛИЗАЦИЯ ФОНОВОЙ МУЗЫКИ
// ===============================
window.backgroundMusic = {
    audio: null,
    currentTrack: null,
    tracks: [
        '../../music/трек1.mp3',
        '../../music/трек2.mp3',
        '../../music/трек3.mp3',
        '../../music/трек4.mp3',
        '../../music/трек5.mp3'
    ],
    volume: 0.5,
    isPlaying: false,
    userInteracted: false,

    init: function () {
        console.log('Инициализация фоновой музыки на странице теста...');
        this.loadState();
        this.continueMusicFromMainPage();
        this.createFloatingButton();
    },

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

    continueMusicFromMainPage: function () {
        const savedState = localStorage.getItem('backgroundMusicState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.isPlaying && state.track) {
                    console.log('Продолжаем воспроизведение музыки с главной страницы');
                    this.playTrack(state.track, true);
                }
            } catch (e) {
                console.error('Ошибка при восстановлении музыки:', e);
            }
        }
    },

    createFloatingButton: function () {
        if (document.getElementById('floating-music-button')) return;

        const musicButton = document.createElement('button');
        musicButton.id = 'floating-music-button';
        musicButton.setAttribute('aria-label', 'Управление фоновой музыкой');

        const noteImg = document.createElement('img');
        noteImg.src = '../../music/img/нота.png';
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
            outline: none;
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
            this.handleMusicButtonClick(musicButton);
        });

        document.body.appendChild(musicButton);

        setTimeout(() => {
            if (this.audio && !this.audio.paused) {
                this.updateButtonIcon(musicButton, false);
            }
        }, 500);
    },

    handleMusicButtonClick: function (button) {
        if (!this.userInteracted) {
            this.userInteracted = true;
            this.startMusic();
            this.updateButtonIcon(button, false);
        } else {
            this.togglePlayback();
            this.updateButtonIcon(button, this.audio.paused);
        }

        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    },

    updateButtonIcon: function (button, isPaused) {
        const imgSrc = isPaused ? '../../music/img/старт.png' : '../../music/img/пауза.png';
        const imgAlt = isPaused ? 'Воспроизвести' : 'Пауза';
        const title = isPaused ? 'Воспроизвести' : 'Пауза';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.cssText = 'width: 24px; height: 24px;';
        img.alt = imgAlt;
        button.innerHTML = '';
        button.appendChild(img);
        button.title = title;
    },

    startMusic: function () {
        console.log('Запуск музыки на странице теста...');

        const savedTrack = this.getSavedTrack();

        if (savedTrack && this.tracks.includes(savedTrack)) {
            this.playTrack(savedTrack, true);
        } else {
            this.playRandomTrack();
        }

        const musicButton = document.getElementById('floating-music-button');
        if (musicButton) {
            this.updateButtonIcon(musicButton, false);
        }
    },

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
        } catch (e) {
            console.error('Не удалось сохранить состояние музыки:', e);
        }
    },

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
            }
        }

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.saveState();
            this.updateMusicButtonIcon(false);
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.saveState();
            this.updateMusicButtonIcon(true);
        });

        this.audio.addEventListener('ended', () => {
            this.playNextTrack();
        });

        this.audio.addEventListener('error', (e) => {
            console.error(`Ошибка загрузки трека ${trackPath}:`, e);
            this.playNextTrack();
        });

        this.playAudio();
    },

    updateMusicButtonIcon: function (isPaused) {
        const musicButton = document.getElementById('floating-music-button');
        if (musicButton) {
            this.updateButtonIcon(musicButton, isPaused);
        }
    },

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
                });
        }
    },

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

// ===============================
// ДАННЫЕ О ЦВЕТАХ
// ===============================

// ВЫ КАК ЛИЧНОСТЬ (левый блок)
const colors = [
    {
        name: "Красный",
        hex: "#E27D7D",
        description: "Вы - человек действия, энергии и страсти.<br><br>Ваша натура сильная, решительная и напористая.<br>Вы предпочитаете прямой подход и не боитесь брать на себя ответственность."
    },
    {
        name: "Оранжевый",
        hex: "#DD9166",
        description: "Вы - человек приключений, творчества и энтузиазма.<br><br>Ваша натура энергичная, общительная и жизнерадостная.<br>Вы любите новые впечатления и вдохновляете окружающих."
    },
    {
        name: "Жёлтый",
        hex: "#F7C977",
        description: "Вы - человек оптимизма, радости и интеллекта.<br><br>Ваша натура светлая, позитивная и вдохновляющая.<br>Вы видите возможности там, где другие видят проблемы."
    },
    {
        name: "Чёрный",
        hex: "#606060",
        description: "Вы - человек тайны, элегантности и силы.<br><br>Ваша натура глубокая, загадочная и мощная.<br>Вы предпочитаете глубину поверхностности и цените настоящую суть вещей."
    },
    {
        name: "Зелёный",
        hex: "#BECC96",
        description: "Вы - человек гармонии, роста и заботы.<br><br>Ваша натура уравновешенная, сострадательная и стабильная.<br>Вы стремитесь к балансу во всём и помогаете другим найти свой путь."
    },
    {
        name: "Бирюзовый",
        hex: "#87CCBE",
        description: "Вы - человек спокойствия, ясности и коммуникации.<br><br>Ваша натура гармоничная, интуитивная и проницательная.<br>Вы умеете слушать и находить общий язык с разными людьми."
    },
    {
        name: "Бордовый",
        hex: "#964E4E",
        description: "Вы - человек страсти, элегантности и глубины.<br><br>Ваша натура утонченная, страстная и загадочная.<br>Вы сочетаете в себе силу и изысканность, создавая вокруг себя атмосферу роскоши и таинственности."
    },
    {
        name: "Синий",
        hex: "#90A2DD",
        description: "Вы - человек глубины, стабильности и мудрости.<br><br>Ваша натура серьёзная, надёжная и интеллектуальная.<br>Вы предпочитаете тщательно обдумывать решения и действовать обоснованно."
    },
    {
        name: "Фиолетовый",
        hex: "#BC9FE2",
        description: "Вы - человек творчества, духовности и интуиции.<br><br>Ваша натура чувствительная, артистичная и мечтательная.<br>Вы видите мир через призму воображения и вдохновения."
    },
    {
        name: "Розовый",
        hex: "#F9AAAB",
        description: "Вы - человек любви, нежности и сострадания.<br><br>Ваша натура чувствительная, заботливая и романтичная.<br>Вы цените эмоциональную близость и создаёте уют вокруг себя."
    },
    {
        name: "Коричневый",
        hex: "#8B7965",
        description: "Вы - человек надёжности, стабильности и практичности.<br><br>Ваша натура устойчивая, ответственная и земная.<br>Вы цените традиции и создаёте прочный фундамент для себя и близких."
    },
    {
        name: "Серый",
        hex: "#CBCBC9",
        description: "Вы - человек баланса, нейтральности и компромисса.<br><br>Ваша натура спокойная, практичная и дипломатичная.<br>Вы умеете находить золотую середину и объективно оценивать ситуацию."
    }
];

// ВАШ ЦВЕТ КАК МУЗЫКА (средний блок)
const colorMusic = [
    {
        name: "Красный",
        hex: "#E27D7D",
        description: "Рок-н-ролл или Хард-рок идеально ассоциируется с красным цветом по мнению многих людей.<br><br>Данный жанр, как и красный цвет, страстный, агрессивный, энергичный и властный.<br>Идеально передает драйв и мощь рок-музыки.",
        audio: "music/Красный/ACDC_-_Back_In_Black_47830042.mp3"
    },
    {
        name: "Оранжевый",
        hex: "#DD9166",
        description: "Фанк или Сёрф-рок ассоциируется у многих людей именно с оранжевым цветом.<br><br>Этот жанр такой же энергичный, жизнерадостный, теплый и солнечный, как и сам цвет.",
        audio: "music/Оранжевый/Dick_Dale_His_Del-Tones_-_Misirlou_48018731.mp3"
    },
    {
        name: "Жёлтый",
        hex: "#F7C977",
        description: "Поп-музыка ассоциируется у людей именно с желтым цветом.<br><br>Этот жанр такой же солнечный, оптимистичный, легкий и притягательный, как самый запоминающийся поп-хит.",
        audio: "music/Желтый/M_-_Pop_Muzik1979_63090739.mp3"
    },
    {
        name: "Чёрный",
        hex: "#606060",
        description: "Черный цвет ассоциируется у многих с Хэви-метал или Готик-роком.<br><br>Этот жанр такой же мощный, агрессивный, таинственный и эпатажный.<br>Классический цвет бунта, тьмы и тяжести.",
        audio: "music/Черный/Ozzy_Osbourne_-_No_More_Tears_47874811.mp3"
    },
    {
        name: "Зелёный",
        hex: "#BECC96",
        description: "Зеленый цвет ассоциируется у многих с Регги.<br><br>Этот жанр такой же природный, расслабленный, жизнеутверждающий и связанный с корнями.<br>Прямые ассоциации с Растафарианством.",
        audio: "music/Зеленый/Ini_Kamoze_-_World-A-Music_57250823.mp3"
    },
    {
        name: "Бирюзовый",
        hex: "#87CCBE",
        description: "Бирюзовый у многих людей ассоциируется с жанрами Эмбиент или Чиллаут.<br><br>Они такие же спокойные, прохладные, медитативные и прозрачные.<br>Напоминают о воде и небе, создавая расслабляющую атмосферу.",
        audio: "music/Бирюзовый/Home_-_Resonance_75115125.mp3"
    },
    {
        name: "Бордовый",
        hex: "#964E4E",
        description: "Бордовый у многих людей ассоциируется с Джазом (особенно в стиле 'лаунж') или Соул.<br><br>Эти жанры такие же глубокие, утонченные, чувственные и немного таинственные.<br>Ассоциируются с атмосферой джаз-бара и бархатным вокалом соула.",
        audio: "music/Бордовый/Dave_Brubeck_-_Take_Five_47937131.mp3"
    },
    {
        name: "Синий",
        hex: "#90A2DD",
        description: "Синий цвет ассоциируется у многих с Блюзом.<br><br>Этот жанр такой же глубокий, меланхоличный, спокойный и душевный.<br>Самая прямая ассоциация по названию и настроению.",
        audio: "music/Синий/Carey_Bell_-_So_Hard_To_Leave_You_Alone_(musmore.org) (1).mp3"
    },
    {
        name: "Фиолетовый",
        hex: "#BC9FE2",
        description: "Фиолетовый ассоциируется у многих с R&B или Нео-соул.<br><br>Эти жанры такие же элегантные, чувственные, мистические и творческие.<br>Передают меланхолию, роскошь и глубину современных ритмов.",
        audio: "music/Фиолетовый/702_-_Get_It_Together_69372200.mp3"
    },
    {
        name: "Розовый",
        hex: "#F9AAAB",
        description: "Розовый ассоциируется у многих с К-поп или Бабблгам-поп.<br><br>Эти жанры идеально передают атмосферу розового цвета, которому присущи игривость, сладость, романтичность и яркость.<br>Воплощение нежности и гламура.",
        audio: "music/Розовый/NewJeans_-_New_Jeans_76302903.mp3"
    },
    {
        name: "Коричневый",
        hex: "#8B7965",
        description: "Коричневый цвет ассоциируется с Фолком или Кантри.<br><br>Эти жанры такие же землистые, акустические, теплые и традиционные.<br>Ассоциируются с деревом гитар, кожей и природой.",
        audio: "music/Коричневый/The_Animals_-_The_House_Of_The_Rising_Sun_48169294.mp3"
    },
    {
        name: "Серый",
        hex: "#CBCBC9",
        description: "Серый у многих ассоциируется с Пост-панком или индастриалом.<br><br>Эти жанры такие же холодные, мрачные, урбанистические и минималистичные.<br>Передают чувство отчуждения и индустриальную эстетику.",
        audio: "music/Серый/Molchat_Doma_-_Kletka_58595718.mp3"
    }
];

// КАК ЦВЕТ ВЛИЯЕТ НА ЧЕЛОВЕКА (правый блок)
const colorEffect = [
    {
        name: "Красный",
        hex: "#E27D7D",
        description: "Красный цвет будит страсть и волю к власти, заставляя действовать решительно.<br><br>Он учащает пульс и повышает артериальное давление, побуждая к немедленным действиям.<br><br>Применяй его, когда нужен прорыв, но избегай в состоянии гнева или стресса.<br>Его следует использовать для привлечения внимания и в зонах активности (спортзал), но желательно избегать там, где нужен покой: например, в спальнях и зонах отдыха."
    },
    {
        name: "Оранжевый",
        hex: "#DD9166",
        description: "Оранжевый цвет стимулирует социальную активность и аппетит, активируя участки мозга, ответственные за коммуникацию.<br><br>Помогает при подавленности, но противопоказан при необходимости сосредоточиться.<br>Его следует использовать в зонах для общения (гостиная, столовая), спортзалах. Но слишком яркие оттенки могут быть навязчивыми."
    },
    {
        name: "Жёлтый",
        hex: "#F7C977",
        description: "Желтый цвет стимулирует умственную деятельность, активизируя работу нервной системы.<br><br>Он вызывает ощущение тепла и оптимизма, но в избытке может привести к умственному переутомлению.<br>Идеален для творчества и обучения, но опасен при тревожности.<br>Его следует использовать на кухне, в столовой, креативных пространствах, чтобы «осветить» темную комнату. Но использование в детских спальнях может мешать сну."
    },
    {
        name: "Чёрный",
        hex: "#606060",
        description: "Черный цвет создает психологический барьер, помогая сконцентрироваться на внутренних переживаниях.<br><br>При длительном воздействии может провоцировать подавленное состояние.<br>Эффективен для кратковременной защиты от внешних воздействий.<br>Его следует использовать как акцент для придания строгости и шика (аксессуары, текст, интерьер), в качестве контраста. Не стоит делать основным цветом в интерьере."
    },
    {
        name: "Зелёный",
        hex: "#BECC96",
        description: "Зеленый цвет исцеляет психику, снижая уровень кортизола.<br><br>Его длинные волны успокаивают нервную систему, восстанавливая душевное равновесие.<br>Лучший выбор для снятия стресса и восстановления сил.<br>Его следует использовать везде, где нужен отдых и релаксация: спальни, гостиные, домашний офис, больницы."
    },
    {
        name: "Бирюзовый",
        hex: "#87CCBE",
        description: "Бирюзовый цвет объединяет успокаивающее действие синего и жизнеутверждающую энергию зеленого.<br><br>Снижает психическое напряжение, облегчая самовыражение.<br>Помогает при коммуникативных трудностях и творческих блоках.<br>Его следует использовать в ванных, спа-зонах, творческих пространствах. Помогает создать ощущение свежести и чистоты."
    },
    {
        name: "Бордовый",
        hex: "#964E4E",
        description: "Бордовый цвет создает ощущение защищенной роскоши, умеренно стимулируя нервную систему.<br><br>Сочетает энергию красного и глубину синего.<br>Помогает сохранять достоинство в стрессовых ситуациях.<br>Его следует использовать в кабинетах, библиотеках, столовых для создания глубокой и элегантной атмосферы."
    },
    {
        name: "Синий",
        hex: "#90A2DD",
        description: "Синий цвет замедляет метаболизм и снижает давление и тревожность, создавая физиологическое ощущение прохлады и покоя.<br><br>Помогает при бессоннице и медитации, но может усилить чувство одиночества.<br>Его следует использовать в спальнях (способствует сну), ванных, офисах для концентрации. Осторожно в столовых (может подавлять аппетит)."
    },
    {
        name: "Фиолетовый",
        hex: "#BC9FE2",
        description: "Фиолетовый цвет балансирует между возбуждением и покоем, активизируя правое полушарие мозга.<br><br>Он стимулирует воображение, но может вызывать внутреннее напряжение. Используй для духовных практик, но ограничь при склонности к депрессии.<br>Его следует использовать в творческих студиях, медитативных пространствах, в декоре для создания атмосферы роскоши и таинственности."
    },
    {
        name: "Розовый",
        hex: "#F9AAAB",
        description: "Розовый цвет снижает агрессию и мышечное напряжение, вызывая выработку эндорфинов.<br><br>Создает иллюзию безопасности, снижая критичность восприятия.<br>Эффективен для кратковременного расслабления.<br>Его следует использовать в спальнях для релаксации, в зонах, где хочется создать мягкую и нежную атмосферу."
    },
    {
        name: "Коричневый",
        hex: "#8B7965",
        description: "Коричневый цвет вызывает чувство защищенности, напоминая о земле и стабильности.<br><br>Замедляет восприятие времени, но может порождать ощущение рутины.<br>Полезен при необходимости 'заземлиться', но ограничь при тоске.<br>Его следует использовать в гостиных, кабинетах, чтобы создать уютную и надежную атмосферу. Отлично сочетается с природными материалами."
    },
    {
        name: "Серый",
        hex: "#CBCBC9",
        description: "Серый цвет снижает эмоциональное напряжение, помогая объективно оценивать ситуацию.<br><br>Однако он подавляет творческие порывы и может привести к апатии.<br>Помогает в аналитической работе, но опасен при низкой мотивации.<br>Его следует использовать в качестве фона в интерьере и дизайне, поскольку он подчеркивает другие цвета. Хорош в офисах и формальной обстановке."
    }
];

// ===============================
// ТЕМЫ С ИЗОБРАЖЕНИЯМИ ЦВЕТОВ
// ===============================

const colorThemes = {
    "КРАСНЫЙ": {
        bgGradient: ['#C98A8A', '#B87375', '#984245'],
        accentColor: '#E27D7D',
        flowerImages: {
            left: 'images/цветы/Красный/левый.png',
            right: 'images/цветы/Красный/правый.png'
        }
    },
    "ОРАНЖЕВЫЙ": {
        bgGradient: ['#FFD7AB', '#FFD7AB', '#E3AE85'],
        accentColor: '#DD9166',
        flowerImages: {
            left: 'images/цветы/Оранжевый/левый.png',
            right: 'images/цветы/Оранжевый/правый.png'
        }
    },
    "ЖЁЛТЫЙ": {
        bgGradient: ['#FAEDCD', '#FAEDC9', '#EDD9A2'],
        accentColor: '#F7C977',
        flowerImages: {
            left: 'images/цветы/Желтый/левый.png',
            right: 'images/цветы/Желтый/правый.png'
        }
    },
    "ЧЁРНЫЙ": {
        bgGradient: ['#626060', '#626060', '#2B2B2B'],
        accentColor: '#606060',
        flowerImages: {
            left: 'images/цветы/Черный/левый.png',
            right: 'images/цветы/Черный/правый.png'
        }
    },
    "ЗЕЛЁНЫЙ": {
        bgGradient: ['#E3E4DE', '#CACFBA', '#7E8C74'],
        accentColor: '#879354',
        flowerImages: {
            left: 'images/цветы/Зеленый/левый.png',
            right: 'images/цветы/Зеленый/правый.png'
        }
    },
    "БИРЮЗОВЫЙ": {
        bgGradient: ['#C0D5D7', '#B3CEC8', '#8EAAAF'],
        accentColor: '#87CCBE',
        flowerImages: {
            left: 'images/цветы/Бирюзовый/левый.png',
            right: 'images/цветы/Бирюзовый/правый.png'
        }
    },
    "БОРДОВЫЙ": {
        bgGradient: ['#B77F83', '#996567', '#673232'],
        accentColor: '#964E4E',
        flowerImages: {
            left: 'images/цветы/Бордовый/левый.png',
            right: 'images/цветы/Бордовый/правый.png'
        }
    },
    "СИНИЙ": {
        bgGradient: ['#E0EAF4', '#D0DEF1', '#A4B8D2'],
        accentColor: '#90A2DD',
        flowerImages: {
            left: 'images/цветы/Синий/левый.png',
            right: 'images/цветы/Синий/правый.png'
        }
    },
    "ФИОЛЕТОВЫЙ": {
        bgGradient: ['#E4C5D3', '#C0A9C0', '#9D86B1'],
        accentColor: '#BC9FE2',
        flowerImages: {
            left: 'images/цветы/Фиолетовый/левый.png',
            right: 'images/цветы/Фиолетовый/правый.png'
        }
    },
    "РОЗОВЫЙ": {
        bgGradient: ['#FBE0DB', '#EABEBD', '#D49A9A'],
        accentColor: '#F9AAAB',
        flowerImages: {
            left: 'images/цветы/Розовый/левый.png',
            right: 'images/цветы/Розовый/правый.png'
        }
    },
    "КОРИЧНЕВЫЙ": {
        bgGradient: ['#AE9B8E', '#A39185', '#90796C'],
        accentColor: '#8B7965',
        flowerImages: {
            left: 'images/цветы/Коричневый/левый.png',
            right: 'images/цветы/Коричневый/правый.png'
        }
    },
    "СЕРЫЙ": {
        bgGradient: ['#AAA5A3', '#8D8A89', '#636161'],
        accentColor: '#CBCBC9',
        flowerImages: {
            left: 'images/цветы/Серый/левый.png',
            right: 'images/цветы/Серый/правый.png'
        }
    }
};

// ===============================
// ФУНКЦИИ ДЛЯ ОБНОВЛЕНИЯ БЛОКОВ И ЦВЕТОВ
// ===============================

// Функция для обновления всех блоков с результатами
function updateAllBlocks(colorIndex) {
    console.log('Обновление всех блоков для цвета:', colors[colorIndex].name);

    // Обновляем заголовок
    const titleElement = document.querySelector('.bigText.leftText');
    if (titleElement) {
        titleElement.textContent = colors[colorIndex].name.toUpperCase() + ',';
        titleElement.style.color = colors[colorIndex].hex;
    }

    // Обновляем описание личности
    const leftBlock = document.querySelector('.leftDescr');
    if (leftBlock && colors[colorIndex]) {
        leftBlock.innerHTML = colors[colorIndex].description;
    }

    // Обновляем описание музыки
    const middleBlock = document.querySelector('.middleDescr');
    if (middleBlock && colorMusic[colorIndex]) {
        middleBlock.innerHTML = colorMusic[colorIndex].description;

        // Удаляем старый аудиоплеер
        const oldPlayer = document.querySelector('.music-player-container');
        if (oldPlayer) {
            oldPlayer.remove();
        }

        // Добавляем новый аудиоплеер
        const audioPlayer = createAudioPlayer(
            colorMusic[colorIndex].audio,
            colorMusic[colorIndex].hex,
            colors[colorIndex].name
        );

        middleBlock.parentNode.appendChild(audioPlayer);
    }

    // Обновляем описание влияния
    const rightBlock = document.querySelector('.rightDescr');
    if (rightBlock && colorEffect[colorIndex]) {
        rightBlock.innerHTML = colorEffect[colorIndex].description;
    }

    // ВСЕГДА применяем тему из результата теста или выбранного цвета
    applyBackgroundFromColor(colorIndex);

    // Обновляем цветы
    updateFlowersForColor(colorIndex);

    console.log('Все блоки обновлены');
}

// Функция для применения фона из выбранного цвета
function applyBackgroundFromColor(colorIndex) {
    // Всегда меняем фон на основе выбранного цвета
    if (colorIndex >= 0 && colorIndex < colors.length) {
        const color = colors[colorIndex];
        const themeColor = colorThemes[color.name.toUpperCase()];

        if (themeColor) {
            document.body.style.background =
                `linear-gradient(${themeColor.bgGradient[0]}, ${themeColor.bgGradient[1]}, ${themeColor.bgGradient[2]})`;

            console.log(`Фон изменен на тему: ${color.name}`);
        }
    }
}

// Функция для обновления цветов
function updateFlowersForColor(colorIndex) {
    if (colorIndex >= 0 && colorIndex < colors.length) {
        const color = colors[colorIndex];
        const themeColor = colorThemes[color.name.toUpperCase()];

        if (themeColor && themeColor.flowerImages) {
            console.log(`Обновление цветов для цвета: ${color.name}`);

            // Обновляем левый цветок
            const leftFlower = document.querySelector('.redFlow');
            if (leftFlower && themeColor.flowerImages.left) {
                console.log(`Загрузка левого цветка: ${themeColor.flowerImages.left}`);
                const tempImg = new Image();
                tempImg.onload = function () {
                    leftFlower.style.backgroundImage = `url('${themeColor.flowerImages.left}')`;
                    leftFlower.style.backgroundSize = 'contain';
                    leftFlower.style.backgroundRepeat = 'no-repeat';
                    leftFlower.style.backgroundPosition = 'center';
                    console.log('Левый цветок обновлен');
                };
                tempImg.onerror = function () {
                    console.error(`Не удалось загрузить левый цветок: ${themeColor.flowerImages.left}`);
                };
                tempImg.src = themeColor.flowerImages.left;
            }

            // Обновляем правый цветок
            const rightFlower = document.querySelector('.redFlowRig');
            if (rightFlower && themeColor.flowerImages.right) {
                console.log(`Загрузка правого цветка: ${themeColor.flowerImages.right}`);
                const tempImg = new Image();
                tempImg.onload = function () {
                    rightFlower.style.backgroundImage = `url('${themeColor.flowerImages.right}')`;
                    rightFlower.style.backgroundSize = 'contain';
                    rightFlower.style.backgroundRepeat = 'no-repeat';
                    rightFlower.style.backgroundPosition = 'center';
                    console.log('Правый цветок обновлен');
                };
                tempImg.onerror = function () {
                    console.error(`Не удалось загрузить правый цветок: ${themeColor.flowerImages.right}`);
                };
                tempImg.src = themeColor.flowerImages.right;
            }
        }
    }
}

// ===============================
// ВЫПАДАЮЩЕЕ МЕНЮ
// ===============================

// Функция для инициализации выпадающего меню
function initResultsDropdown() {
    console.log('Начало инициализации выпадающего меню...');

    const allResultsLink = document.getElementById('all-results-link');
    const resultsDropdown = document.getElementById('results-dropdown');

    console.log('Элементы меню:', {
        allResultsLink: allResultsLink,
        resultsDropdown: resultsDropdown,
        dropdownExists: !!resultsDropdown
    });

    if (!allResultsLink || !resultsDropdown) {
        console.error('Элементы выпадающего меню не найдены!');
        return;
    }

    setupNavLinks();

    setupDropdownPositioning(allResultsLink, resultsDropdown);

    setupDropdownEventHandlers(allResultsLink, resultsDropdown);

    populateDropdownOptions(resultsDropdown);

    document.addEventListener('click', function (e) {
        if (!allResultsLink.contains(e.target) && !resultsDropdown.contains(e.target)) {
            resultsDropdown.style.display = 'none';
            resultsDropdown.classList.remove('show');
        }
    });

    console.log('Выпадающее меню инициализировано успешно');
}

// Настройка ссылок навигации
function setupNavLinks() {
    const navLinks = document.querySelectorAll('.link-text');
    console.log('Найдено ссылок навигации:', navLinks.length);

    navLinks.forEach(link => {
        const originalColor = link.style.color || '#42383C';

        link.style.transition = 'color 0.3s ease, transform 0.3s ease';

        link.addEventListener('mouseenter', function () {
            this.style.color = '#736357';
            this.style.transform = 'translateY(-3px)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.color = originalColor;
            this.style.transform = 'translateY(0)';
        });
    });
}

// Настройка позиционирования dropdown
function setupDropdownPositioning(allResultsLink, resultsDropdown) {
    const parentLi = allResultsLink.closest('li');
    if (parentLi) {
        parentLi.style.position = 'relative';
    }
}

// Настройка обработчиков событий dropdown
function setupDropdownEventHandlers(allResultsLink, resultsDropdown) {
    allResultsLink.addEventListener('mouseenter', function () {
        console.log('Наведение на ссылку "Все результаты"');
        showDropdown(resultsDropdown);
    });

    allResultsLink.addEventListener('mouseleave', function () {
        setTimeout(() => {
            if (!resultsDropdown.matches(':hover')) {
                hideDropdown(resultsDropdown);
            }
        }, 200);
    });

    resultsDropdown.addEventListener('mouseenter', function () {
        showDropdown(resultsDropdown);
    });

    resultsDropdown.addEventListener('mouseleave', function () {
        setTimeout(() => {
            hideDropdown(resultsDropdown);
        }, 200);
    });

    allResultsLink.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Клик по ссылке "Все результаты"');

        if (resultsDropdown.style.display === 'block' && resultsDropdown.classList.contains('show')) {
            hideDropdown(resultsDropdown);
        } else {
            showDropdown(resultsDropdown);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideDropdown(resultsDropdown);
        }
    });
}

// Показать dropdown
function showDropdown(dropdown) {
    dropdown.style.display = 'block';
    setTimeout(() => {
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
        dropdown.classList.add('show');
    }, 10);
}

// Скрыть dropdown
function hideDropdown(dropdown) {
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        if (parseFloat(dropdown.style.opacity) === 0) {
            dropdown.style.display = 'none';
            dropdown.classList.remove('show');
        }
    }, 300);
}

// Заполнение dropdown опциями цветов (без подчеркивания и фиолетового цвета)
function populateDropdownOptions(dropdown) {
    dropdown.innerHTML = '';

    colors.forEach((color, index) => {
        const option = document.createElement('a');
        option.href = '#';
        option.className = 'results-option';
        option.setAttribute('data-color', index);

        option.style.textDecoration = 'none';
        option.style.color = '#42383C';

        // Определяем текущий цвет
        const currentColorIndex = localStorage.getItem('testResult');
        if (currentColorIndex && parseInt(currentColorIndex) === index) {
            option.style.backgroundColor = '#f0f0f0';
            option.style.fontWeight = 'bold';
        }

        const colorIndicator = document.createElement('span');
        colorIndicator.style.cssText = `
            display: inline-block;
            width: 12px;
            height: 12px;
            background-color: ${color.hex};
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle;
        `;

        option.appendChild(colorIndicator);
        option.appendChild(document.createTextNode(color.name));

        option.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Выбран цвет:', color.name, 'индекс:', index);

            // Сохраняем выбранный цвет как результат теста
            localStorage.setItem('testResult', index);
            
            // Очищаем тему с главной страницы, чтобы не мешала
            localStorage.removeItem('selectedTheme');
            localStorage.removeItem('themeData');

            // Обновляем блоки
            updateAllBlocks(index);

            hideDropdown(dropdown);

            window.scrollTo(0, 0);

            // Показываем уведомление
            showNotification(`Выбран цвет: ${color.name}`, 'info');
        });

        option.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#f5f5f5';
            this.style.color = '#42383C';
        });

        option.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
            this.style.color = '#42383C';
        });

        dropdown.appendChild(option);
    });

    console.log('Dropdown заполнен опциями цветов:', colors.length);
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

// Функция для создания и управления уведомлениями
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ff6b6b' : '#736357'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Функция для проверки поддержки Web Audio API
function checkAudioSupport() {
    return !!(window.AudioContext || window.webkitAudioContext);
}

// Функция для дебага - показывает состояние всех элементов
function debugPageState() {
    console.log('=== DEBUG PAGE STATE ===');
    console.log('testResult:', localStorage.getItem('testResult'));
    console.log('themeData:', localStorage.getItem('themeData'));
    console.log('themeSynced:', localStorage.getItem('themeSynced'));
    console.log('selectedTheme:', localStorage.getItem('selectedTheme'));
    console.log('backgroundMusicState:', localStorage.getItem('backgroundMusicState'));

    const elements = {
        'allResultsLink': document.getElementById('all-results-link'),
        'resultsDropdown': document.getElementById('results-dropdown'),
        'nextCategoryBtn': document.getElementById('next-category-btn'),
        'bigText': document.querySelector('.bigText.leftText'),
        'resText': document.querySelector('.resText'),
        'leftDescr': document.querySelector('.leftDescr'),
        'middleDescr': document.querySelector('.middleDescr'),
        'rightDescr': document.querySelector('.rightDescr'),
        'floatingMusicButton': document.getElementById('floating-music-button'),
        'audioPlayer': document.querySelector('.color-audio-player'),
        'leftFlower': document.querySelector('.redFlow'),
        'rightFlower': document.querySelector('.redFlowRig')
    };

    console.log('Elements found:', Object.entries(elements).filter(([name, el]) => el).map(([name]) => name));
    console.log('=== END DEBUG ===');
}

// Экспортируем функции для отладки
window.debugPageState = debugPageState;

console.log('Скрипт results.js загружен и готов к работе');