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
    });

    Hack.hasMany(models.Comment, {
      foreignKey: "hackId",
      as: "comments"
    });

    Hack.hasMany(models.Vote, {
      foreignKey: "hackId",
      as: "votes"
    });
  };

  Hack.prototype.getPoints = function() {
    if (this.votes.length === 0) return 0;
    return this.votes
      .map((v) => {return v.value})
      .reduce((prev, next) => {return prev + next})
  };

  return Hack;
};
