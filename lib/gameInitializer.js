// gameInitializer.js

const initializeGameVariables = (dbData) => {
  dbData.game = {
    tebaklagu: [],
    _family100: [],
    math: [],
    tebakgambar: [],
    tebakkata: [],
    lontong: [],
    lontong_desk: [],
    kalimat: [],
    lirik: [],
    tebakan: [],
    ...(dbData.game || {})
  };
};

module.exports = initializeGameVariables;