# العقد الذكي والتكامل | Smart Contract Integration

## 📝 مواصفات العقد الذكي | Smart Contract Specifications

### الدوال المطلوبة | Required Functions

```solidity
// 1. إصدار شهادة جديدة
function issueCertificate(
  string memory studentName,
  string memory studentID,
  string memory specialization,
  uint256 graduationYear,
  string memory ipfsCID
) public onlyIssuer returns (bytes32 certificateID)

// 2. التحقق من الشهادة
function verifyCertificate(
  bytes32 certificateID
) public view returns (
  string memory studentName,
  bool isValid,
  uint256 issueDate
)

// 3. إلغاء الشهادة (اختياري)
function revokeCertificate(
  bytes32 certificateID
) public onlyIssuer

// 4. الحصول على بيانات الشهادة
function getCertificateData(
  bytes32 certificateID
) public view returns (Certificate memory)
```

### بنية البيانات | Data Structure

```solidity
struct Certificate {
  bytes32 id;
  string studentName;
  string studentID;
  string specialization;
  uint256 graduationYear;
  uint256 issueDate;
  string ipfsCID;
  address issuer;
  bool isValid;
  bool isRevoked;
}

mapping(bytes32 => Certificate) public certificates;
mapping(address => bool) public issuers;
```

## 🔌 التكامل مع React | React Integration

### 1. إنشاء Web3 Service

```typescript
// src/services/Web3Service.ts

import { ethers } from 'ethers';
import CONTRACT_ABI from '../contracts/CertificateVerification.json';

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.REACT_APP_RPC_URL
    );
    this.contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS!,
      CONTRACT_ABI,
      this.provider
    );
  }

  // الاتصال بمحفظة المستخدم
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    
    this.signer = new ethers.BrowserProvider(window.ethereum).getSigner();
    return account;
  }

  // إصدار شهادة
  async issueCertificate(
    studentName: string,
    studentID: string,
    specialization: string,
    graduationYear: number,
    ipfsCID: string
  ) {
    if (!this.signer) throw new Error('Wallet not connected');
    
    const contractWithSigner = this.contract.connect(this.signer);
    const tx = await contractWithSigner.issueCertificate(
      studentName,
      studentID,
      specialization,
      graduationYear,
      ipfsCID
    );
    
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }

  // التحقق من الشهادة
  async verifyCertificate(certificateID: bytes32) {
    const certificate = await this.contract.getCertificateData(certificateID);
    return {
      studentName: certificate.studentName,
      specialization: certificate.specialization,
      graduationYear: certificate.graduationYear,
      issueDate: new Date(certificate.issueDate * 1000),
      isValid: certificate.isValid && !certificate.isRevoked,
      ipfsCID: certificate.ipfsCID,
    };
  }
}

export const web3Service = new Web3Service();
```

### 2. إنشاء Wallet Context

```typescript
// src/contexts/WalletContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { web3Service } from '../services/Web3Service';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      const connectedAccount = await web3Service.connectWallet();
      setAccount(connectedAccount);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
```

### 3. تحديث CertificateService

```typescript
// src/utils/certificateService.ts

import { web3Service } from '../services/Web3Service';

export const CertificateService = {
  // إصدار شهادة
  issueCertificate: async (data: IssueCertificateData) => {
    try {
      // إصدار على البلوكشين
      const txHash = await web3Service.issueCertificate(
        data.studentName,
        data.studentID,
        data.specialization,
        data.graduationYear,
        data.ipfsCID
      );

      return {
        success: true,
        transactionHash: txHash,
        certificateID: 'CERT-' + Date.now(),
      };
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      throw error;
    }
  },

  // التحقق من الشهادة
  verifyCertificate: async (certificateID: string) => {
    try {
      return await web3Service.verifyCertificate(certificateID);
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      return null;
    }
  },
};
```

## 🌐 متغيرات البيئة | Environment Variables

```bash
# .env.local

# Blockchain
REACT_APP_RPC_URL=https://rpc.ankr.com/eth
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_NETWORK_ID=1

# IPFS
REACT_APP_IPFS_API=https://ipfs.infura.io:5001
REACT_APP_IPFS_GATEWAY=https://ipfs.io

# API
REACT_APP_API_URL=https://api.example.com
```

## 📦 IPFS Integration

### تحميل الملف إلى IPFS

