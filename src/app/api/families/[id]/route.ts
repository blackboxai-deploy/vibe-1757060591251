import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch single family
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const family = await prisma.family.findUnique({
      where: { id: id },
      include: {
        members: true
      }
    });

    if (!family) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(family);
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family' },
      { status: 500 }
    );
  }
}

// DELETE - Remove family and all members
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Delete family (members will be deleted automatically due to cascade)
    const deletedFamily = await prisma.family.delete({
      where: { id: id }
    });

    return NextResponse.json({ 
      message: 'Family deleted successfully',
      familyId: deletedFamily.familyId 
    });
  } catch (error) {
    console.error('Error deleting family:', error);
    
    // Handle case where family doesn't exist
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete family' },
      { status: 500 }
    );
  }
}