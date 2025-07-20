import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Stack,
  MenuItem,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Fade,
  Slide,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
  Send as SendIcon,
  Inbox as InboxIcon,
  Outbox as OutboxIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  PriorityHigh as PriorityHighIcon,
  Emergency as EmergencyIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { messagesAPI } from '../services/api';
import ComposeMessage from './ComposeMessage';
import AdminLayout from './AdminLayout';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`message-tabpanel-${index}`}
      aria-labelledby={`message-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function Messages() {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const messageTypes = ['announcement', 'event', 'academic', 'emergency', 'personal'];
  const priorities = ['low', 'normal', 'high', 'urgent'];

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading messages for user:', user?.id, user?.role);
      
      // Load received messages
      const receivedResponse = await messagesAPI.getMessages();
      const received = receivedResponse.data.messages || [];
      console.log('Received messages:', received.length);
      setReceivedMessages(received);
      
      // Load sent messages
      const sentResponse = await messagesAPI.getSentMessages();
      const sent = sentResponse.data.messages || [];
      console.log('Sent messages:', sent.length);
      setSentMessages(sent);
      
      setMessages([...received, ...sentMessages]);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(`Failed to load messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await messagesAPI.deleteMessage(messageId);
      loadMessages();
    } catch (error) {
      setError('Failed to delete message');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'normal': return 'primary';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'emergency': return 'error';
      case 'academic': return 'primary';
      case 'event': return 'success';
      case 'announcement': return 'warning';
      case 'personal': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return <EmergencyIcon />;
      case 'academic': return <SchoolIcon />;
      case 'event': return <EventIcon />;
      case 'announcement': return <InfoIcon />;
      case 'personal': return <PersonIcon />;
      default: return <MessageIcon />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getCurrentMessages = () => {
    const messages = tabValue === 0 ? receivedMessages : sentMessages;
    return messages.filter(message => {
      const matchesSearch = message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           message.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !filterType || message.type === filterType;
      const matchesPriority = !filterPriority || message.priority === filterPriority;
      
      return matchesSearch && matchesType && matchesPriority;
    });
  };

  const canCompose = ['admin', 'college_admin', 'teacher', 'super_admin'].includes(user?.role);
  const isTeacher = user?.role === 'teacher';
  const isCollegeAdmin = user?.role === 'college_admin';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          bgcolor: 'background.default',
          background: (theme) => theme.palette.background.gradient || theme.palette.background.default,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Compose Button */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        {canCompose && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setComposeOpen(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Compose Message
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="dashboardCard">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom>
                    Received Messages
                  </Typography>
                  <Typography variant="h4">
                    {receivedMessages.length}
                  </Typography>
                </Box>
                <InboxIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="dashboardCard">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom>
                    Sent Messages
                  </Typography>
                  <Typography variant="h4">
                    {sentMessages.length}
                  </Typography>
                </Box>
                <OutboxIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="dashboardCard">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom>
                    Unread Messages
                  </Typography>
                  <Typography variant="h4">
                    {receivedMessages.filter(m => !m.is_read).length}
                  </Typography>
                </Box>
                <Badge badgeContent={receivedMessages.filter(m => !m.is_read).length} color="error">
                  <MessageIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="dashboardCard">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" gutterBottom>
                    Total Messages
                  </Typography>
                  <Typography variant="h4">
                    {receivedMessages.length + sentMessages.length}
                  </Typography>
                </Box>
                <SendIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

        {/* Main Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            background: (theme) => theme.palette.card.background,
            border: (theme) => theme.palette.card.border,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="message tabs"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                  fontWeight: 600,
                }
              }}
            >
              <Tab 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <InboxIcon />
                    Received Messages
                    <Badge badgeContent={receivedMessages.filter(m => !m.is_read).length} color="error" />
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <OutboxIcon />
                    Sent Messages
                  </Box>
                } 
              />
            </Tabs>
          </Box>

          {/* Filters */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Message Type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  InputProps={{
                    startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {messageTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  {priorities.map(priority => (
                    <MenuItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Messages List */}
          <TabPanel value={tabValue} index={0}>
            <MessagesList 
              messages={getCurrentMessages()}
              onView={handleViewMessage}
              onDelete={handleDeleteMessage}
              user={user}
              getPriorityColor={getPriorityColor}
              getTypeColor={getTypeColor}
              getTypeIcon={getTypeIcon}
              formatDate={formatDate}
              showDelete={false}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <MessagesList 
              messages={getCurrentMessages()}
              onView={handleViewMessage}
              onDelete={handleDeleteMessage}
              user={user}
              getPriorityColor={getPriorityColor}
              getTypeColor={getTypeColor}
              getTypeIcon={getTypeIcon}
              formatDate={formatDate}
              showDelete={true}
            />
          </TabPanel>
        </Paper>

        {/* Compose Message Dialog */}
        <Dialog 
          open={composeOpen} 
          onClose={() => setComposeOpen(false)}
          maxWidth="md"
          fullWidth
          TransitionComponent={Slide}
          transitionDuration={300}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <MessageIcon />
              <Typography variant="h6">
                Compose Message
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <ComposeMessage 
              onSent={() => {
                setComposeOpen(false);
                loadMessages();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* View Message Dialog */}
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
          TransitionComponent={Slide}
          transitionDuration={300}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              {selectedMessage && getTypeIcon(selectedMessage.type)}
              <Typography variant="h6">
                {selectedMessage?.title}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedMessage && (
              <Box>
                <Box display="flex" gap={2} mb={2}>
                  <Chip 
                    label={selectedMessage.type} 
                    color={getTypeColor(selectedMessage.type)}
                    icon={getTypeIcon(selectedMessage.type)}
                  />
                  <Chip 
                    label={selectedMessage.priority} 
                    color={getPriorityColor(selectedMessage.priority)}
                  />
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedMessage.content}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    From: {selectedMessage.sender_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(selectedMessage.created_at)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}

function MessagesList({ messages, onView, onDelete, user, getPriorityColor, getTypeColor, getTypeIcon, formatDate, showDelete }) {
  if (messages.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No messages found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {showDelete ? 'You haven\'t sent any messages yet.' : 'You don\'t have any received messages.'}
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {messages.map((message, index) => (
        <Fade in={true} timeout={300 + index * 100} key={message.id}>
          <ListItem
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getTypeColor(message.type) }}>
                {getTypeIcon(message.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {message.title}
                  </Typography>
                  {!message.is_read && (
                    <Badge color="primary" variant="dot" />
                  )}
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {message.content.length > 100 
                      ? `${message.content.substring(0, 100)}...` 
                      : message.content
                    }
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip 
                      label={message.type} 
                      size="small"
                      color={getTypeColor(message.type)}
                      icon={getTypeIcon(message.type)}
                    />
                    <Chip 
                      label={message.priority} 
                      size="small"
                      color={getPriorityColor(message.priority)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(message.created_at)}
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <Box display="flex" gap={1}>
              <Tooltip title="View Message">
                <IconButton onClick={() => onView(message)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              {showDelete && (
                <Tooltip title="Delete Message">
                  <IconButton onClick={() => onDelete(message.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </ListItem>
        </Fade>
      ))}
    </List>
  );
}

// MessagesPage component that wraps Messages with AdminLayout
const MessagesPage = () => {
  const { user } = useContext(AuthContext);
  const isTeacher = user?.role === 'teacher';
  const isCollegeAdmin = user?.role === 'college_admin';
  
  const getTitle = () => {
    if (isTeacher) return 'Teacher Messages';
    if (isCollegeAdmin) return 'College Admin Messages';
    return 'Messages';
  };
  
  const getSubtitle = () => {
    if (isTeacher) return 'Manage and communicate with your students';
    if (isCollegeAdmin) return 'Manage and communicate with your college community';
    return 'Manage and communicate with your community';
  };

  return (
    <AdminLayout title={getTitle()} subtitle={getSubtitle()}>
      <Messages />
    </AdminLayout>
  );
};

export default MessagesPage; 