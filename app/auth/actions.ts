"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "../../lib/auth/server";

export type AuthFormState = {
  error?: string;
  fields?: { email?: string; name?: string };
} | null;

const credentials = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Passwords are at least 8 characters"),
});

const signUpInput = credentials.extend({
  name: z.string().trim().min(1, "Tell us your name"),
});

export async function signInWithEmail(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const fields = { email: String(formData.get("email") ?? "") };
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error:
        flat.formErrors[0] ??
        Object.values(flat.fieldErrors).flat()[0] ??
        "Check your details and try again",
      fields,
    };
  }

  const { error } = await auth.signIn.email(parsed.data);
  if (error) {
    return {
      error: "Couldn’t sign you in. Check your email and password.",
      fields,
    };
  }
  redirect("/journal");
}

export async function signUpWithEmail(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const fields = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error:
        flat.formErrors[0] ??
        Object.values(flat.fieldErrors).flat()[0] ??
        "Check your details and try again",
      fields,
    };
  }

  const { error } = await auth.signUp.email(parsed.data);
  if (error) {
    return {
      error:
        error.message ?? "Couldn’t create your account. Try a different email.",
      fields,
    };
  }
  redirect("/journal");
}

export async function signOut(): Promise<void> {
  await auth.signOut();
  redirect("/");
}
