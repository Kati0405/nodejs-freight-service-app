const request = require('request');

const getWeatherInCity = (req, res) => {
  const { city } = req.body;
  request(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=5d066958a60d315387d9492393935c19`,
    function (err, res, body) {
      const data = JSON.parse(body);
      if (res.statusCode === 200) {
        console.log(data);
        res.send({
          message: `The weather in '${city}' is ${data.weather.description}`,
        });
      }
    },
  );
};

module.exports = {
  getWeatherInCity,
};
