import { getDependencyTree, Reaction } from "mobx";
import { useCallback, useEffect, useState, useDebugValue, useRef } from "react";

const EMPTY_OBJECT = {};

export function useObserver(fn, baseComponentName = "observed", options = EMPTY_OBJECT) {
    const forceUpdate = useForceUpdate();
    const reaction = useRef(null);
    if (!reaction.current) {
        reaction.current = new Reaction(`observer(${baseComponentName})`, () => {
            forceUpdate();
        });
    }
    const dispose = () => {
        if (reaction.current && !reaction.current.isDisposed) {
            reaction.current.dispose();
        }
    };
    useDebugValue(reaction, printDebugValue);
    useUnmount(() => {
        dispose();
    });
    // render the original component, but have the
    // reaction track the observables, so that rendering
    // can be invalidated (see above) once a dependency changes
    let rendering;
    let exception;
    reaction.current.track(() => {
        try {
            rendering = fn();
        }
        catch (e) {
            exception = e;
        }
    });
    if (exception) {
        dispose();
        throw exception; // re-throw any exceptions catched during rendering
    }
    return rendering;
}


const EMPTY_ARRAY = [];
export function useUnmount(fn) {
    useEffect(() => fn, EMPTY_ARRAY);
}
export function useForceUpdate() {
    const [, setTick] = useState(0);
    const update = useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

export function printDebugValue(v) {
    if (!v.current) {
        return "<unknown>";
    }
    return getDependencyTree(v.current);
}