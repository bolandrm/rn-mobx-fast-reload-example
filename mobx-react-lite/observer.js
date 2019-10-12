import {memo} from 'react';
import {useObserver} from './useObserver';

export function observer(baseComponent) {
  const wrappedComponent = (props) => {
    return useObserver(() => baseComponent(props));
  };
  const memoComponent = memo(wrappedComponent);
  return memoComponent;
}
