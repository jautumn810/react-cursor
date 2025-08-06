"use client"


import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ShoppingCart, Heart, Star, ArrowRight, ChevronRight, Truck, Shield, RefreshCw, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      title: "New Collection Arrived",
      subtitle: "Discover the latest trends in fashion",
      description: "Shop our newest arrivals with up to 50% off",
      image: "/images/banner1.jpg",
      buttonText: "Shop Now",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "Summer Sale",
      subtitle: "Limited time offer",
      description: "Get ready for summer with our exclusive collection",
      image: "/images/banner2.jpg",
      buttonText: "View Sale",
      buttonLink: "/products"
    },
    {
      id: 3,
      title: "Free Shipping",
      subtitle: "On orders over $50",
      description: "Fast and free shipping on all orders",
      image: "/images/banner3.jpg",
      buttonText: "Learn More",
      buttonLink: "/shipping"
    }
  ]

  // Featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Classic Cotton T-Shirt",
      price: 29.99,
      comparePrice: 39.99,
      image: "/images/p11-1.jpg",
      rating: 4.5,
      reviews: 24,
      category: "T-Shirts",
      isNew: true
    },
    {
      id: "2", 
      name: "Slim Fit Blue Jeans",
      price: 79.99,
      comparePrice: 99.99,
      image: "/images/p21-1.jpg",
      rating: 4.8,
      reviews: 18,
      category: "Jeans",
      isFeatured: true
    },
    {
      id: "3",
      name: "Casual Sneakers", 
      price: 89.99,
      comparePrice: 119.99,
      image: "/images/p31-1.jpg",
      rating: 4.6,
      reviews: 32,
      category: "Shoes",
      isSale: true
    },
    {
      id: "4",
      name: "Vintage Graphic T-Shirt",
      price: 34.99,
      comparePrice: 44.99,
      image: "/images/p12-1.jpg",
      rating: 4.3,
      reviews: 15,
      category: "T-Shirts"
    },
    {
      id: "5",
      name: "Relaxed Fit Black Jeans",
      price: 69.99,
      comparePrice: 89.99,
      image: "/images/p22-1.jpg",
      rating: 4.4,
      reviews: 22,
      category: "Jeans"
    },
    {
      id: "6",
      name: "Formal Oxford Shoes",
      price: 149.99,
      comparePrice: 199.99,
      image: "/images/p32-1.jpg",
      rating: 4.7,
      reviews: 28,
      category: "Shoes"
    }
  ]

  const categories = [
    {
      name: "T-Shirts",
      image: "/images/c-tshirts.jpg",
      productCount: 2,
      slug: "t-shirts",
      description: "Comfortable and stylish t-shirts for everyday wear"
    },
    {
      name: "Jeans", 
      image: "/images/c-jeans.jpg",
      productCount: 2,
      slug: "jeans",
      description: "Classic and modern jeans for all occasions"
    },
    {
      name: "Shoes",
      image: "/images/c-shoes.jpg", 
      productCount: 2,
      slug: "shoes",
      description: "Trendy and comfortable footwear for every style"
    }
  ]

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout"
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30 day return policy"
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "Multiple payment options"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Carousel */}
      <section className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[500px] md:h-[600px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-2xl mx-auto px-4">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl mb-2 text-blue-100">
                        {slide.subtitle}
                      </p>
                      <p className="text-lg mb-8 text-gray-200">
                        {slide.description}
                      </p>
                      <Link href={slide.buttonLink}>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you&apos;re looking for</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-64 overflow-hidden rounded-t-lg">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-900">
                        {category.productCount} products
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                      <span className="text-sm font-medium">Browse {category.name}</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Handpicked items just for you</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      NEW
                    </Badge>
                  )}
                  {product.isSale && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      SALE
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      FEATURED
                    </Badge>
                  )}
                  {product.comparePrice > product.price && !product.isSale && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">${product.price}</span>
                      {product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.comparePrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="h-8">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe to our newsletter for the latest products and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">Free</div>
              <div className="text-gray-600">Shipping Over $50</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
/ /   F o r c e   d e p l o y m e n t   u p d a t e  
 