import { generateSignString } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import useSusbcriptionDialogStore from '@/store/useSusbcriptionDialogStore';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './ub.css';

export default function UpgradeBanner() {
    const router = useRouter();
    const { openSubDialog } = useSusbcriptionDialogStore();
    const { user } = useAuthStore();

    // Don't show for beta users or non-starter plans
    if (user?.is_beta_user || user?.subscription_plan?.toLowerCase() !== 'starter') {
        return null;
    }

    const onUpgradeClick = () => {
        openSubDialog();
        const signString = generateSignString(user?.organization_name);
        router.push(`/platform/${signString}/settings`);
    };

    return (
        <div onClick={onUpgradeClick} className="upgrade-tag">
            <span className="upgrade-tag-text">
                ⚡ Get Pro to unlock all features
            </span>
            <ChevronRight className="upgrade-tag-icon" size={16} />
        </div>
    );
}
