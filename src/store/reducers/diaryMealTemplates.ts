import { MealAdded, MealsLoaded, MealDeleted } from '../actions'
import { MEAL_ADDED, MEALS_LOADED, MEAL_DELETED } from '../consts'
import { TemplateId } from '../../types'

interface DiaryMealTemplate {
  name: string
  id: number
  isOpened: boolean
  isVisible: boolean
}

interface DiaryMealTemplatesState {
  mealTemplates: DiaryMealTemplate[]
  visibleIds: TemplateId[]
}

const initialState: DiaryMealTemplatesState = {
  mealTemplates: [],
  visibleIds: [],
}

const diaryOpenedMealIdReducer = (
  state: number,
  action: DiaryMealTemplatesAction
) => {
  
}

export const diaryMealTemplatesReducer = (
  state = initialState,
  action: DiaryMealTemplatesAction
): DiaryMealTemplatesState => {
  switch(action.type) {
    case MEAL_ADDED: return {
      ...state,
      mealTemplates: state.mealTemplates.map(mealTemplate => {
        if (mealTemplate.name === action.payload.name) {
          return {
            ...mealTemplate,
            isVisible: false,
            isOpened: false,
          }
        }
        return mealTemplate;
      })
      // visibleIds: state.visibleIds.filter(mealTemplateId => {
        
      // })
    }
    case MEAL_DELETED: return {
      ...state,
    }
    case MEALS_LOADED: return {
      ...state,
    }
    default: return state;
  }
}

type DiaryMealTemplatesAction = 
  | MealAdded
  | MealsLoaded
  | MealDeleted