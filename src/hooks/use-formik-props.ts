

export const useFormikProps = <
  F extends object,
  K extends keyof F
>(
  formik: Formik<F, K>,
  formikProperty: K
) => ({
  value: formik.values[formikProperty],
  onChangeText: formik.handleChange(formikProperty),
  onBlur: formik.handleBlur(formikProperty),
  error: formik.errors[formikProperty],
  isDirty: formik.touched[formikProperty],
});

interface Formik<F extends object, K extends keyof F> {
  values: F
  errors: F
  touched: F
  handleChange: (key: K) => any
  handleBlur: (key: K) => any
}