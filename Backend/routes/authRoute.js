import express from 'express';
import {signup,login,logout,refreshAccessToken} from "../controllers/authController.js"

const router = express.Router();

router.post('/login', login)
router.post('/signup', signup)
router.get('/logout', logout)
router.post('/refresh', refreshAccessToken)

export default router;