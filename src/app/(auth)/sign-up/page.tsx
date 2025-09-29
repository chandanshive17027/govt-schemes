
import RegisterPage from '@/components/auth/Signup'
import { Suspense } from 'react'
export default function SignUpPage() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage/>
      </Suspense>
    </div>
  )
}