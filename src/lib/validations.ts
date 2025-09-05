import { z } from "zod";

export const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be positive").max(120, "Age must be realistic"),
  relation: z.string().min(1, "Relation is required"),
  sex: z.enum(["Male", "Female"], { required_error: "Sex is required" }),
  occupation: z.string().optional(),
  health: z.enum(["Normal", "Priority", "High Priority"], { 
    required_error: "Health status is required" 
  }),
  code: z.enum([
    "N/A", "Elderly", "PWD", "Pregnant", "Lactating", "Infant", "Children"
  ], { required_error: "Code is required" }),
});

export const familyRegistrationSchema = z.object({
  barangay: z.string().min(1, "Barangay is required"),
  dateOfEvacuation: z.date({ required_error: "Date of evacuation is required" }),
  evacuationSite: z.string().min(1, "Evacuation site is required"),
  disasterType: z.enum(["Flood", "Fire", "Earthquake"], {
    required_error: "Disaster type is required"
  }),
  assignedTent: z.string().optional(),
  
  // Head of Family
  familyName: z.string().min(1, "Family name is required"),
  givenName: z.string().min(1, "Given name is required"),
  middleName: z.string().optional(),
  completeAddress: z.string().min(1, "Complete address is required"),
  age: z.number().min(18, "Head of family must be at least 18").max(120, "Age must be realistic"),
  occupation: z.string().min(1, "Occupation is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  
  // Members
  members: z.array(familyMemberSchema),
  
  // Terms
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type FamilyRegistrationInput = z.infer<typeof familyRegistrationSchema>;
export type FamilyMemberInput = z.infer<typeof familyMemberSchema>;