import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Palette, 
  AutoAwesome, 
  PeopleAlt, 
  ArrowForward, 
  Lightbulb,
  Speed,
  SentimentSatisfiedAlt,
  Psychology,
  Loop,
  Share
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// 가상 사용자 리뷰 데이터
const userReviews = [
  {
    id: 1,
    name: '김민지',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: '패션 디자이너',
    comment: '인공지능과 함께 디자인을 만들어가는 과정이 매우 흥미롭습니다. 다른 사용자들의 피드백을 받으면서 디자인이 완성되어가는 과정이 놀랍습니다.',
    rating: 5
  },
  {
    id: 2,
    name: '박준호',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: '일반 사용자',
    comment: '다른 사람들의 디자인을 평가하고 피드백을 주는 것만으로도 패션에 대한 이해가 높아졌어요. 내 의견이 디자인에 반영되는 것이 신기해요!',
    rating: 4
  },
  {
    id: 3,
    name: '이소연',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: '패션 브랜드 MD',
    comment: '소비자의 의견을 실시간으로 반영할 수 있어서 트렌드를 빠르게 파악하고 적용할 수 있습니다. 비즈니스에 큰 도움이 되고 있어요.',
    rating: 5
  }
];

/**
 * 홈페이지
 * 
 * 플랫폼의 메인 랜딩 페이지로, 주요 기능과 특징을 소개합니다.
 */
const HomePage = () => {
  return (
    <Box>
      {/* 히어로 섹션 */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #512da8 100%)',
          color: 'white',
          py: 10,
          borderRadius: { xs: 0, md: '0 0 50px 50px' }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                인공지능 패션 콜렉티브
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mb: 4, fontWeight: 'light' }}
              >
                집단 지성과 AI가 만나 새로운 패션을 창조합니다
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ mb: 4, fontSize: '1.1rem' }}
              >
                사용자들의 참여로 완성되는 혁신적인 패션 디자인 플랫폼입니다. 
                당신의 아이디어가 AI의 창의력과 만나 상상하던 디자인을 현실로 만듭니다.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={RouterLink}
                  to="/design-studio"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                  startIcon={<Palette />}
                >
                  디자인 시작하기
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  component={RouterLink}
                  to="/design-evaluation"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<PeopleAlt />}
                >
                  디자인 평가하기
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://source.unsplash.com/random/600x400/?fashion,design,technology"
                alt="AI 패션 디자인"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 핵심 특징 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            주요 특징
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            인공지능을 이용한 패션플랫폼은 디자인, 평가, 제작의 전 과정을 혁신합니다
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                <AutoAwesome fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  집단 창작
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  다수의 사용자가 참여하여 의류 디자인을 평가하고 수정합니다. 개인이 아닌 집단의 지혜로 더 나은 디자인을 만듭니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', textAlign: 'center' }}>
                <Psychology fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  AI 최적화
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  인공지능이 사용자들의 평가를 학습하여 디자인을 지속적으로 발전시킵니다. 피드백이 많을수록 디자인은 더 완벽해집니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white', textAlign: 'center' }}>
                <Loop fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  실시간 협업
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  평가와 수정이 실시간으로 반영되어 디자인이 진화하는 과정을 지켜볼 수 있습니다. 모든 과정이 투명하고 개방적입니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: 'error.main', color: 'white', textAlign: 'center' }}>
                <SentimentSatisfiedAlt fontSize="large" />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  맞춤형 결과물
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  완성된 디자인은 각 사용자별로 맞춤화되어 제공됩니다. 패턴 추출부터 3D 모델링까지 다양한 형태로 활용할 수 있습니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* 작동 방식 섹션 */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              작동 방식
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: '700px', mx: 'auto' }}
            >
              단계별로 진행되는 디자인 프로세스를 통해 아이디어가 완성품으로 발전합니다
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h4">1</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  오브젝트 감지
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI가 이미지에서 의류 아이템을 자동으로 감지하고 분리합니다. 원하는 디자인 요소를 정확히 선택할 수 있습니다.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h4">2</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  텍스처 렌더링
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  감지된 의류에 다양한 텍스처를 적용해볼 수 있습니다. 원단의 종류와 패턴을 자유롭게 변경해보세요.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h4">3</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  모델 적용
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3D 모델이나 아바타에 디자인을 적용하여 실제로 착용했을 때의 모습을 확인합니다. 다양한 각도에서 살펴볼 수 있습니다.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h4">4</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  패턴 추출
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  완성된 디자인에서 재단 패턴을 자동으로 생성합니다. 실제 제작을 위한 모든 정보를 손쉽게 얻을 수 있습니다.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={RouterLink}
              to="/design-studio"
              startIcon={<Palette />}
            >
              디자인 시작하기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 특허 정보 섹션 */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: 'primary.light', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
              <Lightbulb sx={{ fontSize: 80 }} />
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography variant="h5" gutterBottom>
                특허 기술 기반
              </Typography>
              <Typography variant="body1" paragraph>
                인공지능을 이용한 패션플랫폼은 특허 출원 중인 혁신적인 기술을 기반으로 합니다. 
                사용자들의 집단 지성과 인공지능의 학습을 결합한 새로운 디자인 접근 방식입니다.
              </Typography>
              <Box>
                <Chip label="출원번호: 10-2022-0151706" sx={{ mr: 1, mb: 1, bgcolor: 'primary.dark' }} />
                <Chip label="공개번호: 10-2024-0070763" sx={{ mr: 1, mb: 1, bgcolor: 'primary.dark' }} />
                <Chip label="출원인: 장지환" sx={{ mb: 1, bgcolor: 'primary.dark' }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* 사용자 리뷰 섹션 */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              사용자 후기
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: '700px', mx: 'auto' }}
            >
              인공지능 패션 콜렉티브를 사용한 사용자들의 생생한 경험담을 확인하세요
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {userReviews.map((review) => (
              <Grid item xs={12} md={4} key={review.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={review.avatar} 
                        alt={review.name}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">
                          {review.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                      "{review.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            fontSize="small" 
                            sx={{ color: i < review.rating ? 'warning.main' : 'grey.300' }}
                          />
                        ))}
                      </Box>
                      <IconButton color="primary" size="small">
                        <Share fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          지금 바로 시작하세요
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}
        >
          인공지능 패션 콜렉티브와 함께 새로운 디자인 경험을 만나보세요.
          사용자들과 함께 만들어가는 혁신적인 패션의 세계로 여러분을 초대합니다.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          component={RouterLink}
          to="/register" 
          endIcon={<ArrowForward />}
          sx={{ py: 1.5, px: 4 }}
        >
          무료로 시작하기
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;