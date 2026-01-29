export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('At least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('One number');
  }

  if (!/[!@#$%^&*()\-_+=.,?/\\|]/.test(password)) {
    errors.push('One special character (!@#$%^&*()-_+=.,?/\\|)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordStrength = (password) => {
  const validation = validatePassword(password);
  const satisfiedCount = 5 - validation.errors.length;

  if (satisfiedCount <= 2) return { strength: 'weak', color: 'red', percentage: 33 };
  if (satisfiedCount <= 4) return { strength: 'medium', color: 'yellow', percentage: 66 };
  return { strength: 'strong', color: 'green', percentage: 100 };
};
