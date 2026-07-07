'use client';

import { useState } from "react";
import CounterDislay from "@/components/CounterDisplay";
import CounterControls from "@/components/CounterControl";

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount((prev) => 0);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-500">
      <main className="bg-white p-8 w-fit rounded-lg shadow-lg text-center">
        <h1 className="text-2xl mb-4 font-bold text-gray-500">
          State Lifting Demo With a Simple Counter App
        </h1>
        <CounterDislay count={count} />
        <CounterControls onIncrement={increment} onDecrement={decrement} onReset={reset} />
      </main>
    </div>
  );
}