
export const INTL_PL = {
  // MealItem
  mealLabel: 'Posiłek',
  addingProductPendingLabel: 'Trwa dodawanie produktu',
  addProductToMealLabel: 'Dodaj produkt do posiłku',
  addProductToMealHint: 'Przechodzi do wyszukiwarki produktów',
  removeProductOrShowDetailsLabel: 'Pokaż szczegóły lub usuń posiłek',
  removeProductOrShowDetailsHint: 'Dotknij aby wyświetlić szczegóły posiłku, lub przytrzymaj aby go usunąć',

  // DateChanger
  prevDayLabel: 'Poprzedni dzień',
  changeDateLabel: 'Zmień datę',
  nextDayLabel: 'Następny dzień',

  // NutritionHome
  deleteMeal: 'Usuń posiłek',
  confirmMealDelete: (mealName: string) => `Czy jesteś pewnien że chcesz usunąć "${mealName}"?`,
  deleteProduct: 'Usuń produkt',
  confirmProductDelete: (productName: string) => `Czy jesteś pewnien że chcesz usunąć "${productName}"?`,

  carbs: 'Węglowodany',
  prots: 'Białko',
  fats: 'Tłuszcze',
  kcal: 'Kalorie',

  androidCameraPermissions: {
    title: 'Uprawnienia kamery',
    message: 'Potrzebuję uprawnień kamery do zeskanowania kodu kreskowego',
    buttonPositive: 'Ok',
    buttonNegative: 'Anuluj',
  },

  takePhoto: 'Zrób zdjęcie',

  createdProduct: (productName: string) => `Utworzono produkt "${productName}"`,

  createOwnProductLabel: 'Stwórz własny produkt',
  createOwnProductHint: 'Przechodzi do tworzenia własnego produktu',

  productsRecent: 'Ostatnio używane',
  productsFavorite: 'Ulubione',
  productsCreated: 'Utworzone',
  productsFound: 'Znalezione',

  withBarcode: (barcode: string) => `z podanym kodem kreskowym: ${barcode}`,
  withName: (name: string) => `o podanej nazwie: ${name}`,

  productListRecent: 'Lista ostatnio używanych produktów',
  productListFound: 'Lista znalezionych produktów',
  productListFavorite: 'Lista ulubionych produktów',
  productListCreated: 'Lista utworzonych produktów',

  loadingProducts: 'Trwa ładowanie produktów',

};