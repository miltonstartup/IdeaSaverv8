"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/use-auth'; 
import { getSupabaseBrowserClient } from '@/src/lib/supabaseClient'; 
import { useToast } from '@/hooks/use-toast'; 
import { Check, Star, Gift, DollarSign, Wallet, Gem } from 'lucide-react'; 
import Link from 'next/link'; 
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
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const { user, profile, isLoading, updateCredits, refetchProfile } = useAuth(); 
  const router = useRouter();
  const { toast } = useToast(); 

  const [giftCode, setGiftCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSelectingFreePlan, setIsSelectingFreePlan] = useState(false);

  // URLs for payments and donations
  const PAYPAL_FULL_PURCHASE_URL = "https://www.paypal.com/ncp/payment/NTKN3MXA7SVCY";
  const FLOW_FULL_PURCHASE_URL = "https://www.flow.cl/btn.php?token=k171e659cedfb7b4af5d50c24a93f143b741b635";
  const FLOW_DONATIONS_URL = "https://www.flow.cl/btn.php?token=ydeb8622977178f0f68db6f7bd71a27b169ab641";

  // --- Redirection based on user and profile state ---
  useEffect(() => {
    if (!isLoading && user && profile) {
      if (profile.plan_selected) { 
        // Only redirect if not already on pricing page to avoid infinite loops
        const currentPath = window.location.pathname;
        if (currentPath !== '/pricing') { 
            console.log("PricingPage useEffect: User has plan, redirecting to /record");
            router.push('/record');
        }
      }
    } else if (!isLoading && !user) { 
      console.log("PricingPage useEffect: Not authenticated, redirecting to /login");
      router.push('/login');
    }
  }, [user, profile, isLoading, router]);

  // --- Function to handle "Continue with Free Plan" ---
  const handleSelectFreePlan = async () => {
    if (!user || !profile || isLoading) {
      toast({ title: "Error", description: "User or profile not loaded.", variant: "destructive" });
      return;
    }
    if (profile.plan_selected) {
        toast({ title: "Info", description: "You have already selected a plan.", variant: "default" });
        return;
    }

    setIsSelectingFreePlan(true);
    console.log('PricingPage: Attempting to select Free Plan for user:', user.id); 
    try {
      await refetchProfile({ 
        current_plan: 'free', 
        plan_selected: true, 
        credits: 25 
      }); 

      console.log("✅ PricingPage: Free Plan selected successfully via API. Now refetchProfile updated state."); 
      toast({ title: "Success!", description: "You are now on the Free Plan! Enjoy 25 credits.", variant: "default" });
    } catch (error: any) {
      console.error("❌ PricingPage: Unexpected error selecting free plan:", error); 
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSelectingFreePlan(false);
    }
  };

  // --- Function to handle Gift Code Redemption ---
  const handleRedeemCode = async () => {
    if (!user || !profile || isLoading) {
      toast({
        title: 'Error',
        description: 'You must be logged in to redeem a gift code.',
        variant: 'destructive',
      });
      return;
    }
    if (!giftCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a gift code.',
        variant: 'destructive',
      });
      return;
    }

    setIsRedeeming(true);
    try {
      const { data, error } = await getSupabaseBrowserClient().functions.invoke('redeem-gift-code', {
        body: { code: giftCode.trim(), userId: user.id },
      });

      if (error) {
        throw new Error(error.message);
      }
      if (data && data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Success!',
        description: `Gift code redeemed! You now have ${data.newCredits} credits.`,
        variant: 'default',
      });
      await refetchProfile({ credits: data.newCredits }); 
      setGiftCode(''); 
    } catch (err: any) {
      console.error('Redeem error:', err);
      toast({
        title: 'Redemption Failed',
        description: err.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  // --- Function to handle Credit Pack Purchase (Coming Soon) ---
  const handleCreditPackPurchase = (packName: string) => {
    toast({ 
      title: "Coming Soon!", 
      description: `${packName} credit pack purchases are under development.`, 
      variant: "default" 
    });
  };

  // --- Conditional Rendering for Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark-primary-bg">
        <p className="text-dark-text-light">Loading plans...</p> 
      </div>
    );
  }

  // If not logged in, or no profile (and not loading), redirect to login
  if (!user || !profile) {
    return null;
  }

  // --- Main Page Content (Conditional based on plan status) ---
  const isProUser = profile.has_purchased_app || profile.current_plan === 'full_app_purchase';
  const hasSelectedPlan = profile.plan_selected; 

  return (
    <div className="min-h-screen bg-dark-primary-bg text-dark-text-light py-10 px-4 flex flex-col items-center">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-dark-text-muted text-lg mb-6">
          Unlock Your Potential: A Guide to Idea Saver Credits
        </p>
        {/* Link to How Credits Work page */}
        <Link href="/credits" className="text-accent-purple hover:underline text-sm font-semibold">
          How do AI Credits work?
        </Link>
      </div>

      {/* Conditional Plan Display Section */}
      {/* Display for NEW Users (no plan selected yet) OR Existing Free Users (not Pro but selected free plan) */}
      {(!isProUser && !hasSelectedPlan) || (!isProUser && hasSelectedPlan && profile.current_plan === 'free') ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
          {/* Free Plan Card */}
          <div className="bg-dark-secondary-bg p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
            <p className="text-dark-text-muted mb-6">
              Test out Idea Saver with basic features and a few credits.
            </p>
            <ul className="text-left w-full mb-8 text-dark-text-light space-y-2">
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> 25 Welcome Credits</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Voice Recording & Playback</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> AI Transcription & Titling</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Local Storage</li>
            </ul>
            <Button
              onClick={handleSelectFreePlan}
              disabled={isSelectingFreePlan || hasSelectedPlan} 
              className="bg-gradient-to-r from-accent-purple to-accent-blue text-dark-text-light font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSelectingFreePlan ? 'Selecting...' : (hasSelectedPlan ? 'Plan Selected' : 'Continue with Free Plan')}
            </Button>
          </div>

          {/* Full App Purchase Card (Pro Plan) */}
          <div className="bg-dark-secondary-bg p-8 rounded-xl shadow-lg flex flex-col items-center text-center border-2 border-accent-purple">
            <h2 className="text-2xl font-bold mb-4">Full App Access (Pro)</h2>
            <p className="text-dark-text-muted mb-6">
              Unlock unlimited AI features and cloud sync with a one-time purchase.
            </p>
            <ul className="text-left w-full mb-8 text-dark-text-light space-y-2">
              <li className="flex items-center"><Star className="h-5 w-5 text-yellow-400 mr-2" /> Everything in Free, plus:</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Cloud Sync across devices</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> All advanced AI features (no credit cost)</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Full-text search of your notes (coming soon)</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Priority support</li>
              <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Access to future features & integrations</li>
              <li className="flex items-center"><Gift className="h-5 w-5 text-pink-400 mr-2" /> Massive 1,500 Bonus Credits</li>
            </ul>
            
            {/* Payment Method Selection AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-accent-purple to-accent-blue text-dark-text-light font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full"
                >
                  Purchase Full App
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-dark-secondary-bg text-dark-text-light rounded-lg shadow-lg border border-dark-border-subtle">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-dark-text-light text-xl font-bold">Choose Payment Method</AlertDialogTitle>
                  <AlertDialogDescription className="text-dark-text-muted">
                    You will be redirected to complete your secure payment. After successful payment, your account will be automatically upgraded.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col space-y-4 my-4">
                  <a href={PAYPAL_FULL_PURCHASE_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-yellow-500 text-dark-text-light hover:bg-yellow-600 rounded-lg py-3 font-semibold transition-colors duration-200">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pay with PayPal (USD)
                    </Button>
                  </a>
                  <a href={FLOW_FULL_PURCHASE_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-blue-500 text-dark-text-light hover:bg-blue-600 rounded-lg py-3 font-semibold transition-colors duration-200">
                      <Wallet className="w-5 h-5 mr-2" />
                      Pay with Flow (CLP)
                    </Button>
                  </a>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-dark-tertiary-bg text-dark-text-muted rounded-lg hover:bg-dark-border-subtle border border-dark-border-subtle">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ) : null }

      {/* Display for Pro Users (Full App Access) */}
      {isProUser && (
        <div className="text-center mb-10 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-4 gradient-text">You have Full App Access!</h2>
          <p className="text-dark-text-muted mb-8">
            Thank you for supporting Idea Saver! All premium features are unlocked.
          </p>
          <a href={FLOW_DONATIONS_URL} target="_blank" rel="noopener noreferrer">
            <Button 
              className="bg-accent-purple text-dark-text-light rounded-lg hover:opacity-90 transition-opacity py-3 px-8 font-semibold shadow-lg hover:shadow-xl"
            >
              <Gift className="w-5 h-5 mr-2" />
              Make a Donation
            </Button>
          </a>
        </div>
      )}
      
      {/* Credit Packs Section (Always visible for top-ups, except for NEW users before plan selection) */}
      {hasSelectedPlan && (
        <div className="text-center mb-10 w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Need More Credits?</h2>
          <p className="text-dark-text-muted mb-8">
            Top up your account to keep the ideas flowing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* 100 Credits Pack */}
            <div className="bg-dark-secondary-bg p-6 rounded-xl shadow-lg flex flex-col items-center border border-dark-border-subtle">
              <Gem className="h-8 w-8 text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-dark-text-light">100 Credits</h3>
              <p className="text-dark-text-light text-lg mb-4 font-semibold">$4.99 USD</p>
              <Button
                onClick={() => handleCreditPackPurchase('100')}
                className="bg-dark-tertiary-bg text-dark-text-muted font-semibold py-2 px-6 rounded-lg w-full cursor-not-allowed opacity-50"
                disabled
              >
                Buy Now (Coming Soon!)
              </Button>
            </div>
            
            {/* 500 Credits Pack */}
            <div className="bg-dark-secondary-bg p-6 rounded-xl shadow-lg flex flex-col items-center border border-dark-border-subtle">
              <Gem className="h-8 w-8 text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-dark-text-light">500 Credits</h3>
              <p className="text-dark-text-light text-lg mb-4 font-semibold">$19.99 USD</p>
              <Button
                onClick={() => handleCreditPackPurchase('500')}
                className="bg-dark-tertiary-bg text-dark-text-muted font-semibold py-2 px-6 rounded-lg w-full cursor-not-allowed opacity-50"
                disabled
              >
                Buy Now (Coming Soon!)
              </Button>
            </div>
            
            {/* 2000 Credits Pack */}
            <div className="bg-dark-secondary-bg p-6 rounded-xl shadow-lg flex flex-col items-center border border-dark-border-subtle">
              <Gem className="h-8 w-8 text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-dark-text-light">2000 Credits</h3>
              <p className="text-dark-text-light text-lg mb-4 font-semibold">$59.99 USD</p>
              <Button
                onClick={() => handleCreditPackPurchase('2000')}
                className="bg-dark-tertiary-bg text-dark-text-muted font-semibold py-2 px-6 rounded-lg w-full cursor-not-allowed opacity-50"
                disabled
              >
                Buy Now (Coming Soon!)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Code Redemption Section (Always visible if a plan is selected) */}
      {hasSelectedPlan && (
        <div className="bg-dark-secondary-bg p-8 rounded-xl shadow-lg w-full max-w-md text-center mb-10 border border-dark-border-subtle">
          <h2 className="text-xl font-bold mb-4 text-dark-text-light">Have a Gift Code?</h2>
          <p className="text-dark-text-muted mb-6">Enter your code below to redeem AI credits.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input
              type="text"
              placeholder="Enter code here"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              className="flex-grow p-3 rounded-lg bg-dark-tertiary-bg text-dark-text-light border border-dark-border-subtle focus:border-accent-purple outline-none transition-colors duration-200"
              disabled={isRedeeming}
            />
            <Button
              onClick={handleRedeemCode}
              disabled={isRedeeming || !giftCode.trim()}
              className="bg-accent-purple text-dark-text-light px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRedeeming ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}