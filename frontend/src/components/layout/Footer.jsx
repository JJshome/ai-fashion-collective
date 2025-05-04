import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              AI 패션 콜렉티브
            </Typography>
            <Typography variant="body2" color="text.secondary">
              인공지능과 집단 지성을 활용하여 더 나은 패션 디자인을 함께 만드는 플랫폼
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              © {new Date().getFullYear()} 장지환. 모든 권리 보유.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              빠른 링크
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              홈
            </Link>
            <Link component={RouterLink} to="/design-studio" color="inherit" display="block" sx={{ mb: 1 }}>
              디자인 스튜디오
            </Link>
            <Link component={RouterLink} to="/design-evaluation" color="inherit" display="block" sx={{ mb: 1 }}>
              디자인 평가
            </Link>
            <Link component={RouterLink} to="/dashboard" color="inherit" display="block">
              대시보드
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              특허 정보
            </Typography>
            <Typography variant="body2" color="text.secondary">
              출원번호: 10-2022-0151706
            </Typography>
            <Typography variant="body2" color="text.secondary">
              출원일자: 2022년 11월 14일
            </Typography>
            <Typography variant="body2" color="text.secondary">
              공개번호: 10-2024-0070763
            </Typography>
            <Typography variant="body2" color="text.secondary">
              공개일자: 2024년 05월 22일
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box>
            <Link href="/patent-info" color="inherit" sx={{ mr: 2 }}>
              특허 정보
            </Link>
            <Link href="/terms" color="inherit" sx={{ mr: 2 }}>
              이용약관
            </Link>
            <Link href="/privacy" color="inherit">
              개인정보처리방침
            </Link>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            인공지능을 이용한 패션플랫폼 - 집단 창작이 핵심 개념
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;