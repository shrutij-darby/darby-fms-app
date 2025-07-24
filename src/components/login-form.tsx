'use client'
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputBox } from "./ui/input-box";
import { Button } from "./ui/button";

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: LoginFormValues) => {
    // Handle form submission
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <InputBox
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            description="We'll never share your email with anyone else."
            className="w-full"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />

          <InputBox
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            description="Password must be at least 8 characters."
            className="w-full"
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
