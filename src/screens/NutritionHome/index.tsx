import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, Alert, InteractionManager } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import styled from 'styled-components/native';
import { MealId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId, DiaryProduct } from '../../store/reducers/diary';
import { useAfterInteractions, useNavigationData } from '../../hooks';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { MealItem, MealItemSeparator, ChartsMacroNeeds } from '../../_components';
import { layoutAnimateEase } from '../../common/utils';

interface NutritionHomeScreenProps {}

export const NutritionHomeScreen = (props: NutritionHomeScreenProps) => {
  const { navigate, navigation } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const [processedMealId, setProcessedMealId] = useState<DiaryMealId | null>(null);
  const dispatch = useDispatch();
  const appDate = useSelector(Selectors.getAppDate);
  const appDateDay = useSelector(Selectors.getAppDay);
  const macroNeeds = useSelector(Selectors.getCalcedMacroNeeds);
  const meals = useSelector(Selectors.getMealsCalced);
  const mealListRef = useRef<FlatList<Selectors.MealCalced>>(null);

  useAfterInteractions(() => dispatch(Actions.productHistoryRecentLoad()));

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(appDateDay));
  }, [appDateDay]);

  const handleProductAdd = (
    meal: DiaryMeal | DiaryMealTemplate
  ): void => {
    navigate('ProductFind', {
      async onItemPress(productResolver) {
        navigate('NutritionHome');
        setProcessedMealId(meal.id);
        const foundProduct = await productResolver();

        await dispatch(
          Actions.mealOrTemplateProductAdd(
            meal,
            foundProduct.id,
            appDate
          )
        );

        setProcessedMealId(null);
      }
    });
  }
  
  const handleMealDelete = (meal: DiaryMeal): void => {
    Alert.alert(
      'Usuń posiłek',
      `Czy jesteś pewnien że chcesz usunąć "${meal.name}"?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'Usuń',
          onPress: () => dispatch(Actions.mealDelete(meal.id))
        }
      ]
    );
  }

  const handleProductDelete = (mealId: MealId, product: DiaryProduct): void => {
    Alert.alert(
      'Usuń produkt',
      `Czy jesteś pewnien że chcesz usunąć "${product.data.name}"?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'Usuń',
          onPress: () => dispatch(Actions.mealProductDelete(mealId, product.data.id))
        }
      ]
    );
  }

  const handleMealOpen = (
    mealId: DiaryMealId,
    meal: Selectors.MealCalced,
    index: number
  ): void => {
    const scroll = () => {
      mealListRef.current?.scrollToIndex({
        index,
        viewOffset: 50,
      });
    }

    layoutAnimateEase();

    dispatch(Actions.mealOpenToggled(mealId));

    if (!meal.isOpened) scroll();
  }

  const handleProductQuantityUpdate = (mealId: MealId, product: DiaryProduct): void => {
    navigate('ProductPreview', {
      product: product.data,
      quantity: product.quantity,
      async onProductQuantityUpdated(quantity) {
        navigation.goBack();

        await InteractionManager.runAfterInteractions();

        dispatch(Actions.mealProductQuantityUpdate(mealId, product.data.id, quantity));
      }
    });
  }

  const Header = (
    <>
      <DateChanger
        value={appDate}
        onChange={date => dispatch(Actions.appDateUpdated(date))}
      />
      <ChartsMacroNeeds macroNeeds={macroNeeds} />
    </>
  );

  return (
    <Container>
      <FlatList
        ref={mealListRef}
        data={meals}
        keyExtractor={mealKeyExtractor}
        ItemSeparatorComponent={MealItemSeparator}
        ListHeaderComponent={Header}
        renderItem={({ item: meal, index }) => (
          <MealItem
            meal={meal}
            onMealOpen={(mealId) => handleMealOpen(mealId, meal, index)}
            onMealDelete={handleMealDelete}
            onProductAdd={handleProductAdd}
            onProductQuantityUpdate={handleProductQuantityUpdate}
            onProductDelete={handleProductDelete}
            isAddingProduct={processedMealId === meal.id}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`

const mealKeyExtractor = (meal: Selectors.MealCalced): string => meal.id.toString();