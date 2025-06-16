import { toast } from "sonner";
import { API } from "./authAPI";

export const handleSubscribe = async (priceId, user, updateIsSubscribing) => {
    if (!user) {
        router.push(`/sign-off`);
        return
    }

    if (user?.stripe_customer_id) {
        openBillingPortal(user?.stripe_customer_id, updateIsSubscribing)
    } else {
        callPlanSubscribe(priceId, updateIsSubscribing)
    }

};


async function openBillingPortal(stripeCustomerId, updateIsSubscribing) {
    if (!stripeCustomerId) return;

    try {
        // Get token from localStorage
        const token = localStorage.getItem("access_token");

        const response = await API.post('/stripe/billing-portal', { stripeCustomerId },
            {
                headers: { Authorization: `Bearer ${token}` },
            });

        window.location.href = response.data.url;
    } catch (err) {
        const errMssg =
            err?.response?.data?.error ||
            err?.message ||
            "Error opening billing portal"

        toast.error("Error opening billing portal", {
            description: errMssg,
            style: { border: "none", color: "red" },
        });
    }
        updateIsSubscribing(false)
}

const callPlanSubscribe = async (priceId, updateIsSubscribing) => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem("access_token");

        const response = await API.post('/stripe/create-checkout-session', {
            priceId,
        },
            {
                headers: { Authorization: `Bearer ${token}` },
            });

        const { url } = response.data;
        if (url) {
            window.location.href = url;
        } else {
            throw new Error("Stripe didn't return a url - try again.")
        }

    } catch (err) {
        const errMssg =
            err?.response?.data?.error ||
            err?.message ||
            "Error creating checkout session"

        toast.error("Error creating checkout session", {
            description: errMssg,
            style: { border: "none", color: "red" },
        });
    }
        updateIsSubscribing(false)
}