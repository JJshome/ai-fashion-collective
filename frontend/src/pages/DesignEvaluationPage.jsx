import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Rating,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  LinearProgress
} from '@mui/material';
import { 
  ThumbUp, 
  ThumbDown, 
  Comment, 
  Star, 
  StarBorder, 
  Save,
  Share,
  Edit,
  People,
  AccessTime,
  Refresh,
  Check,
  Close
} from '@mui/icons-material';

// 컨텍스트 임포트 (실제 구현 시 필요)
// import { useAuth } from '../contexts/AuthContext';
// import { useDesign } from '../contexts/DesignContext';

/**
 * 디자인 평가 페이지
 * 
 * 사용자들이 다른 사용자의 디자인을 평가하고 피드백을 제공할 수 있는 페이지입니다.
 * 디자인에 대한 평가를 인공지능이 반영하여 최종 디자인을 완성합니다.
 * 특허의 '평가 입력부'와 '디자인 제안부' 기능을 구현합니다.
 */
const DesignEvaluationPage = () => {
  // 디자인 목록 상태
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // 평가 및 피드백 상태
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 실시간 업데이트 및 AI 처리 상태
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiProcessed, setAiProcessed] = useState(false);
  
  // 대화 상자 상태
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  
  // 알림 상태
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // 컴포넌트 마운트 시 디자인 목록 로딩
  useEffect(() => {
    fetchDesigns();
  }, []);
  
  // 디자인 목록 가져오기
  const fetchDesigns = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 실제로는 API 호출하여 데이터 가져오기
      // 테스트 용도로 더미 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummyDesigns = [
        {
          id: 1,
          title: '미니멀 데님 재킷',
          designer: { id: 101, name: '김디자이너', avatar: 'https://i.pravatar.cc/150?img=1' },
          imageUrl: 'https://source.unsplash.com/random/500x700/?denim,jacket',
          category: '아우터',
          description: '심플한 디자인의 데님 재킷으로, 다양한 스타일에 활용 가능합니다.',
          status: 'in_progress',
          createdAt: '2025-04-01T12:00:00Z',
          updatedAt: '2025-04-20T15:30:00Z',
          views: 124,
          ratings: { average: 4.2, count: 18 },
          comments: 12,
          aiProgress: 65
        },
        {
          id: 2,
          title: '여름용 플로럴 원피스',
          designer: { id: 102, name: '이패션', avatar: 'https://i.pravatar.cc/150?img=5' },
          imageUrl: 'https://source.unsplash.com/random/500x700/?floral,dress',
          category: '원피스',
          description: '시원한 소재의 플로럴 패턴 원피스로, 여름철 데일리룩으로 적합합니다.',
          status: 'completed',
          createdAt: '2025-03-15T09:20:00Z',
          updatedAt: '2025-04-18T11:45:00Z',
          views: 345,
          ratings: { average: 4.8, count: 32 },
          comments: 27,
          aiProgress: 100
        },
        {
          id: 3,
          title: '오버사이즈 후드 티셔츠',
          designer: { id: 103, name: '박스타일', avatar: 'https://i.pravatar.cc/150?img=8' },
          imageUrl: 'https://source.unsplash.com/random/500x700/?hoodie',
          category: '상의',
          description: '편안한 착용감의 오버사이즈 후드 티셔츠입니다. 캐주얼한 스타일링에 적합합니다.',
          status: 'in_progress',
          createdAt: '2025-04-05T14:10:00Z',
          updatedAt: '2025-04-19T16:20:00Z',
          views: 89,
          ratings: { average: 3.9, count: 10 },
          comments: 8,
          aiProgress: 40
        },
        {
          id: 4,
          title: '와이드 레그 슬랙스',
          designer: { id: 104, name: '최트렌드', avatar: 'https://i.pravatar.cc/150?img=12' },
          imageUrl: 'https://source.unsplash.com/random/500x700/?wide,pants',
          category: '하의',
          description: '편안한 착용감과 세련된 실루엣을 동시에 느낄 수 있는 와이드 레그 슬랙스입니다.',
          status: 'in_progress',
          createdAt: '2025-03-28T10:30:00Z',
          updatedAt: '2025-04-17T13:50:00Z',
          views: 156,
          ratings: { average: 4.5, count: 24 },
          comments: 19,
          aiProgress: 85
        }
      ];
      
      setDesigns(dummyDesigns);
      
      // 첫 번째 디자인 선택
      if (dummyDesigns.length > 0) {
        setSelectedDesign(dummyDesigns[0]);
        fetchEvaluations(dummyDesigns[0].id);
      }
    } catch (err) {
      console.error('디자인 목록을 가져오는 중 오류가 발생했습니다:', err);
      setError('디자인 목록을 가져오는 중 오류가 발생했습니다. 새로고침을 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 특정 디자인의 평가 및 피드백 가져오기
  const fetchEvaluations = async (designId) => {
    try {
      // 실제로는 API 호출하여 데이터 가져오기
      // 테스트 용도로 더미 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyEvaluations = [
        {
          id: 1,
          user: { id: 201, name: '박사용자', avatar: 'https://i.pravatar.cc/150?img=3' },
          rating: 5,
          comment: '완벽한 디자인입니다! 색상과 실루엣이 정말 멋져요.',
          createdAt: '2025-04-19T09:15:00Z',
          likes: 12
        },
        {
          id: 2,
          user: { id: 202, name: '정패션리스타', avatar: 'https://i.pravatar.cc/150?img=7' },
          rating: 4,
          comment: '디자인은 좋지만, 소매 부분이 조금 더 타이트했으면 좋겠어요.',
          createdAt: '2025-04-18T16:40:00Z',
          likes: 5
        },
        {
          id: 3,
          user: { id: 203, name: '김스타일', avatar: 'https://i.pravatar.cc/150?img=10' },
          rating: 5,
          comment: '요즘 트렌드에 딱 맞는 디자인이에요. 실물로 꼭 보고 싶네요!',
          createdAt: '2025-04-18T11:20:00Z',
          likes: 8
        }
      ];
      
      setEvaluations(dummyEvaluations);
    } catch (err) {
      console.error('평가 데이터를 가져오는 중 오류가 발생했습니다:', err);
      setError('평가 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };
  
  // 디자인 선택 핸들러
  const handleSelectDesign = (design) => {
    setSelectedDesign(design);
    setRating(0);
    setComment('');
    fetchEvaluations(design.id);
  };
  
  // 탭 변경 핸들러
  const handleChangeTab = (_, newValue) => {
    setTabValue(newValue);
  };
  
  // 평가 제출 핸들러
  const handleSubmitEvaluation = async () => {
    if (rating === 0) {
      setNotification({
        open: true,
        message: '평가 점수를 선택해주세요.',
        severity: 'warning'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 실제로는 API 호출하여 평가 제출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 새 평가 데이터 생성 (테스트용)
      const newEvaluation = {
        id: Date.now(),
        user: { id: 999, name: '현재 사용자', avatar: 'https://i.pravatar.cc/150?img=20' },
        rating,
        comment,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      // 평가 목록에 추가
      setEvaluations([newEvaluation, ...evaluations]);
      
      // 입력 필드 초기화
      setRating(0);
      setComment('');
      
      // AI 자동 업데이트 시작
      triggerAiUpdate();
      
      // 성공 알림 표시
      setNotification({
        open: true,
        message: '평가가 성공적으로 제출되었습니다!',
        severity: 'success'
      });
    } catch (err) {
      console.error('평가 제출 중 오류가 발생했습니다:', err);
      setNotification({
        open: true,
        message: '평가 제출 중 오류가 발생했습니다. 다시 시도해주세요.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // AI 자동 업데이트 핸들러
  const triggerAiUpdate = async () => {
    setIsUpdating(true);
    setAiProcessing(true);
    
    try {
      // 실제로는 AI가 평가를 반영하여 디자인 업데이트
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 디자인 AI 진행도 업데이트 (테스트용)
      if (selectedDesign && selectedDesign.aiProgress < 100) {
        const newProgress = Math.min(selectedDesign.aiProgress + 15, 100);
        
        setSelectedDesign({
          ...selectedDesign,
          aiProgress: newProgress,
          updatedAt: new Date().toISOString()
        });
        
        // 디자인 목록도 업데이트
        setDesigns(designs.map(design => 
          design.id === selectedDesign.id 
            ? { ...design, aiProgress: newProgress, updatedAt: new Date().toISOString() } 
            : design
        ));
      }
      
      setAiProcessed(true);
      
      // 성공 알림 표시
      setNotification({
        open: true,
        message: 'AI가 평가를 반영하여 디자인을 업데이트했습니다!',
        severity: 'success'
      });
    } catch (err) {
      console.error('AI 업데이트 중 오류가 발생했습니다:', err);
      setNotification({
        open: true,
        message: 'AI 업데이트 중 오류가 발생했습니다.',
        severity: 'error'
      });
    } finally {
      setAiProcessing(false);
      setIsUpdating(false);
      
      // 5초 후 AI 처리 완료 상태 초기화
      setTimeout(() => {
        setAiProcessed(false);
      }, 5000);
    }
  };
  
  // 대화 상자 열기 핸들러
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };
  
  // 대화 상자 닫기 핸들러
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // 알림 닫기 핸들러
  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
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
  
  // 디자인 카드 렌더링
  const renderDesignCard = (design) => {
    const isSelected = selectedDesign && selectedDesign.id === design.id;
    
    return (
      <Card 
        key={design.id} 
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}
        onClick={() => handleSelectDesign(design)}
      >
        <Grid container>
          <Grid item xs={4}>
            <CardMedia
              component="img"
              height="120"
              image={design.imageUrl}
              alt={design.title}
            />
          </Grid>
          <Grid item xs={8}>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="subtitle1" noWrap>
                {design.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {design.designer.name} | {design.category}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating value={design.ratings.average} precision={0.1} size="small" readOnly />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  ({design.ratings.count})
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Box 
                sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center' 
                }}
              >
                <Chip 
                  label={design.status === 'completed' ? '완료' : '진행 중'} 
                  color={design.status === 'completed' ? 'success' : 'primary'}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  AI 진행도: {design.aiProgress}%
                </Typography>
              </Box>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    );
  };
  
  // 디자인 상세 정보 렌더링
  const renderDesignDetail = () => {
    if (!selectedDesign) return null;
    
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <img 
                src={selectedDesign.imageUrl} 
                alt={selectedDesign.title}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {selectedDesign.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={selectedDesign.designer.avatar} 
                  alt={selectedDesign.designer.name}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="subtitle1">
                  {selectedDesign.designer.name}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Chip 
                  label={selectedDesign.category} 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={selectedDesign.status === 'completed' ? '완료' : '진행 중'} 
                  color={selectedDesign.status === 'completed' ? 'success' : 'primary'}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedDesign.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <AccessTime fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    업데이트: {formatDate(selectedDesign.updatedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <People fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    조회수: {selectedDesign.views}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  AI 디자인 진행도:
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={selectedDesign.aiProgress}
                    color={selectedDesign.aiProgress === 100 ? 'success' : 'primary'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {selectedDesign.aiProgress}%
                </Typography>
              </Box>
              
              {aiProcessing && (
                <Alert 
                  icon={<CircularProgress size={20} />} 
                  severity="info"
                  sx={{ mt: 2 }}
                >
                  AI가 평가를 반영하여 디자인을 업데이트하고 있습니다...
                </Alert>
              )}
              
              {aiProcessed && (
                <Alert 
                  icon={<Check />} 
                  severity="success"
                  sx={{ mt: 2 }}
                >
                  AI가 평가를 성공적으로 반영했습니다!
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleChangeTab} 
            aria-label="design tabs"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ mr: 1 }} />
                  평가하기
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Comment sx={{ mr: 1 }} />
                  평가 목록
                  <Badge 
                    badgeContent={evaluations.length} 
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              } 
            />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                디자인에 대한 평가를 남겨주세요
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Typography component="legend">
                  평점
                </Typography>
                <Rating
                  name="design-rating"
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  disabled={isSubmitting}
                />
              </Box>
              
              <TextField
                label="댓글 (선택사항)"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                margin="normal"
                disabled={isSubmitting}
                placeholder="디자인에 대한 피드백이나 개선 사항을 자유롭게 작성해주세요."
              />
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitEvaluation}
                disabled={rating === 0 || isSubmitting}
                sx={{ mt: 2 }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? '제출 중...' : '평가 제출하기'}
              </Button>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                * 평가는 AI 학습 데이터로 활용되어 디자인 최적화에 반영됩니다.
              </Typography>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              {evaluations.length === 0 ? (
                <Alert severity="info">
                  아직 등록된 평가가 없습니다. 첫 번째 평가를 남겨보세요!
                </Alert>
              ) : (
                <List>
                  {evaluations.map((evaluation) => (
                    <React.Fragment key={evaluation.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar 
                            src={evaluation.user.avatar} 
                            alt={evaluation.user.name}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                {evaluation.user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(evaluation.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Rating 
                                value={evaluation.rating} 
                                size="small" 
                                readOnly 
                                sx={{ display: 'block', mb: 0.5 }}
                              />
                              <Typography variant="body2" color="text.primary">
                                {evaluation.comment}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Button
                                  size="small"
                                  startIcon={<ThumbUp fontSize="small" />}
                                  color="primary"
                                  sx={{ mr: 1 }}
                                >
                                  좋아요 ({evaluation.likes})
                                </Button>
                                <Button
                                  size="small"
                                  startIcon={<Comment fontSize="small" />}
                                  color="primary"
                                >
                                  답글
                                </Button>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={() => fetchEvaluations(selectedDesign.id)}
                >
                  평가 새로고침
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
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
        onClick={fetchDesigns} 
        sx={{ ml: 2 }}
      >
        다시 시도
      </Button>
    </Alert>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          디자인 평가
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          다른 사용자의 디자인을 평가하고 피드백을 남겨보세요. 인공지능이 여러분의 평가를 학습하여 디자인을 발전시킵니다.
        </Typography>
      </Box>
      
      {error && renderError()}
      
      {isLoading ? (
        renderLoading()
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              디자인 목록
            </Typography>
            {designs.map(renderDesignCard)}
          </Grid>
          
          <Grid item xs={12} md={8}>
            {selectedDesign ? renderDesignDetail() : (
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1">
                  평가할 디자인을 선택해주세요.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'share' ? '디자인 공유하기' : '알림'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'share' && (
            <Typography variant="body1">
              공유 기능이 준비 중입니다. 곧 업데이트될 예정입니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DesignEvaluationPage;