import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Building,
  GraduationCap,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schemas for each step
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
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

interface RegistrationFormProps {
  onSubmit?: (data: RegistrationFormData) => void;
  isOpen?: boolean;
}

interface RegistrationFormData {
  personalInfo: z.infer<typeof personalInfoSchema>;
  professionalInfo: z.infer<typeof professionalInfoSchema>;
  membershipInfo: z.infer<typeof membershipInfoSchema>;
  documents: z.infer<typeof documentUploadSchema>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit = (data) => console.log("Form submitted:", data),
  isOpen = true,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    personalInfo: {} as z.infer<typeof personalInfoSchema>,
    professionalInfo: {} as z.infer<typeof professionalInfoSchema>,
    membershipInfo: {} as z.infer<typeof membershipInfoSchema>,
    documents: {} as z.infer<typeof documentUploadSchema>,
  });

  // Form for personal information (Step 1)
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      town: "",
      province: "",
      dateJoined: "",
    },
  });

  // Form for professional information (Step 2)
  const professionalInfoForm = useForm<z.infer<typeof professionalInfoSchema>>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      qualification: "",
      institution: "",
      graduationYear: "",
      currentEmployer: "",
      jobTitle: "",
      experience: "",
      specialization: "",
    },
  });

  // Form for membership information (Step 3)
  const membershipInfoForm = useForm<z.infer<typeof membershipInfoSchema>>({
    resolver: zodResolver(membershipInfoSchema),
    defaultValues: {
      membershipType: "",
      specialization: "",
      bio: "",
    },
  });

  // Form for document uploads (Step 4)
  const documentUploadForm = useForm<z.infer<typeof documentUploadSchema>>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      idCopy: undefined,
      qualificationCertificate: undefined,
      professionalReferences: undefined,
      passportPhoto: undefined,
      cv: undefined,
    },
  });

  const handlePersonalInfoSubmit = (
    data: z.infer<typeof personalInfoSchema>,
  ) => {
    setFormData({ ...formData, personalInfo: data });
    setStep(2);
  };

  const handleProfessionalInfoSubmit = (
    data: z.infer<typeof professionalInfoSchema>,
  ) => {
    setFormData({ ...formData, professionalInfo: data });
    setStep(3);
  };

  const handleMembershipInfoSubmit = (
    data: z.infer<typeof membershipInfoSchema>,
  ) => {
    setFormData({ ...formData, membershipInfo: data });
    setStep(4);
  };

  const handleDocumentUploadSubmit = (
    data: z.infer<typeof documentUploadSchema>,
  ) => {
    const completeFormData = {
      ...formData,
      documents: data,
    } as RegistrationFormData;

    setFormData(completeFormData);
    onSubmit(completeFormData);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      documentUploadForm.setValue(fieldName as any, e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Register as a Planner
        </h2>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {i}
                </div>
                <span className="text-xs mt-1">
                  {i === 1
                    ? "Personal"
                    : i === 2
                      ? "Professional"
                      : i === 3
                        ? "Membership"
                        : "Documents"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300"
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please provide your personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...personalInfoForm}>
                  <form
                    onSubmit={personalInfoForm.handleSubmit(
                      handlePersonalInfoSubmit,
                    )}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={personalInfoForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  placeholder="John"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  placeholder="Middle Name (Optional)"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  placeholder="Doe"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={personalInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                placeholder="john.doe@example.com"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                placeholder="+260 97X XXX XXX"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                placeholder="123 Main St"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={personalInfoForm.control}
                        name="town"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Town</FormLabel>
                            <FormControl>
                              <Input placeholder="Lusaka" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select province" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="central">
                                    Central
                                  </SelectItem>
                                  <SelectItem value="copperbelt">
                                    Copperbelt
                                  </SelectItem>
                                  <SelectItem value="eastern">
                                    Eastern
                                  </SelectItem>
                                  <SelectItem value="luapula">
                                    Luapula
                                  </SelectItem>
                                  <SelectItem value="lusaka">Lusaka</SelectItem>
                                  <SelectItem value="muchinga">
                                    Muchinga
                                  </SelectItem>
                                  <SelectItem value="northern">
                                    Northern
                                  </SelectItem>
                                  <SelectItem value="north-western">
                                    North-Western
                                  </SelectItem>
                                  <SelectItem value="southern">
                                    Southern
                                  </SelectItem>
                                  <SelectItem value="western">
                                    Western
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={personalInfoForm.control}
                      name="dateJoined"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            When did you first join the organization?
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4">
                      <Button type="submit" className="w-full">
                        Continue
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Professional Information */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Tell us about your professional background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...professionalInfoForm}>
                  <form
                    onSubmit={professionalInfoForm.handleSubmit(
                      handleProfessionalInfoSubmit,
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={professionalInfoForm.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Qualification</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                placeholder="Bachelor of Urban Planning"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={professionalInfoForm.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  placeholder="University of Zambia"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={professionalInfoForm.control}
                        name="graduationYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Graduation Year</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  placeholder="2020"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={professionalInfoForm.control}
                        name="currentEmployer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Employer</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ministry of Planning"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={professionalInfoForm.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Urban Planner" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={professionalInfoForm.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input placeholder="5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={professionalInfoForm.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area of Specialization</FormLabel>
                            <FormControl>
                              <Input placeholder="Urban Design" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit">Continue</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Membership Information */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Membership Information</CardTitle>
                <CardDescription>
                  Select your membership type and provide a brief bio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...membershipInfoForm}>
                  <form
                    onSubmit={membershipInfoForm.handleSubmit(
                      handleMembershipInfoSubmit,
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={membershipInfoForm.control}
                      name="membershipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membership Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select membership type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technician">
                                Technician
                              </SelectItem>
                              <SelectItem value="associate">
                                Associate
                              </SelectItem>
                              <SelectItem value="full">Full Member</SelectItem>
                              <SelectItem value="fellow">Fellow</SelectItem>
                              <SelectItem value="student">
                                Student Chapter
                              </SelectItem>
                              <SelectItem value="postgrad">
                                Post Grad.
                              </SelectItem>
                              <SelectItem value="planning-firms">
                                Planning Firms
                              </SelectItem>
                              <SelectItem value="educational-ngo">
                                Educational/Research Institutions or NGO
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Different membership types have different
                            requirements and fees.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={membershipInfoForm.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spatial">
                                Spatial Planning
                              </SelectItem>
                              <SelectItem value="socioeconomic">
                                Socio-economic Planning
                              </SelectItem>
                              <SelectItem value="environmental">
                                Environmental Planning
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select your primary area of specialization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={membershipInfoForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write a brief professional bio (50-500 characters)"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be visible on your public profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button type="submit">Continue</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Document Upload */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload required documents to complete your registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...documentUploadForm}>
                  <form
                    onSubmit={documentUploadForm.handleSubmit(
                      handleDocumentUploadSubmit,
                    )}
                    className="space-y-4"
                  >
                    <div className="grid gap-4">
                      <div className="border rounded-md p-4">
                        <FormLabel className="block mb-2">ID Copy</FormLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id="idCopy"
                            onChange={(e) => handleFileChange(e, "idCopy")}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("idCopy")?.click()
                            }
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload ID</span>
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {documentUploadForm.watch("idCopy")?.name ||
                              "No file chosen"}
                          </span>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <FormLabel className="block mb-2">
                          Qualification Certificate
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id="qualificationCertificate"
                            onChange={(e) =>
                              handleFileChange(e, "qualificationCertificate")
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("qualificationCertificate")
                                ?.click()
                            }
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload Certificate</span>
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {documentUploadForm.watch(
                              "qualificationCertificate",
                            )?.name || "No file chosen"}
                          </span>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <FormLabel className="block mb-2">
                          Professional References
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id="professionalReferences"
                            onChange={(e) =>
                              handleFileChange(e, "professionalReferences")
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("professionalReferences")
                                ?.click()
                            }
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload References</span>
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {documentUploadForm.watch("professionalReferences")
                              ?.name || "No file chosen"}
                          </span>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <FormLabel className="block mb-2">
                          Passport Photo <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id="passportPhoto"
                            onChange={(e) =>
                              handleFileChange(e, "passportPhoto")
                            }
                            className="hidden"
                            accept="image/*"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("passportPhoto")?.click()
                            }
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload Photo</span>
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {documentUploadForm.watch("passportPhoto")?.name ||
                              "No file chosen"}
                          </span>
                        </div>
                        <p className="text-xs text-red-500 mt-1">
                          {String(documentUploadForm.formState.errors.cv?.message ?? "")}
                        </p>
                      </div>

                      <div className="border rounded-md p-4">
                        <FormLabel className="block mb-2">
                          CV/Resume <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id="cv"
                            onChange={(e) => handleFileChange(e, "cv")}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("cv")?.click()
                            }
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload CV</span>
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {documentUploadForm.watch("cv")?.name ||
                              "No file chosen"}
                          </span>
                        </div>
                        <p className="text-xs text-red-500 mt-1">
                          {String(documentUploadForm.formState.errors.passportPhoto?.message ?? "")}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(3)}
                      >
                        Back
                      </Button>
                      <Button type="submit">Complete Registration</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
