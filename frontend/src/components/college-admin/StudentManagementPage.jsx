import React from 'react';
import CollegeAdminLayout from './CollegeAdminLayout';
import StudentManagement from './StudentManagement';

const StudentManagementPage = () => {
  return (
    <CollegeAdminLayout 
      title="Student Management" 
      subtitle="Manage students, view profiles, and handle student-related operations"
    >
      <StudentManagement />
    </CollegeAdminLayout>
  );
};

export default StudentManagementPage; 