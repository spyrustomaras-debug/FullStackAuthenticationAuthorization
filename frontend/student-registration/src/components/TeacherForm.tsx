import React from "react";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TeacherForm: React.FC<Props> = ({ formData, handleChange }) => {
  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4";

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Teacher Registration</h2>

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
        name="employee_id"
        placeholder="Employee ID"
        value={formData.employee_id || ""}
        onChange={handleChange}
        className={inputClasses}
        required
      />
      <input
        type="text"
        name="specialization"
        placeholder="Specialization"
        value={formData.specialization || ""}
        onChange={handleChange}
        className={inputClasses}
      />
      <input
        type="number"
        name="years_of_experience"
        placeholder="Years of Experience"
        value={formData.years_of_experience || ""}
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
      <input
        type="text"
        name="office_address"
        placeholder="Office Address"
        value={formData.office_address || ""}
        onChange={handleChange}
        className={inputClasses}
      />
    </div>
  );
};

export default TeacherForm;
