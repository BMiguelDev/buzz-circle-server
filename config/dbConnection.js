const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch(err) {
        console.err(err);
    }
}

module.exports = connectToDB;
