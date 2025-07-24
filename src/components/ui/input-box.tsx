// 'use client'
import React from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export interface InputBoxProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  rules?: RegisterOptions;
  description?: string;
}

export const InputBox: React.FC<InputBoxProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  className,
  rules,
  description,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className={cn("w-64 space-y-2", className)}>
      <div className="space-y-1">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p 
          id={`${name}-error`}
          className="text-xs font-medium text-destructive mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
