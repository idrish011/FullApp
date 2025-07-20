import React from 'react';
import { Box } from '@mui/material';
import CollegeAdminLayout from '../../components/college-admin/CollegeAdminLayout';
import ReportsAnalytics from '../../components/college-admin/ReportsAnalytics';

const ReportsPage = () => {
  return (
    <CollegeAdminLayout 
      title="Reports & Analytics" 
      subtitle="View comprehensive reports, analytics, and performance metrics"
    >
      <ReportsAnalytics />
    </CollegeAdminLayout>
  );
};

export default ReportsPage; 