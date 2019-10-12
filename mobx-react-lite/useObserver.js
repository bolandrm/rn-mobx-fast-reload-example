import {Reaction} from 'mobx';
import {useEffect, useRef} from 'react';

export function useObserver(fn) {
  const reaction = useRef(null);
  if (!reaction.current) {
    reaction.current = new Reaction('observer(observed)');
  }
  const dispose = () => {
    if (reaction.current && !reaction.current.isDisposed) {
      reaction.current.dispose();
    }
  };
  useUnmount(() => {
    dispose();
  });
  // render the original component, but have the
  // reaction track the observables, so that rendering
  // can be invalidated (see above) once a dependency changes
  let rendering;
  reaction.current.track(() => {
    rendering = fn();
  });

  return rendering;
}

export function useUnmount(fn) {
  useEffect(() => fn, []);
}
