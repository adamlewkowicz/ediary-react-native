import React, { useReducer, useRef, createRef, useEffect } from 'react';
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
import { NavigationScreenProps } from 'react-navigation';
import { useUserId } from '../../hooks';
import { Product } from '../../database/entities';
import { parseNumber } from '../../common/utils';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';
import { ProductCreateParams } from './params';
import { useNavigationParams } from '../../hooks/useNavigationParams';
import { PORTION_TITLE, NUTRITION_INPUTS } from './consts';
import { useNavigation } from 'react-navigation-hooks';
import { H2, TextInput as Input, Button, H2Dot } from '../../elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { RightArrowIcon } from '../../components/Icons';
import { theme } from '../../common/theme';

interface ProductCreateProps extends
  NavigationScreenProps<ProductCreateParams, ProductCreateOptions> {}

export const ProductCreate = (props: ProductCreateProps) => {
  const params = useNavigationParams<ProductCreateParams>();
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
  const navigation = useNavigation();

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
  
  useEffect(() => {
    navigation.setParams({ _handleProductCreate: handleProductCreate });
  }, [state]);

  function handlePortionOptionChange(option: PortionOption) {
    dispatch({
      type: 'SELECT_PORTION_OPTION',
      payload: option
    });
  }

  return (
    <ScrollView>
      <Container>
        <Section>
          <SectionTitle>Podstawowe dane</SectionTitle>
          <StyledInput
            label="Nazwa"
            placeholder="Mleko UHT 3.2%"
            value={'Mleko UHT 3.2%'}
            isValid={true}
          />
          <StyledInput
            label="Marka"
            placeholder="Łaciate"
          />
          <StyledInput
            label="Producent"
            placeholder="Mlekpol"
          />
        </Section>
        <Section>
          <SectionTitle>Makroskładniki</SectionTitle>
          <MultipleInputsContainer>
            <StyledInput
              label="Węglowodany"
              placeholder="0"
            />
            <StyledInput
              label="w tym cukry"
              placeholder="0"
            />
          </MultipleInputsContainer>
          <StyledInput
            label="Białko"
            placeholder="0"
          />
          <MultipleInputsContainer>
            <StyledInput
              label="Tłuszcze"
              placeholder="0"
            />
            <StyledInput
              label="w tym kwasy tłuszczowe"
              placeholder="0"
            />
          </MultipleInputsContainer>
          <StyledInput
            label="Kalorie"
            placeholder="0"
            rightContent={(
              <InputActionButton isReverted>Oblicz</InputActionButton>
            )}
          />
        </Section>
        <Section>
          <SectionTitle>Porcje</SectionTitle>
        </Section>
        <Section isLast>
          <SectionTitle>Inne</SectionTitle>
          <StyledInput
            label="Kod kreskowy"
            placeholder="5900820000011"
            rightContent={(
              <InputActionButton
                // rightContent={<BarcodeButton />}
                rightContent={RightArrowI}
                isReverted
              >
                Zeskanuj
              </InputActionButton>
            )}
          />
        </Section>
        <Button>Zapisz produkt</Button>
        {/* <BasicInput
          label="Nazwa"
          accessibilityLabel="Nazwa produktu"
          value={state.name}
          onChangeText={name => handleUpdate({ name })}
          onSubmitEditing={refsList.producer.current?.focus}
        />
        <BasicInputRef
          label="Producent"
          accessibilityLabel="Producent"
          value={state.producer}
          onChangeText={producer => handleUpdate({ producer })}
          onSubmitEditing={refsList.portion.current?.focus}
          ref={refsList.producer}
        />
        <OptionsContainer>
          <InfoTitle>Wartości odżywcze na:</InfoTitle>
          <Options
            value={state.portionOptions}
            onChange={handlePortionOptionChange}
          />
        </OptionsContainer>
        <InputRow
          title={PORTION_TITLE[state.portionOption]}
          value={state.portion}
          onChangeText={portion => handleUpdate({ portion: parseNumber(portion, 10000, 6) })}
          onSubmitEditing={refsList.carbs.current?.focus}
          ref={refsList.portion}
          accessibilityLabel="Ilość produktu"
          styles={InputCss}
        />
        {NUTRITION_INPUTS.map(data => (
          <InputRow
            key={data.title}
            title={data.title}
            value={state[data.property]}
            onChangeText={value => handleUpdate({ [data.property]: parseNumber(value, 10000, 6) })}
            onSubmitEditing={refsList[data.nextRef].current?.focus}
            ref={refsList[data.property]}
            accessibilityLabel={data.title}
            styles={InputCss}
          />
        ))}
        <InputRow
          title="Kod kreskowy"
          keyboardType="default"
          ref={refsList.barcode}
          value={state.barcode as string}
          onChangeText={barcode => handleUpdate({ barcode })}
          onSubmitEditing={handleProductCreate}
          accessibilityLabel="Kod kreskowy"
          styles={InputCss}
        /> */}
      </Container>
    </ScrollView>
  );
}

const MultipleInputsContainer = styled.View`
  flex-direction: row;s
`

const Section = styled.View<{
  isLast?: boolean
}>`
  margin-bottom: ${props => props.isLast ? 0 : '35px'};
`

const StyledInput = styled(Input)`
  flex: 1;
`

const InputActionButton = styled(Button)`
  margin-left: 20px;
`

const StyledRightArrow = styled(RightArrowIcon)`
  margin-left: 5px;
`

const RightArrowI = (
  <StyledRightArrow width={14} height={14} fill={theme.color.primary} />
)

const SectionTitle = styled(H2Dot)``

const Container = styled.KeyboardAvoidingView`
  padding: ${props => props.theme.padding.screen};
  background: ${props => props.theme.color.background};
`

const InfoTitle = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.regular};
`

const SaveButton = styled(TouchableOpacity)`
  margin-right: 10px;
`

const SaveText = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.focus};
`

const OptionsContainer = styled.View`
  margin: 10px 0;
`

const InputCss = css`
  margin-bottom: 10px;
`

const navigationOptions: ProductCreateProps['navigationOptions'] = ({ navigation }) => ({
  headerTitle: 'Stwórz produkt',
  headerRight: (
    <_SaveButton>Zapisz</_SaveButton>
    // <SaveButton
    //   onPress={navigation.getParam('_handleProductCreate')}
    //   accessibilityLabel="Zapisz produkt"  
    // >
    //   <SaveText>Zapisz</SaveText>
    // </SaveButton>
  )
});

const _SaveButton = styled(Button)`
  margin-right: 10px;
`

ProductCreate.navigationOptions = navigationOptions;
interface ProductCreateOptions {
  headerTitle: string
  headerRight: JSX.Element
}