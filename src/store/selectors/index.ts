import { MealState, ProductState } from '../reducers/diary';
import { MACRO_ELEMENTS } from '../../common/consts';

export const mergedMealSelector = (
  meals: MealState[],
  products: ProductState[]
) => (
  meals.map(meal => ({
    ...meal,
    products: meal.products.flatMap(productId => {
      const foundProduct = products.find(product => product.id === productId);
      return foundProduct ? [foundProduct] : [];
    })
  }))
);

export const calcedMealSelector = (
  meals: ReturnType<typeof mergedMealSelector>
) => meals.map(meal => {
  const baseMacro = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

  const calcedProducts = meal.products.map(product => ({
    ...product,
    ...MACRO_ELEMENTS.reduce((macro, element) => ({
      ...macro,
      [element]: product[element] * product.quantity
    }), { ...baseMacro })
  }));

  const mealMacro = calcedProducts.reduce((macro, product) => {
    for (const element of MACRO_ELEMENTS) {
      macro[element] += product[element];
    }
    return macro;
  }, baseMacro);

  return {
    ...meal,
    ...mealMacro,
    products: calcedProducts
  }
});