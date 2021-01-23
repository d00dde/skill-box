// ## Создаёт задержку ответа сервера для проверки ##
// ## правильности отработки лоадеров на фронте    ##

module.exports = (delay = 200) => {
  return (req, res, next) => {
    setTimeout(() => {
      return next();
    }, delay);
  };
};