```typescript
// src/services/IPFSService.ts

import { create } from 'ipfs-http-client';

const ipfs = create({
  url: process.env.REACT_APP_IPFS_API,
});

export const IPFSService = {
  uploadFile: async (file: File) => {
    try {
      const result = await ipfs.add(file);
      return {
        cid: result.cid.toString(),
        url: `https://ipfs.io/ipfs/${result.cid}`,
      };
    } catch (error) {
      console.error('Failed to upload to IPFS:', error);
      throw error;
    }
  },

  getFile: async (cid: string) => {
    return `https://ipfs.io/ipfs/${cid}`;
  },
};
```

### في صفحة إصدار الشهادة

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    // 1. رفع الملف إلى IPFS
    const ipfsResult = await IPFSService.uploadFile(formData.pdfFile!);

    // 2. إصدار الشهادة على البلوكشين
    const certResult = await CertificateService.issueCertificate({
      studentName: formData.studentName,
      studentID: formData.studentID,
      specialization: formData.specialization,
      graduationYear: formData.graduationYear,
      ipfsCID: ipfsResult.cid,
    });

    // 3. حفظ البيانات محلياً
    setIssuedCertificate({
      id: certResult.certificateID,
      ...formData,
      ipfsCID: ipfsResult.cid,
      blockchainHash: certResult.transactionHash,
      isValid: true,
    });

    setLoading(false);
  } catch (error) {
    console.error('Error issuing certificate:', error);
    setLoading(false);
  }
};
```

## 🧪 اختبار التكامل | Testing Integration

### محاكي المحفظة | Mock Wallet

```typescript
// للاختبار بدون metamask

class MockProvider {
  async request({ method }: { method: string }) {
    if (method === 'eth_requestAccounts') {
      return ['0x1234567890123456789012345678901234567890'];
    }
  }
}

// في الاختبارات
window.ethereum = new MockProvider();
```

### اختبارات Unit

```typescript
// src/__tests__/Web3Service.test.ts

import { web3Service } from '../services/Web3Service';

describe('Web3Service', () => {
  it('should issue certificate', async () => {
    const result = await web3Service.issueCertificate(
      'Ahmad',
      'STU-001',
      'CS',
      2024,
      'QmTestCID'
    );
    expect(result).toMatch(/0x[0-9a-f]{64}/);
  });

  it('should verify certificate', async () => {
    const cert = await web3Service.verifyCertificate('0x...');
    expect(cert).toHaveProperty('studentName');
    expect(cert).toHaveProperty('isValid');
  });
});
```

## 🔐 الأمان | Security Considerations

### 1. التحقق من المدخلات

```typescript
// تحقق من البيانات قبل الإرسال
function validateCertificateData(data: any): boolean {
  return (
    data.studentName &&
    data.studentName.length > 0 &&
    data.studentID &&
    data.specialization &&
    data.graduationYear > 1900 &&
    data.graduationYear < 2100
  );
}
```

### 2. التوقيع الرقمي

```typescript
// توقيع البيانات قبل الإرسال
async function signMessage(message: string): Promise<string> {
  const signer = provider.getSigner();
  return signer.signMessage(message);
}
```

### 3. حماية المفاتيح

```typescript
// لا تخزن المفاتيح الخاصة في الكود!
// استخدم متغيرات البيئة والمحافظ

// ❌ خطأ
const privateKey = 'abc123...';

// ✅ صحيح
const privateKey = process.env.PRIVATE_KEY;
```

## 📊 الأحداث | Events

### استماع الأحداث

```typescript
// استماع لإصدار شهادة جديدة
contract.on('CertificateIssued', (certificateID, studentName, event) => {
  console.log(`New certificate: ${certificateID} for ${studentName}`);
  // تحديث الواجهة
});

// استماع لإلغاء شهادة
contract.on('CertificateRevoked', (certificateID, event) => {
  console.log(`Certificate revoked: ${certificateID}`);
  // تحديث الواجهة
});
```

## 🚀 نشر العقد | Deployment

### على شبكات الاختبار

```bash
# Goerli Testnet
RPC: https://goerli.infura.io/v3/YOUR_KEY
BLOCK_EXPLORER: https://goerli.etherscan.io

# Sepolia Testnet
RPC: https://sepolia.infura.io/v3/YOUR_KEY
BLOCK_EXPLORER: https://sepolia.etherscan.io
```

### الخطوات

```bash
1. توزيع العقد على شبكة الاختبار
2. اختبار جميع الوظائف
3. التحقق من العقد على البلوك تشين إكسبلورر
4. تحديث متغيرات البيئة
5. نشر على الشبكة الرئيسية (Mainnet)
```

---

**ملاحظة مهمة: هذا العقد مثال ويجب فحصه بواسطة مراجع أمني قبل النشر على الإنتاج**
