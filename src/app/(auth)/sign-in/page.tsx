// src/app/(auth)/sign-in/page.tsx
import SignInForm from '@/components/auth/Signin'
import { Suspense } from 'react'
export default function SignInPage() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm/>
      </Suspense>
    </div>
  )
}