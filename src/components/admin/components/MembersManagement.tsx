import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MembersManagement({ allUser, isLoading, setIsLoading, fetchAllUser }) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateJoined');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = allUser.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.phone?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.membershipNumber?.toLowerCase().includes(searchLower) ||
        user.membershipInfo?.membershipType?.toLowerCase().includes(searchLower) ||
        user.dateJoined?.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'phone':
          aVal = a.phone || '';
          bVal = b.phone || '';
          break;
        case 'email':
          aVal = a.email || '';
          bVal = b.email || '';
          break;
        case 'membershipNumber':
          aVal = a.membershipNumber || '';
          bVal = b.membershipNumber || '';
          break;
        case 'membershipType':
          aVal = a.membershipInfo?.membershipType || '';
          bVal = b.membershipInfo?.membershipType || '';
          break;
        case 'dateJoined':
        default:
          aVal = a.dateJoined || '';
          bVal = b.dateJoined || '';
          break;
      }

      const comparison = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [allUser, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredAndSortedUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset page when search changes
  const handleSearchChange = value => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <TabsContent value="members">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Member Management</CardTitle>
          <CardDescription className="text-sm md:text-base">
            View and manage all registered members
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Search and Sort Controls */}
          <div className="space-y-4 mb-6">
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by phone, email, membership number, type, or date joined..."
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateJoined">Date Joined</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="membershipNumber">Membership #</SelectItem>
                    <SelectItem value="membershipType">Membership Type</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">A-Z</SelectItem>
                    <SelectItem value="desc">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {searchTerm && (
              <p className="text-gray-600 text-sm">
                Found {filteredAndSortedUsers.length} member(s) matching "{searchTerm}"
              </p>
            )}
          </div>

          {isLoading ? (
            // Skeleton loader (responsive)
            <div className="space-y-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <div
                  key={idx}
                  className="gap-4 grid grid-cols-1 md:grid-cols-2 bg-white shadow-sm p-4 border rounded-lg animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="bg-gray-200 rounded w-3/4 h-5"></div>
                    <div className="bg-gray-200 rounded w-1/2 h-4"></div>
                    <div className="bg-gray-200 rounded w-2/3 h-4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 rounded w-1/3 h-4"></div>
                    <div className="bg-gray-200 rounded w-1/2 h-4"></div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <div className="bg-gray-200 mb-2 rounded w-1/4 h-4"></div>
                    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
                      <div className="bg-gray-200 rounded h-4"></div>
                      <div className="bg-gray-200 rounded h-4"></div>
                      <div className="hidden sm:block bg-gray-200 rounded h-4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentUsers.length > 0 ? (
            <div className="space-y-6">
              {currentUsers.map(user => (
                <div
                  key={user.id}
                  className="gap-6 grid grid-cols-1 md:grid-cols-2 bg-white shadow-sm p-4 border rounded-lg"
                >
                  {/* Personal Info */}
                  <div>
                    <h2 className="font-semibold text-lg md:text-xl">
                      {user.firstName || 'N/A'} {user.middleName || ''} {user.lastName || 'N/A'}
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm">
                      Membership #: {user.membershipNumber || 'Not assigned'}
                    </p>
                    <p className="mt-2 text-gray-700 text-sm">📍 {user.address || 'Address not provided'}</p>
                    <p className="text-gray-700 text-sm">📞 {user.phone || 'Phone not provided'}</p>
                    <p className="text-gray-700 text-sm">📧 {user.email || 'Email not provided'}</p>
                    <p className="text-gray-700 text-sm">🗓️ Joined: {user.dateJoined || 'Date not available'}</p>
                  </div>

                  {/* Membership + Professional Info */}
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">
                      Membership Info
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Type: {user.membershipInfo?.membershipType || 'Not specified'}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Specialization: {user.membershipInfo?.specialization || 'Not specified'}
                    </p>
                    {user.membershipInfo?.bio && (
                      <p className="mt-2 text-gray-700 text-sm italic">
                        “{user.membershipInfo?.bio}”
                      </p>
                    )}

                    <h3 className="mt-4 font-medium text-gray-800 text-sm md:text-base">
                      Professional Info
                    </h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>🏢 Employer: {user.professionalInfo?.currentEmployer || 'Not provided'}</li>
                      <li>🎓 Institution: {user.professionalInfo?.institution || 'Not provided'}</li>
                      <li>📅 Graduation Year: {user.professionalInfo?.graduationYear || 'Not provided'}</li>
                      <li>🧠 Specialization: {user.professionalInfo?.specialization || 'Not provided'}</li>
                      <li>🧪 Experience: {user.professionalInfo?.experience ? `${user.professionalInfo.experience} years` : 'Not provided'}</li>
                    </ul>
                  </div>

                  {/* Documents */}
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="mb-2 font-medium text-gray-800 text-sm md:text-base">
                      Documents
                    </h3>
                    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 text-blue-600 text-xs md:text-sm">
                      {user.documents?.cvURL ? (
                        <a
                          href={user.documents.cvURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 CV
                        </a>
                      ) : (
                        <span className="text-gray-400">📄 CV: Not uploaded</span>
                      )}
                      {user.documents?.idCopyURL ? (
                        <a
                          href={user.documents.idCopyURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🪪 ID Copy
                        </a>
                      ) : (
                        <span className="text-gray-400">🪪 ID Copy: Not uploaded</span>
                      )}
                      {user.documents?.qualificationCertificateURL ? (
                        <a
                          href={user.documents.qualificationCertificateURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🎓 Qualification Certificate
                        </a>
                      ) : (
                        <span className="text-gray-400">🎓 Qualification Certificate: Not uploaded</span>
                      )}
                      {user.documents?.professionalReferencesURL ? (
                        <a
                          href={user.documents.professionalReferencesURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📁 Professional References
                        </a>
                      ) : (
                        <span className="text-gray-400">📁 Professional References: Not uploaded</span>
                      )}
                      {user.documents?.passportPhotoURL ? (
                        <a
                          href={user.documents.passportPhotoURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🖼️ Passport Photo
                        </a>
                      ) : (
                        <span className="text-gray-400">🖼️ Passport Photo: Not uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex sm:flex-row flex-col justify-between items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-gray-600 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No data available</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
