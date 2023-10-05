export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const NAME_REGEX = /^[a-zA-Z0-9_]{2,20}$/
export const PASSWORD_REGEX_1 = /^.{5,}$/
// ^^ At least 5 characters. Accepts any characters.
export const PASSWORD_REGEX_2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
// ^^ At least 8 characters. At least 1 lowercase char, 1 uppercase char, and 1 number
export const PASSWORD_REGEX_3 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{10,}$/
// ^^ At least 10 characters. At least 1 lowercase char, 1 uppercase char, 1 number, and 1 special character
export const PASSWORD_REGEX_4 =
  /^(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*\d.*\d)(?=.*[!@#$%^&*()_+].*[!@#$%^&*()_+]).{12,}$/
// ^^ At least 12 characters. At least 2 lowercase chars, 2 uppercase chars, 2 numbers, and 2 special characters
