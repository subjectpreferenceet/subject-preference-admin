import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Define Subject Schema and Model
const subjectSchema = new mongoose.Schema({
    year: String,
    subjects: [String],
});

const Subject = mongoose.model("Subject", subjectSchema);

// Define FacultyPreferences Schema and Model
const facultyPreferencesSchema = new mongoose.Schema({
    facultyName: String,
    facultyEmail: String,
    preferences: [
        {
            year: String,
            firstPreference: String,
            secondPreference: String,
        },
    ],
});

const FacultyPreferences = mongoose.model("FacultyPreferences", facultyPreferencesSchema);

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

// API endpoint to fetch faculty preferences responses
app.get("/api/facultypreferences", async (req, res) => {
    try {
        const responses = await FacultyPreferences.find();
        res.json(responses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching faculty preferences" });
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

// Add faculty preferences (example POST request for saving faculty preferences)
app.post("/api/facultypreferences", async (req, res) => {
    const { facultyName, facultyEmail, preferences } = req.body;

    try {
        const newPreferences = new FacultyPreferences({
            facultyName,
            facultyEmail,
            preferences,
        });

        await newPreferences.save();
        res.status(201).json(newPreferences);
    } catch (error) {
        res.status(500).json({ message: "Error saving faculty preferences" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
