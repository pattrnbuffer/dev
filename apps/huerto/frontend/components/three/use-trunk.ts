import { useMemo, useRef } from 'react';
import { useRevision } from './use-revision';

const key = Symbol('clone');

type Root<T> = Branch<T> | BranchRef<T>;
type Branch<T> = {
  history: { value: T; at: number }[];
  roots: (Branch<T> | undefined)[];
  tags: {
    head: number;
    latest: number;
    branch?: number;
  };
};
type BranchRef<T> = { [key]: Branch<T> };

export function useTrunk<T>(source?: Root<T>) {
  const $ = useRef(Trunk.create(source));

  const { id, commit } = useRevision<Branch<T>>(
    (value = $.current) => ($.current = value),
  );

  const trunk = useMemo(
    () => ({
      id,

      get head() {
        return Trunk.head($.current);
      },

      get lastest() {
        return Trunk.latest($.current);
      },

      get [key]() {
        return $.current;
      },

      add: (value: T) => void ($.current = Trunk.add($.current, value)),
      branch: () => void ($.current = Trunk.branch($.current)),
      reset: () => void ($.current = Trunk.reset($.current)),

      commit: () => commit(() => Trunk.commit($.current)),
      delete: () => commit(() => Trunk.delete($.current)),
      merge: () => commit(() => Trunk.merge($.current)),

      useMemoAdd: (value: T) =>
        useMemo(() => Trunk.add($.current, value), [value]),
    }),
    [id],
  );

  return trunk;
}

export const Trunk = {
  ref<T>(source?: Branch<T> | BranchRef<T>) {
    return (source as BranchRef<T>)?.[key] ?? source;
  },

  head<T>(source: Branch<T>) {
    return source.history.slice(0, source.tags.head + 1);
  },

  latest<T>(source: Branch<T>) {
    return source.history.slice(0);
  },

  create<T>(source?: Branch<T> | BranchRef<T>): Branch<T> {
    const trunk = Trunk.ref(source);

    return trunk
      ? {
          history: [...trunk.history],
          roots: [trunk, ...trunk.roots],
          tags: {
            ...trunk.tags,
            branch: trunk.tags.latest,
          },
        }
      : {
          history: [],
          roots: [],
          tags: { head: 0, latest: 0 },
        };
  },

  branch<T>(source: Branch<T>) {
    return Trunk.create(source);
  },

  merge<T>(source: Branch<T>) {
    const [root, ...roots] = source.roots;

    return {
      ...source,
      roots,
      tags: {
        ...source.tags,
        branch: root?.tags.branch,
      },
    };
  },

  delete<T>(source: Branch<T>) {
    return source.roots[0] ?? Trunk.create();
  },

  commit<T>(source: Branch<T>) {
    const { history, tags, roots } = source;

    return tags.head < tags.latest
      ? {
          history: [...history],
          roots,
          tags: { ...tags, head: tags.latest },
        }
      : source;
  },

  add<T>(source: Branch<T>, value: T) {
    const { history, roots, tags } = source;

    return {
      history: [...history, { value, at: Date.now() }],
      roots,
      tags: { ...tags, latest: history.length },
    };
  },

  reset<T>(source: Branch<T>) {
    let { history, roots, tags } = source;
    history = history.slice(0, tags.head + 1);

    return {
      history,
      roots,
      tags: {
        ...tags,
        latest: tags.head,
        branch: tags.branch ? tags.head : undefined,
      },
    };
  },
};
