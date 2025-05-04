import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  Alert,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Slider,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ThreeDRotation, 
  Person, 
  AccessibilityNew, 
  SwitchCamera, 
  ZoomIn, 
  ZoomOut,
  RestartAlt,
  FiberManualRecord,
  Videocam,
  Stop,
  Share,
  Refresh
} from '@mui/icons-material';

/**
 * 모델 적용 컴포넌트 (특허 요소: 모델 적용부)
 * 
 * 의류 디자인의 3D 이미지를 모델이나 아바타에게 적용하는 기능을 담당합니다.
 * 인공지능을 통해 모델/아바타의 포즈를 움직이는 동영상으로 변경할 수 있습니다.
 */
const ModelApplication = ({ renderedObject, onModelApplied }) => {
  const canvasRef = useRef(null);
  const [modelType, setModelType] = useState('female');
  const [poseType, setPoseType] = useState('standing');
  const [cameraView, setCameraView] = useState('front');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('static');
  const [isRecording, setIsRecording] = useState(false);
  const [modelResult, setModelResult] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [availablePoses, setAvailablePoses] = useState([]);
  
  // 컴포넌트 마운트 시 가용 모델과 포즈 데이터 로딩
  useEffect(() => {
    // 실제로는 API에서 가져와야 함
    // 테스트 용도로 더미 데이터 사용
    const dummyModels = [
      { id: 'female', name: '여성 모델', previewUrl: 'https://source.unsplash.com/random/100x200/?woman,model' },
      { id: 'male', name: '남성 모델', previewUrl: 'https://source.unsplash.com/random/100x200/?man,model' },
      { id: 'child', name: '아동 모델', previewUrl: 'https://source.unsplash.com/random/100x200/?child,model' },
      { id: 'avatar', name: '가상 아바타', previewUrl: 'https://source.unsplash.com/random/100x200/?avatar,3d' },
    ];
    
    const dummyPoses = [
      { id: 'standing', name: '기본 자세', previewUrl: 'https://source.unsplash.com/random/100x200/?standing,pose' },
      { id: 'walking', name: '걷는 자세', previewUrl: 'https://source.unsplash.com/random/100x200/?walking,pose' },
      { id: 'sitting', name: '앉은 자세', previewUrl: 'https://source.unsplash.com/random/100x200/?sitting,pose' },
      { id: 'casual', name: '캐주얼 포즈', previewUrl: 'https://source.unsplash.com/random/100x200/?casual,pose' },
    ];
    
    setAvailableModels(dummyModels);
    setAvailablePoses(dummyPoses);
  }, []);
  
  // 렌더링된 객체가 변경될 때 초기화
  useEffect(() => {
    if (renderedObject) {
      setModelResult(null);
      setError('');
    }
  }, [renderedObject]);
  
  // 3D 렌더링 및 애니메이션 효과 구현 (실제로는 Three.js 등 사용)
  useEffect(() => {
    if (!canvasRef.current || !renderedObject || !modelResult) return;
    
    // 3D 렌더링 로직 구현
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 테스트 용도의 렌더링 (실제로는 Three.js 또는 WebGL 사용)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 이미지 로드
    const modelImage = new Image();
    modelImage.onload = () => {
      ctx.drawImage(modelImage, 0, 0, canvas.width, canvas.height);
      
      // 테스트용 텍스트 오버레이
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`모델 타입: ${modelType}`, 10, 30);
      ctx.fillText(`포즈: ${poseType}`, 10, 60);
      ctx.fillText(`카메라: ${cameraView}`, 10, 90);
      ctx.fillText(`줌 레벨: ${zoomLevel.toFixed(1)}x`, 10, 120);
    };
    
    // 테스트 이미지 URL - 실제 구현에서는 3D 모델 렌더링
    modelImage.src = modelResult.previewUrl;
    
    // 애니메이션 모드일 경우 애니메이션 효과 추가
    if (viewMode === 'animated' && !isRecording) {
      let angle = 0;
      let animationId;
      
      const animate = () => {
        angle += 0.01;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(cameraView === 'rotating' ? angle : 0);
        ctx.drawImage(
          modelImage, 
          -canvas.width / 2, 
          -canvas.height / 2, 
          canvas.width, 
          canvas.height
        );
        ctx.restore();
        
        // 테스트용 텍스트 오버레이
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`모델 타입: ${modelType}`, 10, 30);
        ctx.fillText(`포즈: ${poseType}`, 10, 60);
        ctx.fillText(`카메라: ${cameraView}`, 10, 90);
        ctx.fillText(`줌 레벨: ${zoomLevel.toFixed(1)}x`, 10, 120);
        
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [renderedObject, modelResult, modelType, poseType, cameraView, zoomLevel, viewMode, isRecording]);

  // 모델 타입 변경 핸들러
  const handleModelTypeChange = (event) => {
    setModelType(event.target.value);
    setModelResult(null);
  };
  
  // 포즈 타입 변경 핸들러
  const handlePoseTypeChange = (event) => {
    setPoseType(event.target.value);
    setModelResult(null);
  };
  
  // 카메라 뷰 변경 핸들러
  const handleCameraViewChange = (event) => {
    setCameraView(event.target.value);
  };
  
  // 줌 레벨 변경 핸들러
  const handleZoomChange = (_, newValue) => {
    setZoomLevel(newValue);
  };
  
  // 뷰 모드 변경 핸들러
  const handleViewModeChange = (_, newValue) => {
    if (newValue !== null) {
      setViewMode(newValue);
    }
  };
  
  // 녹화 시작/중지 핸들러
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // 녹화 시작 로직 (실제로는 캔버스의 내용을 녹화하는 코드 추가)
      console.log('녹화 시작');
    } else {
      // 녹화 중지 및 저장 로직
      console.log('녹화 중지 및 저장');
      
      // 녹화된 비디오 URL (테스트용)
      const recordedVideoUrl = 'https://source.unsplash.com/random/400x600/?fashion,video';
      
      // 모델 결과 업데이트
      setModelResult(prevResult => ({
        ...prevResult,
        recordedVideoUrl
      }));
    }
  };
  
  // 모델에 적용 핸들러
  const handleApplyToModel = async () => {
    if (!renderedObject) {
      setError('적용할 렌더링된 의류 오브젝트가 없습니다.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // 실제로는 서버에 API 요청을 보내야 함
      // 테스트 용도로 딜레이 추가
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 가상 모델에 의류가 적용된 이미지를 받아올 것임 (현재는 더미 이미지)
      const modeledImageUrl = `https://source.unsplash.com/random/400x600/?fashion,model,${modelType}`;
      
      const result = {
        objectId: renderedObject.objectId,
        textureId: renderedObject.textureId,
        modelType,
        poseType,
        cameraView,
        zoomLevel,
        viewMode,
        previewUrl: modeledImageUrl,
        recordedVideoUrl: null,
      };
      
      setModelResult(result);
      
      // 부모 컴포넌트에 모델 적용 결과 전달
      if (onModelApplied) {
        onModelApplied(result);
      }
    } catch (err) {
      console.error('모델 적용 중 오류가 발생했습니다:', err);
      setError('모델 적용 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 모델 초기화 핸들러
  const handleResetModel = () => {
    setModelType('female');
    setPoseType('standing');
    setCameraView('front');
    setZoomLevel(1.0);
    setViewMode('static');
    setIsRecording(false);
    setModelResult(null);
  };
  
  // 모델 카드 렌더링
  const renderModelTypeCards = () => {
    return (
      <Grid container spacing={2}>
        {availableModels.map((model) => (
          <Grid item xs={6} sm={3} key={model.id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                border: modelType === model.id ? '2px solid #1976d2' : 'none',
                height: '100%'
              }}
              onClick={() => setModelType(model.id)}
            >
              <Box 
                sx={{ 
                  height: 140, 
                  backgroundImage: `url(${model.previewUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent sx={{ py: 1 }}>
                <Typography variant="body2" align="center">
                  {model.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // 포즈 카드 렌더링
  const renderPoseTypeCards = () => {
    return (
      <Grid container spacing={2}>
        {availablePoses.map((pose) => (
          <Grid item xs={6} sm={3} key={pose.id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                border: poseType === pose.id ? '2px solid #1976d2' : 'none',
                height: '100%'
              }}
              onClick={() => setPoseType(pose.id)}
            >
              <Box 
                sx={{ 
                  height: 140, 
                  backgroundImage: `url(${pose.previewUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <CardContent sx={{ py: 1 }}>
                <Typography variant="body2" align="center">
                  {pose.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        3D 모델 적용
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        렌더링된 의류 디자인을 가상 모델이나 아바타에 적용합니다. 다양한 포즈와 각도에서 디자인을 확인할 수 있습니다.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {!renderedObject ? (
        <Alert severity="info">
          3D 모델에 적용할 렌더링된 의류 오브젝트가 없습니다. 먼저 텍스처 렌더링을 완료해주세요.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              모델 선택
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {renderModelTypeCards()}
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              포즈 선택
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {renderPoseTypeCards()}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              카메라 설정
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="camera-view-label">카메라 뷰</InputLabel>
                <Select
                  labelId="camera-view-label"
                  id="camera-view"
                  value={cameraView}
                  label="카메라 뷰"
                  onChange={handleCameraViewChange}
                  disabled={isProcessing}
                >
                  <MenuItem value="front">정면 뷰</MenuItem>
                  <MenuItem value="back">후면 뷰</MenuItem>
                  <MenuItem value="side">측면 뷰</MenuItem>
                  <MenuItem value="rotating">회전 뷰</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <Typography id="zoom-level-slider" gutterBottom>
                  줌 레벨: {zoomLevel.toFixed(1)}x
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <ZoomOut />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      value={zoomLevel}
                      onChange={handleZoomChange}
                      aria-labelledby="zoom-level-slider"
                      step={0.1}
                      min={0.5}
                      max={2.0}
                      disabled={isProcessing}
                    />
                  </Grid>
                  <Grid item>
                    <ZoomIn />
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  뷰 모드
                </Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  aria-label="view mode"
                  fullWidth
                  disabled={isProcessing}
                >
                  <ToggleButton value="static" aria-label="static view">
                    <Person sx={{ mr: 1 }} />
                    정적 뷰
                  </ToggleButton>
                  <ToggleButton value="animated" aria-label="animated view">
                    <AccessibilityNew sx={{ mr: 1 }} />
                    애니메이션 뷰
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <ThreeDRotation />}
                  disabled={isProcessing}
                  onClick={handleApplyToModel}
                  sx={{ flex: 1, mr: 1 }}
                >
                  {isProcessing ? '모델에 적용 중...' : '모델에 적용하기'}
                </Button>
                
                <Tooltip title="모델 설정 초기화">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleResetModel}
                    disabled={isProcessing}
                  >
                    <RestartAlt />
                  </Button>
                </Tooltip>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>
          
          {modelResult && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  3D 모델 적용 결과
                </Typography>
                
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    maxWidth: 500, 
                    height: 500, 
                    bgcolor: '#f0f0f0', 
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  {viewMode === 'static' ? (
                    <img 
                      src={modelResult.previewUrl} 
                      alt="모델 적용 결과" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <canvas 
                      ref={canvasRef} 
                      width={500} 
                      height={500} 
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  
                  {viewMode === 'animated' && (
                    <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                      <Button
                        variant="contained"
                        color={isRecording ? 'error' : 'primary'}
                        startIcon={isRecording ? <Stop /> : <FiberManualRecord />}
                        onClick={handleRecordToggle}
                        size="small"
                      >
                        {isRecording ? '녹화 중지' : '녹화 시작'}
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="카메라 뷰 전환">
                    <IconButton 
                      color="primary" 
                      aria-label="change camera view"
                      onClick={() => {
                        const views = ['front', 'side', 'back', 'rotating'];
                        const currentIndex = views.indexOf(cameraView);
                        const nextIndex = (currentIndex + 1) % views.length;
                        setCameraView(views[nextIndex]);
                      }}
                    >
                      <SwitchCamera />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="애니메이션/정적 뷰 전환">
                    <IconButton 
                      color="primary" 
                      aria-label="toggle view mode"
                      onClick={() => setViewMode(viewMode === 'static' ? 'animated' : 'static')}
                    >
                      {viewMode === 'static' ? <Videocam /> : <Person />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="모델 리프레시">
                    <IconButton 
                      color="primary" 
                      aria-label="refresh model"
                      onClick={handleApplyToModel}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="공유하기">
                    <IconButton 
                      color="primary" 
                      aria-label="share model"
                      onClick={() => {
                        console.log('모델 공유 기능 (구현 예정)');
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {modelResult.recordedVideoUrl && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      녹화된 비디오
                    </Typography>
                    <Box
                      component="video"
                      controls
                      sx={{ maxWidth: '100%', height: 'auto', maxHeight: 300 }}
                      src={modelResult.recordedVideoUrl}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
};

export default ModelApplication;