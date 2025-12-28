import { useMemo } from "react";

export function useGreeting(name: string = "Guest") {
  return useMemo(() => {
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    if (hour >= 17) greeting = "Good Evening";
    return `${greeting}, ${name}`;
  }, [name]);
}
