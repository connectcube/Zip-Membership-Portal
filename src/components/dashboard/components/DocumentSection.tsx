import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/lib/zustand';
import { FileText } from 'lucide-react';

const DocumentsSection = () => {
  const { user } = useUserStore();
  const documentLabels = {
    cvURL: 'CV',
    idCopyURL: 'ID Copy',
    passportPhotoURL: 'Passport Photo',
    professionalReferencesURL: 'Professional References',
    qualificationCertificateURL: 'Qualification Certificate',
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Documents</h1>
      <Tabs defaultValue="my-documents">
        <TabsList className="mb-6">
          <TabsTrigger value="my-documents">My Documents</TabsTrigger>
          <TabsTrigger value="institute-documents">Institute Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
        </TabsList>
        <TabsContent value="my-documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(user.profile.documents)
                  .filter(([_, url]) => url) // Only include non-null URLs
                  .map(([key, url], index) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{documentLabels[key]}</h4>
                          <p className="text-gray-500 text-sm">
                            Uploaded on: {/* You can add a timestamp if available */}
                            {new Date().toISOString().split('T')[0]}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm"
                        >
                          View
                        </a>
                        <a
                          href={url as string}
                          download
                          className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="institute-documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: 'ZIP Constitution',
                    date: '2022-05-10',
                    type: 'PDF',
                  },
                  {
                    id: 2,
                    name: 'Code of Ethics',
                    date: '2022-03-15',
                    type: 'PDF',
                  },
                  {
                    id: 3,
                    name: 'Membership Guidelines',
                    date: '2022-01-20',
                    type: 'PDF',
                  },
                ].map(doc => (
                  <div
                    key={doc.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-gray-500 text-sm">Published on: {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm">
                        View
                      </button>
                      <button className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upload">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Upload New Document</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Document Type
                  </label>
                  <select className="p-2 border rounded-md w-full">
                    <option>Professional Certificate</option>
                    <option>Academic Transcript</option>
                    <option>CV</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Document Title
                  </label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    placeholder="Enter document title"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Upload File
                  </label>
                  <div className="p-6 border-2 border-gray-300 border-dashed rounded-md text-center">
                    <FileText className="mx-auto mb-2 w-10 h-10 text-gray-400" />
                    <p className="mb-2 text-gray-500 text-sm">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-gray-400 text-xs">
                      Supported formats: PDF, DOCX, JPG, PNG (Max 10MB)
                    </p>
                    <input type="file" className="hidden" />
                    <button className="bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md text-white transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                    Upload Document
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default DocumentsSection;
