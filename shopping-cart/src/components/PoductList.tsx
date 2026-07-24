import { Product } from "./CartApp";
import ProductItem from "./ProductItem";

type Props = {
    products: Product[];
    onAddToCart: (product: Product) => void;
    likedIds: number[];
    onToggleLike: (id: number) => void;
}

export default function ProductList({ products, onAddToCart, likedIds, onToggleLike }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {products.map((product) => (
                <ProductItem key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                isLiked={likedIds.includes(product.id)}
                onToggleLike={onToggleLike}
                
                />
            ))}
        </div>
    );
}