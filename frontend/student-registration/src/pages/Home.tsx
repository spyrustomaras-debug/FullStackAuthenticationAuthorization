import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../store/index";

import {
  fetchCourses,
  selectCourses,
  selectCoursesLoading,
  selectCoursesError,
  fetchStudents,
  selectStudents,
  createCourse,
} from "../store/courseSlice";

import { useDebounce } from "../hooks/useDebounce";

import {
  searchStudents,
  selectSearchResults,
  selectSearchError,
  selectSearchLoading,
  clearSearchResults,
} from "../store/searchSlice";



// 📊 Import Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchGrades, selectGrades } from "../store/gradesSlice";

let debounceTimer: any;


const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const courses = useSelector(selectCourses);
  const students = useSelector(selectStudents);
  const loading = useSelector(selectCoursesLoading);
  const error = useSelector(selectCoursesError);

  const searchResults = useSelector(selectSearchResults);
  const searchLoading = useSelector(selectSearchLoading);
  const searchError = useSelector(selectSearchError);

  const [searchQuery, setSearchQuery] = useState("");

  const grades = useSelector(selectGrades) as any;

  // use the debounce hook for 5 seconds (5000ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 5000);

  // Effect for live search using the debounced Query
  useEffect(() => {
    if(debouncedSearchQuery.trim() !== ""){
      dispatch(searchStudents(debouncedSearchQuery));
    }else {
      dispatch(clearSearchResults())
    }
  },[debouncedSearchQuery,dispatch])

  const initialFormData = {
    name: "",
    description: "",
    credits: 0,
    student_ids: [] as number[],
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);


  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchStudents());
    dispatch(fetchGrades()); // << IMPORTANT: load grades
  }, [dispatch]);

  // Live search on every input change with debounce
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        dispatch(searchStudents(searchQuery));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300); // 300ms debounce
  }, [searchQuery, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, options } = e.target as HTMLSelectElement;
    if (name === "student_ids") {
      const selectedIds = Array.from(options)
        .filter(option => option.selected)
        .map(option => Number(option.value));
      setFormData({ ...formData, student_ids: selectedIds });
    } else if (name === "credits") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createCourse(formData)).unwrap();
      console.log("course created")
    } catch (err) {
      console.log("error",err)
    }    
    setModalOpen(false);
    setFormData({ name: "", description: "", credits: 0, student_ids: [] });
    dispatch(fetchCourses()); // Refresh course list
  };

  // Build a quick lookup for course id -> name
  const courseNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of courses) map.set(c.id, c.name);
      return map;
  }, [courses]);

  // 📊 Aggregate total score per subject
  // We support two shapes: Grade.subject (string) OR Grade.course (id -> Course.name)
  const chartData = useMemo(() => {
  if (!Array.isArray(grades)) return [];

  const totals = new Map<string, number>();

  for (const g of grades) {
    const subjectName = g.subject?.trim() || (g.course != null ? courseNameById.get(g.course) : undefined);
    if (!subjectName) continue;

    totals.set(subjectName, (totals.get(subjectName) || 0) + (g.score || 0));
  }

  return Array.from(totals.entries()).map(([subject, totalScore]) => ({
    subject,
    totalScore,
  }));
}, [grades, courseNameById]);



  return (
    <div style={{ paddingTop: "4rem" }}>
      <h1>Courses</h1>

      {/* Live Search Section */}
      <input
        type="text"
        placeholder="Search students..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        data-testid="search-input"  // <-- add here
        style={{ marginBottom: "1rem", width: "300px", padding: "0.5rem", marginRight:"1rem"}}
      />
      {searchLoading && <p>Searching students...</p>}
      {searchError && <p style={{ color: "red" }}>{searchError}</p>}
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((student: any) => (
            <li key={student.id}>
              {student.user} - {student.enrollment_number}
            </li>
          ))}
        </ul>
      )}

      {/* Create Course Button */}
      <button onClick={() => setModalOpen(true)} style={{ marginBottom: "1rem" }}>
        Create Course
      </button>

      {loading && <p>Loading courses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <strong>{course.name}</strong> — Students: {course.students?.length ? course.students.map(s => s.user).join(", ") : "None"}
          </li>
        ))}
      </ul>

      {/* 📊 Chart Section */}
      <h2>Total Score per Subject</h2>
      {chartData.length === 0 ? (
      <p>No grade data to display.</p>
      ) : (
      <div style={{ width: "100%", height: 420 }}>
      <ResponsiveContainer>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="subject" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalScore" name="Total Score" />
      </BarChart>
      </ResponsiveContainer>
      </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#00000099",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              margin: "5rem auto",
              width: "400px",
              borderRadius: "8px",
            }}
          >
            <h2>Create Course</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <br />
              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <br />
              <input
                name="credits"
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={handleChange}
                required
              />
              <br />
              <select
                name="student_ids"
                multiple
                value={formData.student_ids.map(String)}
                onChange={handleChange}
              >
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.user}
                  </option>
                ))}
              </select>
              <br />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
