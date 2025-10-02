import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function MembersManagement({ allUser, isLoading, setIsLoading, fetchAllUser }) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(allUser.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const currentUsers = allUser.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
                      {user.firstName} {user.middleName} {user.lastName}
                    </h2>
                    <p className="text-gray-500 text-xs md:text-sm">
                      Membership #: {user.membershipNumber}
                    </p>
                    <p className="mt-2 text-gray-700 text-sm">📍 {user.address}</p>
                    <p className="text-gray-700 text-sm">📞 {user.phone}</p>
                    <p className="text-gray-700 text-sm">📧 {user.email}</p>
                    <p className="text-gray-700 text-sm">🗓️ Joined: {user.dateJoined}</p>
                  </div>

                  {/* Membership + Professional Info */}
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">
                      Membership Info
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Type: {user.membershipInfo.membershipType}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Specialization: {user.membershipInfo.specialization}
                    </p>
                    <p className="mt-2 text-gray-700 text-sm italic">“{user.membershipInfo.bio}”</p>

                    <h3 className="mt-4 font-medium text-gray-800 text-sm md:text-base">
                      Professional Info
                    </h3>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>🏢 Employer: {user.professionalInfo.currentEmployer}</li>
                      <li>🎓 Institution: {user.professionalInfo.institution}</li>
                      <li>📅 Graduation Year: {user.professionalInfo.graduationYear}</li>
                      <li>🧠 Specialization: {user.professionalInfo.specialization}</li>
                      <li>🧪 Experience: {user.professionalInfo.experience} years</li>
                    </ul>
                  </div>

                  {/* Documents */}
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="mb-2 font-medium text-gray-800 text-sm md:text-base">
                      Documents
                    </h3>
                    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 text-blue-600 text-xs md:text-sm">
                      <a href={user.documents.cvURL} target="_blank" rel="noopener noreferrer">
                        📄 CV
                      </a>
                      {user.documents.idCopyURL ? (
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
                      <a
                        href={user.documents.qualificationCertificateURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🎓 Qualification Certificate
                      </a>
                      <a
                        href={user.documents.professionalReferencesURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📁 Professional References
                      </a>
                      <a
                        href={user.documents.passportPhotoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🖼️ Passport Photo
                      </a>
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
