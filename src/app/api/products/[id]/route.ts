import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id)
    const body = await request.json()
    const { name, price, quantity, categoryId } = body

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: price !== undefined ? Number(price) : undefined,
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      },
      include: {
        category: true,
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id)
    await prisma.product.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
