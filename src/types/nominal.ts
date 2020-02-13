export interface DateDay extends String {
  _dateDayBrand: 'YYYY-MM-DD';
}

export interface DateTime extends String {
  _dateTimeBrand: 'HH:mm:ss'
}

export interface TemplateId extends Number {
  _templateIdBrand: number;
}

export interface TemplateIdReverted extends Number {
  _TemplateIdRevertedBrand: number;
}

export interface ProfileId extends Number {
  _profileIdBrand: number;
}

export interface BarcodeId extends String {};

enum ProductIdBrand {};
export type ProductId = ProductIdBrand & number;

enum MealIdBrand {};
export type MealId = MealIdBrand & number;

enum UserIdBrand {};
export type UserId = UserIdBrand & number;

export interface TrainingId extends Number {};
export interface ExerciseId extends Number {};
export interface ExerciseSetId extends Number {};