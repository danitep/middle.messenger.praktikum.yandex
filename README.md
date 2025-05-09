# [Middle-messenger]

Проект курса "Мидл фронтенд-разработчик"



## Установка

Установить и запустить можно выполнив следующие шаги:

* Установить зависимости проекта 'npm install'
* Собрать проект можно по 'npm run build'
* Запустить на Localhost можно по 'npm run start'

## Ссылки

Netlify: https://middle-messenger-danitep.netlify.app

* ссылки на страницы:

main: https://middle-messenger-danitep.netlify.app
page404: https://middle-messenger-danitep.netlify.app/src/pages/err404
page500: https://middle-messenger-danitep.netlify.app/src/pages/err5xx
profile: https://middle-messenger-danitep.netlify.app/src/pages/profile
login: https://middle-messenger-danitep.netlify.app/src/pages/login
signin: https://middle-messenger-danitep.netlify.app/src/pages/signin
chats: https://middle-messenger-danitep.netlify.app/src/pages/chats
## Ссылка на макет

Figma: https://www.figma.com/design/hbpaOyzO1jQDqeRJZyv536/Chat_external_link--Copy-?m=auto&t=wJb6pvuG84DOX3Kb-6

## Документация

По большей части здесь расписано упрваление страницей изменяя параметры контекста в файле vite.config.js

При запуске будет открыта страница index.html, на которой будет список навигации для переключения между другими страницами.

### Описание параметров в файле vite.config.js
err404Params - параметры для отображения страницы с ошибкой 404
err5xxParams - параметры для отображения страницы с ошибками 5xx (на данный момент это заготовка с ошибкой 500)

profileParams - параметры для отображения страницы с данными профиля
* linkpath - ссылка для перехода по стрелке (в данный момент отправляет на страницу чатов)
* avatarTempPath - ссылка на аватар пользователя.
* username - заглушка для имени пользователя
* isEditDisabled - поле для отключения редактирования полей профиля, когда необходимо редактировать поля профиля, значение равно false. 
* isPasswordEditable - поле для редактирования полей профиля, когда необходимо сменить пароль, значение равно true. 

* popup - Объект для управления popup'ом добавления изображения.
  - isOpened - "Открывает" попап при значение true.
  - isImageLoaded - изменение popup'а (отображение названия файла) в случае, если фото выбрано.
  - isSubmitEmpty - предупреждение на случай, если пользователь не выбрал новое изображение
  - isSubmitErrored - Для сообщения об ошибке с отправкой
  - fileName - строка с названием загруженного файла

* passwordRows - Объекты для смены пароля
 - name - id поля (для дальнейшего использования значения при развитии проекта)
 - placeholder - название поля, и заглушка, на случай, если поле пустое.
 - type - тип input'а.
 - value - заготовленное значение.
 - minLength - минимальная длинная содержимого.
 - maxLength - максимальная длинная содержимого.
 - (в данном блоке не реализованы isErrored и isErrorActive)

 * profileRows - Объекты строк с данными пользователя
 - (поля не указаны, т.к. повторяются)


 * buttons - Объекты кнопок для корректного заполенения.
 - text - текст кнопки.
 - link - ссылка, если кнопка куда-то ведёт (кнопка "выйти").

loginParams - параметры для отображения страницы входа.
* title - заголовок формы 
* name - название формы для корректировки свойств формы
* buttontext - текст кнопки submit'а 
* linktext - текст ссылки внизу формы
* linkpath - ссылка, которая ведёт со страницы.
* inputs - объекты полей ввода
(указаны поля отличающиеся поля)
 - isNameActive - для корректного отбражения названия поля (true - название отображается над полем, false - название отключено).
 - errortext - текст ошибки, в случае некорректного заполнения поля
 - isErrored - для подцветки поля (true - некорректое значение поля, здесь значение пароля) 
 - isErrorActive - для отображения ошибки (true - отображение текста ошибки)

signinParams - параметры для отображения страницы входа.
(аналогичны loginParams)

chatParams - параметры для отображения страницы чата.
* isChatChosen - для отображения заглушки чата
* profileLink - ссылка на страницу профиля
* popups - popup'ы с кнопками добавления/удаления пользователей или файлов
 - isActive - для отображение popup'а
 - isSettings - "это popup для добавления/удаления пользователя?"
 - isAdd - "это popup для добавления файлов?"
 - buttons - кнопки popup'ов
  - imageLink - ссылка на иконку кнопки
  - buttonText - текст кнопки
* addRemovePopup - объект popup'а добавления/удаления чата
 - isOpened - для отображение popup'а
 - isAdd - "это popup додобавления пользователя?" (если нет, то удаления)
 - username - имя пользователя
 - addPopup - данные для popup'а добавления
 - removePopup - данные для popup'а удаления
  - title - заголовок popup'а
  - buttonText - текст кнопки
* openedChat - данные открытого чата
 - imagePath - изображение чата
 - name - название чата
 - isSettingsActive - "нажата ли кнопка добавления/удаления пользователей?"
 - isAddActive - "нажата ли кнопка добавления файлов?"
 - packs - наборы сообщений по датам
  - date - дата сообщений
  - messages - набор сообщений
   - isSideChanged - "изменилась ли сторона отправителя сообщения, в сравнении с предыдущим?"
   - isMessageMine - "сообщение было отправлено пользователем?"
   - isRead - "отправленное сообщение прочитано?"
   - isText - "сообщение содержит только текст?"
   - isImage - "сообщение содержить только изображение?"
   - time - время отправки сообщения
   - content - содержимое сообщения
    - text - текст сообщения
    - imageLink - изображение сообщения
* chatList - данные списка чатов
 - imagePath - изображение чата
 - name - название чата
 - lastMessage - последнее сообщение
 - isMyMessage - "сообщение было отправлено пользователем?"
 - lastMessageTime - время последнего сообщения
 - hasNewMessages - "есть ли новые сообщения?"
 - isTooManyMessages - "количество новых сообщения 100 и более?"
 - newMessagesCount - количество новых сообщений
 - isActive - "чат открыт?"
## Ссылка на Pull Request
https://github.com/danitep/middle.messenger.praktikum.yandex/pull/2
