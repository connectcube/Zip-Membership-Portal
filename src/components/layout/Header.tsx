import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Menu, X } from 'lucide-react';
import LoginForm from '../auth/LoginForm';
import RegistrationForm from '../auth/RegistrationForm';
import * as z from "zod";
import { useUserStore } from '@/lib/zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDataBase, fireStorage } from '@/lib/firebase';
import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DialogTitle } from '@radix-ui/react-dialog';
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  town: z.string().min(2, { message: "Town must be at least 2 characters" }),
  province: z
    .string()
    .min(2, { message: "Province must be at least 2 characters" }),
  dateJoined: z.string().min(1, { message: "Date joined is required" }),
});
const professionalInfoSchema = z.object({
  qualification: z.string().min(2, { message: "Qualification is required" }),
  institution: z.string().min(2, { message: "Institution is required" }),
  graduationYear: z.string().min(4, { message: "Graduation year is required" }),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.string().min(1, { message: "Years of experience is required" }),
  specialization: z
    .string()
    .min(2, { message: "Area of specialization is required" }),
});
const membershipInfoSchema = z.object({
  membershipType: z
    .string()
    .min(1, { message: "Please select a membership type" }),
  specialization: z
    .string()
    .min(1, { message: "Please select a specialization" }),
  bio: z
    .string()
    .min(50, { message: "Bio must be at least 50 characters" })
    .max(500, { message: "Bio must not exceed 500 characters" }),
});
const documentUploadSchema = z.object({
  idCopy: z.any().optional(),
  qualificationCertificate: z.any().optional(),
  professionalReferences: z.any().optional(),
  passportPhoto: z.any().refine((val) => val !== undefined, {
    message: "Passport photo is required",
  }),
  cv: z.any().refine((val) => val !== undefined, {
    message: "CV is required",
  }),
});
interface RegistrationFormData {
  personalInfo: z.infer<typeof personalInfoSchema>;
  professionalInfo: z.infer<typeof professionalInfoSchema>;
  membershipInfo: z.infer<typeof membershipInfoSchema>;
  documents: z.infer<typeof documentUploadSchema>;
}
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
// Define interface for AuthModal props to ensure type safety
interface AuthModalProps {
  activeTab?: 'login' | 'register';
  onClose?: () => void;
  setActiveTab?: (tab: 'login' | 'register') => void;
}

// Create a placeholder AuthModal component until the real one is implemented
const AuthModal: React.FC<AuthModalProps> = ({ activeTab = 'login', setActiveTab = () => {} }) => {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      // 1. Authenticate user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    const user = userCredential.user;

    // 2. Fetch user document from Firestore
    const userRef = doc(fireDataBase, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found in Firestore");
    }

    const userData = userSnap.data();

    // 3. Trigger success callback with full user data
    setUser({
      uid: user.uid,
      email: user.email,
      rememberMe: values.rememberMe,
      profile: userData,
    });
    navigate("/dashboard")
    setIsLoading(false);
    setActiveTab(null);
  } catch (error) {
    console.error("Login failed:", error);
    // Optionally show toast or error feedback
  }
};

