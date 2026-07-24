import CartApp from "@/components/CartApp";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Shop
      </h1>
      <CartApp />
    </main>
  )
}