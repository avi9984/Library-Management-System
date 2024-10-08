const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB is Connected")).catch((err) => console.log(err))

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})