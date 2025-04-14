const express = require('express');
const router = express.Router();

const db = require('../models/index')

// post method - creation of a new measurement
router.post('/', (req, res, next) => {
    let measurement = {
        groupName: req.body.groupName,
        value: req.body.value,
        timestamp: req.body.timestamp,
        useCaseId: req.body.useCase
    }

    db.Measurement.create(measurement)
    .then(result => {
        res.status(200).json(result)    
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
})

// get all measurement
router.get("/", (req, res, next) => {
    db.Measurement.findAll()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// get specific measurement by id
router.get("/:id", (req, res, next) => {
    let measurementId = req.params.id

    db.Measurement.findOne({ where: 
        { 'id': measurementId }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// update measurement based on measurement id
router.put("/:id", (req, res, next) => {
    let measurementId = req.params.id
    let updatedMeasurement = {
        groupName: req.body.groupName,
        value: req.body.value,
        timestamp: req.body.timestamp,
        useCase: req.body.useCase
    }
    
    db.Measurement.findOne({ where:
        { 'id': measurementId }
    })
    .then(measurement => {
        if(measurement) {
            measurement.update(updatedMeasurement)
            res.status(200).json(measurement)
        } else {
            res.status(404).json({
                error: "Measurement with given id could not be found"
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// delete measurement based on id
router.delete("/:id", (req, res, next) => {
    let measurementId = req.params.id

    db.Measurement.destroy({
        where: { 'id': measurementId }
    })
    .then(data => {
        res.status(200).json({
            data
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;