"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface SignInForm {
  email: string;
  password: string;
}

export default function Signin() {
  const session = useSession();
  if (session?.status === "authenticated") {
    redirect("/");
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>();

  const onSubmit = async (data: SignInForm) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error === "CredentialsSignin") {
        toast.error("Incorrect password or email address");
      } else if (res?.ok) {
        toast.success("Signed in successfully!");
        window.location.href = '/';
      } else if (res?.error) {
        toast.error(`An error occurred: ${res.error}`);
      }
    } catch (e) {
      console.error("Error occured while signing in", e);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-xs p-5 bg-white border-2 border-gray-400 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="text-xs h-9"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              className="text-xs h-9"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full text-xs text-white h-9 bg-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <p>Signing in...</p>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="text-xs text-center">
            Don&apos;t have an account?
            <Link className="underline ml-1" href="/signup">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}