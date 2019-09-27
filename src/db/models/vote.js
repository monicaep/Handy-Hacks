'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1, 1]]
      }
    },
    hackId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Vote.associate = function(models) {
    // associations can be defined here
    Vote.belongsTo(models.Hack, {
      foreignKey: "hackId",
      onDelete: "CASCADE"
    });

    Vote.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Vote;
};
