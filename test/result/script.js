// Прокрутка наверх при загрузке страницы
window.scrollTo(0, 0);

// Основная функция при загрузке DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, инициализация страницы результатов...');

    // Устанавливаем масштаб 75%
    document.body.style.zoom = "0.75";

    // Инициализируем выпадающее меню ПЕРВЫМ
    console.log('Инициализация выпадающего меню...');
    initResultsDropdown();

    // Загружаем результат теста
    console.log('Загрузка результата теста...');
    const resultColorIndex = localStorage.getItem('testResult');

    // Применяем сохраненную тему
    console.log('Применение сохраненной темы...');
    applyThemeToResults();

    // Если результат есть - показываем его
    if (resultColorIndex !== null) {
        const index = parseInt(resultColorIndex);
        console.log('Найден результат:', index);
        if (!isNaN(index) && index >= 0 && index < colors.length) {
            showColorResult(index);
            initCategorySwitcher();
        } else {
            showErrorResult();
        }
    } else {
        showErrorResult();
    }

    // Инициализируем музыку с задержкой
    setTimeout(() => {
        console.log('Инициализация фоновой музыки...');
        if (window.backgroundMusic) {
            window.backgroundMusic.init();
        }
    }, 500);
});

// Функция показа ошибки при отсутствии результата
function showErrorResult() {
    console.log('Результат не найден, показываем сообщение об ошибке');
    const resultContent = document.getElementById('result-content');
    if (resultContent) {
        resultContent.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Результат не найден</h2>
                <p>Пройдите тест, чтобы увидеть ваш результат.</p>
                <a href="index.html" style="color: #736357; text-decoration: underline;">Вернуться к тесту</a>
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
                    this.playTrack(state.track, true);
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
        musicButton.setAttribute('aria-label', 'Управление фоновой музыкой');

        // Создаем изображение для кнопки
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

        // Анимация при наведении
        musicButton.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        });

        musicButton.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });

        // Клик по кнопке
        musicButton.addEventListener('click', () => {
            this.handleMusicButtonClick(musicButton);
        });

        document.body.appendChild(musicButton);

        // Обновляем иконку при загрузке, если музыка уже играет
        setTimeout(() => {
            if (this.audio && !this.audio.paused) {
                this.updateButtonIcon(musicButton, false);
            }
        }, 500);
    },

    // Обработка клика по кнопке музыки
    handleMusicButtonClick: function (button) {
        if (!this.userInteracted) {
            this.userInteracted = true;
            this.startMusic();
            this.updateButtonIcon(button, false);
        } else {
            this.togglePlayback();
            this.updateButtonIcon(button, this.audio.paused);
        }

        // Анимация нажатия
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    },

    // Обновление иконки кнопки
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

    // Начало воспроизведения музыки
    startMusic: function () {
        console.log('Запуск музыки на странице теста...');

        const savedTrack = this.getSavedTrack();

        if (savedTrack && this.tracks.includes(savedTrack)) {
            this.playTrack(savedTrack, true);
        } else {
            this.playRandomTrack();
        }

        // Обновляем иконку плавающей кнопки
        const musicButton = document.getElementById('floating-music-button');
        if (musicButton) {
            this.updateButtonIcon(musicButton, false);
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
            }
        }

        // Обработчики событий
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

        // Пытаемся воспроизвести
        this.playAudio();
    },

    // Обновление иконки кнопки музыки
    updateMusicButtonIcon: function (isPaused) {
        const musicButton = document.getElementById('floating-music-button');
        if (musicButton) {
            this.updateButtonIcon(musicButton, isPaused);
        }
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

// ВЫ КАК ЛИЧНОСТЬ
const colors = [
    {
        name: "Красный",
        hex: "#E27D7D",
        description: "Вы - человек действия, энергии и страсти. Ваша натура сильная, решительная и напористая. Вы предпочитаете прямой подход и не боитесь брать на себя ответственность."
    },
    {
        name: "Оранжевый",
        hex: "#DD9166",
        description: "Вы - человек приключений, творчества и энтузиазма. Ваша натура энергичная, общительная и жизнерадостная. Вы любите новые впечатления и вдохновляете окружающих."
    },
    {
        name: "Жёлтый",
        hex: "#F7C977",
        description: "Вы - человек оптимизма, радости и интеллекта. Ваша натура светлая, позитивная и вдохновляющая. Вы видите возможности там, где другие видят проблемы."
    },
    {
        name: "Чёрный",
        hex: "#606060",
        description: "Вы - человек тайны, элегантности и силы. Ваша натура глубокая, загадочная и мощная. Вы предпочитаете глубину поверхностности и цените настоящую суть вещей."
    },
    {
        name: "Зелёный",
        hex: "#BECC96",
        description: "Вы - человек гармонии, роста и заботы. Ваша натура уравновешенная, сострадательная и стабильная. Вы стремитесь к балансу во всём и помогаете другим найти свой путь."
    },
    {
        name: "Бирюзовый",
        hex: "#87CCBE",
        description: "Вы - человек спокойствия, ясности и коммуникации. Ваша натура гармоничная, интуитивная и проницательная. Вы умеете слушать и находить общий язык с разными людьми."
    },
    {
        name: "Бордовый",
        hex: "#964E4E",
        description: "Вы - человек страсти, элегантности и глубины. Ваша натура утонченная, страстная и загадочная. Вы сочетаете в себе силу и изысканность, создавая вокруг себя атмосферу роскоши и таинственности."
    },
    {
        name: "Синий",
        hex: "#90A2DD",
        description: "Вы - человек глубины, стабильности и мудрости. Ваша натура серьёзная, надёжная и интеллектуальная. Вы предпочитаете тщательно обдумывать решения и действовать обоснованно."
    },
    {
        name: "Фиолетовый",
        hex: "#BC9FE2",
        description: "Вы - человек творчества, духовности и интуиции. Ваша натура чувствительная, артистичная и мечтательная. Вы видите мир через призму воображения и вдохновения."
    },
    {
        name: "Розовый",
        hex: "#F9AAAB",
        description: "Вы - человек любви, нежности и сострадания. Ваша натура чувствительная, заботливая и романтичная. Вы цените эмоциональную близость и создаёте уют вокруг себя."
    },
    {
        name: "Коричневый",
        hex: "#8B7965",
        description: "Вы - человек надёжности, стабильности и практичности. Ваша натура устойчивая, ответственная и земная. Вы цените традиции и создаёте прочный фундамент для себя и близких."
    },
    {
        name: "Серый",
        hex: "#CBCBC9",
        description: "Вы - человек баланса, нейтральности и компромисса. Ваша натура спокойная, практичная и дипломатичная. Вы умеете находить золотую середину и объективно оценивать ситуацию."
    }
];

// КАК ВЫПАВШИЙ ЦВЕТ ВЛИЯЕТ НА ЧЕЛОВЕКА
const colorEffect = [
    {
        name: "Красный",
        hex: "#E27D7D",
        description: "Красный цвет будит страсть и волю к власти, заставляя действовать решительно. Он учащает пульс и повышает артериальное давление, побуждая к немедленным действиям. <br> Применяй его, когда нужен прорыв, но избегай в состоянии гнева или стресса. <br>  Его следует использовать для привлечения внимания и в зонах активности (спортзал), но желательно избегать там, где нужен покой: например, в спальнях и зонах отдыха."
    },
    {
        name: "Оранжевый",
        hex: "#DD9166",
        description: "Оранжевый цвет стимулирует социальную активность и аппетит, активируя участки мозга, ответственные за коммуникацию. <br> Помогает при подавленности, но противопоказан при необходимости сосредоточиться. <br> Его следует использовать в зонах для общения (гостиная, столовая), спортзалах. Но слишком яркие оттенки могут быть навязчивыми. "
    },
    {
        name: "Жёлтый",
        hex: "#F7C977",
        description: "Желтый цвет стимулирует умственную деятельность, активизируя работу нервной системы. Он вызывает ощущение тепла и оптимизма, но в избытке может привести к умственному переутомлению. <br> Идеален для творчества и обучения, но опасен при тревожности. <br> Его следует использовать на кухне, в столовой, креативных пространствах, чтобы «осветить» темную комнату. Но использование в детских спальнях может мешать сну."
    },
    {
        name: "Чёрный",
        hex: "#606060",
        description: "Черный цвет создает психологический барьер, помогая сконцентрироваться на внутренних переживаниях. При длительном воздействии может провоцировать подавленное состояние.<br>Эффективен для кратковременной защиты от внешних воздействий.<br> Его следует использовать как акцент для придания строгости и шика (аксессуары, текст, интерьер), в качестве контраста. Не стоит делать основным цветом в интерьере."
    },
    {
        name: "Зелёный",
        hex: "#BECC96",
        description: "Зеленый цвет исцеляет психику, снижая уровень кортизола. Его длинные волны успокаивают нервную систему, восстанавливая душевное равновесие. <br>Лучший выбор для снятия стресса и восстановления сил. <br> Его следует использовать везде, где нужен отдых и релаксация: спальни, гостиные, домашний офис, больницы."
    },
    {
        name: "Бирюзовый",
        hex: "#87CCBE",
        description: "Бирюзовый цвет объединяет успокаивающее действие синего и жизнеутверждающую энергию зеленого. Снижает психическое напряжение, облегчая самовыражение. <br>Помогает при коммуникативных трудностях и творческих блоках. <br> Его следует использовать в ванных, спа-зонах, творческих пространствах. Помогает создать ощущение свежести и чистоты."
    },
    {
        name: "Бордовый",
        hex: "#964E4E",
        description: "Бордовый цвет создает ощущение защищенной роскоши, умеренно стимулируя нервную систему. Сочетает энергию красного и глубину синего. <br>Помогает сохранять достоинство в стрессовых ситуациях. <br> Его следует использовать в кабинетах, библиотеках, столовых для создания глубокой и элегантной атмосферы."
    },
    {
        name: "Синий",
        hex: "#90A2DD",
        description: "Синий цвет замедляет метаболизм и снижает давление и тревожность, создавая физиологическое ощущение прохлады и покоя. <br>Помогает при бессоннице и медитации, но может усилить чувство одиночества. <br> Его следует использовать в спальнях (способствует сну), ванных, офисах для концентрации. Осторожно в столовых (может подавлять аппетит)."
    },
    {
        name: "Фиолетовый",
        hex: "#BC9FE2",
        description: "Фиолетовый цвет балансирует между возбуждением и покоем, активизируя правое полушарие мозга. <br>Он стимулирует воображение, но может вызывать внутреннее напряжение. Используй для духовных практик, но ограничь при склонности к депрессии. <br> Его следует использовать в творческих студиях, медитативных пространствах, в декоре для создания атмосферы роскоши и таинственности."
    },
    {
        name: "Розовый",
        hex: "#F9AAAB",
        description: "Розовый цвет снижает агрессию и мышечное напряжение, вызывая выработку эндорфинов. Создает иллюзию безопасности, снижая критичность восприятия.<br> Эффективен для кратковременного расслабления. <br>Его следует использовать в спальнях для релаксации, в зонах, где хочется создать мягкую и нежную атмосферу."
    },
    {
        name: "Коричневый",
        hex: "#8B7965",
        description: "Коричневый цвет вызывает чувство защищенности, напоминая о земле и стабильности. Замедляет восприятие времени, но может порождать ощущение рутины. <br>Полезен при необходимости ''заземлиться'', но ограничь при тоске. <br> Его следует использовать в гостиных, кабинетах, чтобы создать уютную и надежную атмосферу. Отлично сочетается с природными материалами."
    },
    {
        name: "Серый",
        hex: "#CBCBC9",
        description: "Серый цвет снижает эмоциональное напряжение, помогая объективно оценивать ситуацию. Однако он подавляет творческие порывы и может привести к апатии. <br>Помогает в аналитической работе, но опасен при низкой мотивации. <br>Его следует использовать в качестве фона в интерьере и дизайне, поскольку он подчеркивает другие цвета. Хорош в офисах и формальной обстановке."
    }
];

// ВАШ ЦВЕТ КАК МУЗЫКА
const colorMusic = [
    {
        name: "Красный",
        hex: "#E27D7D",
        description: "Рок-н-ролл или Хард-рок идеально ассоциируется с красным цветом по мнению многих людей.<br><br> Данный жанр, как и красный цвет, страстный, агрессивный, энергичный и властный. <br>Идеально передает драйв и мощь рок-музыки.",
        audio: "music/Красный/ACDC_-_Back_In_Black_47830042.mp3"
    },
    {
        name: "Оранжевый",
        hex: "#DD9166",
        description: "Фанк или Сёрф-рок ассоциируется у многих людей именно с оранжевым цветом. <br><br>Этот жанр такой же энергичный, жизнерадостный, теплый и солнечный, как и сам цвет",
        audio: "music/Оранжевый/Dick_Dale_His_Del-Tones_-_Misirlou_48018731.mp3"
    },
    {
        name: "Жёлтый",
        hex: "#F7C977",
        description: "Поп-музыка ассоциируется у людей именно с желтым цветом. <br><br> Этот жанр такой же солнечный, оптимистичный, легкий и притягательный, как самый запоминающийся поп-хит.",
        audio: "music/Желтый/M_-_Pop_Muzik1979_63090739.mp3"
    },
    {
        name: "Чёрный",
        hex: "#606060",
        description: "Черный цвет ассоциируется у многих с Хэви-метал или Готик-роком.<br><br> Этот жанр такой же мощный, агрессивный, таинственный и эпатажный.<br> Классический цвет бунта, тьмы и тяжести.",
        audio: "music/Черный/Ozzy_Osbourne_-_No_More_Tears_47874811.mp3"
    },
    {
        name: "Зелёный",
        hex: "#BECC96",
        description: "Зеленый цвет ассоциируется у многих с Регги.<br><br> Этот жанр такой же природный, расслабленный, жизнеутверждающий и связанный с корнями.<br> Прямые ассоциации с Растафарианством",
        audio: "music/Зеленый/Ini_Kamoze_-_World-A-Music_57250823.mp3"
    },
    {
        name: "Бирюзовый",
        hex: "#87CCBE",
        description: "Бирюзовый у многих людей ассоциируется с жанрами Эмбиент или Чиллаут.<br><br> Они такие же спокойные, прохладные, медитативные и прозрачные.<br> Напоминают о воде и небе, создавая расслабляющую атмосферу.",
        audio: "music/Бирюзовый/Home_-_Resonance_75115125.mp3"
    },
    {
        name: "Бордовый",
        hex: "#964E4E",
        description: "Бордовый у многих людей ассоциируется с Джазом (особенно в стиле ''лаунж'') или Соул.<br><br> Эти жанры такие же глубокие, утонченные, чувственные и немного таинственные.<br> Ассоциируются с атмосферой джаз-бара и бархатным вокалом соула.",
        audio: "music/Бордовый/Dave_Brubeck_-_Take_Five_47937131.mp3"
    },
    {
        name: "Синий",
        hex: "#90A2DD",
        description: "Синий цвет ассоциируется у многих с Блюзом.<br><br> Этот жанр такой же глубокий, меланхоличный, спокойный и душевный.<br> Самая прямая ассоциация по названию и настроению.",
        audio: "music/Синий/Carey_Bell_-_So_Hard_To_Leave_You_Alone_(musmore.org) (1).mp3"
    },
    {
        name: "Фиолетовый",
        hex: "#BC9FE2",
        description: "Фиолетовый ассоциируется у многих с R&B или Нео-соул.<br><br> Эти жанры такие же элегантные, чувственные, мистические и творческие.<br> Передают меланхолию, роскошь и глубину современных ритмов.",
        audio: "music/Фиолетовый/702_-_Get_It_Together_69372200.mp3"
    },
    {
        name: "Розовый",
        hex: "#F9AAAB",
        description: "Розовый ассоциируется у многих с К-поп или Бабблгам-поп.<br><br> Эти жанры идеально передают атмосферу розового цвета, которому присущи игривость, сладость, романтичность и яркость.<br> Воплощение нежности и гламура.",
        audio: "music/Розовый/NewJeans_-_New_Jeans_76302903.mp3"
    },
    {
        name: "Коричневый",
        hex: "#8B7965",
        description: "Коричневый цвет ассоциируется с Фолком или Кантри.<br><br> Эти жанры такие же землистые, акустические, теплые и традиционные.<br> Ассоциируются с деревом гитар, кожей и природой.",
        audio: "music/Коричневый/The_Animals_-_The_House_Of_The_Rising_Sun_48169294.mp3"
    },
    {
        name: "Серый",
        hex: "#CBCBC9",
        description: "Серый у многих ассоциируется с Пост-панком или индастриалом.<br><br> Эти жанры такие же холодные, мрачные, урбанистические и минималистичные.<br> Передают чувство отчуждения и индустриальную эстетику.",
        audio: "music/Серый/Molchat_Doma_-_Kletka_58595718.mp3"
    }
];

// Текущая категория результата
let currentCategory = 'personality'; // 'personality', 'influence', 'music'

// ===============================
// ОСНОВНЫЕ ФУНКЦИИ СТРАНИЦЫ РЕЗУЛЬТАТОВ
// ===============================

// Функция для инициализации переключения категорий
function initCategorySwitcher() {
    console.log('Инициализация переключателя категорий...');

    const nextBtn = document.getElementById('next-category-btn');

    if (nextBtn) {
        // Удаляем старые обработчики событий
        nextBtn.removeEventListener('click', switchToNextCategory);

        // Добавляем новый обработчик
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Кнопка "Далее" нажата');
            switchToNextCategory();
        });

        // Добавляем анимацию для кнопки
        nextBtn.style.transition = 'all 0.3s ease';
        nextBtn.style.cursor = 'pointer';

        nextBtn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(5px)';
        });

        nextBtn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
        });

        console.log('Кнопка категорий инициализирована:', nextBtn);
    } else {
        console.error('Кнопка переключения категорий не найдена!');
    }

    updateCategoryDisplay();
}

