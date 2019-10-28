import { render, fireEvent } from '@testing-library/react-native';
import { RunningScreen } from './';

describe('<RunningScreen />', () => {

  it('should increment training duration', () => {
    jest.useFakeTimers();
    const utils = render(<RunningScreen />);

    const trainingDurationText = utils.getByLabelText('Czas trwania treningu');
    jest.advanceTimersByTime(1000);

    expect(trainingDurationText).not.toEqual('0.00');
  });

  it('should pause training when clicked on pause button', () => {
    const utils = render(<RunningScreen />);

    const pauseTrainingButton = utils.getByLabelText('')

    fireEvent.press(pauseTrainingButton, {  })
  });

  it('should show running session distance', () => {

  });

});