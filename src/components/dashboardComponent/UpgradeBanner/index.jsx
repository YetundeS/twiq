import { generateSignString } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import useSusbcriptionDialogStore from '@/store/useSusbcriptionDialogStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './ub.css'; // Import the CSS file

export default function UpgradeBanner() {
    const [visible, setVisible] = useState(false);

    const router = useRouter();
    const { openSubDialog } = useSusbcriptionDialogStore();
    const { user } = useAuthStore()


    useEffect(() => {
        if (user?.subscription_plan.toLowerCase() !== 'starter') return;
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
    }, [user]);


    const onUpgradeClick = () => {
        openSubDialog();
        const signString = generateSignString(user?.organization_name);
        router.push(`/platform/${signString}/settings`);
    };

    return (
        <div onClick={onUpgradeClick} className={`upgrade-banner ${visible ? 'visible' : ''}`}>
            <div className="upgrade-content">
                <span className="upgrade-text">
                    Get Pro to unlock all features
                </span>
                <button className="upgrade-button">
                    Upgrade
                </button>
            </div>
        </div>
    );
}
