const express = require('express');
const User = require('../../models/usermodel');
const Company = require("../../models/company")
const router = express.Router();
const messagemodel = require('../../models/messagemodel');

router.get('/:id' , function (req, res) {
    console.log("hi");
    
    User.findById(req.params.id).then(async function ( user) {
        var company = await Company.findById(user.company);
        // Updated to send a single object containing user and company
        res.send({ user, company });
    });
})

router.get("/" , function (req, res) {
    User.find().then(function (users) {
        res.send(users);
    });
})

router.get("/getroom/:user1/:user2", async function (req, res) {
    try {
        console.log(req.params);
        
        // Find the message for the two users
        const message = await messagemodel.findOne({
            $or: [
                { member1: req.params.user1, member2: req.params.user2 },
                { member1: req.params.user2, member2: req.params.user1 }
            ]
        });

        // If a message exists, send its ID
        if (message) {
            return res.send({id:message.id , messages:message.messages});
        }

        // If no message exists, create a new one
        const newMessage = new messagemodel({
            member1: req.params.user1,
            member2: req.params.user2,
            messages: [],  // Assuming this is an array of messages
        });

        await newMessage.save(); // Save the new message
        console.log("New collection added");

        // Send the ID of the newly created message
        return res.send(newMessage.id);

    } catch (error) {
        // Handle server errors
        console.error(error);
        return res.status(500).send('Server error');
    }
});

module.exports = router
