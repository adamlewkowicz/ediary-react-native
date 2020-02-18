import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { StoreState, Selectors, Actions, DispatchProp } from '../../store';
import { FlatList, Alert } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import { MacroCard } from '../../components/MacroCard';
import { theme } from '../../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../../components/MealListItem';
import { BasicInput } from '../../components/BasicInput';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { BASE_MACRO_ELEMENTS } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { MealId, ProductId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId } from '../../store/reducers/diary';
import { CaloriesChart } from '../../components/CaloriesChart';
import { useAfterInteractions, useNavigate } from '../../hooks';
import { ProductItem } from '../../components/ProductItem';
import { Button } from '../../components/Button';

interface HomeProps extends NavigationScreenProps, MapStateProps, DispatchProp {}

const Home = (props: HomeProps) => {
  const [newMealName, setNewMealName] = useState('Posiłek');
  const [processedMealId, setProcessedMealId] = useState<DiaryMealId | null>(null);
  const { dispatch } = props;
  const navigate = useNavigate();

  useAfterInteractions(() => dispatch(Actions.productHistoryRecentLoad()));

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(props.appDateDay));
  }, [props.appDateDay]);

  const handleProductFindNavigation = (
    meal: DiaryMeal | DiaryMealTemplate
  ) => {
    navigate('ProductFind', {
      async onItemPress(foundProduct) {
        navigate('Home');
        setProcessedMealId(meal.id);

        await dispatch(
          Actions.mealOrTemplateProductAdd(
            meal,
            foundProduct.id,
            props.appDate
          )
        );

        setProcessedMealId(null);
      }
    });
  }
  
  const handleProductCreateNavigation = () => {
    navigate('ProductCreate', {
      onProductCreated: () => navigate('Home')
    });
  }

  const handleMealDelete = <T extends { id: MealId, name: string }>(
    meal: T
  ) => {
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

  const handleProductDelete = <T extends { id: ProductId; name: string }>(
    mealId: MealId,
    product: T
  ) => {
    Alert.alert(
      'Usuń produkt',
      `Czy jesteś pewnien że chcesz usunąć "${product.name}"?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => dispatch(Actions.mealProductDelete(mealId, product.id))
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
            isBeingProcessed={processedMealId === meal.id}
            onProductAdd={() => handleProductFindNavigation(meal)}
            onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
            onLongPress={__DEV__ || meal.type === 'template' ? undefined : () => handleMealDelete(meal)}
            renderProduct={(product) => meal.type === 'template' ? null : (
              <ProductItem
                product={product}
                onDelete={() => handleProductDelete(meal.id, product)}
                onToggle={() => dispatch(Actions.productToggled(product.id))}
                onQuantityUpdate={(quantity) => dispatch(
                  Actions.mealProductQuantityUpdate(meal.id, product.id, quantity)
                )}
              />
            )}
          />
        )}
      />
      <ContentContainer>
        <CreateMealContainer>
          <BasicInput
            placeholder="Nazwa nowego posiłku"
            label="Nazwa nowego posiłku"
            value={newMealName}
            onChangeText={setNewMealName}
          />
          <Button
            accessibilityLabel="Utwórz nowy posiłek"
            onPress={() => dispatch(Actions.mealCreate(newMealName, props.appDate))}
            title="Dodaj posiłek"
          >
            Dodaj posiłek
          </Button>
        </CreateMealContainer>
        <Button onPress={handleProductCreateNavigation}>
          Dodaj własny produkt
        </Button>
      </ContentContainer>
    </ScrollView>
  );
}

const ContentContainer = styled.View`
  padding: 10px;
  margin: 40px 0 15px 0;
`

const MacroCards = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 50px;
`

const CreateMealContainer = styled.View`
  padding: 15px;
  border: ${props => `1px dotted ${props.theme.color.gray20}`};
  border-radius: 5px;
  margin-bottom: 60px;
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

HomeConnected.navigationOptions = {
  header: null,
}

export { HomeConnected as Home };