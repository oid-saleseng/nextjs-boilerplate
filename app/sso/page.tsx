import { Suspense } from "react";
import SSOLogin from "./SSOLogin";

export default function SSOPage() {
  return (
    <Suspense fallback={<div>Loading SSO Login form...</div>}>
      <SSOLogin />
    </Suspense>
  );
}
