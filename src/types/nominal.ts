export interface DateDay extends String {
  _dateDayBrand: 'YYYY-MM-DD';
}

export interface DateTime extends String {
  _dateTimeBrand: 'HH:mm:ss'
}

export interface DateTimeBase extends String {
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