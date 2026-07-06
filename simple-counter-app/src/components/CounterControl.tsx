type Props = {
    onIncrement: () => void;
    onDecrement: () => void;
    onReset: () => void;
};

export default function CounterControls({ onIncrement, onDecrement, onReset }: Props) {
    return (
        <div className="flex justify-center gap-4">
            <button onClick={onIncrement} className="px-5 py-2 text-white rounded-lg bg-green-500 hover:bg-green-600 transition">
                Increase
            </button>
            <button onClick={onDecrement} className="px-5 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition">
                Decrease
            </button>
             <button onClick={onReset} className="px-5 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition">
                Reset
            </button>
        </div>
    )
}