const handleRegistrationSubmit = async (values: RegistrationFormData) => {
  try {
    setIsLoading(true);
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.personalInfo.email,
      values.personalInfo.password
    );
    const user = userCredential.user;
    const userRef = doc(fireDataBase, "users", user.uid);

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
      values.documents.cv
        ? uploadFile(values.documents.cv, `users/${user.uid}/cv`)
        : null,
      values.documents.idCopy
        ? uploadFile(values.documents.idCopy, `users/${user.uid}/idCopy`)
        : null,
      values.documents.qualificationCertificate
        ? uploadFile(values.documents.qualificationCertificate, `users/${user.uid}/qualificationCertificate`)
        : null,
      values.documents.professionalReferences
        ? uploadFile(values.documents.professionalReferences, `users/${user.uid}/professionalReferences`)
        : null,
    ]);

    const [
      passportPhotoURL,
      cvURL,
      idCopyURL,
      qualificationCertificateURL,
      professionalReferencesURL,
    ] = uploadedFiles;

    const lastUserIndexDoc = await getDoc(doc(fireDataBase, "userIndex", "userNumber"));
    const lastUserIndex = lastUserIndexDoc.data()?.lastUserIndex || 0;

   const currentYear = new Date().getFullYear(); // e.g., 2025
  const paddedIndex = String(lastUserIndex + 1).padStart(3, "0"); // e.g., 001
  const uniqueMembershipNumber = `MZIP${currentYear}${paddedIndex}`;
    // 3. Merge all data into one user document
    const userData = {
      ...values.personalInfo,
      membershipNumber: uniqueMembershipNumber,
      professionalInfo: values.professionalInfo,
      membershipInfo: values.membershipInfo,
      documents: {
        passportPhotoURL,
        cvURL,
        idCopyURL,
        qualificationCertificateURL,
        professionalReferencesURL,
      },
      createdAt: new Date(),
      authRef: userRef, // Optional: for relational queries
    };
    // 4. Save to Firestore
    await setDoc(userRef, userData);
    await updateDoc(doc(fireDataBase, "userIndex", "userNumber"), {lastUserIndex: increment(1)});
    setIsLoading(false);
   setActiveTab("login");
  } catch (error) {
    console.error("Registration failed:", error);
    // Optionally show toast or error feedback
  }
};
  if (activeTab === 'login') {
    return (
      <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
    );
  }
  if (activeTab === 'register') {
    return (
      <div className='h-[80svh] overflow-auto'>
        <RegistrationForm onSubmit={handleRegistrationSubmit} isLoading={isLoading}/>
      </div>
    );
  }
}
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(null);
  const {user} = useUserStore();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="top-0 z-50 sticky bg-gradient-to-r from-blue-300 to-blue-800 shadow-lg border-b border-blue-900 w-full">
      <div className="flex justify-between items-center mx-auto px-4 h-20 container">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="ZIP Logo" className="rounded-full size-16" />
          <span className="font-bold text-white text-xl">Zambia Institute of Planners</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-white">
          <Link to="/" className="font-medium hover:text-primary text-lg">
            Home
          </Link>
          <Link to="https://zambiainstituteofplanners.org.zm/about" className="font-medium hover:text-primary text-lg">
            About
          </Link>
          <Link to="https://zambiainstituteofplanners.org.zm/membership" className="font-medium hover:text-primary text-lg">
            Membership
          </Link>
          <Link to="https://zambiainstituteofplanners.org.zm/contact" className="font-medium hover:text-primary text-lg">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            className="hover:bg-primary border-primary text-primary hover:text-white"
            onClick={() => setIsAuthModalOpen("login")}
          >
            Login
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => setIsAuthModalOpen("register")}
          >
            Register
          </Button>
        </div>

        {/* Auth Modal */}
        <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} >
          <DialogTitle></DialogTitle>
          <DialogContent aria-describedby="Authentication Modal" >
            <AuthModal activeTab={isAuthModalOpen} setActiveTab={setIsAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}  />
          </DialogContent>
        </Dialog>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden hover:bg-gray-100 p-2 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute bg-white shadow-md border-gray-200 border-b w-full transition-all duration-300 ease-in-out',
          isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden py-0'
        )}
      >
        <div className="space-y-4 mx-auto px-4 container">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-primary text-sm">
              Home
            </Link>
            <Link to="/about" className="font-medium hover:text-primary text-sm">
              About
            </Link>
            <Link to="/membership" className="font-medium hover:text-primary text-sm">
              Membership
            </Link>
            <Link to="/events" className="font-medium hover:text-primary text-sm">
              Events
            </Link>
            <Link to="/resources" className="font-medium hover:text-primary text-sm">
              Resources
            </Link>
            <Link to="/contact" className="font-medium hover:text-primary text-sm">
              Contact
            </Link>
          </nav>
        {
          !user&&<div className="flex flex-col space-y-3 pt-4 border-gray-100 border-t">
            <Button
              variant="outline"
              className="hover:bg-primary border-primary w-full text-primary hover:text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 w-full text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Register
            </Button>
          </div>
        }
          
        </div>
      </div>
    </header>
  );
};

export default Header;
