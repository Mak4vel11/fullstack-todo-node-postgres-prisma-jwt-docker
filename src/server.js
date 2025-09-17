//import path desctructed to dirname
import path, { dirname } from 'path'
import express from 'express'
//enable serve.js file html in this case  and send the back as res 
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 5000

//GET the file path from teh URL of the current module 
//configuration 
const __filename = fileURLToPath(import.meta.url)
//Get the directroy name from the file path 
const __dirname = dirname(__filename)

//Middleware
app.use(express.json())

//tell where public directory is 
//serves the html file from the /public directory 
//tells express to serve all files from public folder as static assts/files 
//any request from teh css files will be resovled from the public directory  
    app.use(express.static(path.join(__dirname, '../public')))

//Serving up the HTML file from the /public directory 
app.get('/', (req, res) => {
    //enable to locate file and folder 
 res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})
