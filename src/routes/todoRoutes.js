import express from 'express'
import db from '../db.js'

const router = express.Router()

//get all to do from logged-in user 
router.get('/', (req, res) => {

})

//create new to do 
//we are going to send 
router.post('/', (req,res) => {

})

//update a todo 
//we are going to do a put 
//to match id we are going to use a dynamic qurey parameter 
router.put('/:id', (req, res ) => {

})

//delete a todo
router.delete('/:id', (req, res ) => {

})

export default router