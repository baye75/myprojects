'use client';
import { useState } from "react";
import Cartsummary from "./CartSummary";
import ProductList from "./PoductList";
import CartIcon from './CartIcon'

export type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
} 

export type CartEntry = {
    id: number;
    quantity: number;
}

const products: Product[] = [
    { id: 1, name: 'Apple Silicon Macbook Pro', price: 2000, image: '/images/macbookpro.jpeg' },
    { id: 2, name: 'Apple Monitor', price: 1000, image: '/images/applemonitor.webp' },
    { id: 3, name: 'Laptop Table and Chair', price: 500, image: '/images/laptopTable.jpeg' },
    { id: 4, name: 'BlueLight Blocking Glasses', price: 50, image: '/images/antiBlueLightGlasses.webp' }
]

const productsByID: Record<number, Product> = {};
products.forEach((p) => (productsByID[p.id] = p));

export default function CartApp() {
    
    const [cart, setCart] = useState<CartEntry[]>([]);
    const [showCart, setShowCart] = useState(true);
    const [likedIds, setLikedIds] = useState<number[]>([]);

    const toggleLike = (productId: number) => {
        setLikedIds((prev) => 
            prev.includes(productId) ? 
            prev.filter((id) => id !== productId) :
            [...prev, productId]
);
    }
    

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingEntry = prevCart.find((entry) => entry.id === product.id);

            if (existingEntry) {
                return prevCart.map((entry) => entry.id === product.id ? {...entry, quantity: entry.quantity = 1} : entry);
            } else {
                return [...prevCart, { id: product.id, quantity: 1 }];
            }
        });
    };

    const increaseQuantity = (productId: number) => {
        setCart((prevCart) => 
            prevCart.map((entry) => 
                entry.id === productId ? {...entry, quantity: entry.quantity + 1} : entry
            )
        );
    };

    const decreaseQuantity = (productId: number) => {
        setCart((prevCart) => {
            const entry = prevCart.find((e) => e.id === productId);
            if (!entry) return prevCart;

            if (entry.quantity === 1) {
                return prevCart.filter((e) => e.id !== productId)
            }
            return prevCart.map((e) => 
                e.id === productId ? {...e, quantity: e.quantity - 1} : e
            );
        })
    };

    const totalItems = cart.reduce((sum, entry) => sum + entry
.quantity, 0);
    const totalPrice = cart.reduce((sum, entry) => sum + entry.quantity * (productsByID[entry.id]?.price ?? 0), 0);

    const toggleCart = () => {
        setShowCart((prev) => (!prev))
    }

    return (
        <div>
            <ProductList 
                products={products} 
                onAddToCart={addToCart} 
                likedIds={likedIds}
                onToggleLike={toggleLike}
                />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                    {showCart ? 'Press Cart Icon to hide Cart' : 'Press Cart Icon to show Cart'}
                </h2>
                <button
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition"
                aria-label={showCart ? 'Hide cart' : 'Show cart'}
                >
                <CartIcon />
                {totalItems > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w05 flex items-center justify-center p-2">
                        {totalItems}
                    </span>
                )}
                </button>
            </div>
            
            
            {showCart && (
                <Cartsummary
                cart={cart}
                productsById={productsByID}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                totalItems={totalItems} 
                totalPrice={totalPrice}
             />
            )}
            
        </div>
    );
}