let counter = 1000;

/** Monotonic id generator for mock entities created at runtime. */
export const uid = (prefix = 'id'): string => {
  counter += 1;
  return `${prefix}-${counter}`;
};
