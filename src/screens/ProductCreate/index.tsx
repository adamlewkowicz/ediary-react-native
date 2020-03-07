import React, { useReducer, useRef, createRef } from 'react';
import styled from 'styled-components/native';
import {
  productCreateReducer,
  ProductCreateState,
  PortionOption,
  initProductCreateReducer,
} from './reducer';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useUserId, useNavigationData } from '../../hooks';
import { Product } from '../../database/entities';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import {
  InputMetaText,
  Section,
  Table,
  Group,
  TextSecondary,
  TextPrimary,
  ButtonPrimary,
  Input,
  InputButton,
} from '../../components';

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
        <Section title="Podstawowe dane">
          <Input 
            label="Nazwa"
            placeholder="Mleko UHT 3.2 %"
          />
          <Input 
            label="Marka"
            placeholder="Łaciate"
          />
          <Input 
            label="Producent"
            placeholder="Mlekovita"
            value={'Mlekovita'}
          />
        </Section>
        <Section
          title="Makroskładniki"
          description="Na 100g produtku"
        >
          <Group.Container>
            <Input
              label="Węglowodany"
              placeholder="0"
            />
            <Group.Separator />
            <Input
              label="w tym cukry"
              placeholder="0"
            />
          </Group.Container>
          <InputMetaText
            label="Białko"
            placeholder="0"
            metaText="g"
          />
          <Group.Container>
            <Input
              label="Tłuszcze"
              placeholder="0"
            />
            <Group.Separator />
            <Input
              label="w tym kwasy tłuszczowe"
              placeholder="0"
            />
          </Group.Container>
          <InputButton
            label="Kalorie"
            placeholder="0"
            buttonText="Oblicz"
          />
        </Section>
        <Section title="Porcje">
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
        <Section title="Inne">
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