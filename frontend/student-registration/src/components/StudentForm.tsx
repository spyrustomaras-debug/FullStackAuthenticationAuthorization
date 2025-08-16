import React from "react";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StudentForm: React.FC<Props> = ({ formData, handleChange }) => {
  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4";

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Student Registration</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="text"
        name="enrollment_number"
        placeholder="Enrollment Number"
        value={formData.enrollment_number || ""}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="date"
        name="date_of_birth"
        placeholder="Date of Birth"
        value={formData.date_of_birth || ""}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="text"
        name="grade_level"
        placeholder="Grade Level"
        value={formData.grade_level || ""}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address || ""}
        onChange={handleChange}
        className={inputClasses}
      />
      <input
        type="text"
        name="phone_number"
        placeholder="Phone Number"
        value={formData.phone_number || ""}
        onChange={handleChange}
        className={inputClasses}
      />
    </div>
  );
};

export default StudentForm;
