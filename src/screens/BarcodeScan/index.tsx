import React, { createRef } from 'react';
import { RNCamera, RNCameraProps } from 'react-native-camera';
import styled from 'styled-components/native';
import { BarcodeId } from '../../types';
import { BarcodeScanScreenNavigationProps } from '../../navigation';

interface BarcodeScanProps extends BarcodeScanScreenNavigationProps {}

export class BarcodeScan extends React.Component<BarcodeScanProps> {

  camera = createRef<RNCamera>();
  prevBarcodeId: BarcodeId | null = null;
  androidCameraPermissions = {
    title: 'Uprawnienia kamery',
    message: 'Potrzebuję uprawnień kamery do zeskanowania kodu kreskowego',
    buttonPositive: 'Ok',
    buttonNegative: 'Anuluj',
  }

  takePicture = async () => {
    const { onPhotoTaken } = this.props.route.params;

    if (this.camera.current && onPhotoTaken) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.current.takePictureAsync(options);
      onPhotoTaken(data);
    }
  }

  handleGoogleBarcodeDetection: RNCameraProps['onGoogleVisionBarcodesDetected'] = ({ barcodes }) => {
    const [barcode] = barcodes.filter(barcode => barcode.type === 'ISBN');
    const { onBarcodeDetected } = this.props.route.params;

    if (!barcode || !onBarcodeDetected) {
      return;
    }

    const barcodeId = barcode.data;

    if (barcodeId !== this.prevBarcodeId) {
      onBarcodeDetected(barcodeId);
      this.prevBarcodeId = barcodeId;
    }
  }

  handleBarcodeDetection: RNCameraProps['onBarCodeRead'] = (barcode) => {
    const { onBarcodeDetected } = this.props.route.params;

    if (!barcode || !onBarcodeDetected) {
      return;
    }

    const barcodeId = barcode.data;

    if (barcodeId !== this.prevBarcodeId) {
      onBarcodeDetected(barcode.data);
      this.prevBarcodeId = barcodeId;
    }
  }

  render() {
    const { onPhotoTaken } = this.props.route.params;

    return (
      <Container>
        <StyledCamera
          ref={this.camera}
          type="back"
          flashMode="auto"
          androidCameraPermissionOptions={this.androidCameraPermissions}
          onBarCodeRead={this.handleBarcodeDetection}
          onGoogleVisionBarcodesDetected={this.handleGoogleBarcodeDetection}
          onTextRecognized={null as any}
          onFacesDetected={null as any}
          captureAudio={false}
        />
        {onPhotoTaken && (
          <PhotoButton onPress={this.takePicture}>
            <PhotoTitle>Zrób zdjęcie</PhotoTitle>
          </PhotoButton>
        )}
      </Container>
    );
  }
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
  background: #fff;
`

const PhotoTitle = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  padding: 15px;
  border-radius: 5px;
  text-align: center;
`