"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { familyRegistrationSchema, type FamilyRegistrationInput } from '@/lib/validations';
import { 
  TAGUIG_BARANGAYS, 
  EVACUATION_SITES, 
  DISASTER_TYPES, 
  MONTHLY_INCOME_RANGES,
  HEALTH_LEVELS,
  SPECIAL_CODES,
  SEX_OPTIONS,
  FAMILY_RELATIONS
} from '@/lib/constants';
import FamilyMemberForm from '@/components/FamilyMemberForm';
import type { FamilyMember } from '@/types';

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<FamilyRegistrationInput>({
    resolver: zodResolver(familyRegistrationSchema),
    defaultValues: {
      members: [],
      termsAccepted: false,
      dateOfEvacuation: new Date(),
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const termsAccepted = watch('termsAccepted');

  const addMember = (member: FamilyMember) => {
    const newMembers = [...members, member];
    setMembers(newMembers);
    setValue('members', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    setValue('members', newMembers);
  };

  const onSubmit = async (data: FamilyRegistrationInput) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          members,
          dateOfEvacuation: selectedDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register family');
      }

      // Reset form
      form.reset();
      setMembers([]);
      setSelectedDate(new Date());
      
      // Show success message
      alert('Family registered successfully!');
      onSuccess();
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register family. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Family Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Family Registration Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="barangay">Barangay *</Label>
            <Select onValueChange={(value) => setValue('barangay', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Barangay" />
              </SelectTrigger>
              <SelectContent>
                {TAGUIG_BARANGAYS.map((barangay) => (
                  <SelectItem key={barangay} value={barangay}>
                    {barangay}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.barangay && (
              <p className="text-sm text-red-600">{errors.barangay.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date of Evacuation *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !selectedDate && "text-muted-foreground"
                  }`}
                >
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) setValue('dateOfEvacuation', date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfEvacuation && (
              <p className="text-sm text-red-600">{errors.dateOfEvacuation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evacuationSite">Evacuation Site *</Label>
            <Select onValueChange={(value) => setValue('evacuationSite', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                {EVACUATION_SITES.map((site) => (
                  <SelectItem key={site} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.evacuationSite && (
              <p className="text-sm text-red-600">{errors.evacuationSite.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disasterType">Type of Disaster *</Label>
            <Select onValueChange={(value) => setValue('disasterType', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Disaster Type" />
              </SelectTrigger>
              <SelectContent>
                {DISASTER_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.disasterType && (
              <p className="text-sm text-red-600">{errors.disasterType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTent">Assigned Tent</Label>
            <Input
              id="assignedTent"
              {...register('assignedTent')}
              placeholder="e.g., Tent A-15"
            />
          </div>
        </CardContent>
      </Card>

      {/* Head of Family Section */}
      <Card>
        <CardHeader>
          <CardTitle>Head of Family Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="familyName">Family Name *</Label>
            <Input
              id="familyName"
              {...register('familyName')}
              placeholder="Enter family name"
            />
            {errors.familyName && (
              <p className="text-sm text-red-600">{errors.familyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="givenName">Given Name *</Label>
            <Input
              id="givenName"
              {...register('givenName')}
              placeholder="Enter given name"
            />
            {errors.givenName && (
              <p className="text-sm text-red-600">{errors.givenName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              {...register('middleName')}
              placeholder="Enter middle name"
            />
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label htmlFor="completeAddress">Complete Address *</Label>
            <Textarea
              id="completeAddress"
              {...register('completeAddress')}
              placeholder="Enter complete address"
              rows={3}
            />
            {errors.completeAddress && (
              <p className="text-sm text-red-600">{errors.completeAddress.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              placeholder="Enter age"
              min="18"
              max="120"
            />
            {errors.age && (
              <p className="text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation *</Label>
            <Input
              id="occupation"
              {...register('occupation')}
              placeholder="Enter occupation"
            />
            {errors.occupation && (
              <p className="text-sm text-red-600">{errors.occupation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income *</Label>
            <Select onValueChange={(value) => setValue('monthlyIncome', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Income Range" />
              </SelectTrigger>
              <SelectContent>
                {MONTHLY_INCOME_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    ₱{range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.monthlyIncome && (
              <p className="text-sm text-red-600">{errors.monthlyIncome.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Family Members Section */}
      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <FamilyMemberForm 
            members={members} 
            onAddMember={addMember}
            onRemoveMember={removeMember}
          />
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setValue('termsAccepted', !!checked)}
            />
            <div className="space-y-2">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the terms and conditions *
              </Label>
              <p className="text-sm text-gray-600 leading-relaxed">
                I understand that providing false information may result in disqualification from 
                receiving assistance and may have legal consequences. I consent to the collection 
                and processing of this information for evacuation center management and disaster 
                response purposes.
              </p>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !termsAccepted}
          className="px-12 py-3 text-lg"
        >
          {isSubmitting ? 'Registering...' : 'Register Family'}
        </Button>
      </div>
    </form>
  );
}