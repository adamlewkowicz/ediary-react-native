import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-ui-kitten';
import { useDispatch, connect } from 'react-redux';
import * as Actions from '../store/actions';
import { AppState } from '../store';
import { FlatList, ScrollView } from 'react-native';
import * as selectors from '../store/selectors';
import { DateChanger } from '../components/DateChanger';
import { MacroCard } from '../components/MacroCard';
import { nutritionColors } from '../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../components/MealListItem';
import { FloatingButton } from '../components/FloatingButton';
import { BasicInput } from '../components/BasicInput';
import { NavigationScreenProps } from 'react-navigation';
import { ProductFinderParams } from './ProductFinder';
import { mealProductAdd } from '../store/actions';
import { ProductCreateParams } from './ProductCreate';
import { BASE_MACRO_ELEMENTS } from '../common/consts';
import { elementTitles } from '../common/helpers';
import { BarcodeScanParams } from './BarcodeScan';
import { productFinder } from '../services/ProductFinder';
import { ProductRepository } from '../repositories/ProductRepository';
import { getCustomRepository } from 'typeorm/browser';

interface HomeProps extends NavigationScreenProps {
  mealsWithRatio: selectors.MealsWithRatio
  appDate: AppState['application']['date']
  appDateDay: AppState['application']['day']
  macroNeedsLeft: selectors.MacroNeedsLeft
  toggledProductId: AppState['diary']['toggledProductId']
}
const Home = (props: HomeProps) => {
  const [name, setName] = useState('Zupa');
  const [menuOpened, setMenuOpened] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.mealsFindByDay(props.appDateDay));
  }, [props.appDateDay]);

  const handleProductFinderNavigation = (meal: selectors.MealsWithRatio[number]) => {
    const screenParams: ProductFinderParams = {
      onItemPress(foundProduct) {
        props.navigation.navigate('Home');
        dispatch(mealProductAdd(meal, foundProduct));
      }
    }
    props.navigation.navigate('ProductFinder', screenParams);
  }
  
  const handleProductCreatorNavigation = () => {
    const screenParams: ProductCreateParams = {
      onProductCreated() {
        props.navigation.navigate('Home');
      }
    }
    props.navigation.navigate('ProductCreate', screenParams);
  }

  const handleBarcodeScan = () => {
    const screenParams: BarcodeScanParams = {
      async onBarcodeDetected(barcode) {
        props.navigation.navigate('Home');
        const product = await productFinder.findByBarcode(barcode);

        if (product) {
          const savedProduct = await getCustomRepository(ProductRepository)
            .findOneOrSave({
              where: { barcode: product.barcode }
            }, product);

          const [firsMeal] = props.mealsWithRatio;
          dispatch(mealProductAdd(firsMeal, savedProduct));
        }
      }
    }
    
    props.navigation.navigate('BarcodeScan', screenParams);
  }
  
  return (
    <Container>
      <FloatingButton
        children="+"
        onPress={() => setMenuOpened(status => !status)}
      />
      <ScrollView>
        <DateChanger
          value={props.appDate}
          onChange={date => dispatch(Actions.appDateUpdated(date))}
        />
        <MacroCards>
          {BASE_MACRO_ELEMENTS.map(element => (
            <MacroCard
              key={element}
              colors={nutritionColors[element]}
              percentages={props.macroNeedsLeft[element].ratio}
              title={elementTitles[element]}
              value={props.macroNeedsLeft[element].diff}
            />
          ))}
        </MacroCards>
        <FlatList
          data={props.mealsWithRatio}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MealListItem
              meal={item}
              onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
              // onLongPress={() => dispatch(Actions.mealDelete(item.id))}
              onProductAdd={() => handleProductFinderNavigation(item)}
              onProductDelete={productId => dispatch(Actions.mealProductDelete(item.id, productId))}
              onProductToggle={productId => dispatch(Actions.productToggled(productId))}
              toggledProductId={props.toggledProductId}
            />
          )}
        />
        <BasicInput
          label="Nazwa posiłku"
          value={name}
          onChangeText={name => setName(name)}
        />
        <Button onPress={() => dispatch(Actions.mealCreate(name))}>
          Dodaj posiłek
        </Button>
        <Button onPress={() => props.navigation.navigate('ProductFinder')}>
          Wyszukiwarka produktów
        </Button>
        <Button onPress={handleProductCreatorNavigation}>
          Dodaj własny produkt
        </Button>
        <Button onPress={handleBarcodeScan}>
          Zeskanuj kod kreskowy
        </Button>
      </ScrollView>
    </Container>
  );
}

const HomeConnected = connect(
  (state: AppState) => ({
    mealsWithRatio: selectors.mealsWithRatio(state),
    macroNeedsLeft: selectors.macroNeedsLeft(state),
    toggledProductId: state.diary.toggledProductId,
    appDate: state.application.date,
    appDateDay: state.application.day,
  }),
  (dispatch) => ({ dispatch })
)(Home);

(HomeConnected as any).navigationOptions = {
  header: null
}

const Container = styled.View`
  display: flex;
  min-height: 100%;
`

const MacroCards = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 50px;
`

export { HomeConnected as Home };