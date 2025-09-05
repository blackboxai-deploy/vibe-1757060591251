import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { familyRegistrationSchema } from '@/lib/validations';

const prisma = new PrismaClient();

// Auto-increment family ID generator
const generateFamilyId = async (): Promise<string> => {
  const count = await prisma.family.count();
  return `FAM-${String(count + 1).padStart(4, '0')}`;
};

// GET - Fetch all families
export async function GET() {
  try {
    const families = await prisma.family.findMany({
      include: {
        members: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Failed to fetch families' },
      { status: 500 }
    );
  }
}

// POST - Create new family registration
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the data
    const validatedData = familyRegistrationSchema.parse({
      ...data,
      dateOfEvacuation: new Date(data.dateOfEvacuation),
    });

    // Generate family ID
    const familyId = await generateFamilyId();

    // Create family with members
    const family = await prisma.family.create({
      data: {
        familyId,
        barangay: validatedData.barangay,
        dateOfEvacuation: validatedData.dateOfEvacuation,
        evacuationSite: validatedData.evacuationSite,
        disasterType: validatedData.disasterType,
        assignedTent: validatedData.assignedTent || null,
        
        // Head of Family
        familyName: validatedData.familyName,
        givenName: validatedData.givenName,
        middleName: validatedData.middleName || null,
        completeAddress: validatedData.completeAddress,
        age: validatedData.age,
        occupation: validatedData.occupation,
        monthlyIncome: validatedData.monthlyIncome,
        
        termsAccepted: validatedData.termsAccepted,
        
        // Create members
        members: {
          create: validatedData.members.map(member => ({
            name: member.name,
            age: member.age,
            relation: member.relation,
            sex: member.sex,
            occupation: member.occupation || null,
            health: member.health,
            code: member.code,
          }))
        }
      },
      include: {
        members: true
      }
    });

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error('Error creating family:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create family registration' },
      { status: 500 }
    );
  }
}