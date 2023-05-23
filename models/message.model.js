const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
      },
      text:{
        type: String,
      },
      sender: {
        type: String,
      },
      images: {
        type: String,
      },
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('Message', MessageSchema);