import { useState } from "react";

export const load = (key, fallback) => {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

export const save = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {

    }
};

export default function usePersist(key, initialValue) {

    const [value, setValue] = useState(() => load(key, initialValue));

    const set = (updater) => {
        const next = typeof updater === "function" ? updater(value) : updater;
        save(key, next);
        setValue(next);
    };

    return [value, set];
}