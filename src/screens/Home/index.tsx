import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import { StoreState, Dispatch } from '../../store';
import { FlatList, Alert, InteractionManager } from 'react-native';
import * as selectors from '../../store/selectors';
import { DateChanger } from '../../components/DateChanger';
import { MacroCard } from '../../components/MacroCard';
import { theme } from '../../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../../components/MealListItem';
import { BasicInput } from '../../components/BasicInput';
import { NavigationScreenProps } from 'react-navigation';
import { ProductFindParams } from '../ProductFind';
import { mealProductAdd } from '../../store/actions';
import { ProductCreateParams } from '../ProductCreate';
import { BASE_MACRO_ELEMENTS, IS_DEV } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { MealId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId } from '../../store/reducers/diary';
import { CaloriesChart } from '../../components/CaloriesChart';

interface HomeProps extends NavigationScreenProps {
  appDate: StoreState['application']['date']
  appDateDay: StoreState['application']['day']
  macroNeedsLeft: selectors.MacroNeedsLeft
  toggledProductId: StoreState['diary']['toggledProductId']
  mealsWithRatio: selectors.MealsWithRatio
  dispatch: Dispatch
}
const Home = (props: HomeProps) => {
  const [name, setName] = useState('Trening');
  const [processedMealId, setProcessedMealId] = useState<DiaryMealId | null>(null);
  const { dispatch } = props;

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(props.appDateDay));
  }, [props.appDateDay]);

  const handleProductFinderNavigation = (
    meal: DiaryMeal | DiaryMealTemplate
  ) => {
    const screenParams: ProductFindParams = {
      onItemPress(foundProduct) {
        InteractionManager.runAfterInteractions(async () => {
          props.navigation.navigate('Home');
          setProcessedMealId(meal.id);
  
          if (meal.type === 'template') {
            const { name, templateId, time } = meal;
            const template = { id: templateId, name, templateId, time };
            await dispatch(
              Actions.mealCreateFromTemplate(
                template, props.appDate, foundProduct.id
              )
            );
          } else {
            await dispatch(mealProductAdd(meal.id, foundProduct.id));
          }
  
          setProcessedMealId(null);
        });
      }
    }
    props.navigation.navigate('ProductFind', screenParams);
  }
  
  const handleProductCreatorNavigation = () => {
    const screenParams: ProductCreateParams = {
      onProductCreated() {
        props.navigation.navigate('Home');
      }
    }
    props.navigation.navigate('ProductCreate', screenParams);
  }

  const handleMealDelete = <T extends { name: string, id: MealId }>(meal: T) => {
    Alert.alert(
      'Usuń posiłek',
      `Czy jesteś pewnien że chcesz usunąć "${meal.name}"?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => dispatch(Actions.mealDelete(meal.id))
        }
      ]
    );
  }
  
  return (
    <Container>
      <DateChanger
        value={props.appDate}
        onChange={date => dispatch(Actions.appDateUpdated(date))}
      />
      <CaloriesChart data={props.macroNeedsLeft.kcal} />
      <MacroCards>
        {BASE_MACRO_ELEMENTS.map(element => (
          <MacroCard
            key={element}
            colors={theme.gradient[element]}
            percentages={props.macroNeedsLeft[element].ratio}
            title={elementTitles[element]}
            reached={props.macroNeedsLeft[element].eaten}
            goal={props.macroNeedsLeft[element].needed}
          />
        ))}
      </MacroCards>
      <FlatList
        data={props.mealsWithRatio}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <MealListItem
            meal={item}
            toggledProductId={props.toggledProductId}
            onProductAdd={() => handleProductFinderNavigation(item)}
            onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
            onLongPress={IS_DEV || item.type === 'template' ? undefined : () => handleMealDelete(item)}
            isBeingProcessed={processedMealId === item.id}
            {...item.type === 'meal' && {
              onProductDelete: (productId) => dispatch(Actions.mealProductDelete(item.id, productId)),
              onProductToggle: (productId) => dispatch(Actions.productToggled(productId)),
              onProductQuantityUpdate: (productId, quantity) => dispatch(
                Actions.mealProductQuantityUpdate(item.id, productId, quantity)
              )
            }}
          />
        )}
      />
      <Button
        onPress={handleProductCreatorNavigation}
        style={{
          marginVertical: 40,
          marginHorizontal: 5 
        }}
      >
        Dodaj własny produkt
      </Button>
      <CreateMealContainer>
        <BasicInput
          placeholder="Nazwa nowego posiłku"
          label="Nazwa posiłku"
          value={name}
          onChangeText={name => setName(name)}
        />
        <Button
          accessibilityLabel="Utwórz nowy posiłek"
          onPress={() => dispatch(Actions.mealCreate(name, props.appDate, null))}
        >
          Dodaj posiłek
        </Button>
      </CreateMealContainer>
    </Container>
  );
}

const HomeConnected = connect(
  (state: StoreState) => ({
    macroNeedsLeft: selectors.macroNeedsLeft(state),
    toggledProductId: state.diary.toggledProductId,
    appDate: state.application.date,
    appDateDay: state.application.day,
    mealsWithRatio: selectors.mealsWithRatio(state),
  })
)(Home);

(HomeConnected as any).navigationOptions = {
  header: null
}

const Container = styled.ScrollView``

const MacroCards = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 50px;
`

const CreateMealContainer = styled.View`
  padding: 10px 5px;
`

export { HomeConnected as Home };