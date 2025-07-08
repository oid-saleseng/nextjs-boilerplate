"use client";

import { useState, useEffect, Suspense } from "react";
import LoginForm from "./LoginForm";
import register from "./register";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
