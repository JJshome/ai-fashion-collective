import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { Upload as UploadIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';

/**
 * 오브젝트 감지 컴포넌트 (특허 요소: 오브젝트 감지부)
 * 
 * 이미지 내에서 원하는 의류 오브젝트를 구분하는 기능을 담당합니다.
 * 인공지능 학습에 의해 이미지에서 의류 아이템을 감지하고 추출합니다.
 */
const ObjectDetector = ({ onObjectDetected }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [error, setError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const fileInputRef = useRef(null);

  // 파일이 선택되면 미리보기 URL 생성
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedFile]);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    setDetectedObjects([]);
  };

  // 파일 업로드 버튼 클릭 핸들러
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // 오브젝트 감지 처리 핸들러
  const handleDetectObjects = async () => {
    if (!selectedFile) {
      setError('이미지를 먼저 업로드해주세요.');
      return;
    }

    setIsProcessing(true);
    setError('');

    // FormData 생성
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // API 호출 (실제 서버 구현 시 경로 수정 필요)
      // 현재는 더미 데이터로 대체
      // const response = await axios.post('/api/detect-objects', formData);
      
      // 테스트용 딜레이
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 테스트용 더미 데이터
      const dummyResponse = {
        data: {
          objects: [
            {
              id: 1,
              name: '상의',
              confidence: 0.95,
              bbox: { x: 100, y: 50, width: 200, height: 300 },
              mask: null // 실제로는 세그멘테이션 마스크 데이터
            },
            {
              id: 2,
              name: '하의',
              confidence: 0.91,
              bbox: { x: 120, y: 380, width: 180, height: 250 },
              mask: null
            }
          ]
        }
      };

      setDetectedObjects(dummyResponse.data.objects);
      setShowSuccessAlert(true);
      
      // 부모 컴포넌트에 감지된 객체 전달
      if (onObjectDetected) {
        onObjectDetected(dummyResponse.data.objects);
      }
    } catch (err) {
      console.error('오브젝트 감지 중 오류가 발생했습니다:', err);
      setError('오브젝트 감지 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 감지된 객체를 이미지 위에 표시
  const renderDetectedObjects = () => {
    if (!previewUrl || detectedObjects.length === 0) return null;

    return (
      <Box sx={{ position: 'relative', mt: 2 }}>
        <img 
          src={previewUrl} 
          alt="감지된 오브젝트" 
          style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
        />
        {detectedObjects.map((obj) => (
          <Box
            key={obj.id}
            sx={{
              position: 'absolute',
              left: `${obj.bbox.x}px`,
              top: `${obj.bbox.y}px`,
              width: `${obj.bbox.width}px`,
              height: `${obj.bbox.height}px`,
              border: '2px solid #f50057',
              borderRadius: '2px',
              backgroundColor: 'rgba(245, 0, 87, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              overflow: 'visible',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                backgroundColor: '#f50057',
                color: 'white',
                padding: '1px 4px',
                borderRadius: '2px',
                fontSize: '0.7rem',
                position: 'absolute',
                top: '-20px',
                left: '-2px',
              }}
            >
              {obj.name} ({Math.round(obj.confidence * 100)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        의류 오브젝트 감지
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        이미지에서 의류 아이템을 자동으로 감지하고 분리합니다. 업로드한 이미지에서 상의, 하의, 아우터 등을 인공지능이 식별합니다.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#aaa',
              }
            }}
            onClick={handleUploadClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadIcon sx={{ fontSize: 40, color: '#888', mb: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              {selectedFile ? selectedFile.name : '이미지 파일을 선택하세요'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              JPEG, PNG 파일 형식 지원
            </Typography>
          </Box>
          
          {previewUrl && (
            <Card sx={{ mt: 2 }}>
              <CardMedia
                component="img"
                image={previewUrl}
                alt="업로드된 이미지"
                sx={{ maxHeight: '300px', objectFit: 'contain' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  이미지 사이즈: {selectedFile?.size ? Math.round(selectedFile.size / 1024) : 0} KB
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<VisibilityIcon />}
              disabled={!selectedFile || isProcessing}
              onClick={handleDetectObjects}
              fullWidth
              sx={{ mb: 2 }}
            >
              {isProcessing ? '오브젝트 감지 중...' : '오브젝트 감지 시작'}
            </Button>
            
            {isProcessing && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
          
          {detectedObjects.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                감지된 오브젝트:
              </Typography>
              {detectedObjects.map((obj) => (
                <Alert key={obj.id} severity="success" sx={{ mb: 1 }}>
                  {obj.name} - 정확도: {Math.round(obj.confidence * 100)}%
                </Alert>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
      
      {detectedObjects.length > 0 && renderDetectedObjects()}
      
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        onClose={() => setShowSuccessAlert(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {detectedObjects.length}개의 의류 오브젝트가 성공적으로 감지되었습니다!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ObjectDetector;