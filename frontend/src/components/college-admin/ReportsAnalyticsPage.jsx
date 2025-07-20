import React from 'react';
import CollegeAdminLayout from './CollegeAdminLayout';
import ReportsAnalytics from './ReportsAnalytics';

const ReportsAnalyticsPage = () => {
  return (
    <CollegeAdminLayout 
      title="Reports & Analytics" 
      subtitle="View comprehensive reports, analytics, and performance metrics"
    >
      <ReportsAnalytics />
    </CollegeAdminLayout>
  );
};

export default ReportsAnalyticsPage; 