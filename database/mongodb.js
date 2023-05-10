const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI).then(res => console.log("MongoDB connected")).catch(err => console.log(err));

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error);
    }
};

module.exports = dbConnect;
