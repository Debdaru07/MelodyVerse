export const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    let strength = 0;

    // Check for length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength += 1;

    // Check for numbers
    if (/\d/.test(password)) strength += 1;

    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength;
  };