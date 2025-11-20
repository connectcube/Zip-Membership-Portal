import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { fireDataBase, auth } from '@/lib/firebase'; // adjust path
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

const registerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const AdminRegister = ({ handleStateUpdate, setActiveTab }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userRef = doc(fireDataBase, 'users', values.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // user already exists
        const adminRef = doc(fireDataBase, 'admins', values.email);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const errorMsg = 'You already have an account. Please sign in instead.';
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
        } else {
          // promote to admin
          await setDoc(adminRef, { email: values.email, createdAt: new Date() });
          toast.success('Admin account created successfully!');
          handleStateUpdate({ email: values.email, role: 'admin' });
        }
      } else {
        // new user: create with Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await setDoc(userRef, { email: values.email, uid: cred.user.uid, createdAt: new Date() });
        await setDoc(doc(fireDataBase, 'admins', values.email), {
          email: values.email,
          createdAt: new Date(),
        });
        toast.success('Admin account created successfully!');
        handleStateUpdate({ email: values.email, role: 'admin' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMsg = 'Something went wrong. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          errorMsg = 'This email is already registered. Please use a different email or sign in.';
        } else if (error.message.includes('auth/weak-password')) {
          errorMsg = 'Password is too weak. Please choose a stronger password.';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMsg = 'Please enter a valid email address.';
        } else {
          errorMsg = error.message || 'Something went wrong. Please try again.';
        }
      }
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white shadow-sm p-6 rounded-lg w-full">
      <div className="space-y-2 text-center">
        <h2 className="font-bold text-2xl tracking-tight">Create an account</h2>
        <p className="text-muted-foreground text-sm">Register to access your admin dashboard</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      autoComplete="new-password"
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
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
                <label htmlFor="rememberMe" className="font-medium text-sm">
                  Remember me
                </label>
              </div>
            )}
          />

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 w-4 h-4" />
                Register
              </>
            )}
          </Button>
        </form>
      </Form>
      <Button onClick={() => setActiveTab('login')}>Have an account? Sign In</Button>
    </div>
  );
};

export default AdminRegister;
