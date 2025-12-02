"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { createUser } from "@/actions/createUser";
import { signIn } from "next-auth/react";
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpBody = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpBody>({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Account created successfully!", {
        description: "Please sign in to continue.",
      });
      router.push("/signin");
    },
    onError: (error) => {
      toast.error("Sign-up failed", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: SignUpBody) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-xs p-5 bg-white border rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              className="text-xs h-9"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="text-xs h-9"
              {...register("email")}
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
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-xs h-9"
            disabled={mutation.isPending}           >
            {mutation.isPending ? (
              <>
                <p>Signing up...</p>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="text-xs text-center">
            Already have an account?
            <Link className="underline ml-1" href={"/signin"}>
              Signin
            </Link>
          </div>
          <div className="border-t pt-2"></div>

        </form>
        <Button
          className="w-full pointer-cursor"
          onClick={async () => {
            await signIn("google");
          }}
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            className="w-[18px] mr-3"
          ></img>
          Google
        </Button>
      </div>
    </div>
  );
}
