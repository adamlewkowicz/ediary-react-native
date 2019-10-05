import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import { StoreState, Dispatch, Selectors } from '../../store';
import { FlatList, Alert } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import { MacroCard } from '../../components/MacroCard';
import { theme } from '../../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../../components/MealListItem';
import { BasicInput } from '../../components/BasicInput';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { ProductFindParams } from '../ProductFind';
import { mealProductAdd } from '../../store/actions';
import { ProductCreateParams } from '../ProductCreate';
import { BASE_MACRO_ELEMENTS, IS_DEV } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { MealId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId } from '../../store/reducers/diary';
import { CaloriesChart } from '../../components/CaloriesChart';
import { useAfterInteractions } from '../../hooks';

interface HomeProps extends NavigationScreenProps, MapStateProps {
  dispatch: Dispatch
}

const Home = (props: HomeProps) => {
  const [name, setName] = useState('Trening');
  const [processedMealId, setProcessedMealId] = useState<DiaryMealId | null>(null);
  const { dispatch } = props;

  useAfterInteractions(() => dispatch(Actions.productHistoryRecentLoad()));

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(props.appDateDay));
  }, [props.appDateDay]);

  const handleProductFindNavigation = (
    meal: DiaryMeal | DiaryMealTemplate
  ) => {
    const screenParams: ProductFindParams = {
      async onItemPress(foundProduct) {
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
      }
    }
    props.navigation.navigate('ProductFind', screenParams);
  }
  
  const handleProductCreateNavigation = () => {
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
    <ScrollView>
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
        renderItem={({ item: meal }) => (
          <MealListItem
            meal={meal}
            onProductAdd={() => handleProductFindNavigation(meal)}
            onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
            onLongPress={IS_DEV || meal.type === 'template' ? undefined : () => handleMealDelete(meal)}
            isBeingProcessed={processedMealId === meal.id}
            {...meal.type === 'meal' && {
              onProductDelete: (productId) => dispatch(Actions.mealProductDelete(meal.id, productId)),
              onProductToggle: (productId) => dispatch(Actions.productToggled(productId)),
              onProductQuantityUpdate: (productId, quantity) => dispatch(
                Actions.mealProductQuantityUpdate(meal.id, productId, quantity)
              )
            }}
          />
        )}
      />
      <CreateProductButton onPress={handleProductCreateNavigation}>
        Dodaj własny produkt
      </CreateProductButton>
      <CreateMealContainer>
        <BasicInput
          placeholder="Nazwa nowego posiłku"
          label="Nazwa posiłku"
          value={name}
          onChangeText={name => setName(name)}
        />
        <Button
          accessibilityLabel="Utwórz nowy posiłek"
          onPress={() => dispatch(Actions.mealCreate(name, props.appDate))}
        >
          Dodaj posiłek
        </Button>
      </CreateMealContainer>
    </ScrollView>
  );
}

const CreateProductButton = styled(Button)`
  margin: 40px 5px;
`

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

interface MapStateProps {
  appDate: StoreState['application']['date']
  appDateDay: StoreState['application']['day']
  macroNeedsLeft: Selectors.MacroNeedsLeft
  mealsWithRatio: Selectors.MealsWithRatio
}

const mapStateToProps = (state: StoreState): MapStateProps => ({
  macroNeedsLeft: Selectors.macroNeedsLeft(state),
  appDate: state.application.date,
  appDateDay: state.application.day,
  mealsWithRatio: Selectors.mealsWithRatio(state),
});

const HomeConnected = connect(mapStateToProps)(Home);

(HomeConnected as any).navigationOptions = {
  header: null,
}

export { HomeConnected as Home };