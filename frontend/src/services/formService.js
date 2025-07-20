import { 
  departmentsAPI, 
  coursesAPI, 
  classesAPI, 
  assignmentsAPI, 
  attendanceAPI, 
  gradesAPI, 
  feeStructuresAPI,
  adminAPI,
  academicAPI,
  feesAPI,
  formUtils 
} from './api';

// Form validation schemas
const validationSchemas = {
  department: {
    required: ['name', 'code'],
    optional: ['description', 'head_teacher_id']
  },
  course: {
    required: ['department_id', 'name', 'code'],
    optional: ['description', 'credits', 'duration_months', 'fee_amount']
  },
  class: {
    required: ['course_id', 'semester_id', 'teacher_id', 'name'],
    optional: ['schedule', 'room_number', 'max_students']
  },
  assignment: {
    required: ['class_id', 'title', 'due_date'],
    optional: ['description', 'max_score', 'assignment_type']
  },
  attendance: {
    required: ['class_id', 'date', 'attendance_data'],
    optional: []
  },
  grade: {
    required: ['assignment_id', 'student_id', 'grade_percentage'],
    optional: ['grade_letter', 'feedback']
  },
  feeStructure: {
    required: ['course_id', 'academic_year_id', 'fee_type', 'amount'],
    optional: ['due_date', 'is_optional']
  },
  user: {
    required: ['username', 'email', 'password', 'first_name', 'last_name', 'role'],
    optional: ['college_id', 'phone', 'date_of_birth', 'gender', 'address']
  },
  college: {
    required: ['name'],
    optional: ['domain', 'logo_url', 'address', 'contact_email', 'contact_phone', 'subscription_plan']
  }
};

// Department Form Service
export const departmentFormService = {
  async createDepartment(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.department.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await departmentsAPI.create(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.department
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateDepartment(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.department.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await departmentsAPI.update(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.department
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteDepartment(id) {
    try {
      const response = await departmentsAPI.delete(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Course Form Service
export const courseFormService = {
  async createCourse(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.course.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await coursesAPI.create(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.course
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateCourse(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.course.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await coursesAPI.update(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.course
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteCourse(id) {
    try {
      const response = await coursesAPI.delete(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Class Form Service
export const classFormService = {
  async createClass(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.class.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await classesAPI.create(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.class
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateClass(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.class.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await classesAPI.update(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.class
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteClass(id) {
    try {
      const response = await classesAPI.delete(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Assignment Form Service
export const assignmentFormService = {
  async createAssignment(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.assignment.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await assignmentsAPI.create(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.assignment
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateAssignment(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.assignment.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await assignmentsAPI.update(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.assignment
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteAssignment(id) {
    try {
      const response = await assignmentsAPI.delete(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Attendance Form Service
export const attendanceFormService = {
  async markAttendance(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.attendance.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      // Validate attendance_data array
      if (!Array.isArray(formData.attendance_data) || formData.attendance_data.length === 0) {
        throw new Error('Attendance data must be a non-empty array');
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await attendanceAPI.markAttendance(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateAttendance(id, formData) {
    try {
      const formattedData = formUtils.formatFormData(formData);
      const response = await attendanceAPI.updateAttendance(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.attendance
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Grade Form Service
export const gradeFormService = {
  async submitGrade(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.grade.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await gradesAPI.submitGrade(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.grade
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateGrade(id, formData) {
    try {
      const formattedData = formUtils.formatFormData(formData);
      const response = await gradesAPI.updateGrade(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.grade
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Fee Structure Form Service
export const feeStructureFormService = {
  async createFeeStructure(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.feeStructure.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await feeStructuresAPI.create(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.feeStructure
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateFeeStructure(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.feeStructure.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await feeStructuresAPI.update(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.feeStructure
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteFeeStructure(id) {
    try {
      const response = await feeStructuresAPI.delete(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// User Form Service
export const userFormService = {
  async createUser(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.user.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await adminAPI.createUser(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateUser(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.user.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await adminAPI.updateUser(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteUser(id) {
    try {
      const response = await adminAPI.deleteUser(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// College Form Service
export const collegeFormService = {
  async createCollege(formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.college.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await adminAPI.createCollege(formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.college
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async updateCollege(id, formData) {
    try {
      const errors = formUtils.validateFormData(formData, validationSchemas.college.required);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed: ' + Object.values(errors).join(', '));
      }

      const formattedData = formUtils.formatFormData(formData);
      const response = await adminAPI.updateCollege(id, formattedData);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response),
        data: response.data.college
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  },

  async deleteCollege(id) {
    try {
      const response = await adminAPI.deleteCollege(id);
      return {
        success: true,
        message: formUtils.handleApiSuccess(response)
      };
    } catch (error) {
      return {
        success: false,
        message: formUtils.handleApiError(error),
        error
      };
    }
  }
};

// Export all form services
export const formServices = {
  department: departmentFormService,
  course: courseFormService,
  class: classFormService,
  assignment: assignmentFormService,
  attendance: attendanceFormService,
  grade: gradeFormService,
  feeStructure: feeStructureFormService,
  user: userFormService,
  college: collegeFormService
};

export default formServices; 