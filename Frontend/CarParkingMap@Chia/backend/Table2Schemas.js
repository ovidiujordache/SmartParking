const mongoose = require("mongoose")

const table2Schema = new mongoose.Schema({
    timestamp: Date,
    motion_detected: Boolean,
    image_data: Buffer, //since mongo no data types of Blob, so using Buffer instead
},
{
    collection: "camera_Image2",
}
);

const Table2Model = mongoose.model("camera_Image2", table2Schema)
module.exports = Table2Model