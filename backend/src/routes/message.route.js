import { Router } from "express";
import { getAllContacts, getChatPatners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";



const router=Router();

router.get('/contacts',requireAuth,getAllContacts)
router.get('/chats',requireAuth,getChatPatners)
router.get('/:id',requireAuth,getMessagesByUserId)

router.post('/send/:id',requireAuth,sendMessage)




export default router