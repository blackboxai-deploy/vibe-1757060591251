"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StatisticsCards from '@/components/StatisticsCards';
import type { FamilyRegistration, FamilyStatistics } from '@/types';

export default function FamilyDirectory() {
  const [families, setFamilies] = useState<FamilyRegistration[]>([]);
  const [filteredFamilies, setFilteredFamilies] = useState<FamilyRegistration[]>([]);
  const [statistics, setStatistics] = useState<FamilyStatistics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilies();
    fetchStatistics();
  }, []);

  useEffect(() => {
    // Filter families based on search term
    if (!searchTerm.trim()) {
      setFilteredFamilies(families);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = families.filter(family => {
        // Search in family info
        const familyMatch = 
          family.familyId?.toLowerCase().includes(term) ||
          family.familyName.toLowerCase().includes(term) ||
          family.givenName.toLowerCase().includes(term) ||
          family.middleName?.toLowerCase().includes(term) ||
          family.barangay.toLowerCase().includes(term) ||
          family.evacuationSite.toLowerCase().includes(term);

        // Search in family members
        const membersMatch = family.members?.some(member =>
          member.name.toLowerCase().includes(term)
        );

        return familyMatch || membersMatch;
      });
      setFilteredFamilies(filtered);
    }
  }, [searchTerm, families]);

  const fetchFamilies = async () => {
    try {
      const response = await fetch('/api/families');
      if (response.ok) {
        const data = await response.json();
        setFamilies(data);
        setFilteredFamilies(data);
      }
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const deleteFamily = async (familyId: string, displayId: string) => {
    try {
      const response = await fetch(`/api/families/${familyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setFamilies(prev => prev.filter(f => f.id !== familyId));
        // Refresh statistics
        fetchStatistics();
        alert(`Family ${displayId} deleted successfully`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete family');
      }
    } catch (error) {
      console.error('Error deleting family:', error);
      alert('Failed to delete family. Please try again.');
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case 'High Priority':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Priority':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCodeBadgeColor = (code: string) => {
    const colors: { [key: string]: string } = {
      'Elderly': 'bg-purple-100 text-purple-800 border-purple-200',
      'PWD': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pregnant': 'bg-pink-100 text-pink-800 border-pink-200',
      'Lactating': 'bg-orange-100 text-orange-800 border-orange-200',
      'Infant': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Children': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'N/A': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[code] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Loading families...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics */}
      {statistics && <StatisticsCards statistics={statistics} />}

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search families or members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredFamilies.length} of {families.length} families
        </div>
      </div>

      {/* Families Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Families</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFamilies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? 'No families found matching your search.' : 'No families registered yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Family ID</TableHead>
                    <TableHead>Head of Family</TableHead>
                    <TableHead>Barangay</TableHead>
                    <TableHead>Evacuation Site</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Date Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies.map((family) => (
                    <TableRow key={family.id}>
                      <TableCell className="font-medium">
                        {family.familyId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {family.givenName} {family.middleName} {family.familyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Age {family.age} • {family.occupation}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{family.barangay}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{family.evacuationSite}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{family.members?.length || 0} members</div>
                          <div className="flex flex-wrap gap-1">
                            {family.members?.slice(0, 3).map((member, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline"
                                className={`text-xs ${getCodeBadgeColor(member.code)}`}
                              >
                                {member.code}
                              </Badge>
                            ))}
                            {(family.members?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(family.members?.length || 0) - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {family.createdAt ? formatDate(family.createdAt) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* View Details */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Family Details - {family.familyId}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Family Registration Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Registration Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Barangay:</span> {family.barangay}</p>
                                      <p><span className="font-medium">Evacuation Site:</span> {family.evacuationSite}</p>
                                      <p><span className="font-medium">Date of Evacuation:</span> {formatDate(family.dateOfEvacuation)}</p>
                                      <p><span className="font-medium">Disaster Type:</span> {family.disasterType}</p>
                                      {family.assignedTent && (
                                        <p><span className="font-medium">Assigned Tent:</span> {family.assignedTent}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Head of Family</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Name:</span> {family.givenName} {family.middleName} {family.familyName}</p>
                                      <p><span className="font-medium">Age:</span> {family.age}</p>
                                      <p><span className="font-medium">Occupation:</span> {family.occupation}</p>
                                      <p><span className="font-medium">Monthly Income:</span> ₱{family.monthlyIncome}</p>
                                      <p><span className="font-medium">Address:</span> {family.completeAddress}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Family Members */}
                                {family.members && family.members.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-3">Family Members ({family.members.length})</h4>
                                    <div className="grid gap-3">
                                      {family.members.map((member, idx) => (
                                        <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                            <div>
                                              <span className="font-medium">Name:</span> {member.name}
                                            </div>
                                            <div>
                                              <span className="font-medium">Age:</span> {member.age}
                                            </div>
                                            <div>
                                              <span className="font-medium">Relation:</span> {member.relation}
                                            </div>
                                            <div>
                                              <span className="font-medium">Sex:</span> {member.sex}
                                            </div>
                                            {member.occupation && (
                                              <div>
                                                <span className="font-medium">Occupation:</span> {member.occupation}
                                              </div>
                                            )}
                                            <div>
                                              <Badge className={getHealthBadgeColor(member.health)}>
                                                {member.health}
                                              </Badge>
                                            </div>
                                            <div>
                                              <Badge className={getCodeBadgeColor(member.code)}>
                                                {member.code}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Family Registration</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the registration for family{' '}
                                  <strong>{family.familyId}</strong> ({family.givenName} {family.familyName})?
                                  This action cannot be undone and will permanently remove all family member data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => family.id && deleteFamily(family.id, family.familyId || '')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Family
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}