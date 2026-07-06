type Props = {
    count: number;
}

export default function CounterDislay({ count }: Props) {
    return (
        <div className="mb-6">
            <span className="text-5xl font-mono font-bold text-blue-600">
                {count}
            </span>
            <p className="text-sm text-gray-500 mt-1">
                Current Count
            </p>
        </div>
    );
}