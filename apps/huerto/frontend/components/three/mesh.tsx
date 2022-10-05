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

export type MeshProps = ThreeElements['mesh'] & {
  // TODO: extensible observers
};

export type MeshRef = MutableRefObject<Three.Mesh>;

const MeshContext = createContext<undefined | MeshRef>(undefined);

const MeshObserverContext = createContext<{
  state: DefaultObserversState;
  history: History<DefaultObserversState>;
}>(undefined!);

export const Mesh = forwardRef<Three.Mesh, MeshProps>((props, ref) => {
  const mesh = useRef<Three.Mesh>(undefined!);

  const { state, handlers } = useDefaultObservers();
  const history = useHistorian(state);
  const observer = useMemo(() => ({ state, history }), [state, history]);

  return (
    <MeshContext.Provider value={mesh}>
      <MeshObserverContext.Provider value={observer}>
        <mesh
          ref={instance => {
            mesh.current = instance!;
            assignRef(ref, instance);
          }}
          {...CallPipe.assign(props, handlers)}
        />
      </MeshObserverContext.Provider>
    </MeshContext.Provider>
  );
});

export const useMesh = () => {
  const context = useContext(MeshContext);

  if (context == null) {
    throw new Error('Outside <Mesh /> element context');
  }

  return context;
};

export const useMeshObserver = () => {
  const context = useContext(MeshObserverContext);

  if (context == null) {
    throw new Error('Outside <Mesh /> element context');
  }

  return context;
};
