import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AssignmentManagement from './AssignmentManagement';
import AssignmentReview from './AssignmentReview';
import TeacherLayout from './TeacherLayout';

const AssignmentManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <TeacherLayout title="Assignments" subtitle="Manage, review, and grade assignments">
      <Box>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Assignment List" />
          <Tab label="Review & Grading" />
        </Tabs>
        {activeTab === 0 && <AssignmentManagement />}
        {activeTab === 1 && <AssignmentReview />}
      </Box>
    </TeacherLayout>
  );
};

export default AssignmentManagementPage; 