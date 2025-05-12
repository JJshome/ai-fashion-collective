import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Palette as PaletteIcon,
  Style as StyleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import DesignContext from '../context/DesignContext';

const AiGenerator = () => {
  const navigate = useNavigate();
  const { generateAiDesign, loading, error } = useContext(DesignContext);
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    prompt: '',
    baseDesignFile: null,
    baseDesignPreview: null,
    stylePreference: 'modern',
    colorPalette: 'neutral',
    complexity: 50,
    tags: []
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [generatedDesign, setGeneratedDesign] = useState(null);
  
  // Style options
  const styleOptions = [
    { value: 'modern', label: '모던' },
    { value: 'casual', label: '캐주얼' },
    { value: 'formal', label: '포멀' },
    { value: 'vintage', label: '빈티지' },
    { value: 'minimalist', label: '미니멀리스트' },
    { value: 'streetwear', label: '스트릿웨어' },
    { value: 'avant-garde', label: '아방가르드' },
    { value: 'traditional', label: '전통적' }
  ];
  
  // Color palette options
  const colorOptions = [
    { value: 'neutral', label: '뉴트럴' },
    { value: 'warm', label: '웜톤' },
    { value: 'cool', label: '쿨톤' },
    { value: 'bright', label: '밝은 색상' },
    { value: 'dark', label: '어두운 색상' },
    { value: 'pastel', label: '파스텔' },
    { value: 'monochrome', label: '모노크롬' },
    { value: 'vibrant', label: '비비드' }
  ];
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSliderChange = (e, newValue) => {
    setFormData({
      ...formData,
      complexity: newValue
    });
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL for the image
      const previewURL = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        baseDesignFile: file,
        baseDesignPreview: previewURL
      });
    }
  };
  
  const handleTagInputChange = (e) => {
    setCurrentTag(e.target.value);
  };
  
  const handleAddTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag]
      });
      setCurrentTag('');
    }
  };
  
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    });
  };
  
  const clearBaseDesign = () => {
    setFormData({
      ...formData,
      baseDesignFile: null,
      baseDesignPreview: null
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    // Prepare form data for submission
    const aiFormData = new FormData();
    aiFormData.append('prompt', formData.prompt);
    
    if (formData.baseDesignFile) {
      aiFormData.append('baseDesignFile', formData.baseDesignFile);
    }
    
    // Add parameters as JSON string
    const parameters = {
      stylePreference: formData.stylePreference,
      colorPalette: formData.colorPalette,
      complexity: formData.complexity,
      tags: formData.tags
    };
    
    aiFormData.append('parameters', JSON.stringify(parameters));
    
    try {
      const design = await generateAiDesign(aiFormData);
      if (design) {
        setGeneratedDesign(design);
        setStep(3); // Move to result step
      }
    } catch (err) {
      console.error('Error generating design:', err);
    }
  };
  
  const handleSaveDesign = () => {
    if (generatedDesign) {
      // Navigate to design detail page
      navigate(`/designs/${generatedDesign._id}`);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              기본 정보 입력
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="prompt"
                  label="디자인 설명"
                  multiline
                  rows={4}
                  value={formData.prompt}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="원하는 디자인에 대해 자세히 설명해주세요. 예: '여름용 가벼운 셔츠 디자인, 하늘색과 흰색 스트라이프 패턴'"
                  helperText="인공지능이 디자인을 생성하기 위한 설명을 입력하세요."
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '1px dashed grey',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center'
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  
                  {formData.baseDesignPreview ? (
                    <Box>
                      <img
                        src={formData.baseDesignPreview}
                        alt="Base design"
                        style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }}
                      />
                      <Box>
                        <Button
                          startIcon={<DeleteIcon />}
                          color="error"
                          onClick={clearBaseDesign}
                          variant="outlined"
                          sx={{ mt: 1 }}
                        >
                          삭제
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      startIcon={<CloudUploadIcon />}
                      onClick={() => fileInputRef.current.click()}
                      variant="outlined"
                    >
                      기본 디자인 이미지 업로드 (선택사항)
                    </Button>
                  )}
                  
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    레퍼런스로 사용할 기본 디자인 이미지를 업로드하세요. (선택사항)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!formData.prompt}
              >
                다음
              </Button>
            </Box>
          </>
        );
        
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              디자인 옵션 설정
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>스타일 선호도</InputLabel>
                  <Select
                    name="stylePreference"
                    value={formData.stylePreference}
                    onChange={handleChange}
                    label="스타일 선호도"
                  >
                    {styleOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>색상 팔레트</InputLabel>
                  <Select
                    name="colorPalette"
                    value={formData.colorPalette}
                    onChange={handleChange}
                    label="색상 팔레트"
                  >
                    {colorOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom>
                  디자인 복잡도
                </Typography>
                <Slider
                  value={formData.complexity}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '심플' },
                    { value: 50, label: '중간' },
                    { value: 100, label: '복잡' },
                  ]}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography gutterBottom>
                    태그 (선택사항)
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <TextField
                      value={currentTag}
                      onChange={handleTagInputChange}
                      onKeyPress={handleTagKeyPress}
                      placeholder="태그 추가"
                      size="small"
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddTag}
                      disabled={!currentTag}
                    >
                      추가
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {formData.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                이전
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '디자인 생성'}
              </Button>
            </Box>
          </>
        );
        
      case 3:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              생성된 디자인
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {generatedDesign && (
              <Box sx={{ mt: 3 }}>
                <Card sx={{ maxWidth: 600, mx: 'auto' }}>
                  <CardMedia
                    component="img"
                    image={generatedDesign.imageUrl}
                    alt={generatedDesign.name}
                    sx={{ height: 400, objectFit: 'contain' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {generatedDesign.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {generatedDesign.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                      <Chip
                        icon={<StyleIcon />}
                        label={styleOptions.find(
                          option => option.value === formData.stylePreference
                        )?.label || formData.stylePreference}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<PaletteIcon />}
                        label={colorOptions.find(
                          option => option.value === formData.colorPalette
                        )?.label || formData.colorPalette}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<CategoryIcon />}
                        label={`복잡도: ${formData.complexity}%`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                      {formData.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      디자인 수정
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveDesign}
                    >
                      저장 및 상세보기
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            )}
          </>
        );
        
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI 디자인 생성기
        </Typography>
        <Typography variant="body1" color="text.secondary">
          인공지능을 이용하여 새로운 패션 디자인을 생성해보세요. 원하는 디자인 설명과 옵션을 설정하면 AI가 자동으로 디자인을 생성합니다.
        </Typography>
        
        <Paper sx={{ mt: 4, p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={step - 1} alternativeLabel>
              <Step>
                <StepLabel>기본 정보</StepLabel>
              </Step>
              <Step>
                <StepLabel>디자인 옵션</StepLabel>
              </Step>
              <Step>
                <StepLabel>결과</StepLabel>
              </Step>
            </Stepper>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {renderStepContent()}
        </Paper>
      </Box>
    </Container>
  );
};

// Stepper components (simplified version without MUI Stepper)
const Stepper = ({ activeStep, alternativeLabel, children }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    flexDirection: alternativeLabel ? 'row' : 'column'
  }}>
    {React.Children.map(children, (child, index) => (
      React.cloneElement(child, { 
        active: index === activeStep,
        completed: index < activeStep
      })
    ))}
  </Box>
);

const Step = ({ children }) => (
  <Box sx={{ flex: 1, textAlign: 'center' }}>
    {children}
  </Box>
);

const StepLabel = ({ active, completed, children }) => (
  <Box>
    <Box sx={{ 
      width: 30, 
      height: 30, 
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: completed ? 'primary.main' : active ? 'secondary.main' : 'grey.300',
      color: completed || active ? 'white' : 'text.primary',
      margin: '0 auto',
      mb: 1
    }}>
      {completed ? '✓' : null}
    </Box>
    <Typography 
      color={active ? 'primary.main' : completed ? 'text.primary' : 'text.secondary'}
      fontWeight={active || completed ? 'bold' : 'normal'}
    >
      {children}
    </Typography>
  </Box>
);

export default AiGenerator;