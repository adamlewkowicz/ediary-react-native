import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, InteractionManager } from 'react-native';
import { DateChangerMemo } from '../../components/molecules/DateChanger';
import styled from 'styled-components/native';
import { MealId } from '../../types';
import { DiaryMeal, DiaryProduct, DiaryMealOrTemplate } from '../../store/reducers/diary';
import { useNavigationData, useAppDate } from '../../hooks';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { ChartsMacroNeeds, MealItemMemo, ItemSeparator } from '../../components';
import * as Utils from '../../utils';

interface NutritionHomeScreenProps {}

export const NutritionHomeScreen = (props: NutritionHomeScreenProps) => {
  const { navigate, navigation } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const { appDate, appDateDay, ...appDateContext } = useAppDate();
  const dispatch = useDispatch();
  const macroNeeds = useSelector(Selectors.getCalcedMacroNeeds);
  const meals = useSelector(Selectors.getMealsCalced);
  const mealListRef = useRef<FlatList<Selectors.MealCalced>>(null);

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(appDateDay));
  }, [dispatch, appDateDay]);

  const handleProductAdd = useCallback((meal: DiaryMealOrTemplate): void => {
    navigate('ProductFind', {
      async onProductSelected(productResolver, productQuantity) {
        navigate('NutritionHome');

        await dispatch(
          Actions.mealOrTemplateProductAdd(
            meal,
            productResolver,
            productQuantity,
            appDate
          )
        );
      }
    });
  }, [dispatch, navigate]);
  
  const handleMealDelete = useCallback((meal: DiaryMeal): void => {
    Utils.alertDelete(
      'Usuń posiłek',
      `Czy jesteś pewnien że chcesz usunąć "${meal.data.name}"?`,
      () => dispatch(Actions.mealDelete(meal.data.id))
    );
  }, [dispatch]);

  const handleProductDelete = useCallback((mealId: MealId, product: DiaryProduct): void => {
    Utils.alertDelete(
      'Usuń produkt',
      `Czy jesteś pewnien że chcesz usunąć "${product.data.name}"?`,
      () => dispatch(Actions.mealProductDelete(mealId, product.data.id))
    );
  }, [dispatch]);

  const handleMealOpen = useCallback((meal: DiaryMealOrTemplate, index: number): void => {
    const scroll = () => {
      mealListRef.current?.scrollToIndex({
        index,
        viewOffset: 50,
      });
    }

    Utils.layoutAnimateEase();

    dispatch(Actions.mealOpenToggled(meal.data.id));

    if (!meal.isOpened) scroll();
  }, [dispatch]);

  const handleProductQuantityUpdate = useCallback((mealId: MealId, product: DiaryProduct): void => {
    navigation.navigate('ProductPreview', {
      product: product.data,
      quantity: product.quantity,
      async onProductQuantityUpdated(quantity) {
        navigation.navigate('NutritionHome');

        await InteractionManager.runAfterInteractions();

        dispatch(Actions.mealProductQuantityUpdate(mealId, product.data.id, quantity));
      }
    });
  }, [navigation, dispatch]);

  const Header = (
    <>
      <DateChangerMemo
        value={appDate}
        onChange={appDateContext.update}
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
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={Header}
        renderItem={({ item: meal, index }) => (
          <MealItemMemo
            meal={meal}
            index={index}
            onMealOpen={handleMealOpen}
            onMealDelete={handleMealDelete}
            onProductAdd={handleProductAdd}
            onProductQuantityUpdate={handleProductQuantityUpdate}
            onProductDelete={handleProductDelete}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`

const mealKeyExtractor = (meal: Selectors.MealCalced): string => `${meal.type}${meal.data.id}`;