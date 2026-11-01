import express, { Router } from 'express'
import { authRequired } from '../middleware/express/authRequired.ts'




const router: Router = express.Router()

router.get<>('/', authRequired, async (req, res) => {


})