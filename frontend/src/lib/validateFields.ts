  // Validation rules
  export const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.length < 2) error = "Name must be at least 2 characters long";
        else if (value.length > 50) error = "Name must not exceed 50 characters";
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = "Name can only contain letters and spaces";
        break;

      case "username":
        if (value.length < 3) error = "Username must be at least 3 characters long";
        else if (value.length > 50) error = "Username must not exceed 20 characters";
        // else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = "Username can only contain letters, numbers, and underscores";
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        break;

      case "password":
        if (value.length < 8) error = "Password must be at least 8 characters long";
        else if (value.length > 80) error = "Password must not exceed 80 characters";
        else if (!/[A-Z]/.test(value)) error = "Password must contain at least one uppercase letter";
        else if (!/[a-z]/.test(value)) error = "Password must contain at least one lowercase letter";
        else if (!/[0-9]/.test(value)) error = "Password must contain at least one number";
        else if (!/[\W_]/.test(value)) error = "Password must contain at least one special character";
        break;

      default:
        break;
    }

    return error;
  };