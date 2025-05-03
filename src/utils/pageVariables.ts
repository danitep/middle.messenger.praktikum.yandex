import { PropsWithChildren } from './blockInterfaces';

export const err404Params: PropsWithChildren = {
    number: 404,
    greeting: "Не туда попали",
    link: "./chats"
};

export const err5xxParams: PropsWithChildren = {
    number: 500,
    greeting: "Мы уже фиксим",
    link: "./chats"
};

export const profileParams: PropsWithChildren = {
    linkpath: "./chats",
    avatarTempPath: "../../src/static/avatar.svg",
    username: "Иван",
    isEditDisabled: true,
    isPasswordEditable: false,
    popup: {
      isOpened: false,
      isImageLoaded: false,
      isSubmitEmpty: false,
      isSubmitErrored: false,
      fileName: "pic.jpg",
    },
    passwordRowsData: [
      {
        name: "oldPassword",
        placeholder: "Старый пароль",
        type: "password",
        value:"123456789",
        minLength: 6,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "newPassword",
        placeholder: "Новый пароль",
        type: "password",
        value:"12345678910",
        minLength: 6,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "newPasswordAgain",
        placeholder: "Повторите новый пароль",
        type: "password",
        value:"12345678910",
        minLength: 6,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
    ],
    profileRowsData: [
      {
        name: "email",
        placeholder: "Почта",
        type: "email",
        value:"pochta@yandex.ru",
        minLength: 6,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "login",
        placeholder: "Логин",
        type: "text",
        value:"ivanivanov",
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "first_name",
        placeholder: "Имя",
        type: "text",
        value:"Иван",
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "second_name",
        placeholder: "Фамилия",
        type: "text",
        value:"Иванов",
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "display_name",
        placeholder: "Имя в чате",
        type: "text",
        value:"Иван",
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "phone",
        placeholder: "Телефон",
        type: "text",
        value: '+7(909)9673030',
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
    ],
    buttonsData:[
      {
        text: "Изменить данные",
        link: "",
      },
      {
        text: "Изменить пароль",
        link: "",
      },
      {
        text: "Выйти",
        link: "/main",
      },
    ]
};

export const loginParams: PropsWithChildren  = {
    title: "Вход", 
    name: "login", 
    buttontext: "Авторизоваться", 
    linktext: "Нет аккаунта?",
    linkpath: "./signin",
    inputs: [
      {
        name: "login",
        isNameActive: true,
        placeholder: "Логин",
        type: "text",
        errortext: "Неверный логин",
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "password",
        isNameActive: true,
        placeholder: "Пароль",
        type: "password",
        errortext: "",
        minLength: 0,
        maxLength: 15,
        isErrored: false,
        isErrorActive: false
      }
    ]
};

export const signinParams: PropsWithChildren = {
    title: "Регистрация", 
    name: "signin", 
    buttontext: "Зарегистрироваться", 
    linktext: "Войти",
    linkpath: "./login",
    inputs: [
      {
        name: "email",
        isNameActive: true,
        placeholder: "Почта",
        type: "email",
        errortext: "",
        minLength: 6,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "login",
        isNameActive: true,
        placeholder: "Логин",
        type: "text",
        errortext: "",
        minLength: 1,
        maxLength: 200,
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "first_name",
        isNameActive: true,
        placeholder: "Имя",
        type: "text",
        minLength: 1,
        maxLength: 200,
        errortext: "",
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "second_name",
        isNameActive: true,
        placeholder: "Фамилия",
        type: "text",
        minLength: 1,
        maxLength: 200,
        errortext: "",
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "phone",
        isNameActive: true,
        placeholder: "Телефон",
        type: "text",
        minLength: 0,
        maxLength: 15,
        errortext: "",
        isErrored: false,
        isErrorActive: false
      },
      {
        name: "password",
        isNameActive: true,
        placeholder: "Пароль",
        type: "password",
        errortext: "",
        minLength: 8,
        maxLength: 200,
        isErrored: true,
        isErrorActive: false
      },
      {
        name: "password_again",
        isNameActive: true,
        placeholder: "Пароль (ещё раз)",
        type: "password",
        errortext: "Пароли не совпадают",
        minLength: 8,
        maxLength: 200,
        isErrored: true,
        isErrorActive: true
      }
    ]
};

export const chatParams: PropsWithChildren = {
    isChatChosen: true,
    profileLink: "./profile",
    popups: [
      {
        isActive: false,
        isSettings: true,
        isAdd: false,
        buttons: [
          {
            imageLink: "../../src/static/add_user.svg",
            buttonText: "Добавить пользователя",
          },
          {
            imageLink: "../../src/static/remove_user.svg",
            buttonText: "Удалить пользователя",
          }
        ],
      },
      {
        isActive: false,
        isSettings: false,
        isAdd: true,
        buttons:[
          {
            imageLink: "../../src/static/add_media.svg",
            buttonText: "Фото или Видео",
          },
          {
            imageLink: "../../src/static/add_file.svg",
            buttonText: "Файл",
          },
          {
            imageLink: "../../src/static/add_location.svg",
            buttonText: "Локация",
          }
        ],
      },
    ],
    addRemovePopup:{
      isOpened: false,
      isAdd: true,
      username: "ivanivanov",
      addPopup:{
        title: "Добавить пользователя",
        buttonText: "Добавить"
      },
      removePopup: {
        title: "Удалить пользователя",
        buttonText: "Удалить"
      }
    },
    openedChat:{
      imagePath: "",
      name: "Вадим",
      isSettingsActive: false,
      isAddActive: false,
      packs:[
        {
          date: "19 июня",
          messages: [
            {
              isSideChanged: false,
              isMessageMine:false,
              isRead: false,
              isText: true,
              isImage: false,
              time: "11:56",
              content:{
                text: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. \n \n Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.",
                imageLink: ""
              }
            },
            {
              isSideChanged: false,
              isMessageMine:false,
              isRead: false,
              isText: false,
              isImage: true,
              time: "11:56",
              content:{
                text: "",
                imageLink: "../../src/static/Снимок экрана 2020-06-21 в 19.18 1.png"
              }
            },
            {
              isSideChanged: true,
              isMessageMine:true,
              isRead: true,
              isText: true,
              isImage: false,
              time: "12:00",
              content:{
                text: "Круто!",
                imageLink: ""
              }
            }
          ]
        }
      ]
    },
    chatList:[
      {
        imagePath: "",
        name: "Андрей",
        lastMessage: "Изображение",
        isMyMessage: false,
        lastMessageTime: "10:49",
        hasNewMessages: true,
        isTooManyMessages: false,
        newMessagesCount: 2,
        isActive: false,
      },
      {
        imagePath: "",
        name: "Киноклуб",
        lastMessage: "стикер",
        isMyMessage: true,
        lastMessageTime: "12:00",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: false,
      },
      {
        imagePath: "",
        name: "Илья",
        lastMessage: "Друзья, у меня для вас особенный выпуск новостей! Итак...",
        isMyMessage: false,
        lastMessageTime: "15:12",
        hasNewMessages: true,
        isTooManyMessages: false,
        newMessagesCount: 4,
        isActive: false,
      },
      {
        imagePath: "",
        name: "Вадим",
        lastMessage: "Круто!",
        isMyMessage: true,
        lastMessageTime: "Пт",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: true,
      },
      {
        imagePath: "",
        name: "тет-а-теты",
        lastMessage: "И Human Interface Guidelines и Material Design рекомендуют...",
        isMyMessage: false,
        lastMessageTime: "Ср",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: false,
      },
      {
        imagePath: "",
        name: "1, 2, 3",
        lastMessage: "Миллионы россиян ежедневно проводят десятки часов свое...",
        isMyMessage: false,
        lastMessageTime: "Пн",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: false,
      },
      {
        imagePath: "",
        name: "Design Destroyer",
        lastMessage: "В 2008 году художник Jon Rafman  начал собирать...",
        isMyMessage: false,
        lastMessageTime: "Пн",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: false,
      },
      {
        imagePath: "",
        name: "Day.",
        lastMessage: "Так увлёкся работой по курсу, что совсем забыл его анонсир...",
        isMyMessage: false,
        lastMessageTime: "1 Мая 2020",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: false,
      },
      {
        imagePath: "",
        name: "Стас Рогозин",
        lastMessage: "Можно или сегодня или завтра вечером.",
        isMyMessage: false,
        lastMessageTime: "12 Апр 2020",
        hasNewMessages: false,
        isTooManyMessages: false,
        newMessagesCount: 0,
        isActive: false,
      }
    ]
};