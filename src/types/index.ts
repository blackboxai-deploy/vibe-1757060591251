export interface FamilyMember {
  id?: string;
  name: string;
  age: number;
  relation: string;
  sex: "Male" | "Female";
  occupation?: string;
  health: "Normal" | "Priority" | "High Priority";
  code: "N/A" | "Elderly" | "PWD" | "Pregnant" | "Lactating" | "Infant" | "Children";
}

export interface FamilyRegistration {
  id?: string;
  familyId?: string;
  barangay: string;
  dateOfEvacuation: Date;
  evacuationSite: string;
  disasterType: "Flood" | "Fire" | "Earthquake";
  assignedTent?: string;
  
  // Head of Family
  familyName: string;
  givenName: string;
  middleName?: string;
  completeAddress: string;
  age: number;
  occupation: string;
  monthlyIncome: string;
  
  // Members
  members: FamilyMember[];
  
  // Terms
  termsAccepted: boolean;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FamilyStatistics {
  totalFamilies: number;
  totalMembers: number;
  codeBreakdown: {
    [key: string]: number;
  };
  healthBreakdown: {
    [key: string]: number;
  };
  evacuationSiteBreakdown: {
    [key: string]: number;
  };
}