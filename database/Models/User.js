module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    }
  });
  return User;
};