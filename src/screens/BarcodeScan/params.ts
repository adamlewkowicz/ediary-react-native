import { BarcodeId } from '../../types';
import { TakePictureResponse } from 'react-native-camera/types';

export interface BarcodeScanParams {
  onBarcodeDetected?: (barcode: BarcodeId) => void
  onPhotoTaken?: (data: TakePictureResponse) => void
}