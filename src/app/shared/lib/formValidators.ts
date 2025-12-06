import {FormControl, FormGroup} from '@angular/forms';

// Валидатор для проверки совпадения паролей в группе форм
export function passwordsMatch(group: FormGroup) {
  const password = group.get('password')?.value;
  const repeatPassword = group.get('repeat_password')?.value;
  return password === repeatPassword
    ? null
    : {passwordsMismatch: 'Пароли не совпадают'};
}

// Валидатор для проверки сложности пароля
export function password(control: FormControl) {
  const value: string = control.value || '';

  if (value.length < 8) {
    return {invalidPassword: 'Пароль должен быть не менее 8 символов'};
  }

  if (!/[A-Z]/.test(value)) {
    return {
      invalidPassword: 'Пароль должен содержать хотя бы одну заглавную букву',
    };
  }

  if (!/[a-z]/.test(value)) {
    return {
      invalidPassword: 'Пароль должен содержать хотя бы одну строчную букву',
    };
  }

  if (!/\d/.test(value)) {
    return {invalidPassword: 'Пароль должен содержать хотя бы одну цифру'};
  }

  if (/\s/.test(value)) {
    return {invalidPassword: 'Пароль не должен содержать пробелов'};
  }

  const simplePatterns = [
    '123456',
    'abcdef',
    'qwerty',
    'пароль',
    'password',
    'asdfgh',
  ];
  const lowerValue = value.toLowerCase();
  if (simplePatterns.some((pattern) => lowerValue.includes(pattern))) {
    return {invalidPassword: 'Пароль слишком простой'};
  }

  if (/(.)\1{3,}/.test(value)) {
    return {
      invalidPassword:
        'Пароль не должен содержать более 3 одинаковых символов подряд',
    };
  }

  return null;
}

// Валидатор для проверки корректности email
export function email(control: FormControl) {
  const strictEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  const valid = strictEmailRegex.test(control.value);
  return valid ? null : {invalidEmail: 'Некорректная почта'};
}
