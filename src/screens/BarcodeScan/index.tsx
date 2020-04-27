import React, { useRef } from 'react';
import { RNCamera, RNCameraProps } from 'react-native-camera';
import styled from 'styled-components/native';
import { BarcodeId } from '../../types';
import { BarcodeScanScreenNavigationProps } from '../../navigation';
import { useNavigationData, useIntl } from '../../hooks';

export const BarcodeScanScreen = () => {
  const { params } = useNavigationData<BarcodeScanScreenNavigationProps>();
  const cameraRef = useRef<RNCamera>(null);
  const prevBarcodeId = useRef<BarcodeId | null>(null);
  const t = useIntl();
  
  const takePicture = async () => {
    if (cameraRef.current && params.onPhotoTaken) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      params.onPhotoTaken(data);
    }
  }

  const handleBarcodeDetection = <B extends { data: string }>(barcodeData?: B) => {
    const barcodeId = barcodeData?.data;

    if (!barcodeId?.length || !params.onBarcodeDetected) return;

    if (barcodeId !== prevBarcodeId.current) {
      prevBarcodeId.current = barcodeId;
      params.onBarcodeDetected(barcodeId);
    }
  }

  const handleGoogleBarcodeDetection: RNCameraProps['onGoogleVisionBarcodesDetected'] = ({ barcodes }) => {
    const barcodeData = barcodes.find(barcode => barcode.type === 'ISBN');
    handleBarcodeDetection(barcodeData);
  }

  return (
    <Container>
      <StyledCamera
        ref={cameraRef}
        type="back"
        flashMode="auto"
        androidCameraPermissionOptions={t.androidCameraPermissions}
        onBarCodeRead={handleBarcodeDetection}
        onGoogleVisionBarcodesDetected={handleGoogleBarcodeDetection}
        onTextRecognized={null as any}
        onFacesDetected={null as any}
        captureAudio={false}
      />
      {params.onPhotoTaken && (
        <PhotoButton onPress={takePicture}>
          <PhotoTitle>{t.takePhoto}</PhotoTitle>
        </PhotoButton>
      )}
    </Container>
  );
}

const Container = styled.View`
  background-color: black;
  justify-content: center;
  flex: 1;
`

const StyledCamera = styled(RNCamera)`
  flex: 1;
`

const PhotoButton = styled.TouchableOpacity`
  background: ${props => props.theme.color.primaryLight};
`

const PhotoTitle = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  padding: 15px;
  border-radius: 5px;
  text-align: center;
`