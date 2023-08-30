require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

// get data from the products.json file
const jsonProducts = require('./products.json');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany();  // delete all data in database
        await Product.create(jsonProducts);  // add data
        console.log('Successfully added Products to the database!!!')
        process.exit(0);
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
}

start();

// add data the by running this file =>
// node populate

