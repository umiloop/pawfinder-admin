import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Button,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Chip,
  Stack,
  Tooltip,
  LinearProgress,
  linearProgressClasses,
} from '@mui/material';
import {
  Pets as PetsIcon,
  AssignmentTurnedIn as AdoptionIcon,
  People as UsersIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  Event as EventIcon,
  FindInPage as LostIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Add this after your imports
const TypeSafeGrid = Grid as any;

// Styled components
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
    transform: 'translateY(-3px)',
  },
}));

const DashboardOverview: React.FC = () => {
  const theme = useTheme();

  // Chart options for adoption trends
  const adoptionChartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
    legend: {
      position: 'top'
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    }
  };

  const adoptionChartSeries = [
    {
      name: 'Adoption Requests',
      data: [31, 40, 28, 51, 42, 82, 56, 45, 60, 54]
    },
    {
      name: 'Successful Adoptions',
      data: [11, 32, 25, 40, 33, 65, 45, 35, 52, 41]
    }
  ];

  // Chart options for pet distribution
  const petDistributionOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    legend: {
      position: 'bottom'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              label: 'Total Pets',
            }
          }
        }
      }
    }
  };

  const petDistributionSeries = [45, 25, 20, 10];
  
  // Recent adoption data
  const recentAdoptions = [
    {
      id: 1,
      pet: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever',
      adopter: 'John Smith',
      date: '2023-05-02',
      status: 'Approved'
    },
    {
      id: 2,
      pet: 'Luna',
      type: 'Cat',
      breed: 'Siamese',
      adopter: 'Sarah Johnson',
      date: '2023-04-30',
      status: 'Pending'
    },
    {
      id: 3,
      pet: 'Rocky',
      type: 'Dog',
      breed: 'German Shepherd',
      adopter: 'Mike Brown',
      date: '2023-04-28',
      status: 'Approved'
    },
    {
      id: 4,
      pet: 'Bella',
      type: 'Cat',
      breed: 'Maine Coon',
      adopter: 'Emily Wilson',
      date: '2023-04-27',
      status: 'Under Review'
    },
  ];

  // Recent events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Adoption Drive',
      date: '2023-05-15',
      location: 'City Park',
      attendees: 45
    },
    {
      id: 2,
      title: 'Pet Vaccination Camp',
      date: '2023-05-20',
      location: 'Community Center',
      attendees: 32
    },
    {
      id: 3,
      title: 'Pet Training Workshop',
      date: '2023-05-28',
      location: 'Pet Smart Center',
      attendees: 18
    }
  ];

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
          Welcome to PawFinder Admin
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening today
        </Typography>
      </Box>

      {/* Stats Row */}
      <TypeSafeGrid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Pets */}
        <TypeSafeGrid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariant}>
            <StatsCard elevation={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                  <PetsIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Total Pets
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    <CountUp end={125} duration={2.5} />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main" fontWeight="bold" sx={{ ml: 0.5 }}>
                      +12%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StatsCard>
          </motion.div>
        </TypeSafeGrid>
        
        {/* Adoption Requests */}
        <TypeSafeGrid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariant}>
            <StatsCard elevation={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, mr: 2 }}>
                  <AdoptionIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Adoptions
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    <CountUp end={38} duration={2} />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main" fontWeight="bold" sx={{ ml: 0.5 }}>
                      +8%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StatsCard>
          </motion.div>
        </TypeSafeGrid>
        
        {/* Users */}
        <TypeSafeGrid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariant}>
            <StatsCard elevation={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mr: 2 }}>
                  <UsersIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    <CountUp end={542} duration={2.75} />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main" fontWeight="bold" sx={{ ml: 0.5 }}>
                      +24%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StatsCard>
          </motion.div>
        </TypeSafeGrid>
        
        {/* Reports */}
        <TypeSafeGrid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariant}>
            <StatsCard elevation={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56, mr: 2 }}>
                  <LostIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Lost Reports
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    <CountUp end={18} duration={1.5} />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon color="error" fontSize="small" />
                    <Typography variant="caption" color="error.main" fontWeight="bold" sx={{ ml: 0.5 }}>
                      -3%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StatsCard>
          </motion.div>
        </TypeSafeGrid>
      </TypeSafeGrid>

      {/* Charts Row */}
      <TypeSafeGrid container spacing={3} sx={{ mb: 4 }}>
        {/* Adoption Trends Chart */}
        <TypeSafeGrid item xs={12} md={8}>
          <motion.div variants={itemVariant}>
            <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
              <CardHeader
                title="Adoption Trends"
                subheader="Last 10 months"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <ReactApexChart 
                  options={adoptionChartOptions} 
                  series={adoptionChartSeries} 
                  type="area" 
                  height={350} 
                />
              </CardContent>
            </Card>
          </motion.div>
        </TypeSafeGrid>
        
        {/* Pet Distribution Chart */}
        <TypeSafeGrid item xs={12} md={4}>
          <motion.div variants={itemVariant}>
            <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
              <CardHeader
                title="Pet Distribution"
                subheader="By animal type"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <ReactApexChart 
                  options={petDistributionOptions} 
                  series={petDistributionSeries}
                  labels={['Dogs', 'Cats', 'Birds', 'Others']} 
                  type="donut" 
                  height={350} 
                />
              </CardContent>
            </Card>
          </motion.div>
        </TypeSafeGrid>
      </TypeSafeGrid>

      {/* Activities Row */}
      <TypeSafeGrid container spacing={3}>
        {/* Recent Adoptions */}
        <TypeSafeGrid item xs={12} md={6}>
          <motion.div variants={itemVariant}>
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardHeader
                title="Recent Adoption Requests"
                action={
                  <Tooltip title="More actions">
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <List sx={{ p: 0 }}>
                  {recentAdoptions.map((adoption) => (
                    <React.Fragment key={adoption.id}>
                      <ListItem
                        alignItems="flex-start"
                        secondaryAction={
                          <Chip 
                            label={adoption.status} 
                            size="small" 
                            color={
                              adoption.status === 'Approved' ? 'success' : 
                              adoption.status === 'Pending' ? 'warning' : 'primary'
                            }
                          />
                        }
                        sx={{ px: 0 }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PetsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="medium">
                              {adoption.pet} ({adoption.breed})
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {adoption.adopter}
                              </Typography>
                              {` — ${adoption.date}`}
                            </>
                          }
                        />
                      </ListItem>
                      {adoption.id !== recentAdoptions.length && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All Requests
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        </TypeSafeGrid>

        {/* Upcoming Events */}
        <TypeSafeGrid item xs={12} md={6}>
          <motion.div variants={itemVariant}>
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardHeader
                title="Upcoming Events"
                action={
                  <Tooltip title="More actions">
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <List sx={{ p: 0 }}>
                  {upcomingEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{ px: 0 }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <EventIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="medium">
                              {event.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {event.date}
                              </Typography>
                              {` — ${event.location} (${event.attendees} attendees)`}
                            </>
                          }
                        />
                      </ListItem>
                      {event.id !== upcomingEvents.length && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                >
                  Manage Events
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        </TypeSafeGrid>

        {/* Completeness Dashboard */}
        <TypeSafeGrid item xs={12}>
          <motion.div variants={itemVariant}>
            <Card elevation={1} sx={{ borderRadius: 2, mt: 2 }}>
              <CardHeader
                title="Dashboard Completeness"
                subheader="Complete these items to improve the admin experience"
              />
              <CardContent>
                <TypeSafeGrid container spacing={3}>
                  <TypeSafeGrid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Profile Completion</Typography>
                        <Typography variant="body2" fontWeight="bold">85%</Typography>
                      </Box>
                      <StyledLinearProgress 
                        variant="determinate" 
                        value={85} 
                        sx={{ [`& .${linearProgressClasses.bar}`]: { backgroundColor: theme.palette.success.main } }} 
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Pet Database</Typography>
                        <Typography variant="body2" fontWeight="bold">70%</Typography>
                      </Box>
                      <StyledLinearProgress 
                        variant="determinate" 
                        value={70} 
                        sx={{ [`& .${linearProgressClasses.bar}`]: { backgroundColor: theme.palette.primary.main } }} 
                      />
                    </Box>
                  </TypeSafeGrid>
                  <TypeSafeGrid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">User Management</Typography>
                        <Typography variant="body2" fontWeight="bold">60%</Typography>
                      </Box>
                      <StyledLinearProgress 
                        variant="determinate" 
                        value={60} 
                        sx={{ [`& .${linearProgressClasses.bar}`]: { backgroundColor: theme.palette.warning.main } }} 
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Event Planning</Typography>
                        <Typography variant="body2" fontWeight="bold">40%</Typography>
                      </Box>
                      <StyledLinearProgress 
                        variant="determinate" 
                        value={40} 
                        sx={{ [`& .${linearProgressClasses.bar}`]: { backgroundColor: theme.palette.error.main } }} 
                      />
                    </Box>
                  </TypeSafeGrid>
                </TypeSafeGrid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  Complete Setup
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        </TypeSafeGrid>
      </TypeSafeGrid>
    </motion.div>
  );
};

export default DashboardOverview;