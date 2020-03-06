import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, Alert, ScrollView } from 'react-native';
import { DateChanger } from '../../components/DateChanger';
import { MacroCard } from '../../components/MacroCard';
import { theme } from '../../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../../components/MealListItem';
import { BasicInput } from '../../components/BasicInput';
import { BASE_MACRO_ELEMENTS } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { MealId, ProductId } from '../../types';
import { DiaryMealTemplate, DiaryMeal, DiaryMealId } from '../../store/reducers/diary';
import { CaloriesChart } from '../../components/CaloriesChart';
import { useAfterInteractions, useNavigationData } from '../../hooks';
import { ProductItem } from '../../components/ProductItem';
import { Button } from '../../components/Button';
import { NutritionHomeScreenNavigationProps } from '../../navigation';
import { MacroChart } from '../../molecules/MacroChart';

interface NutritionHomeScreenProps {}

export const NutritionHomeScreen = (props: NutritionHomeScreenProps) => {
  const { navigate } = useNavigationData<NutritionHomeScreenNavigationProps>();
  const [newMealName, setNewMealName] = useState('');
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

  const handleNewMealCreate = () => {
    if (!newMealName.length) return;
    dispatch(Actions.mealCreate(newMealName, appDate));
    setNewMealName('');
  }

  return (
    <ScrollView>
      <DateChanger
        value={appDate}
        onChange={date => dispatch(Actions.appDateUpdated(date))}
      />
      <MacroChart
        title="Węglowodany"
        value={204}
        percentages={25}
      />
      <CaloriesChart data={macroNeedsLeft.kcal} />
      <MacroCards>
        {BASE_MACRO_ELEMENTS.map(element => (
          <MacroCard
            key={element}
            colors={theme.gradient[element]}
            percentages={macroNeedsLeft[element].ratio}
            title={elementTitles[element]}
            reached={macroNeedsLeft[element].eaten}
            goal={macroNeedsLeft[element].needed}
          />
        ))}
      </MacroCards>
      <FlatList
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
      />
      <ContentContainer>
        <CreateMealContainer>
          <BasicInput
            placeholder="Kurczak z warzywami"
            label="Nazwa nowego posiłku"
            value={newMealName}
            onChangeText={setNewMealName}
          />
          <Button
            accessibilityLabel="Utwórz nowy posiłek"
            onPress={handleNewMealCreate}
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