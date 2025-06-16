"use client";

import { logOutUser } from "@/apiCalls/authAPI";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAuthStore from "@/store/authStore";
import useLogOutDialogStore from "@/store/useLogOutDialogStore";
import { useRouter } from "next/navigation";
import "./lod.css";


const LogOutDialog = () => {
  const { isOpen, closeDialog } = useLogOutDialogStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const router = useRouter();

  const logOut = () => {
    updateUser(null);

    logOutUser();
    router.push("/sign-off");
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
          <Button className="dialogBtn" onClick={closeDialog}>Not yet</Button>
          <Button className="dialogBtn black" onClick={logOut}>
            Yep, log me out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutDialog;
