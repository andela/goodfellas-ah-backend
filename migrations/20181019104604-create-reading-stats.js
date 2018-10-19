module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ReadingStats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'id',
          as: 'articleId',
        },
      },
      authorId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      readerId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('ReadingStats') 
};