'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hack = sequelize.define('Hack', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Hack.associate = function(models) {
    // associations can be defined here
    Hack.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Hack.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    })
  };
  return Hack;
};
