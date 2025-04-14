require('dotenv').config({ path: '.env' });

const port = process.env.SERVER_PORT || 8080;
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./models/index')
const usecaseApi = require('./routes/useCaseRoutes')
const measurementApi = require('./routes/measurementRoutes');
const healthApi = require('./routes/healthRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static folder for production
let publicFolder = path.resolve(__dirname, '..')
publicFolder = path.resolve(publicFolder, '..')
app.use(express.static(path.join(publicFolder, 'build')));

// serve api 
app.use('/api/useCases', usecaseApi)
app.use('/api/measurements', measurementApi)
app.use('/api/health', healthApi)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})