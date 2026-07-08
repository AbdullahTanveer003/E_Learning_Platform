"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShieldCheck, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyCertificate() {
  const params = useParams();
  const code = params.code;

  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCode = async () => {
      try {
        const res = await fetch(`/api/certificates/verify/${code}`);
        const data = await res.json();
        setVerification(data);
      } catch (err) {
        setVerification({ valid: false, error: 'Network error verifying certificate.' });
      } finally {
        setLoading(false);
      }
    };
    verifyCode();
  }, [code]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          {verification?.valid ? (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <ShieldCheck size={40} className="text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificate Verified!</h1>
                <p className="text-gray-500">This is a valid certificate issued by our platform.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-left space-y-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Student Name</span>
                  <p className="font-medium text-gray-900">{verification.certificate.studentName}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Course</span>
                  <p className="font-medium text-gray-900">{verification.certificate.courseTitle}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Issue Date</span>
                  <p className="font-medium text-gray-900">{new Date(verification.certificate.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Certificate Code</span>
                  <p className="font-mono text-gray-600 bg-gray-200 px-2 py-1 rounded inline-block mt-1">
                    {verification.certificate.uniqueCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <XCircle size={40} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Certificate</h1>
                <p className="text-gray-500">{verification?.error || 'This certificate code could not be found or is invalid.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
