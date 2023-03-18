const express = require('express')
const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes')
const chatRoutes = require('./chatRoutes');
const authMdw = require('../middleware/authMiddleware')
const router = express.Router();
//Routing
router.use('/user', userRoutes);
router.use('/message', messageRoutes)

router.use('/chat', chatRoutes);
// router.use('/lesson'authMd)
module.exports = router;
