const express = require('express');
const db = require('../models/index')
const router = express.Router();

// get method - health check - check if the database is connected
router.get('/database', (req, res, next) => {
    db.Measurement.findAll()
    .then(() => {
        res.status(200).json({
            message: 'OK: Database is connected',
        })    
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: "NOK: Internal server error - database could NOT be connected. Details: " + err
        });
    })
})

// get method - secret check - check if secret can be read
router.get('/secret', (req, res, next) => {
    const secret = process.env.PASSPHRASE || null

    if(secret) {
        res.status(200).json({
            message: "OK: Secret can be read"
        })
    } else {
        res.status(500).json({
            error: "NOK: Secret could NOT be read"
        })
    }
})

module.exports = router;