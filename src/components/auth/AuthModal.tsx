import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "login" | "register";
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = false,
  onOpenChange = () => {},
  defaultTab = "login",
  onLoginSuccess = () => {},
  onRegisterSuccess = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleLoginSubmit = (values: any) => {
    // In a real implementation, this would call an authentication service
    console.log("Login submitted:", values);
    // Simulate successful login
    setTimeout(() => {
      onLoginSuccess();
      onOpenChange(false);
    }, 1000);
  };

  const handleRegistrationSubmit = (values: any) => {
    // In a real implementation, this would call a registration service
    console.log("Registration submitted:", values);
    // Simulate successful registration
    setTimeout(() => {
      onRegisterSuccess();
      onOpenChange(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    // In a real implementation, this would open a forgot password flow
    console.log("Forgot password clicked");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              {activeTab === "login" ? "Welcome Back" : "Join ZIP"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription>
            {activeTab === "login"
              ? "Sign in to access your Zambia Institute of Planners account"
              : "Create an account to join the Zambia Institute of Planners"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="m-0">
            <LoginForm
              onSubmit={handleLoginSubmit}
              onForgotPassword={handleForgotPassword}
            />
          </TabsContent>

          <TabsContent
            value="register"
            className="m-0 max-h-[70vh] overflow-y-auto"
          >
            <RegistrationForm onSubmit={handleRegistrationSubmit} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Example usage component that shows how to use the AuthModal
export const AuthModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const openLoginModal = () => {
    setActiveTab("login");
    setIsOpen(true);
  };

  const openRegisterModal = () => {
    setActiveTab("register");
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
        onLoginSuccess={() => console.log("Login successful")}
        onRegisterSuccess={() => console.log("Registration successful")}
      />
    </div>
  );
};

export default AuthModal;