// Функция для переключения на следующую категорию
function switchToNextCategory() {
    console.log('Переключение категории...');

    const categories = ['personality', 'influence', 'music'];
    const currentIndex = categories.indexOf(currentCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    currentCategory = categories[nextIndex];

    console.log('Новая категория:', currentCategory);

    updateCategoryDisplay();
    window.scrollTo(0, 0);
}

// Функция для обновления отображения категории
function updateCategoryDisplay() {
    console.log('Обновление отображения категории:', currentCategory);

    const resultColorIndex = parseInt(localStorage.getItem('testResult'));
    if (isNaN(resultColorIndex) || resultColorIndex < 0 || resultColorIndex >= colors.length) {
        console.error('Неверный индекс цвета:', resultColorIndex);
        return;
    }

    const colorData = colors[resultColorIndex];

    // Обновляем заголовок блока
    const titleElement = document.querySelector('.bigText.leftText');
    if (titleElement) {
        titleElement.textContent = colorData.name.toUpperCase();

        let titleColor = '';
        switch (currentCategory) {
            case 'personality':
                titleColor = colorData.hex;
                break;
            case 'influence':
                titleColor = colorEffect[resultColorIndex].hex;
                break;
            case 'music':
                titleColor = colorMusic[resultColorIndex].hex;
                break;
        }
        titleElement.style.color = titleColor;
        console.log('Заголовок обновлен:', colorData.name);
    }

    // Обновляем описание
    const descriptionElement = document.querySelector('.resText');
    if (descriptionElement) {
        let descriptionText = '';

        switch (currentCategory) {
            case 'personality':
                descriptionText = colorData.description;
                break;
            case 'influence':
                descriptionText = colorEffect[resultColorIndex].description;
                break;
            case 'music':
                descriptionText = colorMusic[resultColorIndex].description;
                break;
        }

        descriptionElement.innerHTML = descriptionText;
        console.log('Описание обновлено');

        // Управляем аудиоплеером
        updateAudioPlayer(resultColorIndex);
    }

    // Обновляем текст кнопки
    updateNextButtonText();

    console.log('Отображение категории обновлено');
}

// Функция для обновления аудиоплеера
function updateAudioPlayer(colorIndex) {
    console.log('Обновление аудиоплеера для категории:', currentCategory);

    // Удаляем старый аудиоплеер, если он есть
    const oldPlayer = document.getElementById('audio-player-container');
    if (oldPlayer) {
        oldPlayer.remove();
        console.log('Старый аудиоплеер удален');
    }

    // Добавляем новый аудиоплеер только для категории музыки
    if (currentCategory === 'music' && colorMusic[colorIndex].audio) {
        console.log('Добавляем аудиоплеер для музыки');
        addAudioPlayer(colorMusic[colorIndex].audio, colorIndex);
    }
}

// Функция для добавления аудиоплеера
function addAudioPlayer(audioPath, colorIndex) {
    console.log('Добавление аудиоплеера:', audioPath);

    const musicSection = document.querySelector('.resText')?.parentElement;

    if (!musicSection) {
        console.error('Секция для аудиоплеера не найдена');
        return;
    }

    // Получаем текущий цвет для категории музыки
    const currentColor = colorMusic[colorIndex]?.hex || '#CBCBC9';
    const isDarkColor = currentColor === "#606060" ||
        currentColor === "#964E4E" ||
        currentColor === "#8B7965";

    // Создаем контейнер для плеера
    const playerContainer = document.createElement('div');
    playerContainer.id = 'audio-player-container';
    playerContainer.style.cssText = `
        margin-top: 50px;
        text-align: center;
        padding: 20px 0;
    `;

    playerContainer.innerHTML = `
        <audio id="music-player" controls style="width: 100%; max-width: 300px; margin: 0 auto;">
            <source src="${audioPath}" type="audio/mp3">
            Ваш браузер не поддерживает аудио элементы.
        </audio>
    `;

    musicSection.appendChild(playerContainer);

    // Настраиваем стили аудиоплеера
    setTimeout(() => {
        const audioElement = document.getElementById('music-player');
        if (audioElement) {
            audioElement.style.borderRadius = '30px';
            audioElement.style.backgroundColor = currentColor;

            if (isDarkColor) {
                // Для темных цветов делаем контрастные элементы
                audioElement.style.color = 'white';
            }

            // Добавляем обработчик ошибок
            audioElement.addEventListener('error', function (e) {
                console.error('Ошибка загрузки аудио:', e);
                playerContainer.innerHTML = `
                    <p style="color: #ff6b6b; font-size: 14px;">
                        Не удалось загрузить аудио. Проверьте путь к файлу.
                    </p>
                `;
            });

            // Добавляем обработчик успешной загрузки
            audioElement.addEventListener('loadeddata', function () {
                console.log('Аудиофайл успешно загружен');
            });
        }
    }, 100);

    console.log('Аудиоплеер добавлен');
}

// Основная функция для показа результата
function showColorResult(colorIndex) {
    console.log('Показать результат для цвета:', colorIndex);

    if (colorIndex < 0 || colorIndex >= colors.length) {
        console.error('Неверный индекс цвета:', colorIndex);
        return;
    }

    // Сохраняем индекс цвета
    localStorage.setItem('testResult', colorIndex);

    // Показываем первую категорию
    currentCategory = 'personality';
    updateCategoryDisplay();

    // Прокручиваем наверх
    window.scrollTo(0, 0);

    console.log('Результат показан для цвета:', colors[colorIndex].name);
}

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

    // Сначала настраиваем стили для ссылок навигации
    setupNavLinks();

    // Настраиваем позиционирование
    setupDropdownPositioning(allResultsLink, resultsDropdown);

    // Добавляем обработчики событий
    setupDropdownEventHandlers(allResultsLink, resultsDropdown);

    // Заполняем dropdown опциями цветов
    populateDropdownOptions(resultsDropdown);

    // Добавляем обработчик клика по документу
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
    // Делаем родительский элемент относительно позиционированным
    const parentLi = allResultsLink.closest('li');
    if (parentLi) {
        parentLi.style.position = 'relative';
    }

    // Настраиваем стили dropdown
    resultsDropdown.style.position = 'absolute';
    resultsDropdown.style.top = '100%';
    resultsDropdown.style.left = '50';
    resultsDropdown.style.zIndex = '1000';
    resultsDropdown.style.display = 'none';
    resultsDropdown.style.opacity = '0';
    resultsDropdown.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    resultsDropdown.style.transform = 'translateY(-10px)';
    resultsDropdown.style.background = 'white';
    resultsDropdown.style.border = '1px solid #ddd';
    resultsDropdown.style.borderRadius = '8px';
    resultsDropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    resultsDropdown.style.minWidth = '200px';
    resultsDropdown.style.padding = '8px 0';
    resultsDropdown.style.marginTop = '5px';
}

