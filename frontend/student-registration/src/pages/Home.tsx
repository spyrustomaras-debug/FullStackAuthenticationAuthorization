import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import { fetchCourses, selectCourses, selectCoursesLoading, selectCoursesError } from "../store/courseSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const courses = useSelector(selectCourses);
  const loading = useSelector(selectCoursesLoading);
  const error = useSelector(selectCoursesError);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <div style={{ paddingTop: "4rem" }}>
      <h1>Courses</h1>
      {loading && <p>Loading courses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <strong>{course.name}</strong> — Students: {course.students.map(s => s.user).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
