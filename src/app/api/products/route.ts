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
    
    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
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
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
} 