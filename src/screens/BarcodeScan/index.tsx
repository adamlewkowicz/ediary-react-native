import React, { createRef } from 'react';
import { RNCamera, RNCameraProps } from 'react-native-camera';
import styled from 'styled-components/native';
import { NavigationScreenProps } from 'react-navigation';
import { BarcodeId } from '../../types';
import { BarcodeScanParams } from './params';

interface BarcodeScanProps extends
  NavigationScreenProps<BarcodeScanParams, BarcodeScanNavigationOptions> {}

export class BarcodeScan extends React.Component<BarcodeScanProps> {

  static navigationOptions: BarcodeScanProps['navigationOptions'] = {
    title: 'Zeskanuj kod kreskowy'
  }

  camera = createRef<RNCamera>();
  onBarcodeDetected: BarcodeScanParams['onBarcodeDetected'];
  onPhotoTaken: BarcodeScanParams['onPhotoTaken'];
  prevBarcodeId: BarcodeId | null
  androidCameraPermissions = {
    title: 'Uprawnienia kamery',
    message: 'Potrzebuję uprawnień kamery do zeskanowania kodu kreskowego',
    buttonPositive: 'Ok',
    buttonNegative: 'Anuluj',
  }

  constructor(props: BarcodeScanProps) {
    super(props);
    this.onBarcodeDetected = props.navigation.getParam('onBarcodeDetected');
    this.onPhotoTaken = props.navigation.getParam('onPhotoTaken');
    this.prevBarcodeId = null;
  }

  takePicture = async () => {
    if (this.camera.current && this.onPhotoTaken) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.current.takePictureAsync(options);
      this.onPhotoTaken(data);
    }
  }

  handleGoogleBarcodeDetection: RNCameraProps['onGoogleVisionBarcodesDetected'] = ({ barcodes }) => {
    const [barcode] = barcodes.filter(barcode => barcode.type === 'ISBN');

    if (!barcode || !this.onBarcodeDetected) {
      return;
    }

    const barcodeId = barcode.data;

    if (barcodeId !== this.prevBarcodeId) {
      this.onBarcodeDetected(barcodeId);
      this.prevBarcodeId = barcodeId;
    }
  }

  handleBarcodeDetection: RNCameraProps['onBarCodeRead'] = (barcode) => {
    if (!barcode || !this.onBarcodeDetected) {
      return;
    }

    const barcodeId = barcode.data;

    if (barcodeId !== this.prevBarcodeId) {
      this.onBarcodeDetected(barcode.data);
      this.prevBarcodeId = barcodeId;
    }
  }

  render() {
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
        {this.onPhotoTaken && (
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
interface BarcodeScanNavigationOptions {
  title: string
}