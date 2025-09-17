"use client";

import { PricingSection } from "@/components/landingPageComponents/PricingSection";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import useAuthStore from "@/store/authStore";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import "./sd.css";


const SubscriptionDialog = () => {
    const { isSubOpen, subscribingPlanId, closeSubDialog } = useSusbcriptionDialogStore();
    const { user } = useAuthStore();

    // Check if user is beta with active trial
    const getBetaStatus = () => {
        if (!user?.is_beta_user || !user?.beta_end_date) return null;

        const endDate = new Date(user.beta_end_date);
        const now = new Date();
        const timeDiff = endDate - now;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
            daysRemaining: Math.max(0, daysRemaining),
            isActive: daysRemaining > 0,
            endDate: endDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    };

    const betaStatus = getBetaStatus();

    return (
        <Dialog onOpenChange={() => {
            if(!!subscribingPlanId) {
                return
            } else {
                closeSubDialog()
            }
        }} open={isSubOpen}>
            <DialogContent
                aria-describedby="dialog-description"
                className="flex flex-col sm:max-w-[500px] sd_dialogBody"
            >
                <DialogHeader>
                    <DialogTitle>
                        {betaStatus?.isActive ? 'Beta Trial Active' : 'Select a plan'}
                    </DialogTitle>
                </DialogHeader>
                {betaStatus?.isActive ? (
                    <div className="p-6 text-center">
                        <div className="mb-4">
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                Your {user?.beta_plan} beta trial is currently active
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                Trial ends on: <span className="font-semibold">{betaStatus.endDate}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                ({betaStatus.daysRemaining} day{betaStatus.daysRemaining !== 1 ? 's' : ''} remaining)
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                You cannot subscribe to a paid plan while your beta trial is active.
                                Subscription options will become available once your trial expires.
                            </p>
                        </div>
                        {betaStatus.daysRemaining <= 7 && !user?.subscription_plan && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mt-4">
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    ⏰ Your trial expires soon! Come back in {betaStatus.daysRemaining} day{betaStatus.daysRemaining !== 1 ? 's' : ''} to subscribe.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="sbPricing">
                        <PricingSection platform={true} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionDialog;
