import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Paper,
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Badge,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Add, 
  Palette, 
  Star, 
  Comment, 
  People, 
  BarChart,
  Visibility,
  Edit,
  Delete,
  Share,
  ArrowForward,
  CheckCircle,
  HourglassTop
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 컨텍스트 임포트 (실제 구현 시 필요)
// import { useAuth } from '../contexts/AuthContext';
// import { useDesign } from '../contexts/DesignContext';

/**
 * 대시보드 페이지
 * 
 * 사용자의 디자인 현황과 평가 정보를 보여주는 대시보드 페이지입니다.
 * 진행 중인 디자인, 완료된 디자인, 평가 참여 내역 등을 확인할 수 있습니다.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  
  // 상태 관리
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [designs, setDesigns] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  
  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // 대시보드 데이터 가져오기
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 실제로는 API 호출하여 데이터 가져오기
      // 테스트 용도로 더미 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 더미 디자인 데이터
      const dummyDesigns = [
        {
          id: 1,
          title: '미니멀 데님 재킷',
          imageUrl: 'https://source.unsplash.com/random/300x400/?denim,jacket',
          category: '아우터',
          status: 'in_progress',
          createdAt: '2025-04-01T12:00:00Z',
          updatedAt: '2025-04-20T15:30:00Z',
          stats: {
            views: 124,
            ratings: { average: 4.2, count: 18 },
            comments: 12
          },
          aiProgress: 65
        },
        {
          id: 2,
          title: '여름용 플로럴 원피스',
          imageUrl: 'https://source.unsplash.com/random/300x400/?floral,dress',
          category: '원피스',
          status: 'completed',
          createdAt: '2025-03-15T09:20:00Z',
          updatedAt: '2025-04-18T11:45:00Z',
          stats: {
            views: 345,
            ratings: { average: 4.8, count: 32 },
            comments: 27
          },
          aiProgress: 100
        },
        {
          id: 3,
          title: '스트라이프 니트 가디건',
          imageUrl: 'https://source.unsplash.com/random/300x400/?striped,cardigan',
          category: '아우터',
          status: 'completed',
          createdAt: '2025-03-10T14:15:00Z',
          updatedAt: '2025-04-15T09:30:00Z',
          stats: {
            views: 218,
            ratings: { average: 4.5, count: 24 },
            comments: 19
          },
          aiProgress: 100
        },
        {
          id: 4,
          title: '하이웨이스트 진',
          imageUrl: 'https://source.unsplash.com/random/300x400/?highwaist,jeans',
          category: '하의',
          status: 'in_progress',
          createdAt: '2025-04-10T11:20:00Z',
          updatedAt: '2025-04-19T13:40:00Z',
          stats: {
            views: 87,
            ratings: { average: 3.9, count: 11 },
            comments: 8
          },
          aiProgress: 45
        }
      ];
      
      // 더미 활동 데이터
      const dummyActivities = [
        {
          id: 1,
          type: 'design_created',
          designId: 1,
          designTitle: '미니멀 데님 재킷',
          timestamp: '2025-04-01T12:00:00Z'
        },
        {
          id: 2,
          type: 'evaluation_received',
          designId: 2,
          designTitle: '여름용 플로럴 원피스',
          evaluatorName: '김패션',
          evaluatorAvatar: 'https://i.pravatar.cc/150?img=5',
          rating: 5,
          comment: '색상과 패턴이 정말 멋져요. 여름에 딱 어울릴 것 같습니다!',
          timestamp: '2025-04-18T09:15:00Z'
        },
        {
          id: 3,
          type: 'design_completed',
          designId: 2,
          designTitle: '여름용 플로럴 원피스',
          timestamp: '2025-04-18T11:45:00Z'
        },
        {
          id: 4,
          type: 'evaluation_given',
          designId: 5,
          designTitle: '빈티지 레더 백팩',
          designerName: '박디자이너',
          rating: 4,
          timestamp: '2025-04-19T14:30:00Z'
        },
        {
          id: 5,
          type: 'ai_update',
          designId: 1,
          designTitle: '미니멀 데님 재킷',
          progressBefore: 50,
          progressAfter: 65,
          timestamp: '2025-04-20T15:30:00Z'
        }
      ];
      
      // 더미 통계 데이터
      const dummyStatistics = {
        totalDesigns: 4,
        completedDesigns: 2,
        inProgressDesigns: 2,
        totalEvaluationsGiven: 15,
        totalEvaluationsReceived: 85,
        averageRating: 4.4,
        totalViews: 774,
        participationRate: 78
      };
      
      setDesigns(dummyDesigns);
      setActivities(dummyActivities);
      setStatistics(dummyStatistics);
    } catch (err) {
      console.error('대시보드 데이터를 가져오는 중 오류가 발생했습니다:', err);
      setError('대시보드 데이터를 가져오는 중 오류가 발생했습니다. 새로고침을 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 탭 변경 핸들러
  const handleChangeTab = (_, newValue) => {
    setTabValue(newValue);
  };
  
  // 디자인 스튜디오로 이동 핸들러
  const handleCreateNewDesign = () => {
    navigate('/design-studio');
  };
  
  // 디자인 수정 핸들러
  const handleEditDesign = (designId) => {
    navigate(`/design-studio?id=${designId}`);
  };
  
  // 디자인 상세보기 핸들러
  const handleViewDesign = (designId) => {
    navigate(`/design-evaluation?id=${designId}`);
  };
  
  // 포맷팅 유틸리티 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // 활동 타입에 따른 아이콘 컴포넌트 반환
  const getActivityIcon = (type) => {
    switch (type) {
      case 'design_created':
        return <Palette color="primary" />;
      case 'evaluation_received':
        return <Star color="warning" />;
      case 'design_completed':
        return <CheckCircle color="success" />;
      case 'evaluation_given':
        return <Comment color="secondary" />;
      case 'ai_update':
        return <HourglassTop color="info" />;
      default:
        return <ArrowForward />;
    }
  };
  
  // 활동 타입에 따른 설명 텍스트 반환
  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'design_created':
        return `'${activity.designTitle}' 디자인을 생성했습니다.`;
      case 'evaluation_received':
        return `'${activity.designTitle}' 디자인에 ${activity.evaluatorName}님이 ${activity.rating}점을 평가했습니다.`;
      case 'design_completed':
        return `'${activity.designTitle}' 디자인이 완성되었습니다.`;
      case 'evaluation_given':
        return `${activity.designerName}님의 '${activity.designTitle}' 디자인에 ${activity.rating}점을 평가했습니다.`;
      case 'ai_update':
        return `'${activity.designTitle}' 디자인의 AI 진행도가 ${activity.progressBefore}%에서 ${activity.progressAfter}%로 업데이트되었습니다.`;
      default:
        return '알 수 없는 활동입니다.';
    }
  };
  
  // 디자인 카드 렌더링
  const renderDesignCard = (design) => {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} key={design.id}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={design.imageUrl}
            alt={design.title}
          />
          <Chip 
            label={design.status === 'completed' ? '완료' : '진행 중'} 
            color={design.status === 'completed' ? 'success' : 'primary'}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              fontWeight: 'bold'
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {design.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={design.category} 
              size="small" 
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {formatDate(design.createdAt)}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Grid container spacing={1}>
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <Tooltip title="조회수">
                <Badge badgeContent={design.stats.views} color="primary" max={999}>
                  <Visibility color="action" />
                </Badge>
              </Tooltip>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <Tooltip title="평점">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star color="warning" fontSize="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {design.stats.ratings.average.toFixed(1)}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
              <Tooltip title="댓글">
                <Badge badgeContent={design.stats.comments} color="secondary" max={99}>
                  <Comment color="action" />
                </Badge>
              </Tooltip>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              AI 진행도:
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={design.aiProgress}
              sx={{ height: 8, borderRadius: 4 }}
              color={design.aiProgress === 100 ? 'success' : 'primary'}
            />
            <Typography variant="caption" align="right" display="block" sx={{ mt: 0.5 }}>
              {design.aiProgress}%
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            color="primary"
            startIcon={<Visibility />}
            onClick={() => handleViewDesign(design.id)}
          >
            보기
          </Button>
          {design.status !== 'completed' && (
            <Button 
              size="small" 
              color="secondary"
              startIcon={<Edit />}
              onClick={() => handleEditDesign(design.id)}
            >
              수정
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small" color="primary">
            <Share fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>
    );
  };
  
  // 통계 카드 렌더링
  const renderStatisticsCards = () => {
    if (!statistics) return null;
    
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ p: 2, textAlign: 'center', height: '100%' }}
          >
            <Typography variant="h3" color="primary.main">
              {statistics.totalDesigns}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              전체 디자인
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ p: 2, textAlign: 'center', height: '100%' }}
          >
            <Typography variant="h3" color="success.main">
              {statistics.completedDesigns}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              완성된 디자인
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ p: 2, textAlign: 'center', height: '100%' }}
          >
            <Typography variant="h3" color="warning.main">
              {statistics.averageRating.toFixed(1)}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              평균 평점
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2} 
            sx={{ p: 2, textAlign: 'center', height: '100%' }}
          >
            <Typography variant="h3" color="info.main">
              {statistics.totalViews}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              전체 조회수
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper 
            elevation={2} 
            sx={{ p: 2, height: '100%' }}
          >
            <Typography variant="subtitle1" align="center" gutterBottom>
              평가 활동
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary.main">
                  {statistics.totalEvaluationsGiven}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  내가 한 평가
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {statistics.totalEvaluationsReceived}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  받은 평가
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper 
            elevation={2} 
            sx={{ p: 2, height: '100%' }}
          >
            <Typography variant="subtitle1" align="center" gutterBottom>
              참여율
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1.5 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  mr: 3
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={statistics.participationRate}
                  size={80}
                  thickness={4}
                  color="success"
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {`${statistics.participationRate}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                집단 디자인 창작에 적극적으로 참여하고 있습니다. 지속적인 참여로 더 좋은 디자인을 만들어보세요!
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  // 활동 히스토리 렌더링
  const renderActivityHistory = () => {
    if (activities.length === 0) {
      return (
        <Alert severity="info">
          아직 활동 내역이 없습니다.
        </Alert>
      );
    }
    
    return (
      <List>
        {activities.map((activity) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'action.hover' }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={getActivityDescription(activity)}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(activity.timestamp)}
                  </Typography>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    );
  };
  
  // 로딩 중 상태 렌더링
  const renderLoading = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
  
  // 오류 상태 렌더링
  const renderError = () => (
    <Alert severity="error" sx={{ mt: 3 }}>
      {error}
      <Button 
        color="inherit" 
        size="small" 
        onClick={fetchDashboardData} 
        sx={{ ml: 2 }}
      >
        다시 시도
      </Button>
    </Alert>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            대시보드
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateNewDesign}
          >
            새 디자인 만들기
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          나의 디자인 현황과 활동 내역을 확인하고 관리할 수 있습니다.
        </Typography>
      </Box>
      
      {error && renderError()}
      
      {isLoading ? (
        renderLoading()
      ) : (
        <>
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChart sx={{ mr: 1 }} />
                    통계
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Palette sx={{ mr: 1 }} />
                    내 디자인
                    <Badge 
                      badgeContent={designs.length} 
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ mr: 1 }} />
                    활동 내역
                    <Badge 
                      badgeContent={activities.length} 
                      color="secondary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                } 
              />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    디자인 통계
                  </Typography>
                  {renderStatisticsCards()}
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    내 디자인 목록
                  </Typography>
                  {designs.length === 0 ? (
                    <Alert severity="info">
                      아직 디자인이 없습니다. 새 디자인을 만들어보세요!
                    </Alert>
                  ) : (
                    <Grid container spacing={3}>
                      {designs.map((design) => (
                        <Grid item xs={12} sm={6} md={4} key={design.id}>
                          {renderDesignCard(design)}
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    최근 활동 내역
                  </Typography>
                  {renderActivityHistory()}
                </Box>
              )}
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              추천 디자인
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              당신이 좋아할 만한 다른 사용자의 디자인을 추천해 드립니다.
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/design-evaluation')}
            >
              더 많은 디자인 살펴보기
            </Button>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;