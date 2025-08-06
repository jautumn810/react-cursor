import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { z } from "zod"

const createOrderSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1)
  }),
  paymentIntentId: z.string().min(1),
  shippingMethod: z.string().min(1),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  }))
})

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
    const { shippingAddress, paymentIntentId, items } = createOrderSchema.parse(body)
    
    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      )
    }
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingCost = subtotal >= 50 ? 0 : 5.99
    const taxAmount = subtotal * 0.08
    const total = subtotal + shippingCost + taxAmount
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`
    
    // Create order with transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user!.id as string,
          orderNumber,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          subtotal,
          shipping: shippingCost,
          tax: taxAmount,
          total,
          shippingAddress: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country
          },
          paymentMethod: "CREDIT_CARD",
          stripePaymentIntentId: paymentIntentId
        }
      })
      
      // Create order items
      const orderItems = await Promise.all(
        items.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            }
          })
        )
      )
      
      // Update product stock
      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
        )
      )
      
      // Clear user's cart
      const userCart = await tx.cart.findFirst({
        where: { userId: session.user!.id as string }
      })
      
      if (userCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: userCart.id }
        })
      }
      
      return { order: newOrder, orderItems }
    })
    
    return NextResponse.json({
      success: true,
      order: order.order,
      message: "Order created successfully"
    })
    
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit
    
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    })
    
    const total = await prisma.order.count({
      where: {
        userId: session.user.id
      }
    })
    
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map((item: any) => ({
        id: item.id,
        productName: item.product.name,
        productImage: item.product.images[0] || "",
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    }))
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
} 
