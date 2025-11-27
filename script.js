window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', function () {
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
            
            // Используем изображения для кнопок
            button.style.backgroundImage = `url(images/кнопкиЦвет/${color.name}.jpg)`;
            button.style.boxShadow = `0 5px 25px ${color.bgColor}80`;
            
            // Добавляем эффект пульсации при наведении
            button.addEventListener('mouseenter', function() {
                this.style.animation = 'pulse 2s ease-in-out infinite';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.animation = 'none';
                this.style.transform = 'scale(1)';
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
        });

        // Добавляем клик по кружкам
        circles.forEach((circle, index) => {
            circle.addEventListener('click', function() {
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

        let selectedButton = null;

        colorButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Убираем выделение с предыдущей кнопки
                if (selectedButton) {
                    selectedButton.style.transform = 'scale(1)';
                }
                
                // Выделяем новую кнопку
                this.style.transform = 'scale(1.05)';
                selectedButton = this;
                
                const colorName = this.getAttribute('data-color-name');
                const textColor = this.getAttribute('data-text-color');

                colorNameElement.textContent = colorName;
                colorNameElement.style.color = textColor;
            });
        });

        confirmColorButton.addEventListener('click', function () {
            const selectedColor = colorNameElement.textContent;
            if (selectedColor !== "ВЫБЕРИТЕ") {
                // Анимация подтверждения
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    
                    // Уведомление
                    showNotification(`Оформление изменено на "${selectedColor}"`, 'success');
                }, 150);
            } else {
                showNotification("Пожалуйста, выберите цвет сначала!", 'warning');
            }
        });
    }

    // Функция для добавления анимаций ко всем кнопкам
    function initButtonAnimations() {
        // Добавляем CSS transitions для плавности
        const style = document.createElement('style');
        style.textContent = `
            /* Плавные переходы для всех кнопок */
            .Button, .buttonKS, .buttonA, .link-text {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            }
            
            /* Плавные переходы для кнопок выбора цвета */
            .colorButton {
                transition: all 0.3s ease-in-out !important;
            }
        `;
        document.head.appendChild(style);

        // Кнопки "click here" и "confirm"
        const mainButtons = document.querySelectorAll('.Button');
        mainButtons.forEach(button => {
            // Сохраняем оригинальные стили
            const originalBgColor = button.style.backgroundColor || '#FFFFFF';
            const originalTransform = button.style.transform || 'translateY(0)';
            
            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#736357';
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = '0 8px 20px rgba(115, 99, 87, 0.3)';
                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = '#FFFFFF';
                    buttonText.style.transition = 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = originalBgColor;
                this.style.transform = originalTransform;
                this.style.boxShadow = 'none';
                const buttonText = this.querySelector('.button-text');
                if (buttonText) {
                    buttonText.style.color = '#42383C';
                }
            });
        });

        // Кнопки команды "woah!"
        const teamButtons = document.querySelectorAll('.buttonKS, .buttonA');
        teamButtons.forEach(button => {
            // Сохраняем оригинальные стили
            const originalBgColor = button.style.backgroundColor || '#FFFFFF';
            const originalTransform = button.style.transform || 'translateY(0)';
            const originalColor = button.style.color || '#42383C';
            
            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#736357';
                this.style.transform = 'translateY(-4px)';
                this.style.color = '#FFFFFF';
                this.style.boxShadow = '0 8px 20px rgba(115, 99, 87, 0.3)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = originalBgColor;
                this.style.transform = originalTransform;
                this.style.color = originalColor;
                this.style.boxShadow = 'none';
            });

            button.addEventListener('click', function() {
                // Анимация нажатия для кнопок команды
                this.style.transform = 'translateY(-2px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-4px)';
                    showNotification('Спасибо за интерес к нашей команде! 🎨', 'info');
                }, 150);
            });
        });

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

        // Кнопки выбора цвета - только пульсация
        const colorButtons = document.querySelectorAll('.colorButton');
        colorButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.animation = 'pulse 2s ease-in-out infinite';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.animation = 'none';
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Функция для показа уведомлений
    function showNotification(message, type = 'info') {
        // Создаем элемент уведомления
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
        
        // Устанавливаем цвет в зависимости от типа
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            info: '#17a2b8',
            error: '#dc3545'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Автоматически скрываем через 3 секунды
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

    // Обновляем анимацию пульсации для большей плавности
    const style = document.createElement('style');
    style.textContent = `
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
        
        /* Плавные переходы по умолчанию */
        .Button, .buttonKS, .buttonA, .link-text {
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }
    `;
    document.head.appendChild(style);

    // Инициализация всех функций
    generateColorButtons();
    initTextSlider();
    initButtonAnimations();

    // Ждем немного перед инициализацией цветного меню, чтобы кнопки успели сгенерироваться
    setTimeout(initColorChanger, 100);
    
});