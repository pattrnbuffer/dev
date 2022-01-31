import { createContext, useContext, useReducer, Dispatch, DispatchWithoutAction, Reducer, ReducerWithoutAction, ReducerState, ReducerAction } from "react";


export type LayerContextValue = {
  dispatch: DispatchWithoutAction
}


const LayerContext = createContext<LayerContextValue>({
  dispatch() {
    throw new Error("No layer context found, please add a LayerContext.Provider")
  }
})


export function useLayerReducer(reducer: Reducer) {
  const context = useContext(LayerContext)
}

// useLayerReducer((state, action, context) => {

// })
