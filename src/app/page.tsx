"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationForm from '@/components/RegistrationForm';
import FamilyDirectory from '@/components/FamilyDirectory';

export default function Home() {
  const [refreshDirectory, setRefreshDirectory] = useState(0);

  const handleRegistrationSuccess = () => {
    // Trigger refresh of directory when new family is registered
    setRefreshDirectory(prev => prev + 1);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Taguig City Evacuee Registration System
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive family registration and directory management for evacuation centers
          </p>
        </div>

        <Tabs defaultValue="registration" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="registration" className="text-lg py-3">
              Family Registration
            </TabsTrigger>
            <TabsTrigger value="directory" className="text-lg py-3">
              Family Directory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Register New Family</CardTitle>
                <CardDescription>
                  Complete family registration form for evacuation center management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationForm onSuccess={handleRegistrationSuccess} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directory">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Family Directory</CardTitle>
                <CardDescription>
                  Browse and manage all registered families and evacuation statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FamilyDirectory key={refreshDirectory} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}