'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatSession = sequelize.define('ChatSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New Chat'
    }
  }, {
    timestamps: true
  });

  ChatSession.associate = function(models) {
    // associations can be defined here
    ChatSession.hasMany(models.Message, {
      foreignKey: 'chatSessionId',
      as: 'messages',
      onDelete: 'CASCADE'
    });
  };

  return ChatSession;
};
