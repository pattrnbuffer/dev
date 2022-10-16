import { FC, PropsWithChildren } from 'react';

export type FFC<T = {}> = FC<PropsWithChildren<T>>;
export type KeyOf<T extends Record<PropertyKey, any>> = keyof T;
export type ValueOf<T extends Record<PropertyKey, any>> = T[keyof T];
