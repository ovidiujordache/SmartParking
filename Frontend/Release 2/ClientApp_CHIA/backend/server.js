const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();


const app = express()
app.use(cors())
app.use(express.json())



const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const mongoURI = process.env.REACT_APP_DB_URL


mongoose.connect(mongoURI, dbOptions)
.then(() => console.log('DB Connected!'))
.catch(err => console.log(err))


const Table2Model = require('./Table2Schemas')
const Table3Model = require('./Table3Schemas')

app.get('/getCameraImages2', (req, res)=> {
    Table2Model.find().sort({timestamp: -1}).limit(20)
    .then(camera_Image2=> res.json(camera_Image2))
    .catch(err => res.json(err))
})

app.get('/getParkingSpace', (req, res)=> {
    Table3Model.find()
    .then(parking_space=> res.json(parking_space))
    .catch(err => res.json(err))
})

const port = process.env.PORT || 3001;
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})