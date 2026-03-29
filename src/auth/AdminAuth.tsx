import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  InputAdornment, 
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  Pets as PetsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import './AdminAuth.css';

interface AdminCredentials {
  email: string;
  password: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const AdminAuth: React.FC = () => {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const adminUser = localStorage.getItem('pawfinderAdminUser');
    if (adminUser) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, using mock data
      // In a real app, this would be an API call
      
      // Add artificial delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock authentication logic
      if (credentials.email === 'admin@pawfinder.com' && credentials.password === 'admin123') {
        const mockUser: AdminUser = {
          id: '1',
          name: 'Admin User',
          email: credentials.email,
          role: 'Administrator',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6a5acd&color=fff'
        };
        
        // Store user info in localStorage
        localStorage.setItem('pawfinderAdminUser', JSON.stringify(mockUser));
        
        // Add console log for debugging
        console.log('Authentication successful, redirecting...');
        
        // Redirect to dashboard
        navigate('/admin', { replace: true });
      } else {
        console.log('Invalid credentials:', credentials);
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="admin-auth-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#f8f9fa",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#6a5acd",
            },
            links: {
              color: "#6a5acd",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 50,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
      
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper 
            elevation={12} 
            sx={{ 
              p: 4, 
              mt: 8, 
              borderRadius: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(106, 90, 205, 0.2)'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
              >
                <Avatar 
                  sx={{ 
                    m: 1, 
                    bgcolor: 'primary.main',
                    width: 60, 
                    height: 60
                  }}
                >
                  <PetsIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>
              
              <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                PawFinder Admin
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                Access the administration dashboard
              </Typography>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="error-container"
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    variant="outlined"
                    value={credentials.email}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                      borderRadius: 2
                    }}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    variant="outlined"
                    value={credentials.password}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={toggleShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                      borderRadius: 2
                    }}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 1,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 5,
                      position: 'relative',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 15px rgba(106, 90, 205, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 25px rgba(106, 90, 205, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      For demo use: admin@pawfinder.com / admin123
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      © {new Date().getFullYear()} PawFinder. All rights reserved.
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminAuth;