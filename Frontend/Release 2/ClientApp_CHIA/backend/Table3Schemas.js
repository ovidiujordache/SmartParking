const mongoose = require("mongoose")

const table3Schema = new mongoose.Schema({
    _id: String,
    space_id: Number,
    lot_id: String,
    status: String,
    space_type: String,
    gps_latitude: Number,
    gps_longitude: Number,
    space_name: String,
},
{
    collection: "parking_space",
}
);

const Table3Model = mongoose.model("parking_space", table3Schema)
module.exports = Table3Model