import React from 'react';
import AcademicManagement from './AcademicManagement';
import CollegeAdminLayout from './CollegeAdminLayout';

const AcademicManagementPage = () => {
  return (
    <CollegeAdminLayout 
      title="Academic Management" 
      subtitle="Manage academic programs, courses, and related operations"
    >
      <AcademicManagement />
    </CollegeAdminLayout>
  );
};

export default AcademicManagementPage; 