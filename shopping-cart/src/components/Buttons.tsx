import ProductItem from "./ProductItem";

interface ButtonProps {
    label?: string;
    variants?: "product" | "like";
}

const Button = ({label, variants}: ButtonProps) => {
    return (
        <div>
            <button className={
                variants === "product" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white mt-2 px-4 py-1 rounded transition"
                    : "transition-all duration-100 ease-in-out hover:scale-125 active:scale-125"
            }>
                {
                variants === "product" 
                    ? "Add To Cart"
                    : "🤍"
            }
            </button>
        </div>
    )
}

export default Button

// onClick={variants === "product" ? () => onAddToCart(product)} 