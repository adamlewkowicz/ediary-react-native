import React from 'react';
import { Product } from '../../database/entities';
import { renderSetup } from '../../../test-utils';
import { ProductPreviewScreen } from '.';

describe('<ProductPreviewScreen />', () => {

  it('should display product details 📝', async () => {
    const productMock = await Product.save({ name: 'Tomatoes' });
    const params = { product: productMock };

    const ctx = renderSetup(<ProductPreviewScreen />, { params });

    ctx.getByText(productMock.name);
  });

});