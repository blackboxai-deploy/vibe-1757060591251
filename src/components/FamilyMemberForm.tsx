"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { familyMemberSchema, type FamilyMemberInput } from '@/lib/validations';
import { 
  HEALTH_LEVELS,
  SPECIAL_CODES,
  SEX_OPTIONS,
  FAMILY_RELATIONS
} from '@/lib/constants';
import type { FamilyMember } from '@/types';

interface FamilyMemberFormProps {
  members: FamilyMember[];
  onAddMember: (member: FamilyMember) => void;
  onRemoveMember: (index: number) => void;
}

export default function FamilyMemberForm({ 
  members, 
  onAddMember, 
  onRemoveMember 
}: FamilyMemberFormProps) {
  const [isAddingMember, setIsAddingMember] = useState(false);

  const form = useForm<FamilyMemberInput>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      name: '',
      age: 1,
      relation: '',
      sex: 'Male',
      occupation: '',
      health: 'Normal',
      code: 'N/A',
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = form;
  const watchedValues = watch();

  const onSubmit = (data: FamilyMemberInput) => {
    // Prevent any form submission issues
    try {
      onAddMember(data);
      reset();
      setIsAddingMember(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="space-y-6">
      {/* Existing Members List */}
      {members.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Family Members ({members.length})</h4>
          <div className="grid gap-4">
            {members.map((member, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 flex-1">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Name</p>
                        <p className="text-sm">{member.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Age</p>
                        <p className="text-sm">{member.age}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Relation</p>
                        <p className="text-sm">{member.relation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Sex</p>
                        <p className="text-sm">{member.sex}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Occupation</p>
                        <p className="text-sm">{member.occupation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Health</p>
                        <p className={`text-sm font-medium ${
                          member.health === 'High Priority' ? 'text-red-600' :
                          member.health === 'Priority' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {member.health}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Code</p>
                        <p className="text-sm font-medium text-blue-600">{member.code}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveMember(index)}
                      className="ml-4"
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Member Form */}
      {isAddingMember ? (
        <Card className="border-2 border-dashed border-blue-300">
          <CardHeader>
            <CardTitle className="text-lg">Add Family Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memberName">Name *</Label>
                  <Input
                    id="memberName"
                    {...register('name')}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberAge">Age *</Label>
                  <Input
                    id="memberAge"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    placeholder="Enter age"
                    min="0"
                    max="120"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relation">Relation *</Label>
                  <Select onValueChange={(value) => setValue('relation', value)} value={watchedValues.relation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {FAMILY_RELATIONS.map((relation) => (
                        <SelectItem key={relation} value={relation}>
                          {relation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relation && (
                    <p className="text-sm text-red-600">{errors.relation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex *</Label>
                  <Select onValueChange={(value) => setValue('sex', value as any)} value={watchedValues.sex}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEX_OPTIONS.map((sex) => (
                        <SelectItem key={sex} value={sex}>
                          {sex}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sex && (
                    <p className="text-sm text-red-600">{errors.sex.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    {...register('occupation')}
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="health">Health Status *</Label>
                  <Select onValueChange={(value) => setValue('health', value as any)} value={watchedValues.health}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEALTH_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.health && (
                    <p className="text-sm text-red-600">{errors.health.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Select onValueChange={(value) => setValue('code', value as any)} value={watchedValues.code}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIAL_CODES.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.code && (
                    <p className="text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsAddingMember(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Member
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddingMember(true)}
            className="border-dashed border-2 border-blue-300 py-8 px-12 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            + Add Family Member
          </Button>
        </div>
      )}
    </div>
  );
}