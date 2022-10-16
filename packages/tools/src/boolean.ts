/**
 * boooo👻lean
 */
export const boolean = {
  not: not,
  null: isNull,
  notNull: isNotNull,
};

function not<T extends (...args: any) => boolean>(condition: T): T {
  return <T>((...args: Parameters<T>[number][]) => !condition(...args));
}

function isNull(v: unknown): v is null | undefined {
  return v == null;
}

function isNotNull<T>(v: T): v is Exclude<T, null | undefined> {
  return v != null;
}
