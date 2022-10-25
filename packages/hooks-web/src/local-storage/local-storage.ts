import _get from 'lodash/get';
import _set from 'lodash/get';
import _toPath from 'lodash/toPath';
import { useImmer } from 'use-immer';

import {
  createContext,
  DependencyList,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
  FC,
  createElement,
  ReactNode,
  useEffect,
} from 'react';

type State<S> = [S, Dispatch<SetStateAction<S>>];

import { useContextSelector } from 'use-context-selector';
import { createContainer } from 'react-tracked';

let pretty = true;
export const setPrettyLocalStorage = () => (pretty = true);

export function read(key: string) {
  let text = window.localStorage.get(key);
  if (text != null) {
    try {
      return JSON.parse(text);
    } catch (e) {}
  }
}
export function write<T>(key: string, value: T) {
  window.localStorage.set(
    key,
    pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value),
  );
}
