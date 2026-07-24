import { Product } from "./CartApp";
import Image from "next/image";
import Button from "./Buttons";

 type Props = {
    product: Product;
    onAddToCart: (product: Product) => void;
    isLiked: boolean;
    onToggleLike: (id: number) => void;
 };

 export default function ProductItem({ product, onAddToCart, isLiked, onToggleLike }: Props) {
    return (
        <div className="flex flex-col items-center bg-white shadow rounded-lg p-4 hover:scale-105 hover:border-1 hover:border-gray-400">
            <div className="h-32 w-full relative mb-2 rpunded overflow-hidden">
                <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    />
            </div>
            <h2 className="text-lg font-semibold">
                {product.name}
            </h2>
            <p className="text-sm text-gray-600">
                ${product.price.toFixed(2)}
            </p>
            <div className="flex gap-4 items-center">
                <button onClick={() => onAddToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-2 px-4 py-1 rounded transition">
                        Add To Cart
                </button>
                <button onClick={() => onToggleLike(product.id)}
                className={`transition-all duration-100 ease-in-out hover:scale-125 active:scale-125 {isLiked ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {isLiked ? '❤️' : '🤍'}
                </button>
                {/* <Button label="Add To Cart" variants="product" />
                <Button variants="like" /> */}
            </div>
        </div>
    );
 }