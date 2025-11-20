import React, { useState } from "react";
import {
  Search,
  User,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Mentor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  location: string;
  bio: string;
  availability: "Available" | "Limited" | "Full";
  mentees: number;
  maxMentees: number;
  imageUrl: string;
}

interface MentorSearchProps {
  onConnect?: (mentorId: string) => void;
}

const MentorSearch = ({ onConnect = () => {} }: MentorSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // Mock data for mentors
  const mentors: Mentor[] = [
    {
      id: "M001",
      name: "Prof. Emmanuel Mutale",
      title: "Senior Urban Planner",
      specialization: "Spatial Planning",
      experience: "15 years",
      location: "Lusaka",
      bio: "Professor of Urban Planning with extensive experience in spatial planning and urban development. Has worked on major urban renewal projects across Zambia and served as a consultant for international organizations.",
      availability: "Available",
      mentees: 3,
      maxMentees: 5,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel",
    },
    {
      id: "M002",
      name: "Dr. Charity Mumba",
      title: "Environmental Planning Specialist",
      specialization: "Environmental Planning",
      experience: "12 years",
      location: "Kitwe",
      bio: "Environmental planning expert with a PhD in Environmental Science. Specializes in sustainable development and environmental impact assessments for urban and rural planning projects.",
      availability: "Full",
      mentees: 5,
      maxMentees: 5,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charity",
    },
    {
      id: "M003",
      name: "Eng. Robert Chanda",
      title: "Economic Development Planner",
      specialization: "Socio-economic Planning",
      experience: "10 years",
      location: "Ndola",
      bio: "Experienced in socio-economic planning with a focus on economic development strategies for municipalities. Has helped develop economic growth plans for several districts in Zambia.",
      availability: "Available",
      mentees: 2,
      maxMentees: 4,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    },
    {
      id: "M004",
      name: "Ms. Patricia Banda",
      title: "Urban Design Specialist",
      specialization: "Spatial Planning",
      experience: "8 years",
      location: "Livingstone",
      bio: "Specializes in urban design and public space planning. Has worked on revitalization projects for historic areas and public spaces in major Zambian cities.",
      availability: "Limited",
      mentees: 3,
      maxMentees: 4,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia",
    },
    {
      id: "M005",
      name: "Mr. David Mulenga",
      title: "Regional Planning Consultant",
      specialization: "Socio-economic Planning",
      experience: "14 years",
      location: "Kabwe",
      bio: "Expert in regional planning and rural development. Has extensive experience working with local governments to develop comprehensive regional development plans.",
      availability: "Available",
      mentees: 1,
      maxMentees: 3,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "M006",
      name: "Dr. Sarah Tembo",
      title: "Conservation Planning Specialist",
      specialization: "Environmental Planning",
      experience: "11 years",
      location: "Lusaka",
      bio: "Specializes in conservation planning and natural resource management. Has worked on projects to integrate environmental conservation into urban and regional planning frameworks.",
      availability: "Limited",
      mentees: 2,
      maxMentees: 3,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  ];

  // Filter mentors based on search term and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      specializationFilter === "all" ||
      mentor.specialization
        .toLowerCase()
        .includes(specializationFilter.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" &&
        (mentor.availability === "Available" ||
          mentor.availability === "Limited"));

    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConnect = () => {
    if (selectedMentor) {
      onConnect(selectedMentor.id);
      alert(
        `Request sent to connect with ${selectedMentor.name}. They will be notified of your interest.`,
      );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Find a Mentor</h2>
        <p className="text-gray-600">
          Connect with experienced planners who can guide you in your
          professional journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search and Filters */}
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, specialization, or keywords"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={specializationFilter}
                onValueChange={setSpecializationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="spatial">Spatial Planning</SelectItem>
                  <SelectItem value="environmental">
                    Environmental Planning
                  </SelectItem>
                  <SelectItem value="socio-economic">
                    Socio-economic Planning
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available Mentors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mentor List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  className={`cursor-pointer transition-all ${selectedMentor?.id === mentor.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                  onClick={() => handleMentorSelect(mentor)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={mentor.imageUrl}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <BookOpen className="h-3 w-3" />
                            {mentor.specialization}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Award className="h-3 w-3" />
                            {mentor.experience}
                          </Badge>
                          <Badge
                            variant={
                              mentor.availability === "Available"
                                ? "default"
                                : mentor.availability === "Limited"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="flex items-center gap-1"
                          >
                            {mentor.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="lg:col-span-2 p-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No mentors found matching your search criteria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mentor Details */}
        <div className="lg:col-span-1">
          {selectedMentor ? (
            <Card>
              <CardHeader>
                <CardTitle>Mentor Profile</CardTitle>
                <CardDescription>
                  Detailed information about your selected mentor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={selectedMentor.imageUrl}
                      alt={selectedMentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xl">{selectedMentor.name}</h3>
                  <p className="text-gray-600">{selectedMentor.title}</p>
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">Specialization:</span>
                    <span>{selectedMentor.specialization}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-medium">Experience:</span>
                    <span>{selectedMentor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Location:</span>
                    <span>{selectedMentor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">Mentees:</span>
                    <span>
                      {selectedMentor.mentees} of {selectedMentor.maxMentees}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-gray-600">{selectedMentor.bio}</p>
                </div>

                <div className="pt-3">
                  <h4 className="font-medium mb-2">Availability Status</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedMentor.availability === "Available"
                          ? "default"
                          : selectedMentor.availability === "Limited"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-sm"
                    >
                      {selectedMentor.availability}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {selectedMentor.availability === "Available"
                        ? "Open to new mentees"
                        : selectedMentor.availability === "Limited"
                          ? "Limited capacity for new mentees"
                          : "Not accepting new mentees at this time"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={selectedMentor.availability === "Full"}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Request Mentorship
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="font-medium text-lg mb-2">Select a Mentor</h3>
                <p className="text-gray-500 text-sm">
                  Click on a mentor from the list to view their detailed profile
                  and connect with them
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSearch;
