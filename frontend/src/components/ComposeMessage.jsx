import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Chip,
  Typography,
  Box,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../contexts/AuthContext';
import { messagesAPI } from '../services/api';

const MESSAGE_TYPES = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'event', label: 'Event' },
  { value: 'academic', label: 'Academic' },
  { value: 'emergency', label: 'Emergency' },
];
const PRIORITIES = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];
// Target types will be determined based on user role

// Roles will be fetched from API

export default function ComposeMessage({ onSent }) {
  const { user, token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('announcement');
  const [priority, setPriority] = useState('normal');
  const [targetType, setTargetType] = useState('');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load classes based on user role
  useEffect(() => {
    const loadClasses = async () => {
      try {
        if (user.role === 'teacher') {
          // Teachers can only see their own classes
          const response = await fetch('/api/academic/classes', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          setClasses(data.classes || []);
          console.log('Teacher classes loaded:', data.classes?.length || 0);
        } else if (['college_admin', 'super_admin'].includes(user.role)) {
          // College admins can see all classes in their college
          const response = await fetch('/api/academic/classes', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          setClasses(data.classes || []);
          console.log('Admin classes loaded:', data.classes?.length || 0);
        }
      } catch (err) {
        console.error('Failed to load classes:', err);
      }
    };

    if (token && ['teacher', 'college_admin', 'super_admin'].includes(user?.role)) {
      loadClasses();
    }
  }, [token, user]);

  if (!user || !['admin', 'college_admin', 'teacher', 'super_admin'].includes(user.role)) {
    return <Alert severity="warning">You do not have permission to send messages.</Alert>;
  }

  const handleAttachmentChange = (e) => {
    setAttachments([...attachments, ...Array.from(e.target.files)]);
  };

  const removeAttachment = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleClassChange = (event) => {
    const value = event.target.value;
    setSelectedClasses(typeof value === 'string' ? value.split(',') : value);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let targetIds = null;
      let finalTargetType = targetType;
      
      // Handle different target types
      if (targetType === 'class' && selectedClasses.length > 0) {
        targetIds = JSON.stringify(selectedClasses);
        finalTargetType = 'class';
      } else if (targetType === 'my-students') {
        finalTargetType = 'my-students';
      } else if (targetType === 'all-students') {
        finalTargetType = 'all-students';
      } else if (targetType === 'all-teachers') {
        finalTargetType = 'all-teachers';
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('type', type);
      formData.append('priority', priority);
      formData.append('target_type', finalTargetType);
      if (targetIds) {
        formData.append('target_ids', targetIds);
      }
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await messagesAPI.sendMessage(formData);
      
      setSuccess('Message sent successfully!');
      setTitle('');
      setContent('');
      setType('announcement');
      setPriority('normal');
      setTargetType('');
      setSelectedClasses([]);
      setAttachments([]);
      if (onSent) onSent();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
          />
          
          <TextField
            label="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />
          
          <TextField
            select
            label="Type"
            value={type}
            onChange={e => setType(e.target.value)}
            fullWidth
          >
            {MESSAGE_TYPES.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            fullWidth
          >
            {PRIORITIES.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Target"
            value={targetType}
            onChange={e => setTargetType(e.target.value)}
            fullWidth
            required
          >
            {user.role === 'teacher' ? [
              <MenuItem key="my-students" value="my-students">My Class Students</MenuItem>,
              <MenuItem key="class" value="class">Specific Classes</MenuItem>
            ] : [
              <MenuItem key="all-students" value="all-students">All Students</MenuItem>,
              <MenuItem key="all-teachers" value="all-teachers">All Teachers</MenuItem>,
              <MenuItem key="class" value="class">Specific Classes</MenuItem>
            ]}
          </TextField>
          
          {targetType === 'class' && (
            <FormControl fullWidth>
              <InputLabel>Select Classes</InputLabel>
              <Select
                multiple
                value={selectedClasses}
                onChange={handleClassChange}
                input={<OutlinedInput label="Select Classes" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const classItem = classes.find(c => c.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={classItem ? classItem.name : value} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name} ({classItem.course_name || 'No Course'})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No classes available</MenuItem>
                )}
              </Select>
              {classes.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {user.role === 'teacher' 
                    ? 'You are not assigned to any classes yet.' 
                    : 'No classes found in your college.'}
                </Typography>
              )}
            </FormControl>
          )}
          
          {targetType === 'my-students' && (
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                This message will be sent to all students in your assigned classes.
              </Typography>
            </Box>
          )}
          
          {targetType === 'all-students' && (
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                This message will be sent to all students in your college.
              </Typography>
            </Box>
          )}
          
          {targetType === 'all-teachers' && (
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                This message will be sent to all teachers in your college.
              </Typography>
            </Box>
          )}
          
          
          
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{ mb: 1 }}
            >
              Add Attachment
              <input
                type="file"
                hidden
                multiple
                onChange={handleAttachmentChange}
              />
            </Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attachments.map((file, idx) => (
                <Chip
                  key={file.name + idx}
                  label={file.name}
                  onDelete={() => removeAttachment(idx)}
                  deleteIcon={<DeleteIcon />}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Send Message
          </Button>
        </Stack>
      </Box>
  );
}
