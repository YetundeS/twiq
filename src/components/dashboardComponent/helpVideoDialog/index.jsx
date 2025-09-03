import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { generateSignString } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import useHelpVideoDialogStore from '@/store/useHelpVideoDialogStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './helpVidDialog.css';

const HelpVidDialog = () => {
    const [organization, setOrganization] = useState("");
    const { isOpen, closeDialog } = useHelpVideoDialogStore();
    const router = useRouter();
    const { user } = useAuthStore();

    const videoUrl = `https://www.youtube.com/embed/${isOpen}`;

    useEffect(() => {
        if (!user) return;
        const signString = generateSignString(user?.organization_name);
        setOrganization(signString);
    }, [user]);

    // 🚧 TEMPORARILY HIDDEN - Don't show dialog when no video available
    if (!isOpen || isOpen.trim() === '') {
        return null;
    }

    return (
        <Dialog onOpenChange={closeDialog} open={!!isOpen}>
            <DialogContent className="flex flex-col items-center gap-4 p-4 sm:max-w-[700px]">
                <div className="w-full aspect-video">
                    <iframe
                        className="w-full h-full rounded-md"
                        src={videoUrl}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className="flex gap-4 justify-end w-full">
                    <Button variant="outline" onClick={() => router.push(`/platform/${organization}/help`)}>
                        See more
                    </Button>
                    <Button onClick={closeDialog}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpVidDialog;
