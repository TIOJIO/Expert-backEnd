const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/validation', {
        // await mongoose.connect('mongodb://127.0.0.1:27017/validationCopy2', {
        // await mongoose.connect('mongodb://127.0.0.1:27017/validationCopy', {
        // await mongoose.connect('mongodb://127.0.0.1:27017/finalTest', {
        // await mongoose.connect('mongodb://127.0.0.1:27017/MS-User', {
          await mongoose.connect('mongodb+srv://tiojioromain02:HtGRmmOjJu8QPiAE@cluste1.1q2zc.mongodb.net/?retryWrites=true&w=majority&appName=Cluste1', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to db successfully...');
    } catch (error) {
        console.error('Error connecting to db:', error);
    }
}

module.exports = connectToDatabase;



















// await mongoose.connect('mongodb://127.0.0.1:27017/MS-User', {
// await mongoose.connect('mongodb://127.0.0.1:27017/test1', {
// await mongoose.connect('mongodb://127.0.0.1:27017/test2', {
// await mongoose.connect('mongodb://127.0.0.1:27017/test5', {
// await mongoose.connect('mongodb://127.0.0.1:27017/test10', {
// await mongoose.connect('mongodb://127.0.0.1:27017/arslen', {