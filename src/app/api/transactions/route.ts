import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, total, staffName } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Use a transaction to ensure all or nothing
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Create the transaction
      const newTx = await tx.transaction.create({
        data: {
          total: Number(total),
          staffName: staffName || 'Staff',
          items: {
            create: items.map((item: { productId: number, quantity: number, price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      })

      // 2. Deduct stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        })
      }

      return newTx
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
