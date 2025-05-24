const messageModel = require("../Models/messageModel");
const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");

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

const getLastMessage = async (chatId) => {
  return await messageModel
    .findOne({ chatId })
    .sort({ createdAt: -1 });
};

const lastMessage = async (req, res) => {
    // const { chatId,userId } = req.body;
    const { userId } = req.params;
    let members = []
    let latestMessages = [];

    try {
        const users = await userModel.find().select("-password");

        users.map((e) => {
            if (userId.includes(e._id)) members.push(e);
        });

        // for(const user of userId){
        //     console.log(user.chatId);
        //     try{
        //         const lastMsg = await getLastMessage(user.chatId);
        //        if (lastMsg) latestMessages.push(lastMsg);
        //     }catch(err){

        //     }
        // }
        res.status(200).json(latestMessages);
    } catch (err) {

    }


    // try {
    //     const latestMessage = await messageModel
    //         .findOne({ chatId })
    //         .sort({ createdAt: -1 });

    //     res.status(200).json(latestMessage);
    // } catch (err) {
    //     res.status(500).json(err);
    // }
}

module.exports = { createMessage, getMessage, lastMessage };