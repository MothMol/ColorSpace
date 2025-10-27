document.addEventListener('DOMContentLoaded', function() {
    /*Главная страница*/ 
    
    // Получаем элементы DOM
    const circles = document.querySelectorAll('.circle');
    const textElement = document.getElementById('text-content');
    const nextButton = document.getElementById('next-button');
    
    // Счетчик текущего активного элемента
    let currentIndex = 0;
    
    // Массив с тремя разными текстами
    const texts = [
        `Альбина, Соня и Катя, <br> 
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
    
    // Функция для обновления отображения
    function updateDisplay() {
        // Убираем активный класс у всех кружков
        circles.forEach(circle => {
            circle.classList.remove('active');
        });
        
        // Добавляем активный класс текущему кружку
        circles[currentIndex].classList.add('active');
        
        // Обновляем текст
        textElement.innerHTML = texts[currentIndex];
    }
    
    // Обработчик клика на кнопку
    nextButton.addEventListener('click', function() {
        // Переход к следующему индексу (0->1->2->0)
        currentIndex = (currentIndex + 1) % 3;
        updateDisplay();
    });

     // Инициализация начального состояния
    updateDisplay();

        /*смена цвета*/ 
    // Код для смены цвета
    const colorButtons = document.querySelectorAll('.colorButton');
    const colorNameElement = document.getElementById('selected-color-text');
    const confirmColorButton = document.getElementById('confirm-color-button');
    
    // Проверяем, найдены ли элементы для смены цвета
    if (!colorButtons.length || !colorNameElement || !confirmColorButton) {
        console.error('Не найдены элементы для смены цвета');
        console.log('colorButtons:', colorButtons.length);
        console.log('colorNameElement:', colorNameElement);
        console.log('confirmColorButton:', confirmColorButton);
        return;
    }
    
    console.log('Все элементы найдены, добавляем обработчики...');
    
    // Добавляем обработчики для всех кнопок цвета
        colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const colorName = this.getAttribute('data-color-name');
            const textColor = this.getAttribute('data-text-color');
            
            console.log('Нажата кнопка цвета:', colorName, textColor);
            
            // Обновляем текст и цвет
            colorNameElement.textContent = colorName;
            colorNameElement.style.color = textColor;
        });
    });

    // Обработчик для кнопки подтверждения
    confirmColorButton.addEventListener('click', function() {
        const selectedColor = colorNameElement.textContent;
        alert(`Оформление изменено на "${selectedColor}"`);
    });
});

    
   
