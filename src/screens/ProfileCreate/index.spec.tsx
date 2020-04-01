import React from 'react';
import { ProfileCreateScreen } from '.';
import { renderSetup } from '../../../__tests__/utils';
import { fireEvent } from '@testing-library/react-native';
import { Profile } from '../../database/entities';

describe('<ProfileCreateScreen />', () => {
  
  it('should render without crashing 💥', () => {
    renderSetup(<ProfileCreateScreen />);
  });

  it('should create new profile 🧑', async () => {
    const productSaveSpy = jest.spyOn(Profile, 'save');

    const ctx = renderSetup(<ProfileCreateScreen />);

    const nextStepButton = ctx.getByLabelText('Przejdź dalej');
    fireEvent.press(nextStepButton);
    
    // Setting a11y label prop on picker doesnt work.
    fireEvent.press(nextStepButton);

    const increaseWeightGoalButton = ctx.getByText('Zwiększenie');
    fireEvent.press(increaseWeightGoalButton);

    fireEvent.press(nextStepButton);

    expect(productSaveSpy).toHaveBeenCalledTimes(1);
  });

});