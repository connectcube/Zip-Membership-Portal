import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import * as z from 'zod';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { Button } from '@/components/ui/button';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  increment,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, fireDataBase, fireStorage } from '@/lib/firebase';
import { useUserStore } from '@/lib/zustand';
interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: 'login' | 'register';
  onLoginSuccess?: (data?: any) => void;
  onRegisterSuccess?: (data?: any) => void;
}
// Form validation schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  town: z.string().min(2, { message: 'Town must be at least 2 characters' }),
  province: z.string().min(2, { message: 'Province must be at least 2 characters' }),
  dateJoined: z.string().min(1, { message: 'Date joined is required' }),
});
const professionalInfoSchema = z.object({
  qualification: z.string().min(2, { message: 'Qualification is required' }),
  institution: z.string().min(2, { message: 'Institution is required' }),
  graduationYear: z.string().min(4, { message: 'Graduation year is required' }),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.string().min(1, { message: 'Years of experience is required' }),
  specialization: z.string().min(2, { message: 'Area of specialization is required' }),
});
const membershipInfoSchema = z.object({
  membershipType: z.string().min(1, { message: 'Please select a membership type' }),
  specialization: z.string().min(1, { message: 'Please select a specialization' }),
  bio: z
    .string()
    .min(50, { message: 'Bio must be at least 50 characters' })
    .max(500, { message: 'Bio must not exceed 500 characters' }),
});
const documentUploadSchema = z.object({
  idCopy: z.any().optional(),
  qualificationCertificate: z.any().optional(),
  professionalReferences: z.any().optional(),
  passportPhoto: z.any().refine(val => val !== undefined, {
    message: 'Passport photo is required',
  }),
  cv: z.any().refine(val => val !== undefined, {
    message: 'CV is required',
  }),
});
interface RegistrationFormData {
  personalInfo: z.infer<typeof personalInfoSchema>;
  professionalInfo: z.infer<typeof professionalInfoSchema>;
  membershipInfo: z.infer<typeof membershipInfoSchema>;
  documents: z.infer<typeof documentUploadSchema>;
}
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = false,
  onOpenChange = () => {},
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // 1. Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Fetch user document from Firestore
      const userRef = doc(fireDataBase, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User profile not found in Firestore');
      }

      const userData = userSnap.data();

      // 3. Trigger success callback with full user data
      setUser({
        uid: user.uid,
        email: user.email,
        rememberMe: values.rememberMe,
        profile: userData,
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      // Optionally show toast or error feedback
    }
  };

  const handleRegistrationSubmit = async (values: RegistrationFormData) => {
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.personalInfo.email,
        values.personalInfo.password
      );
      const user = userCredential.user;
      const userRef = doc(fireDataBase, 'users', user.uid);

      // 2. Upload files to Firebase Storage
      const uploadFile = async (file: File, path: string) => {
        const storageRef = ref(fireStorage, path);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      };

      const uploadedFiles = await Promise.all([
        values.documents.passportPhoto
          ? uploadFile(values.documents.passportPhoto, `users/${user.uid}/passportPhoto`)
          : null,
        values.documents.cv ? uploadFile(values.documents.cv, `users/${user.uid}/cv`) : null,
        values.documents.idCopy
          ? uploadFile(values.documents.idCopy, `users/${user.uid}/idCopy`)
          : null,
        values.documents.qualificationCertificate
          ? uploadFile(
              values.documents.qualificationCertificate,
              `users/${user.uid}/qualificationCertificate`
            )
          : null,
        values.documents.professionalReferences
          ? uploadFile(
              values.documents.professionalReferences,
              `users/${user.uid}/professionalReferences`
            )
          : null,
      ]);

      const [
        passportPhotoURL,
        cvURL,
        idCopyURL,
        qualificationCertificateURL,
        professionalReferencesURL,
      ] = uploadedFiles;

      const lastUserIndexDoc = await getDoc(doc(fireDataBase, 'userIndex', 'userNumber'));
      const lastUserIndex = lastUserIndexDoc.data()?.lastUserIndex || 0;

      const currentYear = new Date().getFullYear(); // e.g., 2025
      const paddedIndex = String(lastUserIndex + 1).padStart(3, '0'); // e.g., 001
      const uniqueMembershipNumber = `MZIP${currentYear}${paddedIndex}`;
      // 3. Merge all data into one user document
      const userData = {
        ...values.personalInfo,
        membershipNumber: uniqueMembershipNumber,
        professionalInfo: values.professionalInfo,
        membershipInfo: {
          ...values.membershipInfo,
          membershipNumber: uniqueMembershipNumber,
          membershipExpiry: Timestamp.fromMillis(
            Timestamp.now().toMillis() + 7 * 24 * 60 * 60 * 1000 // add 7 days
          ),
          isActive: true,
          startDate: Timestamp.now(),
        },
        documents: {
          passportPhotoURL,
          cvURL,
          idCopyURL,
          qualificationCertificateURL,
          professionalReferencesURL,
        },
        createdAt: Timestamp.now(),
        authRef: userRef, // Optional: for relational queries
      };
      setActiveTab('login');
      // 4. Save to Firestore
      await setDoc(userRef, userData);
      await setDoc(
        doc(fireDataBase, 'userIndex', 'userNumber'),
        { lastUserIndex: increment(1) },
        { merge: true }
      );
      setIsLoading(false);
    } catch (error) {
      console.error('Registration failed:', error);
      // Optionally show toast or error feedback
    }
  };

  const handleForgotPassword = () => {
    // In a real implementation, this would open a forgot password flow
    console.log('Forgot password clicked');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-0 sm:max-w-[500px] overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="font-bold text-2xl">
              {activeTab === 'login' ? 'Welcome Back' : 'Join ZIP'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {activeTab === 'login'
              ? 'Sign in to access your Zambia Institute of Planners account'
              : 'Create an account to join the Zambia Institute of Planners'}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="m-0">
            <LoginForm
              onSubmit={handleLoginSubmit}
              onForgotPassword={handleForgotPassword}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="register" className="m-0 max-h-[70vh] overflow-y-auto">
            <RegistrationForm onSubmit={handleRegistrationSubmit} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Example usage component that shows how to use the AuthModal
export const AuthModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const openLoginModal = () => {
    setActiveTab('login');
    setIsOpen(true);
  };

  const openRegisterModal = () => {
    setActiveTab('register');
    setIsOpen(true);
  };

  return (
    <div className="flex gap-4">
      <Button onClick={openLoginModal}>Login</Button>
      <Button variant="outline" onClick={openRegisterModal}>
        Register
      </Button>
      <AuthModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        defaultTab={activeTab}
        onLoginSuccess={() => console.log('Login successful')}
        onRegisterSuccess={() => console.log('Registration successful')}
      />
    </div>
  );
};

export default AuthModal;
