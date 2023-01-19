/**
 * I kind of don't want to add lodash to this repo …
 */

export type Matcher<Subject> = Subject extends (infer E)[]
  ? ((value: Subject) => boolean) | Matcher<E>[]
  : Subject extends object
  ? {
      [K in keyof Subject]?:
        | ((value: Subject[K]) => boolean)
        | Matcher<Subject[K]>;
    }
  : Subject;

// export function matchmaker<
//   T extends object,
//   J extends Matcher<T> | Matcher<T>[] = Matcher<T> | Matcher<T>[],
// >(filter: J) {
//   const match = (subject: T, currentFilter = filter): boolean => {
//     return isMatchWith(subject, currentFilter, (value, condition) => {
//       // compare value to condition
//       // TODO: test how nested arrays are handled — may have to adjust
//       if (!Array.isArray(value) && !Array.isArray(condition))
//         return typeof condition === 'function'
//           ? condition(value)
//           : isMatch(value, condition);
//       // map value over conditions
//       else if (Array.isArray(condition))
//         return condition.some(c => match(value, c));
//       // map over values and conditions
//       else if (Array.isArray(value))
//         return value.some(v =>
//           !Array.isArray(condition)
//             ? match(v, condition)
//             : condition.some(c => match(v, c)),
//         );
//     });
//   };

//   return match;
// }
