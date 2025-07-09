import { ValidationError } from 'class-validator';

export function buildValidationError(
  errors: ValidationError[],
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  function traverse(errors: ValidationError[], path: string[] = []) {
    errors.forEach((error) => {
      const currentPath = [...path, error.property];
      if (error.constraints) {
        const key = currentPath.join('.');
        const constraints = error.constraints;
        const constraintKeys = Object.keys(constraints).reverse();
        result[key] = constraintKeys.map((k) => constraints[k]);
      }
      if (error.children && error.children.length > 0) {
        traverse(error.children, currentPath);
      }
    });
  }

  traverse(errors);
  return result;
}
