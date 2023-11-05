document.addEventListener('DOMContentLoaded', function() {
    var mobileToggle = document.querySelector('.mobile-toggle'); // Получаем элемент mobile-toggle
    var menu = document.querySelector('.menu-mobile'); // Получаем элемент меню (замените '.menu' на селектор вашего меню)

    // Обработчик события для клика по элементу mobile-toggle
    mobileToggle.addEventListener('click', function() {
        menu.classList.toggle('opened'); // Добавляем или удаляем класс 'open' на элементе меню

        // Если нужно скрыть меню при клике за его пределами, раскомментируйте следующие строки
        // if (!menu.classList.contains('open')) {
        //     menu.classList.add('open');
        // }

        // Добавьте здесь дополнительный код, который нужно выполнить при открытии/закрытии меню
    });
});

