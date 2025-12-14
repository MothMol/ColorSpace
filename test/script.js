document.addEventListener('DOMContentLoaded', function() {
    document.body.style.zoom = "0.65";
});
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
            "Серость без дождя"
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

// Инициализация теста
document.addEventListener('DOMContentLoaded', function() {
    initializeTest();
    setupResultsDropdown();
});

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
    restartBtn.addEventListener('click', restartTest);
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
    scrollToTop()
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
    scrollToTop()
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
    
    // Получаем данные результатов
    const personalityResult = colors[resultColorIndex];
    const influenceResult = colorEffect[resultColorIndex];
    const musicResult = colorMusic[resultColorIndex];
    
    // Заполняем первый блок - Личность
    document.getElementById('result-personality-title').textContent = personalityResult.name;
    document.getElementById('result-personality-description').textContent = personalityResult.description;
    document.getElementById('result-personality-image').style.backgroundColor = personalityResult.hex;
    
    // Заполняем второй блок - Влияние
    document.getElementById('result-influence-description').innerHTML = influenceResult.description;
    document.getElementById('result-influence-image').style.backgroundColor = influenceResult.hex;
    
    // Заполняем третий блок - Музыка
    const musicDescription = musicResult.description && musicResult.description.trim() !== "" 
        ? musicResult.description 
        : "Музыкальные ассоциации для этого цвета пока в разработке. Скоро мы добавим подходящие музыкальные жанры!";
    document.getElementById('result-music-description').textContent = musicDescription;
    document.getElementById('result-music-image').style.backgroundColor = musicResult.hex;
    
    // Скрываем вопросы и показываем результат
    questionsContainer.style.display = 'none';
    backBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    resultDiv.style.display = 'block';
    
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
    scrollToTop()
}

// Функция для инициализации выпадающего меню
function initResultsDropdown() {
    const allResultsLink = document.getElementById('all-results-link');
    const resultsDropdown = document.getElementById('results-dropdown');
    const resultsOptions = document.querySelectorAll('.results-option');
    
    if (!allResultsLink || !resultsDropdown) return;
    
    // Открытие меню при наведении
    allResultsLink.addEventListener('mouseenter', function() {
        resultsDropdown.classList.add('show');
    });
    
    // Закрытие меню при уходе курсора
    allResultsLink.addEventListener('mouseleave', function() {
        setTimeout(() => {
            if (!resultsDropdown.matches(':hover')) {
                resultsDropdown.classList.remove('show');
            }
        }, 100);
    });
    
    // Управление меню при наведении на dropdown
    resultsDropdown.addEventListener('mouseenter', function() {
        resultsDropdown.classList.add('show');
    });
    
    resultsDropdown.addEventListener('mouseleave', function() {
        resultsDropdown.classList.remove('show');
    });
    
    // Обработка выбора цвета
    resultsOptions.forEach(option => {
        option.addEventListener('click', function() {
            const colorIndex = parseInt(this.getAttribute('data-color'));
            showColorResult(colorIndex);
            resultsDropdown.classList.remove('show');
        });
    });
    
    // Предотвращение перехода по ссылке
    allResultsLink.addEventListener('click', function(e) {
        e.preventDefault();
    });
}

// Функция для показа результата выбранного цвета
function showColorResult(colorIndex) {
    // Получаем данные результатов
    const personalityResult = colors[colorIndex];
    const influenceResult = colorEffect[colorIndex];
    const musicResult = colorMusic[colorIndex];
    
    // Заполняем первый блок - Личность
    document.getElementById('result-personality-title').textContent = personalityResult.name;
    document.getElementById('result-personality-description').textContent = personalityResult.description;
    document.getElementById('result-personality-image').style.backgroundColor = personalityResult.hex;
    
    // Заполняем второй блок - Влияние
    document.getElementById('result-influence-description').innerHTML = influenceResult.description;
    document.getElementById('result-influence-image').style.backgroundColor = influenceResult.hex;
    
    // Заполняем третий блок - Музыка
    const musicDescription = musicResult.description && musicResult.description.trim() !== "" 
        ? musicResult.description 
        : "Музыкальные ассоциации для этого цвета пока в разработке. Скоро мы добавим подходящие музыкальные жанры!";
    document.getElementById('result-music-description').textContent = musicDescription;
    document.getElementById('result-music-image').style.backgroundColor = musicResult.hex;
    
    // Скрываем вопросы и показываем результат
    questionsContainer.style.display = 'none';
    backBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    resultDiv.style.display = 'block';
    
    // Прокрутка наверх
    scrollToTop();
}

// Вызовите initResultsDropdown() в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... ваш существующий код ...
    initResultsDropdown();
});
// Функция для анимаций кнопок и навигации теста
function initTestAnimations() {
    // Добавляем CSS transitions
    const style = document.createElement('style');
    style.textContent = `
        .btn-next, .btn-back, .restart-btn, .link-text {
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }
    `;
    document.head.appendChild(style);

    // Навигационные ссылки
    const navLinks = document.querySelectorAll('.link-text');
    navLinks.forEach(link => {
        const originalColor = link.style.color || '#42383C';
        const originalTransform = link.style.transform || 'translateY(0)';
        
        link.addEventListener('mouseenter', function() {
            this.style.color = '#736357';
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
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
        
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('restart-btn')) {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            } else {
                this.style.backgroundColor = '#6e6557';
            }
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 20px rgba(115, 99, 87, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = originalBgColor;
            this.style.transform = originalTransform;
            this.style.boxShadow = 'none';
        });
    });
}

// Вызовите эту функцию в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initTestAnimations();
});




