document.addEventListener('DOMContentLoaded', function() {
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
            button.style.boxShadow = `0 5px 50px ${color.bgColor}`;
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
        
        function updateDisplay() {
            circles.forEach(circle => {
                circle.classList.remove('active');
            });
            
            circles[currentIndex].classList.add('active');
            textElement.innerHTML = texts[currentIndex];
        }
        
        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % 3;
            updateDisplay();
        });

        updateDisplay();
    }

    // Функция для смены цвета
    function initColorChanger() {
        const colorButtons = document.querySelectorAll('.colorButton');
        const colorNameElement = document.getElementById('selected-color-text');
        const confirmColorButton = document.getElementById('confirm-color-button');
        
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const colorName = this.getAttribute('data-color-name');
                const textColor = this.getAttribute('data-text-color');
                
                colorNameElement.textContent = colorName;
                colorNameElement.style.color = textColor;
            });
        });

        confirmColorButton.addEventListener('click', function() {
            const selectedColor = colorNameElement.textContent;
            alert(`Оформление изменено на "${selectedColor}"`);
        });
    }

    // Инициализация всех функций
    generateColorButtons();
    initTextSlider();
    
    // Ждем немного перед инициализацией цветного меню, чтобы кнопки успели сгенерироваться
    setTimeout(initColorChanger, 100);
});