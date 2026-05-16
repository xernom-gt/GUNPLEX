import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, price, quantity, categoryId } = body

    if (!name || price === undefined || quantity === undefined || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        quantity: Number(quantity),
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      }
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
