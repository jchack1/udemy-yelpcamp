const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//starts to add methods and important functionality to User
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);