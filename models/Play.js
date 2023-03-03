const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Play extends Model {}

Play.init({
    // add properites here, ex:
    title: {
         type: DataTypes.STRING,
         allowNull:false
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    isWin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    score:{
        type:DataTypes.INTEGER
    },
    notes:{
        type:DataTypes.TEXT,
    }
},{
    sequelize
});

module.exports=Play