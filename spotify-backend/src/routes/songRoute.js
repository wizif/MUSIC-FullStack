import { addSong, listSong } from "../controllers/songController";

import express from 'express'

const songRouter=express.Router();
songRouter.post('/add',addSong);
songRouter.get('/list',listSong);


export default songRouter;
