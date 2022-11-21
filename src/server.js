import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import router from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router)

const mongoClient = new MongoClient(process.env.MONGO_URI);
export let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});


app.listen(5000);




