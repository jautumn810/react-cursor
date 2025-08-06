import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Try to fetch from database first
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })
    
    if (categories.length > 0) {
      const categoriesWithCount = categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: category._count.products
      }))
      
      return NextResponse.json(categoriesWithCount)
    }
    
    // Fallback to mock data if database is empty
    const mockCategories = [
      {
        id: "1",
        name: "T-Shirts",
        slug: "t-shirts",
        description: "Comfortable and stylish t-shirts",
        image: "/images/c-tshirts.jpg",
        productCount: 12
      },
      {
        id: "2", 
        name: "Jeans",
        slug: "jeans",
        description: "Classic and modern jeans",
        image: "/images/c-jeans.jpg",
        productCount: 8
      },
      {
        id: "3",
        name: "Shoes", 
        slug: "shoes",
        description: "Trendy footwear for every occasion",
        image: "/images/c-shoes.jpg",
        productCount: 15
      }
    ]
    
    return NextResponse.json(mockCategories)
    
  } catch (error) {
    console.error("Error fetching categories:", error)
    
    // Return mock data on error
    const mockCategories = [
      {
        id: "1",
        name: "T-Shirts",
        slug: "t-shirts", 
        description: "Comfortable and stylish t-shirts",
        image: "/images/c-tshirts.jpg",
        productCount: 12
      },
      {
        id: "2",
        name: "Jeans", 
        slug: "jeans",
        description: "Classic and modern jeans",
        image: "/images/c-jeans.jpg",
        productCount: 8
      },
      {
        id: "3",
        name: "Shoes",
        slug: "shoes",
        description: "Trendy footwear for every occasion", 
        image: "/images/c-shoes.jpg",
        productCount: 15
      }
    ]
    
    return NextResponse.json(mockCategories)
  }
} 