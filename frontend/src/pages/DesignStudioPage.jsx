import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper, 
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  Palette, 
  Visibility, 
  Style, 
  ContentCut, 
  Save, 
  Share,
  ArrowForward,
  ArrowBack,
  Check
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// AI Tools 컴포넌트 임포트
import ObjectDetector from '../components/AITools/ObjectDetector';
import TextureRenderer from '../components/AITools/TextureRenderer';
import ModelApplication from '../components/AITools/ModelApplication';
import PatternExtractor from '../components/AITools/PatternExtractor';

// 컨텍스트 임포트 (실제 구현 시 필요)
// import { useAuth } from '../contexts/AuthContext';
// import { useDesign } from '../contexts/DesignContext';

/**
 * 디자인 스튜디오 페이지
 * 
 * 사용자가 의류 디자인을 수정하고 AI 도구를 사용하여 
 * 텍스처, 패턴 등을 적용할 수 있는 스튜디오 페이지입니다.
 * 특허의 '평가 입력부'와 '인공지능 디자인 완성부'를 구현합니다.
 */
const DesignStudioPage = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  // const { saveDesign } = useDesign();
  
  // 스텝 관리
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [skipped, setSkipped] = useState(new Set());
  
  // 디자인 데이터 상태
  const [selectedObject, setSelectedObject] = useState(null);
  const [renderedObject, setRenderedObject] = useState(null);
  const [modeledObject, setModeledObject] = useState(null);
  const [patternResult, setPatternResult] = useState(null);
  const [designTitle, setDesignTitle] = useState('새로운 디자인');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setError] = useState('');
  
  // 알림 상태
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // 스텝 정의
  const steps = [
    { label: '오브젝트 감지', icon: <Visibility /> },
    { label: '텍스처 렌더링', icon: <Palette /> },
    { label: '모델 적용', icon: <Style /> },
    { label: '패턴 추출', icon: <ContentCut /> }
  ];
  
  const isStepOptional = (step) => {
    return step === 3; // 패턴 추출 단계는 선택사항
  };
  
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    
    // 다음 스텝으로 이동
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    
    // 현재 스텝 완료 표시
    setCompleted((prev) => ({ ...prev, [activeStep]: true }));
    
    // 성공 알림 표시
    setNotification({
      open: true,
      message: `${steps[activeStep].label} 단계가 완료되었습니다!`,
      severity: 'success'
    });
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("이 단계는 건너뛸 수 없습니다.");
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  
  // 디자인 단계별 콜백 핸들러
  const handleObjectDetected = (objects) => {
    if (objects && objects.length > 0) {
      setSelectedObject(objects[0]); // 첫 번째 오브젝트 선택
      
      // 자동으로 다음 단계로 진행할 수도 있음
      // handleNext();
    }
  };
  
  const handleTextureApplied = (texturedObject) => {
    setRenderedObject(texturedObject);
    
    // 자동으로 다음 단계로 진행할 수도 있음
    // handleNext();
  };
  
  const handleModelApplied = (modelObject) => {
    setModeledObject(modelObject);
    
    // 자동으로 다음 단계로 진행할 수도 있음
    // handleNext();
  };
  
  const handlePatternExtracted = (pattern) => {
    setPatternResult(pattern);
    
    // 자동으로 다음 단계로 진행할 수도 있음
    // handleNext();
  };
  
  // 디자인 저장 핸들러
  const handleSaveDesign = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      // 실제로는 API를 통해 디자인 저장
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 디자인 저장 성공
      setSaveSuccess(true);
      setNotification({
        open: true,
        message: '디자인이 성공적으로 저장되었습니다!',
        severity: 'success'
      });
      
      // 5초 후 대시보드로 이동
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } catch (err) {
      console.error('디자인 저장 중 오류가 발생했습니다:', err);
      setError('디자인 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setNotification({
        open: true,
        message: '디자인 저장 중 오류가 발생했습니다.',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 디자인 공유 핸들러
  const handleShareDesign = () => {
    // 디자인 공유 기능 구현 (소셜 미디어, 링크 공유 등)
    setNotification({
      open: true,
      message: '디자인 공유 기능이 준비 중입니다.',
      severity: 'info'
    });
  };
  
  // 알림 닫기 핸들러
  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // 현재 스텝에 따른 컴포넌트 렌더링
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ObjectDetector onObjectDetected={handleObjectDetected} />;
      case 1:
        return <TextureRenderer selectedObject={selectedObject} onTextureApplied={handleTextureApplied} />;
      case 2:
        return <ModelApplication renderedObject={renderedObject} onModelApplied={handleModelApplied} />;
      case 3:
        return <PatternExtractor modeledObject={modeledObject} onPatternExtracted={handlePatternExtracted} />;
      default:
        return <Typography>알 수 없는 단계입니다.</Typography>;
    }
  };
  
  // 완료 단계 렌더링
  const renderCompletionStep = () => {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Box sx={{ my: 3 }}>
          <Check sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            디자인 완성!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            모든 단계를 성공적으로 완료했습니다. 이제 디자인을 저장하거나 공유할 수 있습니다.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  디자인 요약
                </Typography>
                
                <Box sx={{ textAlign: 'left', mt: 2 }}>
                  {selectedObject && (
                    <Typography variant="body2" paragraph>
                      <strong>오브젝트:</strong> {selectedObject.name}
                    </Typography>
                  )}
                  
                  {renderedObject && (
                    <Typography variant="body2" paragraph>
                      <strong>텍스처:</strong> {renderedObject.textureName || '커스텀 텍스처'}
                    </Typography>
                  )}
                  
                  {modeledObject && (
                    <Typography variant="body2" paragraph>
                      <strong>모델 타입:</strong> {modeledObject.modelType === 'female' ? '여성 모델' : 
                                           modeledObject.modelType === 'male' ? '남성 모델' : '아바타'}
                    </Typography>
                  )}
                  
                  {patternResult && (
                    <Typography variant="body2" paragraph>
                      <strong>패턴 조각:</strong> {patternResult.patternPieces?.length || 0}개
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  디자인 액션
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    disabled={isSaving || saveSuccess}
                    onClick={handleSaveDesign}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {isSaving ? '저장 중...' : saveSuccess ? '저장됨' : '디자인 저장하기'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Share />}
                    onClick={handleShareDesign}
                    fullWidth
                  >
                    디자인 공유하기
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {saveSuccess && (
          <Alert severity="success" sx={{ mt: 3 }}>
            디자인이 성공적으로 저장되었습니다! 5초 후 대시보드로 이동합니다...
          </Alert>
        )}
        
        {saveError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {saveError}
          </Alert>
        )}
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          디자인 스튜디오
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          인공지능을 활용하여 나만의 의류 디자인을 만들어보세요. 단계별로 진행하면서 원하는 스타일을 완성해 보세요.
        </Typography>
      </Box>
      
      <Box sx={{ mb: 5 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => {
            const stepProps = {};
            const labelProps = {};
            
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">선택사항</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            
            return (
              <Step key={step.label} {...stepProps} completed={completed[index]}>
                <StepLabel 
                  {...labelProps} 
                  StepIconProps={{ 
                    icon: step.icon 
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      
      {activeStep === steps.length ? (
        renderCompletionStep()
      ) : (
        <>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              startIcon={<ArrowBack />}
            >
              이전
            </Button>
            
            <Box sx={{ flex: '1 1 auto' }} />
            
            {isStepOptional(activeStep) && (
              <Button 
                color="inherit" 
                onClick={handleSkip} 
                sx={{ mr: 1 }}
              >
                건너뛰기
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              variant="contained"
              disabled={
                (activeStep === 0 && !selectedObject) ||
                (activeStep === 1 && !renderedObject) ||
                (activeStep === 2 && !modeledObject) ||
                (activeStep === 3 && !patternResult && !isStepOptional(activeStep))
              }
              endIcon={<ArrowForward />}
            >
              {activeStep === steps.length - 1 ? '완료' : '다음'}
            </Button>
          </Box>
        </>
      )}
      
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

export default DesignStudioPage;