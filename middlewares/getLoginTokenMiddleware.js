let data = {
    _value: 'Initial Value',
  
    get value() {
      return this._value;
    },
  
    set value(newValue) {
      this._value = newValue;
    }
  };
  
  // Middleware function with getter and setter for login token
  const loginTokenMiddleware = (req, res, next) => {
    req.getValue = () => data.value;
    req.setValue = (newValue) => {
      data.value = newValue;
    };
    next();
  };

  module.exports = loginTokenMiddleware;