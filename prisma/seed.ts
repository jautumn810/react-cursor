import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.wishlistItem.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create users
  const adminPassword = await hash('admin123', 12)
  const userPassword = await hash('user123', 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  })

  console.log('👥 Created users')

  // Create categories
  const tshirtsCategory = await prisma.category.create({
    data: {
      name: 'T-Shirts',
      description: 'Comfortable and stylish t-shirts for everyday wear',
      slug: 't-shirts',
      image: '/images/c-tshirts.jpg',
    },
  })

  const jeansCategory = await prisma.category.create({
    data: {
      name: 'Jeans',
      description: 'Classic and modern jeans for all occasions',
      slug: 'jeans',
      image: '/images/c-jeans.jpg',
    },
  })

  const shoesCategory = await prisma.category.create({
    data: {
      name: 'Shoes',
      description: 'Trendy and comfortable footwear for every style',
      slug: 'shoes',
      image: '/images/c-shoes.jpg',
    },
  })

  console.log('📂 Created categories')

  // Create products for T-Shirts category
  const tshirt1 = await prisma.product.create({
    data: {
      name: 'Classic Cotton T-Shirt',
      description: 'Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear, this classic design features a crew neck and short sleeves. Made from 100% organic cotton for breathability and softness.',
      price: 29.99,
      comparePrice: 39.99,
      images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
      sku: 'TSH-001',
      stock: 50,
      isActive: true,
      isFeatured: true,
      slug: 'classic-cotton-t-shirt',
      categoryId: tshirtsCategory.id,
      weight: 0.2,
      dimensions: JSON.stringify({ length: 70, width: 50, height: 2 }),
    },
  })

  const tshirt2 = await prisma.product.create({
    data: {
      name: 'Vintage Graphic T-Shirt',
      description: 'Retro-inspired graphic t-shirt with a unique design. This comfortable cotton blend shirt features a vintage print and relaxed fit. Perfect for casual outings and street style.',
      price: 34.99,
      comparePrice: 44.99,
      images: ['/images/p12-1.jpg'],
      sku: 'TSH-002',
      stock: 30,
      isActive: true,
      isFeatured: false,
      slug: 'vintage-graphic-t-shirt',
      categoryId: tshirtsCategory.id,
      weight: 0.25,
      dimensions: JSON.stringify({ length: 72, width: 52, height: 2 }),
    },
  })

  // Create products for Jeans category
  const jeans1 = await prisma.product.create({
    data: {
      name: 'Slim Fit Blue Jeans',
      description: 'Modern slim fit jeans in classic blue denim. These jeans feature a comfortable stretch fabric and a contemporary slim silhouette. Perfect for both casual and smart-casual looks.',
      price: 79.99,
      comparePrice: 99.99,
      images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
      sku: 'JNS-001',
      stock: 25,
      isActive: true,
      isFeatured: true,
      slug: 'slim-fit-blue-jeans',
      categoryId: jeansCategory.id,
      weight: 0.4,
      dimensions: JSON.stringify({ length: 100, width: 40, height: 3 }),
    },
  })

  const jeans2 = await prisma.product.create({
    data: {
      name: 'Relaxed Fit Black Jeans',
      description: 'Comfortable relaxed fit jeans in black denim. These jeans offer a more relaxed silhouette while maintaining style. Perfect for those who prefer comfort without sacrificing fashion.',
      price: 69.99,
      comparePrice: 89.99,
      images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
      sku: 'JNS-002',
      stock: 20,
      isActive: true,
      isFeatured: false,
      slug: 'relaxed-fit-black-jeans',
      categoryId: jeansCategory.id,
      weight: 0.45,
      dimensions: JSON.stringify({ length: 102, width: 42, height: 3 }),
    },
  })

  // Create products for Shoes category
  const shoes1 = await prisma.product.create({
    data: {
      name: 'Casual Sneakers',
      description: 'Versatile casual sneakers perfect for everyday wear. These comfortable shoes feature a lightweight design with cushioned sole and breathable upper. Available in multiple colors.',
      price: 89.99,
      comparePrice: 119.99,
      images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
      sku: 'SHS-001',
      stock: 15,
      isActive: true,
      isFeatured: true,
      slug: 'casual-sneakers',
      categoryId: shoesCategory.id,
      weight: 0.3,
      dimensions: JSON.stringify({ length: 28, width: 10, height: 8 }),
    },
  })

  const shoes2 = await prisma.product.create({
    data: {
      name: 'Formal Oxford Shoes',
      description: 'Classic formal oxford shoes for professional and special occasions. These elegant shoes feature premium leather construction with a comfortable fit and timeless design.',
      price: 149.99,
      comparePrice: 199.99,
      images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
      sku: 'SHS-002',
      stock: 10,
      isActive: true,
      isFeatured: false,
      slug: 'formal-oxford-shoes',
      categoryId: shoesCategory.id,
      weight: 0.5,
      dimensions: JSON.stringify({ length: 30, width: 11, height: 9 }),
    },
  })

  console.log('👕 Created products')

  // Create some sample reviews
  await prisma.review.createMany({
    data: [
      {
        userId: user1.id,
        productId: tshirt1.id,
        rating: 5,
        title: 'Great quality t-shirt!',
        comment: 'This t-shirt is incredibly soft and comfortable. The fit is perfect and the material feels high quality. Highly recommend!',
        isVerified: true,
      },
      {
        userId: user2.id,
        productId: tshirt1.id,
        rating: 4,
        title: 'Good value for money',
        comment: 'Nice t-shirt, good quality cotton. The price is reasonable for the quality you get.',
        isVerified: true,
      },
      {
        userId: user1.id,
        productId: jeans1.id,
        rating: 5,
        title: 'Perfect fit!',
        comment: 'These jeans fit exactly as described. The stretch material is comfortable and the color is beautiful.',
        isVerified: true,
      },
      {
        userId: user2.id,
        productId: shoes1.id,
        rating: 4,
        title: 'Comfortable sneakers',
        comment: 'Very comfortable for daily wear. The cushioning is great and they look stylish too.',
        isVerified: true,
      },
    ],
  })

  console.log('⭐ Created reviews')

  // Create sample carts
  const user1Cart = await prisma.cart.create({
    data: {
      userId: user1.id,
    },
  })

  await prisma.cartItem.createMany({
    data: [
      {
        cartId: user1Cart.id,
        productId: tshirt1.id,
        quantity: 2,
      },
      {
        cartId: user1Cart.id,
        productId: jeans1.id,
        quantity: 1,
      },
    ],
  })

  console.log('🛒 Created sample cart')

  // Create sample wishlist items
  await prisma.wishlistItem.createMany({
    data: [
      {
        userId: user1.id,
        productId: shoes1.id,
      },
      {
        userId: user2.id,
        productId: tshirt2.id,
      },
      {
        userId: user2.id,
        productId: shoes2.id,
      },
    ],
  })

  console.log('❤️  Created wishlist items')

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: 3 (1 admin, 2 regular users)`)
  console.log(`- Categories: 3 (T-Shirts, Jeans, Shoes)`)
  console.log(`- Products: 6 (2 per category)`)
  console.log(`- Reviews: 4`)
  console.log(`- Cart items: 2`)
  console.log(`- Wishlist items: 3`)
  
  console.log('\n🔑 Admin credentials:')
  console.log('Email: admin@example.com')
  console.log('Password: admin123')
  
  console.log('\n👤 User credentials:')
  console.log('Email: john@example.com / jane@example.com')
  console.log('Password: user123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 