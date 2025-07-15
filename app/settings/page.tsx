// app/settings/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/use-auth';
import { getSupabaseBrowserClient } from '@/src/lib/supabaseClient';
import LoadingSpinner from '@/src/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Settings, Cloud, Trash2, Trello, CreditCard, Languages, Palette, UserX } from 'lucide-react'; // Added UserX for delete account
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // Shadcn AlertDialog for delete confirmation
import { Input } from '@/components/ui/input'; // For email confirmation in delete


export default function SettingsPage() {
  const { user, profile, isLoading, updateCredits, signOut, refetchProfile } = useAuth(); // Destructure refetchProfile
  const router = useRouter();
  const { toast } = useToast();

  // --- Local state for settings (initialized from profile) ---
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);
  const [autoCloudSync, setAutoCloudSync] = useState(false);
  const [deletionPolicy, setDeletionPolicy] = useState('never'); // 'never', '7', '15', '30'
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState(''); // For account deletion confirmation

  // --- Initialize local state from profile once loaded ---
  useEffect(() => {
    if (profile) {
      setCloudSyncEnabled(profile.cloud_sync_enabled);
      setAutoCloudSync(profile.auto_cloud_sync);
      setDeletionPolicy(profile.deletion_policy_days === 0 ? 'never' : String(profile.deletion_policy_days));
    }
  }, [profile]);


  // --- Defensive loading and authentication check ---
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('SettingsPage: Not authenticated, redirecting to /login...');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-primary-bg text-dark-text-light">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4">Loading settings...</p>
        </div>
      </div>
    );
  }

  // --- Handle Save Changes ---
  const handleSaveChanges = async () => {
    if (!user || !profile) return;
    setIsSaving(true);
    try {
      console.log("Saving settings for user:", user.id, { cloudSyncEnabled, autoCloudSync, deletionPolicy });
      // CRITICAL: Update profile in Supabase
      const { error } = await getSupabaseBrowserClient()
        .from('profiles')
        .update({
          cloud_sync_enabled: cloudSyncEnabled,
          auto_cloud_sync: autoCloudSync,
          deletion_policy_days: deletionPolicy === 'never' ? 0 : parseInt(deletionPolicy),
        })
        .eq('id', user.id);

      if (error) {
        console.error("Error saving settings:", error);
        toast({ title: "Error", description: error.message || "Failed to save settings.", variant: "destructive" });
      } else {
        console.log("Settings saved successfully to DB. Refetching profile.");
        await refetchProfile(); // CRITICAL: Refetch profile to sync local state
        toast({ title: "Success!", description: "Settings saved successfully.", variant: "default" });
      }
    } catch (error: any) {
      console.error("Unexpected error saving settings:", error);
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handle Delete Account ---
  const handleDeleteAccount = async () => {
    if (!user || !profile || profile.email !== deleteConfirmEmail) {
      toast({ title: "Error", description: "Email does not match or user not found.", variant: "destructive" });
      return;
    }

    console.log("Attempting to delete account for:", user.id);
    try {
      // This requires Supabase service role or a server-side function/API route
      // Supabase client-side delete is usually restricted for security
      // For now, it will be a placeholder toast.
      toast({ title: "Coming Soon!", description: "Actual account deletion requires server-side logic.", variant: "default" });
      console.log("Account deletion logic is a placeholder.");
      // In a real app, this would call an API route that uses adminClientInstance.auth.admin.deleteUser(userId)
      // and then deletes their profile/notes from DB.
      // await signOut(); // Sign out locally after server-side deletion
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({ title: "Error", description: error.message || "Failed to delete account.", variant: "destructive" });
    }
  };


  // --- Main Settings Page Content ---
  const isProUser = profile.has_purchased_app || profile.current_plan === 'full_app_purchase';

  return (
    <div className="min-h-screen bg-dark-primary-bg text-dark-text-light py-10 px-4 flex flex-col items-center">
      <div className="text-center mb-10 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-dark-text-muted text-lg mb-6">
          Manage your application settings, data synchronization, and account.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {/* Plan & Credits Card */}
        <Card className="bg-dark-secondary-bg border-dark-border-subtle rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-dark-text-light flex items-center"><CreditCard className="w-5 h-5 mr-2" /> Plan & Credits</CardTitle>
            <CardDescription className="text-dark-text-muted">
              View your current plan and credit balance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-dark-text-light">Current Plan: <span className="font-semibold capitalize">{profile.current_plan}</span></p>
            <p className="text-dark-text-light">Credits Remaining: <span className="font-semibold">{profile.credits.toLocaleString()}</span></p>
            <Button 
              className="bg-accent-purple text-dark-text-light rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => router.push('/pricing')}
            >
              Manage Plan & Credits
            </Button>
          </CardContent>
        </Card>

        {/* Data & Sync Card */}
        <Card className="bg-dark-secondary-bg border-dark-border-subtle rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-dark-text-light flex items-center"><Cloud className="w-5 h-5 mr-2" /> Data & Sync</CardTitle>
            <CardDescription className="text-dark-text-muted">
              Control how your data is stored and synchronized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cloud Sync Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="cloud-sync" className="text-dark-text-light flex items-center">
                Enable Cloud Sync
              </Label>
              <Switch 
                id="cloud-sync" 
                checked={cloudSyncEnabled} 
                onCheckedChange={setCloudSyncEnabled}
                disabled={!isProUser}
                className="data-[state=checked]:bg-accent-purple data-[state=unchecked]:bg-dark-tertiary-bg"
              />
            </div>
            {!isProUser && (
              <p className="text-red-400 text-sm">Cloud Sync is a Pro feature. Upgrade to enable.</p>
            )}
            {cloudSyncEnabled && isProUser && (
              <div className="flex items-center justify-between pl-6">
                <Label htmlFor="auto-cloud-sync" className="text-dark-text-light flex items-center">
                  Automatically save new notes to the cloud
                </Label>
                <Switch 
                  id="auto-cloud-sync" 
                  checked={autoCloudSync} 
                  onCheckedChange={setAutoCloudSync}
                  className="data-[state=checked]:bg-accent-purple data-[state=unchecked]:bg-dark-tertiary-bg"
                />
              </div>
            )}

            {/* Auto-Delete Notes */}
            <div className="space-y-2">
              <Label className="text-dark-text-light flex items-center"><Trash2 className="w-5 h-5 mr-2" /> Auto-Delete Notes</Label>
              <CardDescription className="text-dark-text-muted">
                Automatically delete notes from this device and the cloud after a certain period.
              </CardDescription>
              <RadioGroup value={deletionPolicy} onValueChange={setDeletionPolicy} className="flex flex-col space-y-2 pl-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="r1" className="data-[state=checked]:border-accent-purple data-[state=checked]:text-accent-purple" />
                  <Label htmlFor="r1" className="text-dark-text-light">Never</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7" id="r2" className="data-[state=checked]:border-accent-purple data-[state=checked]:text-accent-purple" />
                  <Label htmlFor="r2" className="text-dark-text-light">After 7 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15" id="r3" className="data-[state=checked]:border-accent-purple data-[state=checked]:text-accent-purple" />
                  <Label htmlFor="r3" className="text-dark-text-light">After 15 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="r4" className="data-[state=checked]:border-accent-purple data-[state=checked]:text-accent-purple" />
                  <Label htmlFor="r4" className="text-dark-text-light">After 30 days</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Local Storage Management (Placeholder) */}
            <div className="text-center mt-6">
              <Button 
                className="bg-dark-tertiary-bg text-dark-text-muted rounded-lg hover:bg-dark-secondary-bg transition-colors"
                onClick={() => toast({ title: "Coming Soon!", description: "Local storage management is under development." })}
              >
                Manage Local Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trello Integration Card (Placeholder) */}
        <Card className="bg-dark-secondary-bg border-dark-border-subtle rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-dark-text-light flex items-center"><Trello className="w-5 h-5 mr-2" /> Trello Integration</CardTitle>
            <CardDescription className="text-dark-text-muted">
              Connect your Trello account to send notes directly to a board as new cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-accent-purple text-dark-text-light rounded-lg hover:opacity-90 transition-opacity"
              disabled={!isProUser}
              onClick={() => toast({ title: "Coming Soon!", description: "Trello integration is under development." })}
            >
              {isProUser ? 'Connect to Trello' : 'Upgrade to Pro'}
            </Button>
            {!isProUser && (
              <p className="text-red-400 text-sm mt-2">Trello integration is a Pro feature. Upgrade to enable.</p>
            )}
          </CardContent>
        </Card>

        {/* Account Settings / Danger Zone Card */}
        <Card className="bg-dark-secondary-bg border-red-500 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center"><UserX className="w-5 h-5 mr-2" /> Danger Zone</CardTitle> {/* Changed icon to UserX */}
            <CardDescription className="text-dark-text-muted">
              These actions are permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-red-500 text-dark-text-light rounded-lg hover:bg-red-600 transition-colors"
                  // onClick={() => toast({ title: "Confirmation Needed", description: "Deleting account is a multi-step process. Coming Soon!", variant: "destructive" })}
                >
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-dark-secondary-bg text-dark-text-light rounded-lg shadow-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-dark-text-light">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-dark-text-muted">
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers. Type your email to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input 
                  type="email" 
                  placeholder="Enter your email to confirm" 
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                  className="bg-dark-tertiary-bg text-dark-text-light border border-dark-border-subtle rounded-lg mb-4"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-dark-tertiary-bg text-dark-text-muted rounded-lg hover:bg-dark-border-subtle">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount} 
                    disabled={profile?.email !== deleteConfirmEmail || isSaving} // Use isSaving for loading state
                    className="bg-red-500 text-dark-text-light rounded-lg hover:bg-red-600"
                  >
                    {isSaving ? 'Deleting...' : 'Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Save Changes Button */}
        <div className="text-center mt-8">
          <Button 
            className="bg-accent-purple text-dark-text-light rounded-lg hover:opacity-90 transition-opacity"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

      </div>
    </div>
  );
}