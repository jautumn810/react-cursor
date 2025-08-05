import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0
    
    // Format product data
    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images,
      sku: product.sku,
      barcode: product.barcode,
      weight: product.weight,
      dimensions: product.dimensions,
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      slug: product.slug,
      category: product.category.name,
      categoryId: product.categoryId,
      rating: avgRating,
      reviews: product.reviews.length,
      createdAt: product.createdAt
    }
    
    // Format reviews
    const reviews = product.reviews.map(review => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.isVerified,
      date: review.createdAt.toISOString().split('T')[0]
    }))
    
    return NextResponse.json({
      product: productData,
      reviews
    })
    
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
} 