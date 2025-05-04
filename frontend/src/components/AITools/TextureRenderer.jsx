import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Slider, 
  CircularProgress,
  Divider,
  Alert,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { Palette, Style, Texture, Opacity, InvertColors } from '@mui/icons-material';

/**
 * 텍스처 렌더링 컴포넌트 (특허 요소: 렌더링부)
 * 
 * 변환된 오브젝트의 질감을 설정하는 기능을 담당합니다.
 * 사용자가 선택한 텍스처를 스케치에 자동으로 적용합니다.
 */
const TextureRenderer = ({ selectedObject, onTextureApplied }) => {
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [textureOpacity, setTextureOpacity] = useState(0.8);
  const [textureScale, setTextureScale] = useState(1.0);
  const [renderQuality, setRenderQuality] = useState('high');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [renderedResult, setRenderedResult] = useState(null);
  const [availableTextures, setAvailableTextures] = useState([]);
  
  // 컴포넌트 마운트 시 가용 텍스처 로딩
  useEffect(() => {
    // 실제로는 API에서 가져와야 함
    // 테스트 용도로 더미 데이터 사용
    const dummyTextures = [
      {
        id: 1,
        name: '데님',
        category: '원단',
        previewUrl: 'https://source.unsplash.com/random/200x200/?denim',
      },
      {
        id: 2,
        name: '코튼',
        category: '원단',
        previewUrl: 'https://source.unsplash.com/random/200x200/?cotton',
      },
      {
        id: 3,
        name: '실크',
        category: '원단',
        previewUrl: 'https://source.unsplash.com/random/200x200/?silk',
      },
      {
        id: 4,
        name: '가죽',
        category: '원단',
        previewUrl: 'https://source.unsplash.com/random/200x200/?leather',
      },
      {
        id: 5,
        name: '니트',
        category: '원단',
        previewUrl: 'https://source.unsplash.com/random/200x200/?knit',
      },
      {
        id: 6,
        name: '스트라이프',
        category: '패턴',
        previewUrl: 'https://source.unsplash.com/random/200x200/?stripes',
      },
      {
        id: 7,
        name: '체크',
        category: '패턴',
        previewUrl: 'https://source.unsplash.com/random/200x200/?checks',
      },
      {
        id: 8,
        name: '도트',
        category: '패턴',
        previewUrl: 'https://source.unsplash.com/random/200x200/?dots',
      },
    ];
    
    setAvailableTextures(dummyTextures);
  }, []);
  
  // 선택된 객체가 변경될 때 초기화
  useEffect(() => {
    if (selectedObject) {
      setSelectedTexture(null);
      setRenderedResult(null);
      setError('');
    }
  }, [selectedObject]);

  // 텍스처 선택 핸들러
  const handleTextureSelect = (texture) => {
    setSelectedTexture(texture);
    setRenderedResult(null);
  };

  // 투명도 변경 핸들러
  const handleOpacityChange = (_, newValue) => {
    setTextureOpacity(newValue);
  };

  // 텍스처 스케일 변경 핸들러
  const handleScaleChange = (_, newValue) => {
    setTextureScale(newValue);
  };

  // 렌더링 품질 변경 핸들러
  const handleQualityChange = (event) => {
    setRenderQuality(event.target.value);
  };

  // 텍스처 적용 핸들러
  const handleApplyTexture = async () => {
    if (!selectedObject) {
      setError('텍스처를 적용할 오브젝트가 선택되지 않았습니다.');
      return;
    }
    
    if (!selectedTexture) {
      setError('적용할 텍스처를 선택해주세요.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // 실제로는 서버에 API 요청을 보내야 함
      // 테스트 용도로 딜레이 추가
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 텍스처가 적용된 이미지를 받아올 것임 (현재는 더미 이미지)
      // 실제로는 서버에서 처리된 이미지 URL이 반환되어야 함
      const renderedImageUrl = selectedTexture.previewUrl.replace('200x200', '400x400');
      
      setRenderedResult({
        objectId: selectedObject.id,
        textureId: selectedTexture.id,
        textureName: selectedTexture.name,
        renderedImageUrl: renderedImageUrl,
        settings: {
          opacity: textureOpacity,
          scale: textureScale,
          quality: renderQuality
        }
      });
      
      // 부모 컴포넌트에 렌더링 결과 전달
      if (onTextureApplied) {
        onTextureApplied({
          objectId: selectedObject.id,
          textureId: selectedTexture.id,
          renderedImageUrl: renderedImageUrl,
          settings: {
            opacity: textureOpacity,
            scale: textureScale,
            quality: renderQuality
          }
        });
      }
    } catch (err) {
      console.error('텍스처 렌더링 중 오류가 발생했습니다:', err);
      setError('텍스처 렌더링 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 가용 텍스처 리스트 렌더링
  const renderTextureList = () => {
    return (
      <Grid container spacing={2}>
        {availableTextures.map((texture) => (
          <Grid item xs={6} sm={4} md={3} key={texture.id}>
            <Card 
              raised={selectedTexture?.id === texture.id}
              sx={{ 
                borderColor: selectedTexture?.id === texture.id ? 'primary.main' : 'transparent', 
                borderWidth: selectedTexture?.id === texture.id ? 2 : 0,
                borderStyle: 'solid',
                transition: 'all 0.3s ease'
              }}
            >
              <CardActionArea onClick={() => handleTextureSelect(texture)}>
                <CardMedia
                  component="img"
                  height="100"
                  image={texture.previewUrl}
                  alt={texture.name}
                />
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="body2" component="div" align="center">
                    {texture.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" align="center" display="block">
                    {texture.category}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        텍스처 렌더링
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        감지된 의류 오브젝트에 다양한 텍스처를 적용하여 디자인을 변형합니다. 원단 종류와 패턴을 선택하고 적용해보세요.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {!selectedObject ? (
        <Alert severity="info">
          텍스처를 적용할 의류 오브젝트를 먼저 선택해주세요.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              선택된 오브젝트: {selectedObject.name}
            </Typography>
            
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                텍스처 종류 선택
              </Typography>
              {renderTextureList()}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                텍스처 설정
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography id="texture-opacity-slider" gutterBottom>
                  <Opacity fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  투명도: {Math.round(textureOpacity * 100)}%
                </Typography>
                <Slider
                  value={textureOpacity}
                  onChange={handleOpacityChange}
                  aria-labelledby="texture-opacity-slider"
                  step={0.05}
                  min={0}
                  max={1}
                  disabled={!selectedTexture || isProcessing}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography id="texture-scale-slider" gutterBottom>
                  <InvertColors fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  텍스처 스케일: {textureScale.toFixed(1)}x
                </Typography>
                <Slider
                  value={textureScale}
                  onChange={handleScaleChange}
                  aria-labelledby="texture-scale-slider"
                  step={0.1}
                  min={0.5}
                  max={2}
                  disabled={!selectedTexture || isProcessing}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="render-quality-label">렌더링 품질</InputLabel>
                  <Select
                    labelId="render-quality-label"
                    id="render-quality"
                    value={renderQuality}
                    label="렌더링 품질"
                    onChange={handleQualityChange}
                    disabled={!selectedTexture || isProcessing}
                  >
                    <MenuItem value="low">저품질 (빠름)</MenuItem>
                    <MenuItem value="medium">중간 품질</MenuItem>
                    <MenuItem value="high">고품질 (느림)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <Texture />}
                disabled={!selectedTexture || isProcessing}
                onClick={handleApplyTexture}
                fullWidth
              >
                {isProcessing ? '텍스처 적용 중...' : '텍스처 적용하기'}
              </Button>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>
          
          {renderedResult && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                텍스처 적용 결과
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: 500 }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={renderedResult.renderedImageUrl}
                    alt="텍스처 적용 결과"
                  />
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {selectedObject.name} + {renderedResult.textureName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      투명도: {Math.round(renderedResult.settings.opacity * 100)}% / 
                      스케일: {renderedResult.settings.scale.toFixed(1)}x / 
                      품질: {renderedResult.settings.quality === 'high' ? '고품질' : 
                            renderedResult.settings.quality === 'medium' ? '중간 품질' : '저품질'}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
};

export default TextureRenderer;