// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Define schema and model
const subjectSchema = new mongoose.Schema({
    year: String,
    subjects: [String],
});

const Subject = mongoose.model("Subject", subjectSchema);

// API endpoints

// Get all subject entries
app.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects" });
    }
});

// Add a new year or subject to a specific year
app.post("/api/subjects", async (req, res) => {
    const { year, subject } = req.body;

    try {
        // Check if a document for the year exists
        let entry = await Subject.findOne({ year });

        if (entry) {
            // Add new subject to the existing year's subject list
            entry.subjects.push(subject);
            await entry.save();
        } else {
            // Create a new year document
            entry = new Subject({ year, subjects: [subject] });
            await entry.save();
        }
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: "Error adding subject" });
    }
});

// Delete a subject from a specific year
app.delete("/api/subjects", async (req, res) => {
    const { year, subject } = req.body;

    try {
        const entry = await Subject.findOne({ year });

        if (entry) {
            entry.subjects = entry.subjects.filter((subj) => subj !== subject);
            await entry.save();
            res.status(200).json(entry);
        } else {
            res.status(404).json({ message: "Year not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting subject" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
