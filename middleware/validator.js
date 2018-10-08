// this function converts arguments from format ['a', {'b': 'c'}] to [[a], ['b', 'c']]
const convertArgsToArray = mixedArgs => mixedArgs
  .map((eachArg) => {
    if (typeof eachArg === 'object') {
      const objectKeys = Object.keys(eachArg);
      return [objectKeys[0], eachArg[objectKeys[0]]];
    }
    return [eachArg];
  });

const validator = {
// some validation rules, you can add more.
// Return true if validation passes or error message on failure
  minLength(inputField, field, min) {
    return inputField && inputField.length >= min ? true : `${field} should have minimum of ${min} characters`;
  },
  dataType(inputField, field, type) {
    if (inputField && type === 'email') {
      return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(inputField) || `${field} should be of type ${type}`;
    }
    return typeof inputField === type || `${field} should be of type ${type}`;
  },
  // this function does the validation.
  // simply loops and calls every validationRule specified.
  validate(validationRules, userInput) {
    const error = Object.keys(validationRules)
      .map((field) => {
        // trim input if specified and string
        if (validationRules[field].trim && typeof userInput[field] === 'string') userInput[field] = userInput[field].trim();
        // if field is required and not provided, skip subsequent validations, return error
        if (validationRules[field].required && !userInput[field]) return [`${field} is required`];
        // if field is not provided, skip subsequent validations, return no error
        if (!userInput[field]) return [true];
        return convertArgsToArray(validationRules[field].rules)
        // call each rule
          .map(rule => this[rule[0]](
            userInput[field],
            field,
            rule[1],
          ));
      })
      .reduce((accumulator, current) => [...accumulator, ...current], [])
      .filter(test => test !== true);
    return error;
  }
};

export default validationRules => (req, res, next) => {
  const error = validator.validate(validationRules, req.body);
  if (error.length > 0) {
    return res.status(400).json({
      data: {},
      message: error,
    });
  }
  return next();
};
