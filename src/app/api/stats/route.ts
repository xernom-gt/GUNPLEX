import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalProducts,
      totalCategories,
      totalTransactions,
      transactions,
      totalUsers,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.transaction.count(),
      prisma.transaction.findMany({ select: { total: true } }),
      prisma.user.count(),
      prisma.product.findMany({
        where: { quantity: { lte: 5 } },
        include: { category: true },
        orderBy: { quantity: 'asc' }
      })
    ])

    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0)

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalTransactions,
      totalRevenue,
      totalUsers,
      lowStockProducts
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
