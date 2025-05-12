import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body1" align="center">
          AI Fashion Collective - Collective Design Through AI
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} AI Fashion Collective
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <MuiLink component={Link} to="/about" color="inherit" sx={{ mx: 1 }}>
            About
          </MuiLink>
          |
          <MuiLink component={Link} to="/terms" color="inherit" sx={{ mx: 1 }}>
            Terms
          </MuiLink>
          |
          <MuiLink component={Link} to="/privacy" color="inherit" sx={{ mx: 1 }}>
            Privacy
          </MuiLink>
          |
          <MuiLink component={Link} to="/contact" color="inherit" sx={{ mx: 1 }}>
            Contact
          </MuiLink>
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Patent Pending - 10-2024-0070763
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;