import React from 'react';
import CollegeAdminLayout from './CollegeAdminLayout';
import AdmissionInquiry from './AdmissionInquiry';

const AdmissionInquiryPage = () => {
  return (
    <CollegeAdminLayout 
      title="Admission Inquiry Management" 
      subtitle="Manage student admission inquiries, review applications, and update status"
    >
      <AdmissionInquiry />
    </CollegeAdminLayout>
  );
};

export default AdmissionInquiryPage; 