import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import AssignmentReview from './AssignmentReview';

const AssignmentReviewPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/teacher/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Assignment Review & Grading</Typography>
      </Breadcrumbs>

      {/* Page Title */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Assignment Review & Grading
      </Typography>

      {/* Assignment Review Component */}
      <AssignmentReview />
    </Box>
  );
};

export default AssignmentReviewPage; 