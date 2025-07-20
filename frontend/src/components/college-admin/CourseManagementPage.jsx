import React from 'react';
import CollegeAdminLayout from './CollegeAdminLayout';
import CourseManagement from './CourseManagement';

const CourseManagementPage = () => {
  return (
    <CollegeAdminLayout 
      title="Course Management" 
      subtitle="Manage courses, curriculum, and academic programs"
    >
      <CourseManagement />
    </CollegeAdminLayout>
  );
};

export default CourseManagementPage; 