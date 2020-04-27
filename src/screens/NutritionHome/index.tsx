import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, InteractionManager } from 'react-native';
import { DateChangerMemo } from '../../components/molecules/DateChanger';
import { MealId } from '../../types';
import { DiaryMeal, DiaryProduct, DiaryMealOrTemplate } from '../../store/reducers/diary';
import { useNavigationData, useAppDate, useIntl } from '../../hooks';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { ChartMacroNeeds, MealItemMemo, ItemSeparator } from '../../components';
import * as Utils from '../../utils';

export const NutritionHomeScreen = () => {
  const { navigate } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const { appDate, appDateDay, ...appDateContext } = useAppDate();
  const dispatch = useDispatch();
  const macroNeeds = useSelector(Selectors.getCalcedMacroNeeds);
  const meals = useSelector(Selectors.getMealsCalced);
  const mealListRef = useRef<FlatList<Selectors.MealCalced>>(null);
  const t = useIntl();

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(appDateDay));
  }, [dispatch, appDateDay]);

  const handleProductAdd = useCallback((meal: DiaryMealOrTemplate): void => {
    navigate('ProductFind', {
      async onProductSelected(productResolver, productQuantity) {
        navigate('NutritionHome');

        Utils.layoutAnimateEase();

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
  }, [dispatch, navigate, appDate]);
  
  const handleMealDelete = useCallback((meal: DiaryMeal): void => {
    Utils.alertDelete(
      t.deleteMeal,
      t.confirmMealDelete(meal.data.name),
      () => {
        Utils.layoutAnimateEase();
        dispatch(Actions.mealDelete(meal.data.id));
      }
    );
  }, [dispatch]);

  const handleProductDelete = useCallback((mealId: MealId, product: DiaryProduct): void => {
    Utils.alertDelete(
      t.deleteProduct,
      t.confirmProductDelete(product.data.name),
      () => {
        Utils.layoutAnimateEase();
        dispatch(Actions.mealProductDelete(mealId, product.data.id));
      }
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
    navigate('ProductPreview', {
      product: product.data,
      quantity: product.quantity,
      async onProductQuantityUpdated(quantity) {
        navigate('NutritionHome');

        await InteractionManager.runAfterInteractions();
        Utils.layoutAnimateEase();

        dispatch(Actions.mealProductQuantityUpdate(mealId, product.data.id, quantity));
      }
    });
  }, [navigate, dispatch]);

  const handleScrollFailSilently = useCallback(() => {}, []);

  const Header = (
    <>
      <DateChangerMemo
        value={appDate}
        onChange={appDateContext.update}
      />
      <ChartMacroNeeds macroNeeds={macroNeeds} />
    </>
  );

  return (
    <FlatList
      ref={mealListRef}
      data={meals}
      keyExtractor={mealKeyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={Header}
      onScrollToIndexFailed={handleScrollFailSilently}
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
  );
}

const mealKeyExtractor = (meal: Selectors.MealCalced): string => `${meal.type}${meal.data.id}`;