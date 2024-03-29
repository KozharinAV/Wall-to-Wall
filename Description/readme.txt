В процессе выполнения задания использовались: Vue3, Vue CLI5, Vue-router, npm, TypeScript.
Структура проекта:

- App.vue - основной файл приложения, содержит элемент router-view, в который загружается игровое поле, либо правила игры;

- компонент PlayField организует пространство страницы и содержит:
	заголовок с названием игры, который является ссылкой и позволяет переходить к компоненту GemeRules из файла Rules.vue;
	основное поле, представленное компонентом MainFields, где происходит процесс игры, в нем же содержится основная логика;

- игральные карты созданы как отдельный компонент PlayCard, картинки для их визуализации находятся в папке public;

- файл Logic.ts содержит импортируемые в MainFields функции, не привязанные к контексту компонента.

Игровой процесс начинается с нажатия кнопки "Стар!", этой же кнопкой в любой момент можно начать игру сначала. Перед игрой и
в ее процессе можно изменять количество штрафных очков, при достижении которых игра останавливается и определяется победитель.

Поле игрока, который совершает ход подсвечивается зеленым цветом. ИИ самостоятельно делает ход. Для того, чтобы сделать свой
ход, игроку необходимо нажать на очередь своих карт, а затем выбрать карту соперника для продолжения.

ИИ реализован следующим образом: забирается карта соперника, максимально приближенная к карте на кону. Но, если у ИИ осталось
мало нулей(меньше трех) и мало четверок(меньше трех), значит у игрока много четверок, которые бьются только нулями, а нулей
у ИИ мало. В этом случае ИИ будет забирать нули, если на кону окажется карта, меньшая четверки.

Для того, чтобы соперник не делал ходы практически мгновенно, в коде используется SetTimeout. Это позволяет игроку рассмотреть 
карты, которые кладет и забирает соперник.

Чтобы сократить объем кода, изменение цвета поля игрока, который совершает ход реализована за счет прямого обращения к DOM
элементу с помощью ссылки.