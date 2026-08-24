import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Shield, ArrowLeft, Lock, Eye, Database, UserX } from 'lucide-react';
import { Button } from '../components/ui/button';

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#C27691] mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4B3F72] to-[#C27691] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last Updated: November 6, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="glass-card">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[#4B3F72]" />
                  Your Privacy Matters
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At EmpathAI, we take your privacy seriously. This Privacy Policy explains how we handle your data
                  and protect your personal information when you use our emotional, mental, and legal companion service.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#4B3F72]" />
                  Data Collection & Storage
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>No Message Storage:</strong> Your conversations with EmpathAI are not stored on our servers. Messages are processed in real-time and immediately discarded after analysis.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Anonymous Analytics:</strong> We only collect anonymized, aggregated metadata such as emotion trends and usage patterns to improve our service. This data cannot be traced back to you.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Account Information:</strong> We store your email address and authentication credentials securely to enable account access. This information is encrypted and never shared with third parties.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Local Storage:</strong> Some preferences and settings are stored locally in your browser for convenience. You can clear this data anytime from the Settings page.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#4B3F72]" />
                  Security Measures
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>End-to-End Encryption:</strong> All communications between you and EmpathAI are encrypted using industry-standard protocols.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Secure Infrastructure:</strong> Our servers are hosted on secure cloud infrastructure with regular security audits and monitoring.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>No Third-Party Sharing:</strong> We never sell, rent, or share your personal information with advertisers or other third parties.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#4B3F72]" />
                  How We Use Your Data
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the limited data we collect to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Provide personalized emotional support and responses</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Improve our AI models and service quality</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Detect and prevent abuse or misuse of the service</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Authenticate your account and maintain security</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <UserX className="w-5 h-5 text-[#4B3F72]" />
                  Your Rights
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Access and review any personal information we have about you</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Request deletion of your account and associated data</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Opt-out of any data collection or analytics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Export your data in a portable format</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or how we handle your data, 
                  please contact us at:{' '}
                  <a 
                    href="mailto:run40081@gmail.com" 
                    className="text-[#4B3F72] hover:underline font-semibold"
                  >
                    run40081@gmail.com
                  </a>
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> This privacy policy may be updated periodically. 
                  We will notify users of any significant changes via email or in-app notifications.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
