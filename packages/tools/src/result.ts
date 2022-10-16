export type ResultType<I, O, E = {}> =
  | ResultAccepted<I>
  | ResultPending<I>
  | ResultResolved<I, O>
  | ResultRejected<I, E>;

export type ResultAccepted<I> = { type: 'accepted' } & Partial<I>;
export type ResultPending<I> = { type: 'pending' } & I;
export type ResultResolved<I, O> = { type: 'resolved' } & Omit<I, 'type'> & O;
export type ResultRejected<I, E> = { type: 'rejected' } & Omit<I, 'type'> & E;
