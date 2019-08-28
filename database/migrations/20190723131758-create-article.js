/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      body: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      isPaid: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      ratings: {
        type: Sequelize.INTEGER,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dislikes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('draft', 'published', 'trash'),
        defaultValue: 'draft',
      },
      reports: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      tagsList: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      userId: {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      readTime: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      readCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: '0',
      },
      thumbnail: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'https://res.cloudinary.com/mazus/image/upload/v1566988928/default-article-image-large_eeu8ov.gif',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Articles')
};
