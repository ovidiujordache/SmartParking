const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({
    car_id: String,
    license_plate: String,
},
{
    collection: "car",
}
);

const CarModel = mongoose.model("car", carSchema)
module.exports = CarModel