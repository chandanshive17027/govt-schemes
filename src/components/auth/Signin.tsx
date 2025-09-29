"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"; // ✅ Get the callback
  const error = searchParams.get("error") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // ✅ Automatically redirect to callbackUrl after login
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleCredentialsSignIn = async () => {
    setLocalError("");

    const res = await signIn("credentials", {
      redirect: false, // ✅ Prevent auto redirect — we'll do it manually
      email,
      password,
      callbackUrl,
    });

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setLocalError("Invalid email or password");
    }
  };

  return (
    <main className="grid min-h-screen w-full md:grid-cols-2">
      <div className="bg-white flex flex-col justify-center max-sm:px-18 max-md:px-36 min-md:px-10 max-lg:px-10 min-lg:px-[8rem] 2xl:px-[15rem] py-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-primary-900">
            Login to your account
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {(error || localError) && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {error === "OAuthAccountNotLinked"
              ? "Email already linked with another provider."
              : localError || error || "Failed to sign in."}
          </p>
        )}

        <div className="grid gap-4 pt-8">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            className="bg-blue-900 w-full py-4 my-4 text-center text-white"
            onClick={handleCredentialsSignIn}
            type="submit"
          >
            Login
          </Button>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full my-4"
            onClick={() => signIn("google", { callbackUrl })} // ✅ Pass callback here too
          >
            <FcGoogle />
            Login with Google
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="sign-up" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </div>

      <div className="w-full bg-blue-900 max-md:hidden"></div>
    </main>
  );
}