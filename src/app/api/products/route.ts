import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const sortBy = searchParams.get("sortBy") || "newest"
    const minPrice = searchParams.get("minPrice") || ""
    const maxPrice = searchParams.get("maxPrice") || ""
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (category && category !== "all") {
      where.categoryId = category
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    
    // Build orderBy clause
    const orderBy: any = {}
    switch (sortBy) {
      case "price-low":
        orderBy.price = "asc"
        break
      case "price-high":
        orderBy.price = "desc"
        break
      case "rating":
        orderBy.rating = "desc"
        break
      case "reviews":
        orderBy.reviews = "desc"
        break
      case "newest":
      default:
        orderBy.createdAt = "desc"
        break
    }
    
    // Fetch products with category
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })
    
    // Get total count for pagination
    const total = await prisma.product.count({ where })
    
    // If no products in database, return mock data
    if (products.length === 0) {
      const mockProducts = [
        {
          id: "1",
          name: "Classic Cotton T-Shirt",
          description: "Comfortable and breathable cotton t-shirt",
          price: 29.99,
          comparePrice: 39.99,
          images: ["/images/p11-1.jpg", "/images/p11-2.jpg"],
          rating: 4.5,
          reviews: 24,
          category: "T-Shirts",
          stock: 50,
          isActive: true,
          isFeatured: true,
          slug: "classic-cotton-tshirt",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          name: "Slim Fit Blue Jeans",
          description: "Modern slim fit jeans in classic blue",
          price: 79.99,
          comparePrice: 99.99,
          images: ["/images/p21-1.jpg", "/images/p21-2.jpg"],
          rating: 4.8,
          reviews: 18,
          category: "Jeans",
          stock: 30,
          isActive: true,
          isFeatured: true,
          slug: "slim-fit-blue-jeans",
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          name: "Casual Sneakers",
          description: "Comfortable casual sneakers for everyday wear",
          price: 89.99,
          comparePrice: 119.99,
          images: ["/images/p31-1.jpg", "/images/p31-2.jpg"],
          rating: 4.6,
          reviews: 32,
          category: "Shoes",
          stock: 25,
          isActive: true,
          isFeatured: true,
          slug: "casual-sneakers",
          createdAt: new Date().toISOString()
        },
        {
          id: "4",
          name: "Vintage Graphic T-Shirt",
          description: "Retro style graphic t-shirt with unique design",
          price: 34.99,
          comparePrice: 44.99,
          images: ["/images/p12-1.jpg"],
          rating: 4.3,
          reviews: 15,
          category: "T-Shirts",
          stock: 40,
          isActive: true,
          isFeatured: false,
          slug: "vintage-graphic-tshirt",
          createdAt: new Date().toISOString()
        },
        {
          id: "5",
          name: "Relaxed Fit Black Jeans",
          description: "Comfortable relaxed fit jeans in black",
          price: 69.99,
          comparePrice: 89.99,
          images: ["/images/p22-1.jpg", "/images/p22-2.jpg"],
          rating: 4.4,
          reviews: 22,
          category: "Jeans",
          stock: 35,
          isActive: true,
          isFeatured: false,
          slug: "relaxed-fit-black-jeans",
          createdAt: new Date().toISOString()
        },
        {
          id: "6",
          name: "Formal Oxford Shoes",
          description: "Elegant formal oxford shoes for special occasions",
          price: 149.99,
          comparePrice: 199.99,
          images: ["/images/p32-1.jpg", "/images/p32-2.jpg"],
          rating: 4.7,
          reviews: 28,
          category: "Shoes",
          stock: 20,
          isActive: true,
          isFeatured: true,
          slug: "formal-oxford-shoes",
          createdAt: new Date().toISOString()
        }
      ]
      
      return NextResponse.json({
        products: mockProducts,
        pagination: {
          page,
          limit,
          total: mockProducts.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      })
    }
    
    // Calculate average rating for each product
    const productsWithRating = products.map((product: any) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        rating: avgRating,
        reviews: product.reviews.length,
        category: product.category.name,
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        slug: product.slug,
        createdAt: product.createdAt
      }
    })
    
    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
    
  } catch (error) {
    console.error("Error fetching products:", error)
    
    // Return mock data on error
    const mockProducts = [
      {
        id: "1",
        name: "Classic Cotton T-Shirt",
        description: "Comfortable and breathable cotton t-shirt",
        price: 29.99,
        comparePrice: 39.99,
        images: ["/images/p11-1.jpg", "/images/p11-2.jpg"],
        rating: 4.5,
        reviews: 24,
        category: "T-Shirts",
        stock: 50,
        isActive: true,
        isFeatured: true,
        slug: "classic-cotton-tshirt",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Slim Fit Blue Jeans",
        description: "Modern slim fit jeans in classic blue",
        price: 79.99,
        comparePrice: 99.99,
        images: ["/images/p21-1.jpg", "/images/p21-2.jpg"],
        rating: 4.8,
        reviews: 18,
        category: "Jeans",
        stock: 30,
        isActive: true,
        isFeatured: true,
        slug: "slim-fit-blue-jeans",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Casual Sneakers",
        description: "Comfortable casual sneakers for everyday wear",
        price: 89.99,
        comparePrice: 119.99,
        images: ["/images/p31-1.jpg", "/images/p31-2.jpg"],
        rating: 4.6,
        reviews: 32,
        category: "Shoes",
        stock: 25,
        isActive: true,
        isFeatured: true,
        slug: "casual-sneakers",
        createdAt: new Date().toISOString()
      }
    ]
    
    return NextResponse.json({
      products: mockProducts,
      pagination: {
        page: 1,
        limit: 12,
        total: mockProducts.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    })
  }
} 