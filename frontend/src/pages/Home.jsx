import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import DesignContext from '../context/DesignContext';
import HeroImage from '../assets/images/hero-image.jpg'; // You'll need to add this image to the assets folder

const Home = () => {
  const { getDesigns, designs, getAiDesigns, aiDesigns, loading } = useContext(DesignContext);
  const [featuredDesigns, setFeaturedDesigns] = useState([]);

  useEffect(() => {
    // Fetch designs on component mount
    const fetchDesigns = async () => {
      if (designs.length === 0) {
        await getDesigns();
      }
      
      if (aiDesigns.length === 0) {
        await getAiDesigns();
      }
    };
    
    fetchDesigns();
  }, []);

  useEffect(() => {
    // Create featured designs by combining recent AI and user designs
    if (designs.length > 0 || aiDesigns.length > 0) {
      // Get 2 latest AI designs
      const latestAi = aiDesigns.slice(0, 2);
      
      // Get 4 latest regular designs (not including AI designs)
      const latestRegular = designs
        .filter(design => !design.isAIGenerated)
        .slice(0, 4);
      
      // Combine and set as featured
      setFeaturedDesigns([...latestAi, ...latestRegular]);
    }
  }, [designs, aiDesigns]);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 8,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${HeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            AI Fashion Collective
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            집단 창작이 핵심 개념
          </Typography>
          <Typography variant="body1" paragraph>
            다수의 사용자들이 참여하여 의류 디자인에 대한 평가와 수정을 공동으로 진행하고, 인공지능이 이를 학습하여 최적의 디자인을 완성하는 시스템입니다.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
            >
              시작하기
            </Button>
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              color="inherit"
              size="large"
            >
              더 알아보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          주요 기능
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                디자인 제안
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                의류 디자인을 다수의 사용자들에게 제시하고 실시간으로 의견을 수집합니다.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                평가 입력
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                AI 디자인 툴을 통해 의류 디자인에 대한 수정과 평가를 직접 진행합니다.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                인공지능 디자인 완성
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                수집된 평가를 바탕으로 인공지능이 최적의 디자인을 자동으로 생성합니다.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                개인화된 디자인
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                완성된 디자인을 사용자 개인별로 맞춤화하여 제공합니다.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Designs Section */}
      <Box sx={{ backgroundColor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            최근 디자인
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : featuredDesigns.length > 0 ? (
            <Grid container spacing={4}>
              {featuredDesigns.map((design) => (
                <Grid item key={design._id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={design.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={design.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3">
                        {design.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {design.description?.length > 100
                          ? `${design.description.substring(0, 100)}...`
                          : design.description}
                      </Typography>
                      {design.isAIGenerated && (
                        <Typography variant="caption" color="primary">
                          AI Generated
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        to={`/designs/${design._id}`}
                        size="small"
                        color="primary"
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" align="center">
              No designs available yet. Be the first to create one!
            </Typography>
          )}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/designs"
              variant="contained"
              color="primary"
              size="large"
            >
              View All Designs
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          지금 참여하세요!
        </Typography>
        <Typography variant="body1" paragraph>
          AI 패션 플랫폼에서 여러분의 창의력을 발휘하고, 다른 사용자들과 함께 새로운 디자인을 만들어보세요.
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          회원가입
        </Button>
      </Container>
    </>
  );
};

export default Home;