const createStore = <S, A>(
  reducer: (state: S, action: A) => S,
  preloadedState: S
) => {
  let currentReducer = reducer;
  let currentState = preloadedState as S;
  let currentListeners: (() => void)[] | null;

  const getState = (): S => {
    return currentState as S;
  };

  const subscribe = (listener: () => void) => {
    currentListeners.push(listener);
    return () => {
      currentListeners = currentListeners.filter((l) => l !== listener);
    };
  };

  const dispatch = (action: A) => {
    currentReducer(currentState, action);
    currentListeners.forEach((listener) => listener());
  };

  return { getState, subscribe, dispatch };
};

export default createStore;
