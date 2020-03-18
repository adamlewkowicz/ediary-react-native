import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, Alert, InteractionManager } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import styled from 'styled-components/native';
import { MealId, ProductId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId, DiaryProduct } from '../../store/reducers/diary';
import { useAfterInteractions, useNavigationData } from '../../hooks';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { ChartMacroCircles, MealItem, MealItemSeparator, ChartCalories } from '../../_components';
import { layoutAnimateEase } from '../../common/utils';
import { MealWithRatio } from '../../store/selectors';

interface NutritionHomeScreenProps {}

export const NutritionHomeScreen = (props: NutritionHomeScreenProps) => {
  const { navigate, navigation } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const [processedMealId, setProcessedMealId] = useState<DiaryMealId | null>(null);
  const dispatch = useDispatch();
  const appDate = useSelector(Selectors.getAppDate);
  const appDateDay = useSelector(Selectors.getAppDay);
  const macroNeedsLeft = useSelector(Selectors.getMacroNeedsLeft);
  const mealsWithRatio = useSelector(Selectors.getMealsWithRatio);
  const mealListRef = useRef<FlatList<Selectors.MealWithRatio>>(null);

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
  
  const handleMealDelete = <T extends { id: MealId, name: string }>(
    meal: T
  ): void => {
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
  ): void => {
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

  const handleMealOpen = (
    mealId: DiaryMealId,
    meal: Selectors.MealWithRatio,
    index: number
  ): void => {
    const scroll = () => {
      mealListRef.current?.scrollToIndex({
        index,
        viewOffset: 50,
      });
    }

    layoutAnimateEase();

    dispatch(Actions.mealToggled(mealId));

    if (!meal.isToggled) scroll();
  }

  const handleProductQuantityUpdate = (mealId: MealId, product: DiaryProduct): void => {
    navigate('ProductPreview', {
      product: product.data,
      quantity: product.quantity,
      async onProductQuantityUpdated(quantity) {
        navigation.goBack();

        await InteractionManager.runAfterInteractions();

        dispatch(Actions.mealProductQuantityUpdate(mealId, product.id, quantity));
      }
    });
  }

  const Header = (
    <>
      <DateChanger
        value={appDate}
        onChange={date => dispatch(Actions.appDateUpdated(date))}
      />
      <ChartCalories
        percentages={macroNeedsLeft.kcal.ratio}
        value={macroNeedsLeft.kcal.eaten}
        valueLeft={macroNeedsLeft.kcal.needed}
      />
      <ChartMacroCircles
        values={[
          macroNeedsLeft.carbs.eaten,
          macroNeedsLeft.prots.eaten,
          macroNeedsLeft.carbs.eaten,
        ]}
        percentages={[
          macroNeedsLeft.carbs.ratio,
          macroNeedsLeft.prots.ratio,
          macroNeedsLeft.fats.ratio,
        ]}
      />
    </>
  );

  return (
    <Container>
      <FlatList
        ref={mealListRef}
        data={mealsWithRatio}
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

const mealKeyExtractor = (meal: MealWithRatio): string => meal.id.toString();