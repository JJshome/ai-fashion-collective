import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  ContentCut, 
  Layers, 
  SquareFoot, 
  Download, 
  Print, 
  ZoomIn, 
  Add, 
  Straighten,
  FileDownload,
  Share
} from '@mui/icons-material';

/**
 * 패턴 추출 컴포넌트 (특허 요소: 인공지능 패턴 추출부)
 * 
 * 의류 디자인의 실루엣으로부터 의류의 패턴을 인공지능으로 제작하는 기능을 담당합니다.
 * 기하학적 구조(geometry)를 이용하여 의류의 패턴을 인공지능으로 제작합니다.
 */
const PatternExtractor = ({ modeledObject, onPatternExtracted }) => {
  const [fabricType, setFabricType] = useState('cotton');
  const [patternSize, setPatternSize] = useState('m');
  const [patternDetail, setPatternDetail] = useState('standard');
  const [patternFormat, setPatternFormat] = useState('2d');
  const [seamsAllowance, setSeamsAllowance] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState('');
  const [patternResult, setPatternResult] = useState(null);
  const [patternPieces, setPatternPieces] = useState([]);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [availableFabrics, setAvailableFabrics] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  
  // 컴포넌트 마운트 시 가용 원단 정보 로딩
  useEffect(() => {
    // 실제로는 API에서 가져와야 함
    // 테스트 용도로 더미 데이터 사용
    const dummyFabrics = [
      { id: 'cotton', name: '면', stretchFactor: 1.0, notes: '기본 원단, 평균적인 스트레치' },
      { id: 'silk', name: '실크', stretchFactor: 0.8, notes: '낮은 스트레치, 섬세한 패턴 필요' },
      { id: 'denim', name: '데님', stretchFactor: 0.9, notes: '두꺼운 원단, 내구성 높음' },
      { id: 'jersey', name: '저지', stretchFactor: 1.2, notes: '높은 스트레치, 여유로운 패턴 가능' },
      { id: 'wool', name: '울', stretchFactor: 0.9, notes: '보온성 높음, 약간의 수축 고려' },
    ];
    
    setAvailableFabrics(dummyFabrics);
  }, []);
  
  // 모델링된 객체가 변경될 때 초기화
  useEffect(() => {
    if (modeledObject) {
      setPatternResult(null);
      setPatternPieces([]);
      setError('');
    }
  }, [modeledObject]);
  
  // 원단 타입 변경 핸들러
  const handleFabricTypeChange = (event) => {
    setFabricType(event.target.value);
    setPatternResult(null);
  };
  
  // 패턴 사이즈 변경 핸들러
  const handlePatternSizeChange = (event) => {
    setPatternSize(event.target.value);
    setPatternResult(null);
  };
  
  // 패턴 디테일 변경 핸들러
  const handlePatternDetailChange = (event) => {
    setPatternDetail(event.target.value);
    setPatternResult(null);
  };
  
  // 패턴 포맷 변경 핸들러
  const handlePatternFormatChange = (event) => {
    setPatternFormat(event.target.value);
    setPatternResult(null);
  };
  
  // 시접 여유 변경 핸들러
  const handleSeamsAllowanceChange = (_, newValue) => {
    setSeamsAllowance(newValue);
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
  };
  
  // 측정값 표시 토글 핸들러
  const handleMeasurementsToggle = () => {
    setShowMeasurements(!showMeasurements);
  };
  
  // 그리드 표시 토글 핸들러
  const handleGridToggle = () => {
    setShowGrid(!showGrid);
  };
  
  // 패턴 추출 핸들러
  const handleExtractPattern = async () => {
    if (!modeledObject) {
      setError('패턴을 추출할 모델링된 의류 오브젝트가 없습니다.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // 실제로는 서버에 API 요청을 보내야 함
      // 테스트 용도로 딜레이 추가
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 테스트용 패턴 조각 데이터
      const dummyPatternPieces = [
        {
          id: 1,
          name: '앞면 패널',
          imageUrl: 'https://source.unsplash.com/random/300x300/?pattern,sewing',
          measurements: {
            width: 60,
            height: 75,
            notes: '어깨 솔기 부분 주의'
          }
        },
        {
          id: 2,
          name: '뒷면 패널',
          imageUrl: 'https://source.unsplash.com/random/300x300/?pattern,fabric',
          measurements: {
            width: 62,
            height: 78,
            notes: '등 부분 여유 추가'
          }
        },
        {
          id: 3,
          name: '소매 (2개)',
          imageUrl: 'https://source.unsplash.com/random/300x300/?pattern,sleeve',
          measurements: {
            width: 35,
            height: 55,
            notes: '커프스 부분 표시에 주의'
          }
        },
        {
          id: 4,
          name: '칼라',
          imageUrl: 'https://source.unsplash.com/random/300x300/?pattern,collar',
          measurements: {
            width: 40,
            height: 15,
            notes: '칼라 모양 정확히 유지'
          }
        }
      ];
      
      setPatternPieces(dummyPatternPieces);
      
      // 패턴 결과 설정
      const result = {
        objectId: modeledObject.objectId,
        fabricType,
        patternSize,
        patternDetail,
        patternFormat,
        seamsAllowance,
        patternPieces: dummyPatternPieces,
        downloadUrl: 'https://example.com/pattern-download.pdf', // 실제로는 서버에서 생성된 다운로드 URL
        previewUrl: 'https://source.unsplash.com/random/800x600/?sewing,pattern'
      };
      
      setPatternResult(result);
      
      // 부모 컴포넌트에 패턴 추출 결과 전달
      if (onPatternExtracted) {
        onPatternExtracted(result);
      }
    } catch (err) {
      console.error('패턴 추출 중 오류가 발생했습니다:', err);
      setError('패턴 추출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 패턴 다운로드 핸들러
  const handleDownloadPattern = () => {
    if (!patternResult?.downloadUrl) return;
    
    // 실제로는 다운로드 URL을 열거나 파일 다운로드 로직 구현
    window.open(patternResult.downloadUrl, '_blank');
  };
  
  // 패턴 인쇄 핸들러
  const handlePrintPattern = () => {
    // 인쇄 기능 구현 (실제로는 인쇄 가능한 페이지 생성 후 window.print() 호출)
    window.print();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        AI 패턴 추출
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        인공지능을 사용하여 3D 의류 모델로부터 재단 패턴을 자동으로 생성합니다. 원단 종류와 사이즈를 선택하고 맞춤형 재단 패턴을 얻으세요.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {!modeledObject ? (
        <Alert severity="info">
          패턴을 추출할 모델링된 의류 오브젝트가 없습니다. 먼저 3D 모델 적용을 완료해주세요.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              패턴 설정
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="fabric-type-label">원단 종류</InputLabel>
                <Select
                  labelId="fabric-type-label"
                  id="fabric-type"
                  value={fabricType}
                  label="원단 종류"
                  onChange={handleFabricTypeChange}
                  disabled={isProcessing}
                >
                  {availableFabrics.map((fabric) => (
                    <MenuItem value={fabric.id} key={fabric.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography>{fabric.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          스트레치 계수: {fabric.stretchFactor.toFixed(1)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="pattern-size-label">패턴 사이즈</InputLabel>
                <Select
                  labelId="pattern-size-label"
                  id="pattern-size"
                  value={patternSize}
                  label="패턴 사이즈"
                  onChange={handlePatternSizeChange}
                  disabled={isProcessing}
                >
                  <MenuItem value="xs">XS (44)</MenuItem>
                  <MenuItem value="s">S (88)</MenuItem>
                  <MenuItem value="m">M (95)</MenuItem>
                  <MenuItem value="l">L (100)</MenuItem>
                  <MenuItem value="xl">XL (105)</MenuItem>
                  <MenuItem value="xxl">XXL (110)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="pattern-detail-label">패턴 세부 설정</InputLabel>
                <Select
                  labelId="pattern-detail-label"
                  id="pattern-detail"
                  value={patternDetail}
                  label="패턴 세부 설정"
                  onChange={handlePatternDetailChange}
                  disabled={isProcessing}
                >
                  <MenuItem value="simple">간편 패턴 (초보자용)</MenuItem>
                  <MenuItem value="standard">표준 패턴</MenuItem>
                  <MenuItem value="detailed">상세 패턴 (전문가용)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="pattern-format-label">패턴 포맷</InputLabel>
                <Select
                  labelId="pattern-format-label"
                  id="pattern-format"
                  value={patternFormat}
                  label="패턴 포맷"
                  onChange={handlePatternFormatChange}
                  disabled={isProcessing}
                >
                  <MenuItem value="2d">2D 패턴</MenuItem>
                  <MenuItem value="3d">3D 패턴 미리보기</MenuItem>
                  <MenuItem value="pdf">PDF 문서</MenuItem>
                  <MenuItem value="svg">SVG 파일</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="seams-allowance-slider" gutterBottom>
                  시접 여유: {seamsAllowance.toFixed(1)}cm
                </Typography>
                <Slider
                  value={seamsAllowance}
                  onChange={handleSeamsAllowanceChange}
                  aria-labelledby="seams-allowance-slider"
                  step={0.1}
                  min={0.5}
                  max={2.0}
                  disabled={isProcessing}
                  marks={[
                    { value: 0.5, label: '0.5cm' },
                    { value: 1.0, label: '1.0cm' },
                    { value: 1.5, label: '1.5cm' },
                    { value: 2.0, label: '2.0cm' },
                  ]}
                />
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <ContentCut />}
              disabled={isProcessing}
              onClick={handleExtractPattern}
              fullWidth
              sx={{ mb: 2 }}
            >
              {isProcessing ? '패턴 추출 중...' : '패턴 추출하기'}
            </Button>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {patternResult ? (
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs 
                    value={tabIndex} 
                    onChange={handleTabChange} 
                    aria-label="pattern tabs"
                    variant="fullWidth"
                  >
                    <Tab label="패턴 미리보기" />
                    <Tab label="패턴 조각" />
                  </Tabs>
                </Box>
                
                {tabIndex === 0 && (
                  <Box>
                    <Box sx={{ position: 'relative' }}>
                      <img 
                        src={patternResult.previewUrl}
                        alt="패턴 미리보기"
                        style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }}
                      />
                      
                      {showGrid && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            backgroundImage: 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            opacity: 0.3,
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <FormControlLabel
                        control={<Switch checked={showGrid} onChange={handleGridToggle} />}
                        label="그리드 표시"
                      />
                      
                      <Box>
                        <Tooltip title="패턴 다운로드">
                          <IconButton 
                            color="primary" 
                            onClick={handleDownloadPattern}
                            sx={{ mr: 1 }}
                          >
                            <FileDownload />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="패턴 인쇄">
                          <IconButton 
                            color="primary" 
                            onClick={handlePrintPattern}
                          >
                            <Print />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        패턴 정보
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            원단 종류: {availableFabrics.find(f => f.id === fabricType)?.name || fabricType}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            사이즈: {patternSize.toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            패턴 세부 설정: {
                              patternDetail === 'simple' ? '간편 패턴' : 
                              patternDetail === 'standard' ? '표준 패턴' : '상세 패턴'
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            시접 여유: {seamsAllowance.toFixed(1)}cm
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
                
                {tabIndex === 1 && (
                  <Box>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">
                        패턴 조각 ({patternPieces.length}개)
                      </Typography>
                      
                      <FormControlLabel
                        control={<Switch checked={showMeasurements} onChange={handleMeasurementsToggle} />}
                        label="측정값 표시"
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      {patternPieces.map((piece) => (
                        <Grid item xs={12} sm={6} key={piece.id}>
                          <Card>
                            <CardMedia
                              component="img"
                              height="160"
                              image={piece.imageUrl}
                              alt={piece.name}
                            />
                            <CardContent sx={{ pb: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {piece.name}
                              </Typography>
                              
                              {showMeasurements && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    <Straighten fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                    너비: {piece.measurements.width}cm × 높이: {piece.measurements.height}cm
                                  </Typography>
                                  
                                  {piece.measurements.notes && (
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                      참고: {piece.measurements.notes}
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </CardContent>
                            <CardActions>
                              <Button 
                                size="small" 
                                startIcon={<ZoomIn />}
                                onClick={() => console.log(`패턴 조각 상세보기: ${piece.id}`)}
                              >
                                확대
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<Print />}
                                onClick={() => console.log(`패턴 조각 인쇄: ${piece.id}`)}
                              >
                                인쇄
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            ) : (
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: 300,
                  p: 3,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1
                }}
              >
                <Layers sx={{ fontSize: 60, color: '#aaa', mb: 2 }} />
                <Typography variant="subtitle1" align="center" gutterBottom>
                  패턴 추출 준비 완료
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  왼쪽에서 원하는 패턴 설정을 선택한 후 '패턴 추출하기' 버튼을 클릭하세요.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default PatternExtractor;