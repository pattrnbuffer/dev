import { assignRef } from '@chakra-ui/react';
import { ThreeElements } from '@react-three/fiber';
import {
  createContext,
  forwardRef,
  MutableRefObject,
  useContext,
  useMemo,
  useRef,
} from 'react';
import type * as Three from 'three';
import { CallPipe } from './call-pipe';
import { useDefaultObservers, DefaultObserversState } from './handlers';
import { useHistorian, History } from './use-historian';

export type GroupProps = ThreeElements['group'] & {
  // TODO: extensible observers
};

export type GroupRef = MutableRefObject<Three.Group>;

const GroupContext = createContext<undefined | GroupRef>(undefined);

const GroupObserverContext = createContext<{
  state: DefaultObserversState;
  history: History<DefaultObserversState>;
}>(undefined!);

export const Group = forwardRef<Three.Group, GroupProps>((props, ref) => {
  const group = useRef<Three.Group>(undefined!);

  const { state, handlers } = useDefaultObservers();
  const history = useHistorian(state);
  const observer = useMemo(() => ({ state, history }), [state, history]);

  return (
    <GroupContext.Provider value={group}>
      <GroupObserverContext.Provider value={observer}>
        <group
          ref={instance => {
            group.current = instance!;
            assignRef(ref, instance);
          }}
          {...props}
          {...CallPipe.assign(props, handlers)}
        />
      </GroupObserverContext.Provider>
    </GroupContext.Provider>
  );
});

export const useGroup = () => {
  const context = useContext(GroupContext);

  if (context == null) {
    throw new Error('Outside <Group /> element context');
  }

  return context;
};

export const useGroupObserver = () => {
  const context = useContext(GroupObserverContext);

  if (context == null) {
    throw new Error('Outside <Group /> element context');
  }

  return context;
};
