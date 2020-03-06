import React, { useReducer, useRef, createRef } from 'react';
import styled, { css } from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import {
  productCreateReducer,
  ProductCreateState,
  PortionOption,
  initProductCreateReducer,
} from './reducer';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { InputRow } from '../../components/InputRow';
import { Options } from '../../components/Options';
import { useUserId, useNavigationData } from '../../hooks';
import { Product } from '../../database/entities';
import { parseNumber } from '../../common/utils';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';
import { PORTION_TITLE, NUTRITION_INPUTS } from './consts';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import { Button } from '../../components/Button';
import { Input, InputButton } from '../../elements/Input';
import { H2, H3, TextSecondary, TextPrimary } from '../../elements/Text';
import { ButtonPrimary, ButtonSecondary } from '../../elements/ButtonPrimary';
import * as Table from '../../elements/Table';

interface ProductCreateScreenProps {}

export const ProductCreateScreen = (props: ProductCreateScreenProps) => {
  const { params, navigation } = useNavigationData<ProductCreateScreenNavigationProps>();
  const [state, dispatch] = useReducer(
    productCreateReducer,
    params,
    initProductCreateReducer
  );
  const storeDispatch = useDispatch();
  const userId = useUserId();
  const { current: refsList } = useRef({
    producer: createRef<TextInput>(),
    portion: createRef<TextInput>(),
    carbs: createRef<TextInput>(),
    prots: createRef<TextInput>(),
    fats: createRef<TextInput>(),
    kcal: createRef<TextInput>(),
    barcode: createRef<TextInput>(),
  });

  function handleUpdate(payload: Partial<ProductCreateState>) {
    dispatch({
      type: 'UPDATE',
      payload
    });
  }

  async function handleProductCreate() {
    const {
      portionOption,
      portionOptions,
      portion,
      barcode,
      carbs,
      prots,
      fats,
      kcal,
      ...data
    } = state;

    if (!data.name.length) {
      return;
    }

    const createdProduct = await Product.save({
      ...data,
      name: data.name.trim(),
      barcode: barcode.length ? barcode : null,
      userId,
      macro: {
        carbs: Number(carbs),
        prots: Number(prots),
        fats: Number(fats),
        kcal: Number(kcal),
      }
    });

    storeDispatch(
      Actions.productHistoryRecentAdded([createdProduct])
    );

    params.onProductCreated?.(createdProduct);
  }

  function handlePortionOptionChange(option: PortionOption) {
    dispatch({
      type: 'SELECT_PORTION_OPTION',
      payload: option
    });
  }

  navigation.setOptions({
    headerRight: () => (
      <SaveButton
        onPress={handleProductCreate}
        accessibilityLabel="Zapisz produkt"  
      >
        <SaveText>Zapisz</SaveText>
      </SaveButton>
    )
  });

  return (
    <ScrollView>
      <Container>
        <Section>
          <H2>Podstawowe dane:</H2>
          <Input 
            label="Nazwa:"
            placeholder="Mleko UHT 3.2 %"
          />
          <Input 
            label="Marka:"
            placeholder="Łaciate"
          />
          <Input 
            label="Producent:"
            placeholder="Mlekovita"
            value={'Mlekovita'}
          />
        </Section>
        <Section>
          <H2>Makroskładniki:</H2>
          <H3>Na 100g produktu</H3>
          <InputGroup>
            <Input
              label="Węglowodany"
              placeholder="0"
            />
            <GroupSeparator />
            <Input
              label="w tym cukry"
              placeholder="0"
            />
          </InputGroup>
          <Input
            label="Białko"
            placeholder="0"
          />
          <InputGroup>
            <Input
              label="Tłuszcze"
              placeholder="0"
            />
            <GroupSeparator />
            <Input
              label="w tym kwasy tłuszczowe"
              placeholder="0"
            />
          </InputGroup>
          <InputButton
            label="Kalorie"
            placeholder="0"
            buttonText="Oblicz"
          />
        </Section>
        <Section>
          <H2>Porcje</H2>
          <Table.HeadRow>
            <Table.TH>Nazwa</Table.TH>
            <Table.TH>Ilość</Table.TH>
          </Table.HeadRow>
          {PRODUCTS.map(productName => (
            <Table.Row key={productName}>
              <TextSecondary>{productName}</TextSecondary>
              <TextPrimary>150g</TextPrimary>
            </Table.Row>
          ))}
        </Section>
        <Section>
          <H2>Inne</H2>
          <InputButton
            label="Kod kreskowy"
            placeholder="5900512300108"
            buttonText="Zeskanuj"
          />
        </Section>
        <ButtonPrimary>
          Zapisz produkt
        </ButtonPrimary>
      </Container>
    </ScrollView>
  );
}

const PRODUCTS = [
  'Porcja',
  'Opakowanie',
  'Szklanka'
] as const;

const Container = styled.KeyboardAvoidingView`
  padding: 20px;
`

const SaveButton = styled(TouchableOpacity)`
  margin-right: 10px;
`

const SaveText = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.focus};
`

const Section = styled.View`
  padding: 10px 0;
`

const InputGroup = styled.View`
  flex-direction: row;
`

const GroupSeparator = styled.View`
  width: 20px;
`