// Настройка обработчиков событий dropdown
function setupDropdownEventHandlers(allResultsLink, resultsDropdown) {
    // Открытие меню при наведении
    allResultsLink.addEventListener('mouseenter', function () {
        console.log('Наведение на ссылку "Все результаты"');
        showDropdown(resultsDropdown);
    });

    // Закрытие меню при уходе курсора с ссылки
    allResultsLink.addEventListener('mouseleave', function () {
        setTimeout(() => {
            if (!resultsDropdown.matches(':hover')) {
                hideDropdown(resultsDropdown);
            }
        }, 200);
    });

    // Управление меню при наведении на dropdown
    resultsDropdown.addEventListener('mouseenter', function () {
        showDropdown(resultsDropdown);
    });

    resultsDropdown.addEventListener('mouseleave', function () {
        setTimeout(() => {
            hideDropdown(resultsDropdown);
        }, 200);
    });

    // Обработка клика по ссылке
    allResultsLink.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Клик по ссылке "Все результаты"');

        if (resultsDropdown.style.display === 'block' && resultsDropdown.classList.contains('show')) {
            hideDropdown(resultsDropdown);
        } else {
            showDropdown(resultsDropdown);
        }
    });

    // Закрытие меню при нажатии Escape
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

// Заполнение dropdown опциями цветов
function populateDropdownOptions(dropdown) {
    // Очищаем dropdown перед заполнением
    dropdown.innerHTML = '';

    colors.forEach((color, index) => {
        const option = document.createElement('a');
        option.href = '#';
        option.className = 'results-option';
        option.setAttribute('data-color', index);
        option.style.cssText = `
            display: block;
            padding: 10px 20px;
            text-decoration: none;
            color: #42383C;
            transition: background-color 0.2s;
            cursor: pointer;
            font-size: 14px;
        `;

        // Добавляем цветной индикатор
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
            showColorResult(index);
            hideDropdown(dropdown);
        });

        // Анимация при наведении
        option.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#f5f5f5';
        });

        option.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
        });

        dropdown.appendChild(option);
    });

    console.log('Dropdown заполнен опциями цветов:', colors.length);
}


