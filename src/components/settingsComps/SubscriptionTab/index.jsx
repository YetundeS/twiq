import '@/app/platform/[slug]/settings/settings.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useBuyCreditDialog } from '@/store/useBuyCreditDialog';
import { Info } from "lucide-react";
import { BuyCreditDialog } from '../BuyCreditDialog';

export function SubscriptionTab({ user, openSubDialog }) {
    const inputCredits = Math.floor((user?.subscription_quota?.input_tokens || 0) / 1000);
    //   const outputCredits = Math.floor((user?.subscription_quota?.output_tokens || 0) / 1000);
    //   const inputUsed = Math.floor((user?.subscription_usage?.input_tokens_used || 0) / 1000);
    //   const outputUsed = Math.floor((user?.subscription_usage?.output_tokens_used || 0) / 1000);

    const { setOpen } = useBuyCreditDialog()

    return (
        <TabsContent value="subscription">
            <Card className="tabsContent">
                <CardHeader>
                    <CardTitle className="text-black">Subscription</CardTitle>
                    <CardDescription>Update your subscription plan</CardDescription>
                </CardHeader>

                <CardContent className="settings_cardContent space-y-5">
                    <div className="settings_cardRow">
                        <Label htmlFor="current">Current Plan</Label>
                        <p className="settings_cardRow_content">
                            {!user?.is_active ? "Inactive" : `${user?.subscription_plan} plan`}
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

                <CardFooter>
                    <Button onClick={openSubDialog} className="fogBtn">
                        {user?.is_active ? "Change Plan" : "Subscribe"}
                    </Button>
                    <Button onClick={setOpen} className="fogBtn alt">
                        Buy Credits
                    </Button>
                </CardFooter>
            </Card>
            <BuyCreditDialog />
        </TabsContent>
    );
}
