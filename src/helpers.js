export function validateNumber (checkedValue, code_len) {
  // show error, etc
  // todo: fix regexp if code_len != 4 or no digits only
  if(checkedValue.length !== code_len || !(/^\d{4}$/.test(checkedValue))) {
    return `Please enter ${code_len} unique digit`;
  }

  // skip if has same digit > 1
  let error = null;
  checkedValue.split('').forEach((digit,index) => {
    if(checkedValue.indexOf(digit) !== index) {
      error = 'Please use unique digits in the code';
    }
  });

  return error;
}

export function getResult(testValue, value) {
  const result = {
    checkedValue: testValue,
    countCow: 0,
    countBull: 0
  };
  testValue = testValue.toString();
  value = value.toString();

  for (let i = 0; i < testValue.length; i++) {
    if (testValue[i] === value[i]) {
      result.countBull++;
    } else if (value.includes(testValue[i])) {
      result.countCow++;
    }

  }
  result.tempCow = result.countBull + result.countCow;
  return result;
}