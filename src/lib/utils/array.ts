export const areEqual = <T>(
  a: T[],
  b: T[],
  options: {
    strict?: boolean;
    compareOrder?: boolean;
  } = {
    strict: true,
    compareOrder: true,
  },
): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (a.length !== b.length) return false;
  if (options.compareOrder) {
    return a.every((value, index) => {
      const otherValue = b[index];
      if (Array.isArray(value) && Array.isArray(otherValue)) {
        return areEqual(value, otherValue, options);
      }
      if (typeof value === "object" && typeof otherValue === "object" && value !== null && otherValue !== null) {
        return JSON.stringify(value) === JSON.stringify(otherValue);
      }
      return options.strict ? value === otherValue : value == otherValue;
    });
  }
  return a.every((value) =>
    b.some((otherValue) => {
      if (Array.isArray(value) && Array.isArray(otherValue)) {
        return areEqual(value, otherValue, options);
      }
      if (typeof value === "object" && typeof otherValue === "object" && value !== null && otherValue !== null) {
        return JSON.stringify(value) === JSON.stringify(otherValue);
      }
      return options.strict ? value === otherValue : value == otherValue;
    }),
  );
};
