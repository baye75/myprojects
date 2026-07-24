import { Product, CartEntry } from './CartApp';

type Props = {
    cart: CartEntry[];
    productsById: Record<number, Product>;
    onIncrease: (productId: number) => void;
    onDecrease: (productId: number) => void;
    totalItems: number;
    totalPrice: number;
}

export default function Cartsummary({ 
    cart,
    productsById,
    onIncrease,
    onDecrease,
    totalItems, 
    totalPrice }: Props) {
    if (cart.length === 0) {
        return (
            <div className='bg-white rounded-lg shadow p-6 mt-4'>
                <h2 className='text-xl font-bold mb-2'>
                    Your Cart
                </h2>
                <p className='text-gray-500'>
                    Cart is Empty.
                </p>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h2 className="text-xl font-bold mb-2">
                Your Cart
            </h2>
            <ul>
                {cart.map((entry) => {
                    const product = productsById[entry.id];
                    if (!product) return null;

                    return (
                        <li key={entry.id}
                        className='flex justify-between items-center border-b pb-2'>
                            <div>
                                <p className='font-semibold'>
                                    {product.name}
                                </p>
                                <p className='text-xs text-gray-500'>
                                    ID: {product.id}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    ${product.price.toFixed(2)} each
                                </p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => onDecrease(entry.id)}
                                    className='px-2 py-1 text-white text-sm rounded bg-red-500 hover:bg-red-600 transition'>
                                        -
                                </button>
                                <span className='w-6 text-center font-medium text-gray-700'>
                                    {entry.quantity}
                                </span>
                                <button
                                    onClick={() => onIncrease(entry.id)}
                                    className='px-2 py-1 text-white text-sm rounded bg-green-500 hover:bg-green-600 transition'>
                                        +
                                </button>
                                <span className='w-6 text-center font-medium text-gray-700'>
                                    {entry.quantity}
                                </span>
                            </div>
                        </li>
                    );
                }
                )}
            </ul>
            <div className='border-t pt-3'>
                <p className="text-gray-700">
                Total Items: {totalItems}
            </p>
                <p className="text-gray-700 font-bold">
                    Total Price: ${totalPrice.toFixed(2)}
                </p>
            </div>
        </div>
    );
}