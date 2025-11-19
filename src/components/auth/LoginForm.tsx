import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

const LoginForm = ({ onSubmit = () => {}, onForgotPassword = () => {} }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check for remembered email on component mount
  React.useEffect(() => {
    try {
      const rememberMe = localStorage.getItem("zipRememberMe");
      const rememberedEmail = localStorage.getItem("zipRememberedEmail");

      if (rememberMe === "true" && rememberedEmail) {
        form.setValue("email", rememberedEmail);
        form.setValue("rememberMe", true);
      }
    } catch (error) {
      console.error("Failed to load remembered credentials:", error);
    }
  }, [form]);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      toast.success('Login successful!');
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white shadow-sm p-6 rounded-lg w-full">
      <div className="space-y-2 text-center">
        <h2 className="font-bold text-2xl tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="top-0 right-0 absolute"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />

            <Button
              type="button"
              variant="link"
              className="px-0 font-normal"
              onClick={onForgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 w-4 h-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
