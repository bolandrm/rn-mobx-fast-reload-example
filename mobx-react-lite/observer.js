import { forwardRef, memo } from "react";
import { useObserver } from "./useObserver";

export function observer(baseComponent, options) {
    // The working of observer is explained step by step in this talk: https://www.youtube.com/watch?v=cPF4iBedoF0&feature=youtu.be&t=1307

    const realOptions = Object.assign({ forwardRef: false }, options);
    const baseComponentName = baseComponent.displayName || baseComponent.name;
    const wrappedComponent = (props, ref) => {
        return useObserver(() => baseComponent(props, ref), baseComponentName);
    };
    wrappedComponent.displayName = baseComponentName;
    // memo; we are not intested in deep updates
    // in props; we assume that if deep objects are changed,
    // this is in observables, which would have been tracked anyway
    let memoComponent;
    if (realOptions.forwardRef) {
        // we have to use forwardRef here because:
        // 1. it cannot go before memo, only after it
        // 2. forwardRef converts the function into an actual component, so we can't let the baseComponent do it
        //    since it wouldn't be a callable function anymore
        memoComponent = memo(forwardRef(wrappedComponent));
    }
    else {
        memoComponent = memo(wrappedComponent);
    }
    copyStaticProperties(baseComponent, memoComponent);
    memoComponent.displayName = baseComponentName;
    return memoComponent;
}
// based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
const hoistBlackList = {
    $$typeof: true,
    render: true,
    compare: true,
    type: true
};
function copyStaticProperties(base, target) {
    Object.keys(base).forEach(key => {
        if (base.hasOwnProperty(key) && !hoistBlackList[key]) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
    });
}
