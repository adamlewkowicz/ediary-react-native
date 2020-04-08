import React from 'react';
import { InputProps, InputRef } from './Input';
import { TextInput } from 'react-native';

interface InputFormProps<
  V extends object = {},
  T extends object = {},
  K extends keyof V = keyof V,
>
  extends InputProps
{
  formik: {
    values: V
    errors: V
    touched: T
    handleChange: (key: K) => any
    handleBlur: (key: K) => any
  }
  formikProperty: K
  ref?: React.Ref<TextInput>
}

export const InputForm = React.forwardRef((
  props: InputFormProps,
  ref: React.Ref<TextInput>
) => {
  const {
    formik,
    formikProperty: property, 
    ...inputProps
  } = props;

  return (
    <InputRef
      value={formik.values[property]}
      onChangeText={formik.handleChange(property)}
      onBlur={formik.handleBlur(property)}
      error={formik.errors[property]}
      isDirty={formik.touched[property]}
      ref={ref}
      {...inputProps}
    />
  );
}) as any as IInputForm;

type IInputForm = <V extends object>(props: InputFormProps<V>) => React.ReactElement;