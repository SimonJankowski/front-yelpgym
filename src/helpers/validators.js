export const required = (value) => (value ? undefined : "Required");
export const mustBeNumber = (value) => (isNaN(value) ? "Must be a number" : undefined);
export const minValue = (min) => (value) => isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;
export const isEmail = (value) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : "this is not correct email adress";
export const isLong = (min) => (value) => value.length >= min ? undefined : `It has to be longer than ${min} characters`;
export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined);
