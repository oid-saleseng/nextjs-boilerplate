import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
