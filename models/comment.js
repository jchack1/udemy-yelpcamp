const mongoose = require("mongoose");
 
const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
 
//compile to the model
//this is what we are exporting
module.exports = mongoose.model("Comment", commentSchema);
