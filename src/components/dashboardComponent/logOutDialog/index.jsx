"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import "./lod.css";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/apiCalls/authAPI";
import useLogOutDialogStore from "@/store/useLogOutDialogStore";
import { Button } from "@/components/ui/button";


const LogOutDialog = () => {
  const { isOpen, closeDialog } = useLogOutDialogStore();
    const updateUser = useAuthStore((state) => state.updateUser);
  const router = useRouter();

    const logOut = () => {
    updateUser(null);

    logOutUser();
    router.push("/auth");
    closeDialog()
  };

  return (
    <Dialog onOpenChange={closeDialog} open={isOpen}>
      <DialogContent
        aria-describedby="dialog-description"
        className="flex flex-col sm:max-w-[500px] dialogBody"
      >
        <DialogHeader>
          <DialogTitle>Done already?</DialogTitle>
          <div className="dialogDescription">
            <p>We’ll miss you! Ready to log out for real?</p>
            </div>
        </DialogHeader>
        <DialogFooter className="dialogFooter">
          <Button className="dialogBtn black" variant="outline" onClick={closeDialog}>Not yet</Button>
          <Button className="dialogBtn" onClick={logOut}>
            Yep, log me out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutDialog;
