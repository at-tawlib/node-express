require('./db/connect');
const express = require('express');
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static('./public'));


// routes
app.use('/api/v1/tasks', tasks);
app.use(notFound);
app.use(errorHandlerMiddleware);

// app.get('/api/v1/tasks')         - get all the tasks
// app.post('/api/v1/tasks')        - create a new task
// app.get('/api/v1/tasks/:id')     - get a single task
// app.patch('/api/v1/tasks/:id')   - update task
// app.delete('/api/v1/tasks/:id')  - delete task

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI).then(() => console.log('CONNECTED TO MONGO DB...'));
        app.listen(port, console.log(`server is listening on port ${3000}...`));
    } catch (error) {
        console.log(error);
    }
}

start();