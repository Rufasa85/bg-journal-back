const User = require("./User");
const Play = require("./Play");

User.hasMany(Play,{
    onDelete:"CASCADE"
});
Play.belongsTo(User,{
    onDelete:"CASCADE"
});

module.exports={
    User,
    Play,
}