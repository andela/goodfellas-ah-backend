'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
      authorId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'authorId',
        },
      },
      articleSlug: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'slug',
          as: 'articleSlug',
        },
      },
      commentId: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['followerArticle', 'favoriteArticleComment']
      },
      seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserNotifications');
  }
};