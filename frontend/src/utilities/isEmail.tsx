export const isEmail = (input: String): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
  };