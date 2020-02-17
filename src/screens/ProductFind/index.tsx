import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { ProductListItem, Separator } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { SectionList } from 'react-navigation';
import { Block, Title } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { BarcodeId } from '../../types';
import { Button } from '../../components/Button';
import { useConnected, useIdleStatus, useNavigate } from '../../hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { ActivityIndicator } from 'react-native';
import { ProductFindParams } from './params';
import { useNavigationParams } from '../../hooks/useNavigationParams';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';

interface ProductFindProps {}

export const ProductFind = (props: ProductFindProps) => {
  const params = useNavigationParams<ProductFindParams>();
  const [name, setName] = useState('');
  const [products, setProducts] = useState<ProductOrNormalizedProduct[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState<BarcodeId | null>(null);
  const isConnected = useConnected();
  const productsAreEmpty = !products.length;
  const recentProducts = useSelector((state: StoreState) => state.productHistory);
  const hasBeenPressed = useRef(false);
  const isIdle = useIdleStatus();
  const navigate = useNavigate();

  const handleProductNameUpdate = (productName: string): void => {
    setName(productName);
    if (!isLoading) setLoading(true);
  }

  useDebouncedEffect(() => {
    const controller = new AbortController();
    const trimmedName = name.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    Product[methodName](trimmedName, controller)
      .then(setProducts)
      .catch(error => {
        // TODO: Error handling
        if (error.name === 'AbortError') {
          // pass
        } else {
          
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [name, isConnected], 150);

  function handleBarcodeScanNavigation() {
    navigate('BarcodeScan', {
      async onBarcodeDetected(barcode) {
        navigate('ProductFind');
        setName('');
        setProducts([]);
        setLoading(true);

        const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';
        const foundProducts = await Product[methodName](barcode);

        if (foundProducts.length) {
          setProducts(foundProducts);
        } else {
          setBarcode(barcode);
        }
        setLoading(false);
      }
    });
  }

  function handleProductCreateNavigation() {
    navigate('ProductCreate', {
      barcode: barcode !== null ? barcode : undefined,
      name: name.trim(),
      onProductCreated(createdProduct) {
        setBarcode(null);
        setProducts([createdProduct]);
        setLoading(false);
        navigate('ProductFind');
      }
    });
  }

  async function handleItemPress(product: ProductOrNormalizedProduct) {
    if (params.onItemPress && !hasBeenPressed.current) {
      hasBeenPressed.current = true;

      const productResolver: ProductResolver = async () => {
        if (product instanceof Product) {
          return product;
        }
        return Product.saveNormalizedProduct(product);
      }

      params.onItemPress(productResolver);
    }
  }

  function renderInfo() {
    if (
      isLoading ||
      !productsAreEmpty ||
      (!name.length && barcode === null)
    ) return null;

    return (
      <>
        <NotFoundInfo>
          Nie znaleziono produktów.
        </NotFoundInfo>
        {!isConnected && (
          <NotFoundInfo>
            Aby wyszukiwać więcej produktów, przejdź do trybu online.
          </NotFoundInfo>
        )}
        <AddOwnProductButton
          onPress={handleProductCreateNavigation}
          accessibilityLabel="Dodaj własny produkt"
        >
          Dodaj własny
        </AddOwnProductButton>
      </>
    );
  }

  return (
    <Container>
      <Block space="space-between" align="center">
        <InputSearcher
          value={name}
          placeholder="Nazwa produktu"
          accessibilityLabel="Nazwa szukanego produktu"
          onChangeText={handleProductNameUpdate}
          isLoading={isLoading}
        />
        <BarcodeButton
          accessibilityLabel="Zeskanuj kod kreskowy"
          onPress={handleBarcodeScanNavigation}
        />
      </Block>
      <SectionList
        data={products}
        keyExtractor={(product, index) => `${product.id}${index}`}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        renderSectionHeader={({ section: { title }}) => (
          <SectionTitleContainer isFirst={title === SECTION_TITLE.foundProducts}>
            <Title>{title}</Title>
            {title === SECTION_TITLE.foundProducts && renderInfo()}
            {title === SECTION_TITLE.recentProducts && !isIdle && <ActivityIndicator />}
          </SectionTitleContainer>
        )}
        sections={[
          { title: SECTION_TITLE.foundProducts, data: products },
          { title: SECTION_TITLE.recentProducts, data: isIdle ? recentProducts : [] },
        ]}
        renderItem={({ item: product }: { item: ProductOrNormalizedProduct }) => (
          <ProductListItem
            product={product}
            onPress={() => handleItemPress(product)}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  padding: 20px 20px 60px 20px;
`

const NotFoundInfo = styled.Text`
  margin-top: 25px;
  text-align: center;
  font-family: ${props => props.theme.fontWeight.regular};
  padding: 0 50px;
`

const SectionTitleContainer = styled.View<{
  isFirst: boolean
}>`
  padding: ${props => props.isFirst ? '10px 0 5px 0' : '30px 0 5px 0'}
`

const AddOwnProductButton = styled(Button)`
  margin-top: 15px;
`

ProductFind.navigationOptions = {
  headerTitle: 'Znajdź produkt'
}

const SECTION_TITLE = {
  foundProducts: 'Znalezione produkty:',
  recentProducts: 'Ostatnie produkty:',
}

export type ProductResolver = () => Promise<Product>;