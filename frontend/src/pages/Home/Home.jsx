import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logout } from "../../config/firebaseConfig";
import { useNavigate } from 'react-router-dom';
import "./Home.css";

const Home = ({ setIsAuthenticated }) => {
  const [data, setData] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [subjects, setSubjects] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [facultyPreferences, setFacultyPreferences] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    console.log("Logged Out");
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      const res = await axios.get("https://subject-preference-admin.onrender.com/api/subjects");
      setData(res.data);
    };
    fetchData();
  }, [refresh]);

  const handleAddSubject = async (year) => {
    const subject = subjects[year];
    if (!subject) return alert("Enter a subject name");

    await axios.post("https://subject-preference-admin.onrender.com/api/subjects", { year, subject });
    setSubjects((prev) => ({ ...prev, [year]: "" }));
    setRefresh(!refresh);
  };

  const handleDeleteSubject = async (year, subject) => {
    await axios.delete("https://subject-preference-admin.onrender.com/api/subjects", { data: { year, subject } });
    setRefresh(!refresh);
  };

  const handleAddYear = async () => {
    if (!newYear) return alert("Enter a year");
    if (data.some((entry) => entry.year === newYear)) return alert("Year already exists");

    await axios.post("https://subject-preference-admin.onrender.com/api/subjects", { year: newYear, subject: "" });
    setNewYear("");
    setRefresh(!refresh);
  };

  // Fetch faculty preferences when the "View Responses" button is clicked
  const handleViewResponses = async () => {
    try {
      const response = await axios.get("https://subject-preference-admin.onrender.com/api/facultypreferences");
      setFacultyPreferences(response.data);
    } catch (error) {
      console.error("Error fetching faculty preferences", error);
    }
  };

  // Function to convert table data to CSV and trigger download
  const downloadCSV = () => {
    const csvData = [];
    const headers = ["Faculty Name", "Faculty Email", "Year", "First Preference", "Second Preference"];
    csvData.push(headers.join(","));

    facultyPreferences.forEach(faculty => {
      faculty.preferences.forEach((preference) => {
        const row = [
          faculty.facultyName,
          faculty.facultyEmail,
          preference.year,
          preference.firstPreference,
          preference.secondPreference
        ];
        csvData.push(row.join(","));
      });
    });

    const csvBlob = new Blob([csvData.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faculty_preferences.csv"; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">
        Admin Subject Management
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        <button onClick={handleViewResponses} className="view-responses-btn">View Responses</button>
        
      </h1>

      {/* Display faculty preferences in tabular format */}
      {facultyPreferences.length > 0 && (
        <div className="responses-table">
          <h2>Faculty Preferences</h2>
          <table>
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Faculty Email</th>
                <th>Year</th>
                <th>First Preference</th>
                <th>Second Preference</th>
              </tr>
            </thead>
            <tbody>
              {facultyPreferences.map((faculty) => (
                faculty.preferences.map((preference, index) => (
                  <tr key={`${faculty._id}-${index}`}>
                    <td>{faculty.facultyName}</td>
                    <td>{faculty.facultyEmail}</td>
                    <td>{preference.year}</td>
                    <td>{preference.firstPreference}</td>
                    <td>{preference.secondPreference}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
          {/* Save as CSV button */}
        <button onClick={downloadCSV} className="save-csv-btn">Save as CSV</button>
        </div>
      )}

      <div className="year-addition">
        <input
          type="text"
          className="new-year-input"
          placeholder="Enter new year"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
        />
        <button onClick={handleAddYear} className="add-year-btn">Add Year</button>
      </div>

      {data.map((entry) => (
        <div key={entry.year} className="subject-container">
          <h3 className="year-title">{entry.year}</h3>
          <ul className="subject-list">
            {entry.subjects.map((subject, idx) => (
              <li key={idx} className="subject-item">
                {subject}
                <button onClick={() => handleDeleteSubject(entry.year, subject)} className="delete-btn">
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="subject-input"
            placeholder="Enter subject name"
            value={subjects[entry.year] || ""}
            onChange={(e) => setSubjects((prev) => ({ ...prev, [entry.year]: e.target.value }))}
          />
          <button onClick={() => handleAddSubject(entry.year)} className="add-subject-btn">Add Subject</button>
        </div>
      ))}
    </div>
  );
};

export default Home;
