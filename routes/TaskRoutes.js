const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');

router.get('/tasks',
    async (req, res) => {
        try {
            const tasks = await Task.find();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });

router.get('/tasks/:id',
    getTask, (req, res) => {
        res.json(res.task);
    });

router.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        createdBy: req.body.createdBy,
        Status: req.body.Status || 'Open',
        priority: req.body.priority || 'Low',
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.patch('/tasks/:id', getTask,
    async (req, res) => {
        if (req.body.title != null) {
            res.task.title = req.body.title;
        }
        if (req.body.description != null) {
            res.task.description = req.body.description;
        }
        if (req.body.Status != null) {
            res.task.Status = req.body.Status;
        }
        if (req.body.priority != null) {
            res.task.priority = req.body.priority;
        }

        try {
            const updatedTask = await res.task.save();
            res.json(updatedTask);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    });

router.delete('/tasks/:id',
    getTask, async (req, res) => {
        try {
            // Use deleteOne method here
            await res.task.deleteOne();
            res.json({ message: 'Task deleted' });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });

async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.task = task;
    next();
}

module.exports = router;