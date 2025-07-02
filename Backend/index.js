import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoute from './routes/authRoute.js'
import dbInit from './config/db.js' 
import taskRoute from './routes/taskRoute.js'
import userRoute from './routes/userRoute.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express();
const PORT = process.env.PORT
dbInit;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute);
app.use('/task', taskRoute);
app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.send('Backend up!')
    console.log('Backend up!')
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})