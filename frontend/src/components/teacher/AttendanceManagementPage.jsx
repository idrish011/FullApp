import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import AttendanceManagement from './AttendanceManagement';
import TeacherLayout from './TeacherLayout';

const AttendanceManagementPage = () => {
  return (
    <TeacherLayout title="Attendance Management" subtitle="Track and manage class attendance">
      <AttendanceManagement />
    </TeacherLayout>
  );
};

export default AttendanceManagementPage; 