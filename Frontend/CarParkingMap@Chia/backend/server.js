const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


const app = express()
app.use(cors())
app.use(express.json())



const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true}
const mongoURI = "mongodb+srv://jeremysoh222:kk6dGaMao5h7CoLW@cluster0.ke2biwp.mongodb.net/SmartParking"

mongoose.connect(mongoURI, dbOptions)
.then(() => console.log('DB Connected!'))
.catch(err => console.log(err))


const CarModel = require('./CarSchemas')
const Table2Model = require('./Table2Schemas')

app.get('/getAllCar', async(req, res)=> {
    try {
        const allCar = await CarModel.find({});
        res.send({status: "ok", data: allCar });
    } catch(error){
        console.log(error);
    }
})


app.get('/getCar', (req, res)=> {
    CarModel.find()
    .then(car => res.json(car))
    .catch(err => res.json(err))
})

app.get('/getCameraImages2', (req, res)=> {
    Table2Model.find()
    .then(camera_Image2=> res.json(camera_Image2))
    .catch(err => res.json(err))
})





const port = 3001
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})