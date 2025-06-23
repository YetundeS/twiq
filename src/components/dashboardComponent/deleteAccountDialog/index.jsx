"use client";

import { deleteUserAccountAPI } from "@/apiCalls/authAPI";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useAuthStore from "@/store/authStore";
import useDeleteAccountStore from "@/store/useDeleteAccountStore";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import "./dad.css";

const DeleteAccountDialog = () => {
    const { isOpen, closeDialog } = useDeleteAccountStore();
    const updateUser = useAuthStore((state) => state.updateUser);
    const router = useRouter();
    const [loading, setLoading] = useState(false)

const handleDeleteAccount = async () => {
  setLoading(true);
  try {
    console.log("Deleting account...");

    toast.success("Account deletion in progress", {
      description: "Hang tight while we remove your data.",
      style: {
        border: "none",
        color: "blue",
      },
    });

    const response = await deleteUserAccountAPI();

    if (response.error) {
      throw new Error(response.error);
    } else {
      toast.success("Account deleted successfully", {
        description: "We hope you change your mind someday.",
        style: {
          border: "none",
          color: "green",
        },
      });
    }
    
    closeDialog();
    
    setTimeout(() => {
      updateUser(null);
      router.push("/sign-off");
    }, 1000);
  } catch (error) {
    toast.error("Something went wrong while deleting your account.", {
      description:
        typeof error === "string"
          ? error
          : error?.message || "Server error.",
      style: {
        border: "none",
        color: "red",
      },
    });
  } finally {
    setLoading(false);
  }
};


    return (
        <Dialog onOpenChange={closeDialog} open={isOpen}>
            <DialogContent
                aria-describedby="dialog-description"
                className="flex flex-col sm:max-w-[500px] dialogBody z-[9999999999999999999999]"
            >
                <DialogHeader>
                    <DialogTitle className="text-red-600">We hate to see you go</DialogTitle>
                    <div className="dialogDescription text-sm">
                        <p>
                            This will permanently delete your account and all associated data.
                            Are you absolutely sure?
                        </p>
                    </div>
                </DialogHeader>
                <DialogFooter className="dialogFooter">
                    <Button variant="outline" className="dialogBtn" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button
                        className="dialogBtn bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleDeleteAccount}
                    >
                        {loading ? (
                            <CircularProgress color="black" size="14px" />
                        ) : (
                            <p>Yes, delete my account</p>
                        )}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAccountDialog;
