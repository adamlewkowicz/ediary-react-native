import { diaryActions } from '../actions'
import { MEAL_PRODUCT_ADDED, MEAL_PRODUCT_DELETED, MEAL_DELETED } from '../consts'
import { DiaryProduct } from './diary/types'
import { calcMacroByQuantity } from './diary/helpers'

export const diaryProductsReducer = (
  state: DiaryProduct[],
  action: DiaryProductsAction,
): DiaryProduct[] => {
  switch(action.type) {
    case MEAL_PRODUCT_ADDED: return [
      ...state,
      {
        ...action.payload,
        data: action.meta.rawProduct,
        isToggled: false,
        calcedMacro: calcMacroByQuantity(action.payload.macro, action.payload.quantity),
      }
    ]
    case MEAL_PRODUCT_DELETED: return state.filter(
      product => product.id !== action.meta.productId
    )
    case MEAL_DELETED: return state.filter(product =>
      product.mealId !== action.meta.mealId
    )
    default: return state;
  }
}


type ValueOf<T> = T[keyof T]

type Actions<T extends object> = ReturnType<ValueOf<T>>

type DiaryActionCreators = typeof diaryActions
type DiaryActions = ReturnType<ValueOf<DiaryActionCreators>>

type x = ReturnType<DiaryActionCreators['mealUpdated']>
// type DiaryActions = Actions<typeof diaryActions>

type DiaryProductsAction = 
  | DiaryActions