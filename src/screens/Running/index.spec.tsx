import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { RunningScreen } from './';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { renderSetup } from '../../../__tests__/utils';

describe('<RunningScreen />', () => {

  describe.only('when training is active 🏃', () => {

    it('should increment training duration ⌚', async () => {
      jest.useFakeTimers();
      const ctx = renderSetup(<RunningScreen />);

      jest.advanceTimersByTime(1000);
      const trainingDurationText = ctx.getByLabelText('Czas trwania treningu');

      expect(trainingDurationText).toHaveTextContent('00:00:01');
    });

  });

  it('should pause training when clicked on a pause button', () => {
    jest.useFakeTimers();
    const ctx = renderSetup(<RunningScreen />);

    const pauseTrainingButton = ctx.getByLabelText('Zatrzymaj/kontynuuj trening');
    fireEvent.pressIn(pauseTrainingButton);

    jest.advanceTimersByTime(1000);

    const trainingDurationText = ctx.getByLabelText('Czas trwania treningu');

    expect(trainingDurationText).toEqual('00:00:00');
  });

  it('should calculate correct session distance', () => {
    const geoLocationMock = jest.spyOn(Geolocation, 'watchPosition')
      .mockImplementationOnce(success => {
        success({
          timestamp: 1,
          coords: {
            longitude: 10000,
            latitude: 10000,
          }
        } as GeolocationResponse)
        const watchId = 1;
        return watchId;
      })
    const ctx = renderSetup(<RunningScreen />);
    
    const trainingDistanceText = ctx.findByLabelText('Przebyty dystans');

    expect(geoLocationMock).toHaveBeenCalledTimes(1);
    expect(trainingDistanceText).not.toEqual('0.00');
  });

});