import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1)
})

const updateCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1)
})

const removeFromCartSchema = z.object({
  productId: z.string()
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      })
    }
    
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })
    
    const formattedItems = cartItems.map((item: any) => ({
      id: item.productId,
      name: item.product.name,
      price: item.product.price,
      comparePrice: item.product.comparePrice,
      image: item.product.images[0] || "", // Use first image from array
      quantity: item.quantity,
      stock: item.product.stock,
      category: item.product.category.name
    }))
    
    return NextResponse.json(formattedItems)
    
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { productId, quantity } = addToCartSchema.parse(body)
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      })
    }
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })
    
    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
      
      return NextResponse.json({
        message: "Cart item updated",
        item: updatedItem
      })
    } else {
      // Add new item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
      
      return NextResponse.json({
        message: "Item added to cart",
        item: newItem
      }, { status: 201 })
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { productId, quantity } = updateCartItemSchema.parse(body)
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      )
    }
    
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })
    
    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      )
    }
    
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity }
    })
    
    return NextResponse.json({
      message: "Cart item updated",
      item: updatedItem
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { productId } = removeFromCartSchema.parse(body)
    
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    })
    
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      )
    }
    
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })
    
    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      )
    }
    
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    })
    
    return NextResponse.json({
      message: "Item removed from cart"
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    )
  }
} 