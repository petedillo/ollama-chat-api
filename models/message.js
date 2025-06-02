'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chatSessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ChatSessions',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.ChatSession, {
      foreignKey: 'chatSessionId',
      as: 'chatSession',
      onDelete: 'CASCADE'
    });
  };

  return Message;
};
