
export type Response = ({
  status: 0
  product: null
}) | ({
  status: 1
  product: Product
})

export interface Product {
  _id: string
  product_name_pl?: string
  image_url?: string
  image_nutrition_url?: string
  /** 10g */
  serving_size: string
  nutriments: {
    'nutrition-score-fr': 19
    'sodium_unit': 'g'
    'fat_unit':	"g"
    'sodium':	0.008
    'energy_serving':	312
    'proteins_unit':	"g"
    'sugars_100g':	1
    'sugars_unit':	"g"
    'energy-kcal_value':	number
    'energy_value':	number
    'salt_serving':	0.002
    'energy-kcal':	3121
    'proteins_100g':	1
    'saturated-fat_value':	54
    'salt_value':	0.02
    'saturated-fat_100g':	number
    'sugars':	1
    'energy_unit':	"kcal"
    'energy-kcal_unit':	"kcal"
    'saturated-fat_serving':	5.4
    'sodium_value':	0.008
    'sodium_100g':	0.008
    'carbohydrates':	1
    'saturated-fat':	54
    'carbohydrates_100g':	1
    'fat':	82
    'energy':	3121
    'sugars_value':	1
    'sodium_serving':	0.0008
    'proteins':	1
    'nutrition-score-fr_100g':	19
    'salt_unit':	"g"
    'energy-kcal_serving':	312
    'saturated-fat_unit':	"g"
    'fat_value':	number
    'fat_100g':	number
    'sugars_serving':	0.1
    'salt':	0.02
    'fat_serving':	8.2
    'energy-kcal_100g':	3121
    'proteins_value':	1
    'carbohydrates_serving':	0.1
    'salt_100g':	0.02
    'carbohydrates_unit':	"g"
    'carbohydrates_value':	1
    'energy_100g':	3121
    'fruits-vegetables-nuts-estimate-from-ingredients_100g':	0
    'proteins_serving':	0.1
  }
  selected_images: {
    nutrition: {
      pl?: string
    }
    display: {
      pl?: string
    }
    front: {
      pl?: string
    }
  }
}

export type Country = 'pl' | 'world'