import React from 'react';
import "./Home.css";
import axios from "axios";
import { useState, useEffect } from 'react';
import { logout } from '../../../../../client/frontend/src/config/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Home = ({ setIsAuthenticated }) => {
  const [data, setData] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [subjects, setSubjects] = useState({});
  const [refresh, setRefresh] = useState(false);
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
      const res = await axios.get("http://localhost:5000/api/subjects");
      setData(res.data);
    };

    fetchData();
  }, [refresh]);

  const handleAddSubject = async (year) => {
    const subject = subjects[year];
    if (!subject) return alert("Enter a subject name");

    await axios.post("http://localhost:5000/api/subjects", { year, subject });
    setSubjects((prev) => ({ ...prev, [year]: "" }));
    setRefresh(!refresh);
  };

  const handleDeleteSubject = async (year, subject) => {
    await axios.delete("http://localhost:5000/api/subjects", { data: { year, subject } });
    setRefresh(!refresh);
  };

  const handleAddYear = async () => {
    if (!newYear) return alert("Enter a year");
    if (data.some((entry) => entry.year === newYear)) return alert("Year already exists");

    await axios.post("http://localhost:5000/api/subjects", { year: newYear, subject: "" });
    setNewYear("");
    setRefresh(!refresh);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Admin Subject Management 
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </h1>

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
