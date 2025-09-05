# Taguig City Evacuee Registration System

A comprehensive family registration and directory management system for evacuation centers in Taguig City. Built with Next.js 15, TypeScript, Prisma, and modern web technologies.

## 🎯 Features

### Multi-Tab Interface
- **Family Registration Tab**: Complete registration form for new evacuee families
- **Family Directory Tab**: Browse, search, and manage all registered families

### Comprehensive Registration System
- **Family Details**: Barangay selection, evacuation dates, disaster types, evacuation sites
- **Head of Family**: Personal information, occupation, income ranges
- **Family Members**: Dynamic member addition with health codes and demographics
- **Terms & Conditions**: Legal compliance and data processing consent

### Advanced Directory Management
- **Search Functionality**: Search across all families and individual members
- **Statistics Dashboard**: Real-time demographics and code breakdowns
- **Family Details Modal**: Complete family information viewer
- **Delete Operations**: Safe family removal with confirmation dialogs

### Taguig City Integration
- Complete list of all 28 Taguig City barangays
- Local evacuation site management (Evac 1-5)
- Disaster type tracking (Flood, Fire, Earthquake)

### Demographics Tracking
- **Special Codes**: Elderly, PWD, Pregnant, Lactating, Infant, Children
- **Health Priority**: Normal, Priority, High Priority classifications
- **Statistical Analytics**: Code breakdowns, evacuation site distribution

## 🛠 Technology Stack

- **Frontend**: Next.js 15, TypeScript, React 19
- **UI/UX**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Production-ready build system

## 📋 Prerequisites

- Node.js 18+ (Works on both Windows and Linux)
- npm or pnpm package manager

## 🚀 Getting Started

### 1. Clone and Install
```bash
# Install dependencies
npm install
# or
pnpm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push database schema (creates SQLite database)
npx prisma db push
```

### 3. Build and Start
```bash
# Build the application
npm run build -- --no-lint

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 🗂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── families/          # Family CRUD operations
│   │   │   ├── route.ts       # GET all families, POST new family
│   │   │   └── [id]/route.ts  # GET single family, DELETE family
│   │   └── statistics/route.ts # Dashboard statistics
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main application page
├── components/
│   ├── RegistrationForm.tsx   # Family registration form
│   ├── FamilyDirectory.tsx    # Directory management
│   ├── FamilyMemberForm.tsx   # Dynamic member form
│   └── StatisticsCards.tsx    # Statistics dashboard
├── lib/
│   ├── constants.ts           # Taguig barangays, options
│   ├── database.ts            # Prisma client
│   └── validations.ts         # Zod schemas
└── types/
    └── index.ts               # TypeScript interfaces
```

## 🔌 API Endpoints

### Families Management
```bash
# Get all families
GET /api/families

# Create new family
POST /api/families
{
  "barangay": "Bagumbayan",
  "dateOfEvacuation": "2024-01-15T00:00:00.000Z",
  "evacuationSite": "Evac 1",
  "disasterType": "Flood",
  "familyName": "Santos",
  "givenName": "Juan",
  "middleName": "Cruz",
  "completeAddress": "123 Main Street, Bagumbayan, Taguig City",
  "age": 35,
  "occupation": "Construction Worker",
  "monthlyIncome": "15,001 - 20,000",
  "members": [
    {
      "name": "Maria Santos",
      "age": 32,
      "relation": "Spouse",
      "sex": "Female",
      "occupation": "Vendor",
      "health": "Normal",
      "code": "N/A"
    }
  ],
  "termsAccepted": true
}

# Get single family
GET /api/families/[id]

# Delete family
DELETE /api/families/[id]
```

### Statistics Dashboard
```bash
# Get evacuation statistics
GET /api/statistics
{
  "totalFamilies": 1,
  "totalMembers": 2,
  "codeBreakdown": {"N/A": 1, "Children": 1},
  "healthBreakdown": {"Normal": 2},
  "evacuationSiteBreakdown": {"Evac 1": 1}
}
```

## 🎨 Key Components

### Family Registration Form
- Dynamic barangay dropdown with all 28 Taguig barangays
- Date picker for evacuation dates
- Evacuation site selection
- Family member management with add/remove functionality
- Form validation with error handling

### Family Directory
- Searchable family listings
- Statistics cards with demographic breakdowns
- Family detail modals
- Safe deletion with confirmation dialogs

### Database Schema
- **Families**: Registration details and head of family information
- **FamilyMembers**: Individual member records with health codes
- Automatic family ID generation (FAM-0001, FAM-0002, etc.)

## 🔍 Search & Filter Features

- Search across family names, member names, family IDs
- Filter by barangay, evacuation site, disaster type
- Real-time search results
- Case-insensitive matching

## 📊 Statistics & Analytics

- Total registered families and members
- Special code breakdowns (Elderly, PWD, Pregnant, etc.)
- Health priority distributions
- Evacuation site occupancy tracking
- Visual progress bars and demographic cards

## 🛡 Data Validation

- Required field validation
- Age range validation (18+ for head of family)
- Terms and conditions acceptance requirement
- Type-safe form submissions with Zod schemas

## 🌍 Cross-Platform Compatibility

- **Windows**: Full compatibility with SQLite and Node.js
- **Linux**: Native support for all dependencies
- **Database**: SQLite file-based database (dev.db)
- **Deployment**: Production-ready builds

## 🚨 Emergency Management Features

- Disaster type tracking (Flood, Fire, Earthquake)
- Health priority classifications for medical triage
- Special demographic coding for vulnerable populations
- Evacuation site capacity management

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build -- --no-lint

# Start production server
npm start

# Database operations
npx prisma generate    # Generate client
npx prisma db push     # Apply schema changes
npx prisma studio      # Database browser (optional)
```

## 🤝 Contributing

This application is designed for emergency management and evacuation centers. When contributing:

1. Maintain data accuracy and validation
2. Ensure cross-platform compatibility
3. Follow accessibility guidelines
4. Test thoroughly with realistic data

## 📄 License

This project is designed for emergency response and evacuation management in Taguig City.

---

**Emergency Contact Information**: This system is designed for disaster response coordination. Always follow official emergency protocols and procedures.