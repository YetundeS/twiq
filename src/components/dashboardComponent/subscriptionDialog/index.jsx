"use client";

import { PricingSection } from "@/components/landingPageComponents/PricingSection";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import "./sd.css";


const SubscriptionDialog = () => {
    const { isSubOpen, subscribingPlanId, closeSubDialog } = useSusbcriptionDialogStore();

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
                    <DialogTitle>Select a plan</DialogTitle>
                </DialogHeader>
                <div className="sbPricing">
                    <PricingSection platform={true} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionDialog;
