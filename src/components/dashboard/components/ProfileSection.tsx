import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useUserStore } from '@/lib/zustand';
import { fireDataBase, fireStorage } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Reusable components
const EditableField = ({ label, value, isEditing, onChange, type = 'text' }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700 text-sm">{label}</label>
    {isEditing ? (
      <input
        type={type}
        className="px-1 py-1 border-gray-300 border-b focus:border-blue-500 focus:outline-none w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      <p className="text-gray-900">{value || '—'}</p>
    )}
  </div>
);

const EditableTextarea = ({ label, value, isEditing, onChange }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700 text-sm">{label}</label>
    {isEditing ? (
      <textarea
        rows={3}
        className="px-1 py-1 border-gray-300 border-b focus:border-blue-500 focus:outline-none w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      <p className="text-gray-900 whitespace-pre-line">{value || '—'}</p>
    )}
  </div>
);

const EditableSelect = ({ label, value, isEditing, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700 text-sm">{label}</label>
    {isEditing ? (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gray-300 border-b focus:border-blue-500 w-full">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <p className="text-gray-900 capitalize">{value || '—'}</p>
    )}
  </div>
);
const ProfileSection = () => {
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const [profileData, setProfileDatas] = useState({
    fullName: `${user.profile.firstName} ${user.profile.middleName} ${user.profile.lastName}`,
    email: user.profile.email,
    phone: user.profile.phone,
    address: `${user.profile.address}, ${user.profile.town}, ${user.profile.province}, Zambia`,
    membershipInfo: {
      expiryDate: user.profile.membershipInfo.expiryDate || '',
      membershipType: user.profile.membershipInfo.membershipType,
      membershipStatus: user.profile.membershipInfo.membershipStatus,
    },
    photoURL: user.profile.photoURL || null,
  });
  const setProfileData = value => {
    setProfileDatas({
      ...profileData,
      ...value,
    });
    setUser({
      ...user,
      profile: {
        ...user.profile,
        ...value,
      },
    });
  };
  const [professionalInfo, setProfessionalInfo] = useState({
    qualification: user.profile.professionalInfo?.qualification || '',
    institution: user.profile.professionalInfo?.institution || '',
    graduationYear: user.profile.professionalInfo?.graduationYear || '',
    specialization: user.profile.professionalInfo?.specialization || '',
    jobTitle: user.profile.professionalInfo?.jobTitle || '',
    currentEmployer: user.profile.professionalInfo?.currentEmployer || '',
    experience: user.profile.professionalInfo?.experience || '',
  });

  const saveProfileChanges = async () => {
    try {
      setLoading(true);
      const userRef = doc(fireDataBase, 'users', user.uid);
      await updateDoc(userRef, {
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        fullName: profileData.fullName,
        membershipInfo: profileData.membershipInfo,
        firstName: profileData.fullName.split(' ')[0] || '',
        lastName: profileData.fullName.split(' ').slice(-1)[0] || '',
        professionalInfo: professionalInfo,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(fireStorage, `profilePhotos/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      () => {},
      error => {
        console.error('Upload error:', error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setProfileData(prev => ({ ...prev, photoURL: downloadURL }));

        const userRef = doc(fireDataBase, 'users', user.uid);
        await updateDoc(userRef, { photoURL: downloadURL });
        await saveProfileChanges();
        setUploading(false);
      }
    );
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">My Profile</h1>
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-xl">Basic Information</h2>
            <div className="flex md:flex-row flex-col gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center bg-slate-200 mb-4 rounded-full w-32 h-32 overflow-hidden">
                  {profileData.photoURL ? (
                    <img
                      src={profileData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-slate-400" />
                  )}
                </div>
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Info Fields */}
              <div className="flex-1 space-y-6">
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <EditableField
                    label="Full Name"
                    value={profileData.fullName}
                    isEditing={isEditing}
                    onChange={val => setProfileData({ ...profileData, fullName: val })}
                  />

                  <EditableSelect
                    label="Membership Type"
                    value={profileData.membershipInfo.membershipType}
                    isEditing={isEditing}
                    onChange={val =>
                      setProfileData({
                        ...profileData,
                        membershipInfo: { ...user.profile.membershipInfo, membershipType: val },
                      })
                    }
                    options={[
                      { value: 'technician', label: 'Technician' },
                      { value: 'associate', label: 'Associate' },
                      { value: 'full', label: 'Full Member' },
                      { value: 'fellow', label: 'Fellow' },
                      { value: 'student', label: 'Student Chapter' },
                      { value: 'postgrad', label: 'Post Grad.' },
                      { value: 'planning-firms', label: 'Planning Firms' },
                      {
                        value: 'educational-ngo',
                        label: 'Educational/Research Institutions or NGO',
                      },
                    ]}
                  />

                  <EditableField
                    label="Email Address"
                    value={profileData.email}
                    isEditing={isEditing}
                    type="email"
                    onChange={val => setProfileData({ ...profileData, email: val })}
                  />

                  <EditableField
                    label="Phone Number"
                    value={profileData.phone}
                    isEditing={isEditing}
                    type="tel"
                    onChange={val => setProfileData({ ...profileData, phone: val })}
                  />

                  {/* Always readonly fields */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Planner ID
                    </label>
                    <p className="text-gray-900">{user.profile.membershipNumber || '—'}</p>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Registration Date
                    </label>
                    <p className="text-gray-900">
                      {user.profile.createdAt.toDate().toLocaleDateString() || '—'}
                    </p>
                  </div>
                </div>

                <EditableTextarea
                  label="Professional Address"
                  value={profileData.address}
                  isEditing={isEditing}
                  onChange={val => setProfileData({ ...profileData, address: val })}
                />

                <div className="flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md transition-colors"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                        disabled={loading}
                        onClick={saveProfileChanges}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>
                      <button className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md transition-colors">
                        Change Password
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-xl">Professional Information</h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <EditableField
                label="Qualification"
                value={professionalInfo.qualification}
                isEditing={isEditing}
                onChange={val => setProfessionalInfo({ ...professionalInfo, qualification: val })}
              />

              <EditableField
                label="Institution"
                value={professionalInfo.institution}
                isEditing={isEditing}
                onChange={val => setProfessionalInfo({ ...professionalInfo, institution: val })}
              />

              <EditableField
                label="Graduation Year"
                value={professionalInfo.graduationYear}
                isEditing={isEditing}
                type="number"
                onChange={val => setProfessionalInfo({ ...professionalInfo, graduationYear: val })}
              />

              <EditableField
                label="Specialization"
                value={professionalInfo.specialization}
                isEditing={isEditing}
                onChange={val => setProfessionalInfo({ ...professionalInfo, specialization: val })}
              />

              <EditableField
                label="Job Title"
                value={professionalInfo.jobTitle}
                isEditing={isEditing}
                onChange={val => setProfessionalInfo({ ...professionalInfo, jobTitle: val })}
              />

              <EditableField
                label="Current Employer"
                value={professionalInfo.currentEmployer}
                isEditing={isEditing}
                onChange={val => setProfessionalInfo({ ...professionalInfo, currentEmployer: val })}
              />

              <EditableField
                label="Experience (years)"
                value={professionalInfo.experience}
                isEditing={isEditing}
                type="number"
                onChange={val => setProfessionalInfo({ ...professionalInfo, experience: val })}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              {isEditing ? (
                <>
                  <button
                    className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md transition-colors"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                    disabled={loading}
                    onClick={saveProfileChanges}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Professional Info
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ProfileSection;
