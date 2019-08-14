import { IProduct } from '../../src/database/entities';

const productMock: IProduct = {
  id: 1,
  name: 'Cucumber',
  barcode: null,
  carbs: 41,
  prots: 61,
  fats: 91,
  kcal: 193,
  unit: 'g',
  portions: [],
  userId: null,
  verified: true,
  createdAt: new Date,
  updatedAt: new Date
}

export default productMock;