// ТЕМЫ

// Применяем сохраненную тему на странице результатов
function applyThemeToResults() {
    console.log('Применение темы к странице результатов...');

    const savedTheme = localStorage.getItem('selectedTheme');
    const savedThemeData = localStorage.getItem('themeData');

    if (savedTheme && savedThemeData) {
        try {
            const theme = JSON.parse(savedThemeData);
            console.log('Тема загружена:', theme);

            // Применяем тему к body
            document.body.style.background =
                `linear-gradient(${theme.bgGradient[0]}, ${theme.bgGradient[1]}, ${theme.bgGradient[2]})`;

            // Применяем тему к текстовым элементам
            const textElements = document.querySelectorAll(
                '.bigText, .resText, .next-category-btn, .link-text, .results-option'
            );

            textElements.forEach(el => {
                if (el) {
                    el.style.color = theme.textColor;
                }
            });
            // Для кнопки "Далее" сохраняем белый фон и заданный цвет текста
            const nextBtn = document.getElementById('next-category-btn');
            if (nextBtn) {
                nextBtn.style.backgroundColor = '#FFFFFF !important';
                nextBtn.style.color = '#42383C !important';
                nextBtn.style.border = '2px solid #736357 !important';

                // Для span внутри кнопки
                const buttonTextSpan = nextBtn.querySelector('.button-text');
                if (buttonTextSpan) {
                    buttonTextSpan.style.color = '#42383C !important';
                }
            }
            console.log('Тема применена успешно');
        } catch (e) {
            console.error('Ошибка при применении темы:', e);
        }
    } else {
        console.log('Тема не найдена в localStorage');
    }
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
    console.log('currentCategory:', currentCategory);
    console.log('testResult:', localStorage.getItem('testResult'));
    console.log('themeData:', localStorage.getItem('themeData'));
    console.log('backgroundMusicState:', localStorage.getItem('backgroundMusicState'));

    const elements = {
        'allResultsLink': document.getElementById('all-results-link'),
        'resultsDropdown': document.getElementById('results-dropdown'),
        'nextCategoryBtn': document.getElementById('next-category-btn'),
        'resultContent': document.getElementById('result-content'),
        'bigText': document.querySelector('.bigText.leftText'),
        'resText': document.querySelector('.resText'),
        'floatingMusicButton': document.getElementById('floating-music-button')
    };

    console.log('Elements found:', Object.entries(elements).filter(([name, el]) => el).map(([name]) => name));
    console.log('=== END DEBUG ===');
}

// Экспортируем функции для отладки
window.debugPageState = debugPageState;

// Запускаем дебаг при необходимости (можно раскомментировать)
// setTimeout(debugPageState, 1000);

console.log('Скрипт results.js загружен и готов к работе');