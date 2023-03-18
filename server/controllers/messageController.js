const Message = require("../model/Message");
const User = require("../model/User");
const Chat = require("../model/Chat");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.status(200).json(messages);
        console.log('message ne', messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await Message.findById(message._id).populate({
            path: "sender",
            select: "name pic",
        }).populate({
            path: "chat",
        }).populate({
            path: "chat.users",
            select: "name pic email",
        }).exec();

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { allMessages, sendMessage };