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
    
    const userData = JSON.parse(userId)
    try {
        const users = await userModel.find().select("-password");

        users.map((e) => {
            if (userId.includes(e._id)) members.push(e);
        });

        let i = 0;
        for(const user of userData){
            try{
                const lastMsg = await getLastMessage(user.chatId);
               if (lastMsg) {
                latestMessages.push({"user":members[i],"lastMessage":lastMsg});
                i++
               }
               else {
                latestMessages.push({"user":members[i],"lastMessage":{"text": ""}});
                i++
               }
            }catch(err){

            }
        }
        res.status(200).json(latestMessages);
    } catch (err) {

    }
}

module.exports = { createMessage, getMessage, lastMessage };