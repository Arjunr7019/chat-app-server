const messageModel = require("../Models/messageModel");

const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    const message = new messageModel({
        chatId,
        senderId,
        text
    });

    try {
        const response = await message.save();

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getMessage = async (req, res) => {
    const { chatId } = req.params;

    try {
        const message = await messageModel.find({ chatId });

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
}

const lastMessage = async (req, res) => {
    const { chatId } = req.params;

    try {
        const latestMessage = await messageModel
            .findOne({ chatId })
            .sort({ createdAt: -1 });

        res.status(200).json(latestMessage);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { createMessage, getMessage,lastMessage };