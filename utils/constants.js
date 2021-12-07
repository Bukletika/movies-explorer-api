// Регулярное выражение для проверки ссылок
const linkTest = /(https?:\/\/)(w{3}\.)?[\w-]+(\.[\w-])+[\w.!*=%~?.,:\\+/@-]+#?/;

// Сообщения
const msgNeedAuthorization = 'Необходима авторизация';
const msgNotFound = 'Ресурс не найден';
const msgIncorrectUrl = 'Не правильный формат ссылки';
const msgServerError = 'На сервере произошла ошибка';
const msgManyQuery = 'С вашего IP поступило слишком много запросов. Попробуйте зайти позже';
const msgCardsNotFound = 'Карточки не найдены';
const msgIncorrectData = 'Переданы некорректные данные';
const msgCardNotExist = 'Карточки не существует';
const msgCantDel = 'Нельзя удалить чужую карточку';
const msgMissingData = 'Email или пароль отсутствует';
const msgIncorrectAuthorization = 'Неверный логин или пароль';
const msgUserExists = 'Пользователь с таким email уже есть в системе';
const msgNotUserById = 'Пользователь с указанным _id не найден';
const msgFalseProfileData = 'Переданы некорректные данные при обновлении профиля';

module.exports = {
  linkTest,
  urlMongoDB,
  msgNeedAuthorization,
  msgNotFound,
  msgIncorrectUrl,
  msgServerError,
  msgManyQuery,
  msgCardsNotFound,
  msgIncorrectData,
  msgCardNotExist,
  msgCantDel,
  msgMissingData,
  msgIncorrectAuthorization,
  msgUserExists,
  msgNotUserById,
  msgFalseProfileData,
};
