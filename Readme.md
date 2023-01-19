# createStore 최소구현체 작성해보기

[Redux의 컨셉학습](#redux)  
[createStore 최소 구현체 구현](#createstore-최소구현체)  
[깨달은 점](#깨달은-점)

# Redux

전역 상태 관리에 사용되는 Redux는 복잡해지는 데이터를 통제하기 위해 고안된 `Flux 패턴` 기반 구현체이자 `자바스크립트 앱을 위한 예측 가능한 상테 컨테이너`입니다.  
Redux는 React 이외에도 여러가지 뷰 라이브러리와 함께 사용할 수 있고 Redux Toolkit을 통해 더 쉽게 Redux를 사용할 수 있습니다.

## Flux

Flux 패턴은 대규모 애플리케이션에서 데이터 흐름을 일관성 있게 관리 함으로써 프록램의 예측가능성을 높이기 위한 `단방향 데이터 흐름`을 가진 패턴 입니다.  
![img](http://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-with-client-action-1300w.png)  
위 사진처럼 사용자의 입력을 기반으로 Action을 만들고 Action을 Dispatcher에 전달하여 Store의 데이터를 변경한 뒤 View에 반영하는 단방향구조 입니다.

## Redux의 3가지 원칙

- ### 진실은 하나의 근원으로 부터
  애플리케이션의 모든 상태는 하나의 저장소 안에 하나의 객체 트리구조로 저장됩니다

* ### 상태는 읽기 전용이다
  상태를 변화시키는 유일한 방법은 무슨 일이 벌어지는지를 묘사하는 액션 객체를 전달하는 방법뿐입니다
* ### 변화는 순수 함수로 작성되어야 한다
  액션에 의해 상태 트리가 어떻게 변화하는 지를 지정하기 위해 프로그래머는 순수 리듀서를 작성해야 합니다

# createStore 최소구현체

## createStore 사용법

creatStore는 앱의 상태 트리 전체를 보관하는 Redux 저장소를 만드는 것 입니다

```js
import { createStore } from "redux";

function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.text]);
    default:
      return state;
  }
}

const store = createStore(todos, ["Use Redux"]);

store.dispatch({
  type: "ADD_TODO",
  text: "Read the docs",
});

console.log(store.getState());
```

먼저 createStore에 인자로 todos라는 reducer과 초기값인 ['UseRedux']를 주면 store를 반환해 줍니다. 이렇게 반환받은 store에서는 `getState()`,`dispatch()`,`subscribe()` 메서드를 사용할 수 있습니다.

## createStore 최소구현체 구현

Redux createStore를 참고하여 만들었습니다
https://github.com/reduxjs/redux/blob/master/src/createStore.ts

- ### craeteStore
  createStore는 reducer,preloadedState인자로 받습니다.
  reducer는 함수를 파라미터로 받으니 함수타입으로 지정해주고 reducer를 보면 받은 state에서 action을 취한 후 state를 return해 주기 때문에 같은 타입을 반환해야 합니다. 이를 위해 제네릭을 이용해 타입을 지정해 줍니다.
  #### 구현
  ```js
  const createStore = <S, A>(
    reducer: (state: S, action: A) => S,
    preloadedState: S
  ) => {};
  ```
- ### getState
  getState는 현재 staet를 return해주는 함수입니다.
  #### 구현
  ```js
  const getState = () => {
    return currentState;
  };
  ```

* ### subscribe
  향후 dispatch에 반응할 listener를 등록 하고 listener를 등록 해제할 수 있도록 unsubscribe 함수를 리턴하는 함수 입니다
  #### 구현
  ```js
  const subscribe = (listener: () => void) => {
    currentListeners.push(listener);
    return () => {
      currentListeners = currentListeners.filter((l) => l !== listener);
    };
  };
  ```
* ### dispatch

  action을 인자로받아 상태를 변경시키는 함수 입니다. 원본 코드를 보면 reducer에 action과 state를 인자로 받아 실행시켜 state값을 변경시키고 listner를 호출 합니다.

  #### 구현

  ```js
  const dispatch = (action: A) => {
    currentReducer(action, currentState);
    currentListeners.forEach((listener) => listener());
  };
  ```

### [완성 코드](./createStore.ts)

# 깨달은 점

- Redux 라이브러리를 볼 때 처음 봤을 때는 너무 막막하다는 생각밖에 들지 않았는데 에러 처리, 주석 등을 제외하고 주요 기능에만 집중하면서 보니 생각보다 어렵지 않게 볼 수 있었던 것 같고 이를 통해 라이브러리 보는 법을 조금이나마 배운 것 같다.
- Redux 라이브러리 코드를 보면서 인자로 받는 값과 변수들이 있다. 이러한 내부 변수들을 클로저를 이용하여 외부에서도 접근할 수 있다는 것을 알게 되었다.
- Flux 패턴에 대해서 알게 되었고 Redux에 대해서도 조금의 개념 정도는 알게 된 것 같다

#### 참고

http://facebook.github.io/flux/docs/in-depth-overview/
https://ko.redux.js.org/understanding/thinking-in-redux/three-principles
