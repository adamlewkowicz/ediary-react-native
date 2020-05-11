import React from 'react';
import { Button, ButtonProps } from './Button';
import { RightArrowIcon } from '../Icons';

export const ButtonSecondary = (props: ButtonProps) => (
  <Button {...props} variant="secondary" />
);

export const ButtonSecondaryArrow = (props: ButtonProps) => (
  <Button {...props} variant="secondary" Icon={RightArrowIcon} />
);