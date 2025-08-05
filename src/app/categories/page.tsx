"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CategoriesPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-lg text-gray-600">Browse our products by category</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Shop by Category?</h2>
            <p className="text-gray-600">Find exactly what you&apos;re looking for with our organized product categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Navigation</h3>
              <p className="text-gray-600">Quickly find products that match your style and needs</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Curated Selection</h3>
              <p className="text-gray-600">Carefully selected products in each category</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Better Shopping</h3>
              <p className="text-gray-600">Streamlined shopping experience with organized categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 