import React from 'react';
import CollegeAdminLayout from './CollegeAdminLayout';
import TeacherManagement from './TeacherManagement';

const TeacherManagementPage = () => {
  return (
    <CollegeAdminLayout 
      title="Teacher Management" 
      subtitle="Manage teachers, view profiles, and handle teacher-related operations"
    >
      <TeacherManagement />
    </CollegeAdminLayout>
  );
};

export default TeacherManagementPage; 