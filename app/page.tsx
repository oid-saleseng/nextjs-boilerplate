import { Suspense } from "react";
import ClientRedirectWrapper from "./ClientRedirectWrapper";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientRedirectWrapper />
    </Suspense>
  );
}
