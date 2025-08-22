import { useRef, useTransition } from "react";

export function useDebounceTransition(ms: number = 200) {
    const [isPending, startTransition] = useTransition();

    const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const debounceTransition = (callback: () => void) => {
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => startTransition(callback), ms);
    };

    return [isPending, debounceTransition] as const;
}
