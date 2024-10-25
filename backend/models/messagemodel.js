const mongoose = require('mongoose')

const messageschema = new mongoose.Schema({
  member1: {
    type: String,
    required: true,
  },
  member2: {
    type: String,
    required: true,
  },
  messages: [{
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      default: 'text',
    }
  }]
});


const messagemodel = mongoose.model("messages" , messageschema)

module.exports = messagemodel