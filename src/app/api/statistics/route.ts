import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch statistics for dashboard
export async function GET() {
  try {
    // Get total families
    const totalFamilies = await prisma.family.count();
    
    // Get total members
    const totalMembers = await prisma.familyMember.count();
    
    // Get families with their members for code breakdown
    const families = await prisma.family.findMany({
      include: {
        members: true
      }
    });

    // Calculate code breakdown
    const codeBreakdown: { [key: string]: number } = {};
    const healthBreakdown: { [key: string]: number } = {};
    const evacuationSiteBreakdown: { [key: string]: number } = {};
    
    families.forEach(family => {
      // Count evacuation sites
      evacuationSiteBreakdown[family.evacuationSite] = 
        (evacuationSiteBreakdown[family.evacuationSite] || 0) + 1;
      
      // Count codes and health status from members
      family.members.forEach(member => {
        codeBreakdown[member.code] = (codeBreakdown[member.code] || 0) + 1;
        healthBreakdown[member.health] = (healthBreakdown[member.health] || 0) + 1;
      });
    });

    const statistics = {
      totalFamilies,
      totalMembers,
      codeBreakdown,
      healthBreakdown,
      evacuationSiteBreakdown
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}