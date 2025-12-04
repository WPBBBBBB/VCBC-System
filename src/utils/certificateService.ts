// Mock data storage for certificates
// This will be replaced with blockchain integration later

export interface Certificate {
  id: string;
  studentName: string;
  studentID: string;
  specialization: string;
  graduationYear: number;
  issueDate: string;
  ipfsCID: string;
  blockchainHash: string;
  isValid: boolean;
}

// In-memory storage (replace with backend/blockchain later)
const certificateStore = new Map<string, Certificate>();

// Mock seed data
const seedData: Certificate[] = [
  {
    id: 'CERT-2024-001',
    studentName: 'أحمد محمد علي',
    studentID: 'STU-12345',
    specialization: 'علوم الحاسب الآلي',
    graduationYear: 2024,
    issueDate: '2024-06-15',
    ipfsCID: 'QmVt9qRtNURfqmxNsJXvvFhkfb9bP2gVw6SkMkBrVPUqJQ',
    blockchainHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    isValid: true,
  },
  {
    id: 'CERT-2024-002',
    studentName: 'فاطمة أحمد سالم',
    studentID: 'STU-12346',
    specialization: 'الهندسة الكهربائية',
    graduationYear: 2024,
    issueDate: '2024-06-20',
    ipfsCID: 'QmXwTQxiNURfqmxNsJXvvFhkfb9bP2gVw6SkMkBrVPUqJQ',
    blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    isValid: true,
  },
  {
    id: 'CERT-2023-FAKE',
    studentName: 'محمد علي فارس',
    studentID: 'STU-99999',
    specialization: 'إدارة الأعمال',
    graduationYear: 2023,
    issueDate: '2023-06-01',
    ipfsCID: 'QmFakeCIDForTestingPurposes123456789',
    blockchainHash: '0xfakehash123456789',
    isValid: false,
  },
];

// Initialize with seed data
seedData.forEach((cert) => certificateStore.set(cert.id, cert));

export const CertificateService = {
  // Issue a new certificate
  issueCertificate: (data: Omit<Certificate, 'id' | 'issueDate' | 'ipfsCID' | 'blockchainHash' | 'isValid'>) => {
    const id = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const certificate: Certificate = {
      ...data,
      id,
      issueDate: new Date().toISOString().split('T')[0],
      ipfsCID: `QmIPFS${Math.random().toString(36).substr(2, 44).toUpperCase()}`,
      blockchainHash: `0x${Array.from({ length: 64 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')}`,
      isValid: true,
    };
    certificateStore.set(id, certificate);
    return certificate;
  },

  // Verify a certificate
  verifyCertificate: (certificateID: string): Certificate | null => {
    return certificateStore.get(certificateID) || null;
  },

  // Get all certificates (for admin panel - not exposed in UI)
  getAllCertificates: (): Certificate[] => {
    return Array.from(certificateStore.values());
  },

  // Delete certificate (admin only)
  deleteCertificate: (certificateID: string): boolean => {
    return certificateStore.delete(certificateID);
  },
};

export default CertificateService;
