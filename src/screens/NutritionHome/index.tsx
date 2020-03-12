import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, Alert, ScrollView } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import styled from 'styled-components/native';
import { MealListItem } from '../../components/MealListItem';
import { MealId, ProductId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId } from '../../store/reducers/diary';
import { CaloriesChart } from '../../components/CaloriesChart';
import { useAfterInteractions, useNavigationData } from '../../hooks';
import { ProductItem } from '../../components/ProductItem';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { ChartMacroCircles, MealItem, MealItemSeparator, ButtonSecondary, H1, ButtonSecondaryArrow } from '../../_components';

interface NutritionHomeScreenProps {}

export const NutritionHomeScreen = (props: NutritionHomeScreenProps) => {
  const { navigate } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const [processedMealId, setProcessedMealId] = useState<DiaryMealId | null>(null);
  const dispatch = useDispatch();
  const appDate = useSelector(Selectors.getAppDate);
  const appDateDay = useSelector(Selectors.getAppDay);
  const macroNeedsLeft = useSelector(Selectors.getMacroNeedsLeft);
  const mealsWithRatio = useSelector(Selectors.getMealsWithRatio);

  useAfterInteractions(() => dispatch(Actions.productHistoryRecentLoad()));

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(appDateDay));
  }, [appDateDay]);


  const handleProductFindNavigation = (
    meal: DiaryMeal | DiaryMealTemplate
  ) => {
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

  
  const handleProductCreateNavigation = () => {
    navigate('ProductCreate', {
      onProductCreated: () => navigate('NutritionHome')
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
        value={appDate}
        onChange={date => dispatch(Actions.appDateUpdated(date))}
      />
      <CaloriesChart data={macroNeedsLeft.kcal} />
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
        // valuesLeft={[
        //   macroNeedsLeft.carbs.needed,
        //   macroNeedsLeft.prots.needed,
        //   macroNeedsLeft.fats.needed,
        // ]}
      />
      <FlatList 
        data={mealsWithRatio}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={MealItemSeparator}
        renderItem={({ item: meal }) => (
          <MealItem 
            meal={meal}
            onMealPressed={(mealId) => dispatch(Actions.mealToggled(mealId))}
            onProductAdd={handleProductFindNavigation}
            onProductPressed={(productId) => dispatch(Actions.productToggled(productId))}
          />
        )}
      />
      {/* <FlatList
        data={mealsWithRatio}
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
      /> */}
      <ContentContainer>
        <ButtonAddOwnProduct onPress={handleProductCreateNavigation}>
          Dodaj własny produkt
        </ButtonAddOwnProduct>
      </ContentContainer>
    </ScrollView>
  );
}

const ContentContainer = styled.View`
  margin: 40px 0 15px 0;
`

const ButtonAddOwnProduct = styled(ButtonSecondaryArrow)`
  margin: ${props => `0 ${props.theme.spacing.screenPadding}`};
`