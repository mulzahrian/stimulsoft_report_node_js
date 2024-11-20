require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const reportRoutes = require('./routes/reportRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// Routes
app.use('/report', reportRoutes);
app.use('/upload', uploadRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
