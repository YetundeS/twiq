import '@/app/platform/[slug]/settings/settings.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import useAuthStore from '@/store/authStore';
import { useBuyCreditDialog } from '@/store/useBuyCreditDialog';
import { Info } from "lucide-react";
import { BuyCreditDialog } from '../BuyCreditDialog';

export function SubscriptionTab({ user, openSubDialog }) {
    const inputCredits = Math.floor((user?.subscription_quota?.input_tokens || 0) / 1000);
    //   const outputCredits = Math.floor((user?.subscription_quota?.output_tokens || 0) / 1000);
    //   const inputUsed = Math.floor((user?.subscription_usage?.input_tokens_used || 0) / 1000);
    //   const outputUsed = Math.floor((user?.subscription_usage?.output_tokens_used || 0) / 1000);

    const { setOpen } = useBuyCreditDialog();
    const { isInitialLoading } = useAuthStore();


    // Calculate beta status
    const getBetaStatus = () => {
        if (!user?.is_beta_user || !user?.beta_end_date) return null;
        
        const endDate = new Date(user.beta_end_date);
        const now = new Date();
        const timeDiff = endDate - now;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        return {
            daysRemaining: Math.max(0, daysRemaining),
            endDate: endDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            isActive: daysRemaining > 0
        };
    };

    const betaStatus = getBetaStatus();

    // Show loading skeleton while fetching fresh data
    if (isInitialLoading) {
        return (
            <TabsContent value="subscription">
                <Card className="tabsContent">
                    <CardHeader>
                        <CardTitle className="text-black">Subscription</CardTitle>
                        <CardDescription>Loading subscription information...</CardDescription>
                    </CardHeader>
                    <CardContent className="settings_cardContent space-y-5">
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-32" />
                    </CardFooter>
                </Card>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="subscription">
            <Card className="tabsContent">
                <CardHeader>
                    <CardTitle className="text-black">Subscription</CardTitle>
                    <CardDescription>Update your subscription plan</CardDescription>
                </CardHeader>

                <CardContent className="settings_cardContent space-y-5">
                    {/* Beta Status Section */}
                    {betaStatus && (
                        <>
                            <div className="settings_cardRow">
                                <Label htmlFor="beta-status">Trial Status</Label>
                                <p className="settings_cardRow_content">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        betaStatus.isActive 
                                            ? betaStatus.daysRemaining <= 7 
                                                ? 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-gray-100' 
                                                : 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-gray-100'
                                            : 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-gray-100'
                                    }`}>
                                        {betaStatus.isActive 
                                            ? `${user?.beta_plan} Beta Trial` 
                                            : 'Beta Trial Expired'
                                        }
                                    </span>
                                </p>
                            </div>

                            <div className="settings_cardRow">
                                <Label htmlFor="trial-ends">Trial Ends</Label>
                                <p className="settings_cardRow_content">
                                    {betaStatus.endDate}
                                    {betaStatus.isActive && (
                                        <span className={`ml-2 text-sm font-semibold ${
                                            betaStatus.daysRemaining <= 3 
                                                ? 'text-red-700 dark:text-red-400' 
                                                : betaStatus.daysRemaining <= 7 
                                                    ? 'text-orange-700 dark:text-orange-400' 
                                                    : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            ({betaStatus.daysRemaining} day{betaStatus.daysRemaining !== 1 ? 's' : ''} remaining)
                                        </span>
                                    )}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Current Subscription Plan */}
                    <div className="settings_cardRow">
                        <Label htmlFor="current">Current Plan</Label>
                        <p className="settings_cardRow_content">
                            {!user?.is_active ? (
                                "Inactive"
                            ) : user?.subscription_plan ? (
                                `${user.subscription_plan} plan`
                            ) : betaStatus && betaStatus.isActive ? (
                                "Beta Trial"
                            ) : (
                                "No active plan"
                            )}
                            {betaStatus && betaStatus.isActive && (
                                <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                                    (+ {user?.beta_plan} beta access)
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="settings_cardRow">
                        <Label htmlFor="credits" className="flex items-center gap-1">
                            Current Credit Balance
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info size={16} className="text-muted-foreground cursor-pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent className="text-sm w-[280px]">
                                    <p className="mb-1 font-medium">Detailed Quota Info</p>
                                    <div className="text-muted-foreground space-y-1">
                                        <p>
                                            Input tokens: <strong>{user?.subscription_quota?.input_tokens}</strong>
                                        </p>
                                        <p>
                                            Output tokens: <strong>{user?.subscription_quota?.output_tokens}</strong>
                                        </p>
                                        <p>
                                            Input used: <strong>{user?.subscription_usage?.input_tokens_used || 0}</strong>
                                        </p>
                                        <p>
                                            Output used: <strong>{user?.subscription_usage?.output_tokens_used || 0}</strong>
                                        </p>
                                        <p className="pt-1 text-xs text-gray-500">
                                            1 credit = 1,000 tokens
                                            {betaStatus && betaStatus.isActive && (
                                                <span className="block">Beta trial includes full quota</span>
                                            )}
                                        </p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </Label>
                        <p className="settings_cardRow_content text-muted-foreground">
                            available: <span className="font-bold">{inputCredits} credits</span>
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <div className="flex gap-2 w-full">
                        {betaStatus && betaStatus.isActive ? (
                            // Beta users with active trial
                            <>
                                <Button
                                    disabled
                                    className="fogBtn opacity-50 cursor-not-allowed"
                                    title="Cannot subscribe while beta trial is active"
                                >
                                    Subscribe After Trial Ends
                                </Button>
                                {betaStatus.daysRemaining <= 7 && (
                                    <Button
                                        onClick={() => {
                                            // Store intent to subscribe after trial
                                            console.log('[SubscriptionTab] User wants to subscribe after trial');
                                            openSubDialog();
                                        }}
                                        className="fogBtn"
                                    >
                                        Schedule Subscription
                                    </Button>
                                )}
                            </>
                        ) : (
                            // Non-beta users or expired beta
                            <>
                                <Button onClick={openSubDialog} className="fogBtn">
                                    {user?.is_active ? "Change Plan" : "Subscribe"}
                                </Button>
                                <Button onClick={setOpen} className="fogBtn alt">
                                    Buy Credits
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Warning messages */}
                    {betaStatus && betaStatus.isActive && (
                        <div className="w-full text-sm">
                            {betaStatus.daysRemaining <= 7 ? (
                                <p className="text-orange-600 dark:text-orange-400 font-medium">
                                    ⏰ Trial expires in {betaStatus.daysRemaining} day{betaStatus.daysRemaining !== 1 ? 's' : ''}!
                                    {user?.subscription_plan && ` Your ${user.subscription_plan} plan will activate automatically.`}
                                </p>
                            ) : (
                                <p className="text-blue-600 dark:text-blue-400">
                                    ℹ️ Beta trial active. Subscription options available after trial ends.
                                </p>
                            )}
                        </div>
                    )}
                </CardFooter>
            </Card>
            <BuyCreditDialog />
        </TabsContent>
    );
}
