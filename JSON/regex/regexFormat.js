export const regexFormat = {
  name: /^[aA-zZ\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name2: /[a-zA-Z]+[(@!#\$%\^\&*\)\(+=._-]{1,}/,
  decimal: /^[-+]?[0-10]+\.[0-10]+$/,
};
