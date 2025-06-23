export const dynamic = "force-dynamic";

import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-[#5A0001]">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
