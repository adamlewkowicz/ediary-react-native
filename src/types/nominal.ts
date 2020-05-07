export interface DayjsDate extends String {
  _dateDayBrand: 'YYYY-MM-DD';
}

export interface DayjsTime extends String {
  _dateTimeBrand: 'HH:mm:ss'
}

export interface DayjsTimeBase extends String {
  _dateTimeBrand: 'HH:mm'
}

export interface TemplateId extends Number {
  _templateIdBrand: number;
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

export interface RunningCoordId extends Number {};

export interface RunningTrainingId extends Number {};