import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { USER_ID_UNSYNCED, DEFAULT_CONNECTION } from '../../common/consts';
import { Actions } from '../../store';
import { User } from '../../database/entities';
import { databaseConfig } from '../../database/config/config';
import { getOrCreateConnection } from '../../database/utils/getOrCreateConnection';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';
import * as Utils from '../../utils';

interface AppLoadingScreenProps {}

export const AppLoadingScreen = (props: AppLoadingScreenProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function setup() {
      try {
        const defaultConnection = await getOrCreateConnection(
          DEFAULT_CONNECTION, { name: DEFAULT_CONNECTION, ...databaseConfig }
        );
    
        const hasMigrationsToRun = await defaultConnection.showMigrations();
    
        if (hasMigrationsToRun) {
          await defaultConnection.runMigrations();
        }
    
        const user = await User.getOrCreate({
          id: USER_ID_UNSYNCED,
          email: null,
          login: 'login',
          password: 'password',
        });
    
        dispatch(
          Actions.userInitialized(user)
        );
    
        if (user.profile == null) {
          dispatch(
            Actions.appStatusUpdated('CREATING PROFILE')
          );
        } else {
          dispatch(
            Actions.appStatusUpdated('INITIALIZED')
          );
        }
      } catch(error) {
        Utils.handleError(error);
      }
    }

    setup();
  }, [dispatch]);

  return <Spinner size="large" />;
}

const Spinner = styled(ActivityIndicator)`
  flex: 1;
`