const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "title"',
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "author"',
          },
        },
      },
      genre: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'MeMovies',
      sequelize,
    }
  );
  return Book;
};
