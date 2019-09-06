---
layout: post
title: React Hooks
date: 2019-09-03 00:05 +0800
tags: 
  - react
  - javascript
categories: 
  - 前端开发
---

现代的前端开发框架和库都提倡基于组件式的开发模式，React 在发布的时候就称作是 Component-Based UI library，也是早期把组件式开发模式引入到前端开发的 UI 库之一。组件式开发的好处显而易见，组件拥有自己独立的状态(state)和逻辑，在构建工具的辅助下组件甚至拥有自己的 Markup(JSX 或 template) 和 样式。这种高度封装的方式使得组件之间相互独立，而且第三方和自定义的组件开发也更为独立和简单。

## 组件的弊端

高度封装的方式使组件保持相互独立，同时 props 的传递保持组件之间的通信，但是我们要如何复用组件间的通用逻辑？

通过拆分更小颗粒的组件，我们可以用组件组合解决大部分通用逻辑复用的问题，React 也是[提倡通过组件组合](https://reactjs.org/docs/composition-vs-inheritance.html)的方式来解决部分复用的问题。但是组件组合也只能解决部分逻辑复用的问题，组件高度封装的方式使得组件的状态逻辑复用变得异常困难，为了解决这个问题 React 先后引入了 minxin, [higher-order component](https://reactjs.org/docs/higher-order-components.html) 和 [render props](https://reactjs.org/docs/render-props.html) 的概念试图解决这个问题。

minxin 是第一个被官方遗弃的方案，原因可以查看官方的说明 [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)。而 higher-order component 和 render props 使应用特别使大型应用引入另外一个问题：wrapper hell

{% cloudinary /assets/images/posts/wrapper-hell.jpeg alt="React wrapper-hell" %}

这种类似于 callback hell 的方式不利于后期的维护和扩展，当然在开发的时候也不容易理解😂

使用 Hooks，可以从组件中提取有状态逻辑，以便可以独立测试并重复使用。Hooks 可以在不更改组件层次结构的情况下重用有状态逻辑。这样可以轻松地在许多组件之间或与社区共享Hook。

## 基础 Hooks

### useState

```javascript
const [state, setState] = useState(initialState);
```

`useState` 返回一个状态值(state)，和一个更新状态值的函数，同时接受一个参数作为状态初始值。

如果新的状态值需要基于之前的状态值计算，那么可以向 `setState` 传入一个函数，该函数将接收先前的值，并返回更新的值。

```jsx
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <React.Fragment>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </React.Fragment>
  );
}
```

### useEffect

```javascript
useEffect(didUpdate);
```

`useEffect` 接受一个包含副作用的函数作为参数。纯函数组件(function component)中不允许包含具有副作用的代码，否则会导致UI中的错误和不一致性。

传递给 `useEffect` 的函数将在渲染完成后运行，默认情况下副作用代码会在每次渲染完成后运行。但并不是所有副作用代码需要多次运行，我们可以通过给 `useEffect` 传递第二个参数，一个依赖数组。只有数组中的值更改时，副作用代码才会再次运行：

```javascript
useEffect(
  () => {
    const subscription = props.source.subscribe();
  },
  [props.source],
);
```

如果副作用的代码只需要运行一次，类似于 `componentDidMount`, 那么只需要向 `useEffect` 的第二个参数传递一个空数组 `[]` 

#### 清除副作用

许多副作用创建的资源需要在组件销毁时清除掉，例如订阅或计时器。传递给useEffect的函数返回一个清理函数即可：

```javascript
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

#### 副作用运行时机

不像 `componentDidMount` 和 `componentDidUpdate`，传递给 `useEffect` 的函数在布局(layout)和绘制(paint)之后才会运行，这样不会阻塞浏览器的屏幕更新。但是有的副作用，例如可视化的 DOM 更新，需要在下次绘制之前同步运行，这时候需要用到另外一个 Hooks [useLayoutEffect](#uselayouteffect)

### useContext

```javascript
const value = useContext(MyContext);
```

`useContext` 接受一个 context 对象(`React.createContext` 方法的返回值)作为参数。同时返回值是 `MyContext` 的当前上下文(context)的值。`useContext(MyContext)` 类似于 `<MyContext.Consumer>` 的语法糖。

## 更多 Hooks

### useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

类似于 [Redux](https://redux.js.org/), `useReducer` 接受一个 reducer 类型 `(state, action) => newState` 作为参数，返回当前的状态值和 `dispatch` 方法。

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

### useCallback

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

`useCallback` 返回一个缓存化([memoized](https://en.wikipedia.org/wiki/Memoization)) 的回调函数，将缓存化的回调函数传递给优化过的子组件能避免不必要的重新渲染。

### useMemo

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo` 返回一个缓存化([memoized](https://en.wikipedia.org/wiki/Memoization)) 的值。只有第二个参数的依赖数组更改时才会重新计算缓存化的值，此优化有助于避免在每次渲染时进行昂贵的计算。

如果未提供依赖数组，那么每次渲染时都会重新计算，如果为空数组，缓存的值只会计算一次。

### useRef

```javascript
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可更改的引用对象，对象的 `current` 属性初始化为传递的参数 (`initialValue`)。返回的对象将持续整个组件的生命周期。

常见的使用情景是配合 `ref` 访问 DOM 元素或子组件：

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

`useRef` 不仅仅只是配合 `ref` 使用，`useRef()` 创建了一个普通的 javascript 对象，但 `useRef()`和创建一个 `{current: ...}` 对象的不同点是 `useRef` 在每次渲染都会返回相同的引用对象。


### useImperativeHandle

```javascript
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 定义在使用 `ref` 时暴露给父组件的实例值。`useImperativeHandle` 应该配合 `forwardRef` 一起使用：

```jsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} />;
}
FancyInput = forwardRef(FancyInput);
```

上面的示例中，父组件可以通过 `<FancyInput ref={fancyInputRef} />` 调用子组件，同时能通过 `fancyInputRef.current.focus()` 来调用子组件暴露的方法。

### useLayoutEffect

和 `useEffect` 类似，但会在所有 DOM 更改完成后同步执行。如果需要避免阻塞视觉更新，请使用 `useEffect`。

### useDebugValue

`useDebugValue` 被用来在 React DevTools 中显示自定义 Hooks 的一个标签。

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

## 自定义 Hooks

自定义 Hooks 能让你提取组件逻辑到可复用的函数。

### 定义自定义 Hooks

当我们想在两个 Javascript 函数中共用逻辑代码时，我们通常把共用的逻辑代码写到第三个函数中，Hooks 和组件也同样是函数，所以也可以用这种方式共用逻辑代码。

**自定义 Hooks 是一个名字已 "use" 开头的 Javascript 函数，并且能调用其他的 Hooks.** 例如下面的 `useFriendStatus` 是我们的自定义 Hooks:

```javascript
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

不像 React 组件必须返回 JSX 或者在 class 的 render 方法必须返回 JSX, 自定义 Hooks 可以接受任何参数，返回任何值。

### 使用自定义 Hooks

我们刚刚已经把判断 `isOnline` 的共用逻辑放到了 `useFriendStatus` 中，这时候我们可以直接使用：

```jsx
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

自定义 Hooks 是遵循Hooks设计的一种约定，而不是React功能。


## 参考链接

- [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html)




