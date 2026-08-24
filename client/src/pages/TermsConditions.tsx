import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { FileText, ArrowLeft, AlertCircle, Scale, Heart, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export function TermsConditions() {
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4B3F72] to-[#C27691] bg-clip-text text-transparent">
            Terms & Conditions
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
          {/* Disclaimer Alert */}
          <Card className="glass-card border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Critical Disclaimer</h3>
                  <p className="text-sm text-orange-800">
                    EmpathAI is an AI-powered emotional support tool and does NOT provide professional medical, 
                    psychological, or legal advice. In case of emergency or crisis, please contact local authorities 
                    or crisis helplines immediately (988 for mental health crisis, 911 for emergencies).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using EmpathAI, you accept and agree to be bound by these Terms and Conditions. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#4B3F72]" />
                  Service Description
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  EmpathAI provides:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>AI-powered emotional support and companionship</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Mental wellness guidance and coping strategies</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Informational legal resources and templates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>24/7 conversational assistance</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#4B3F72]" />
                  Limitations & Disclaimers
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Not Professional Advice</h4>
                    <p className="text-gray-700 leading-relaxed">
                      EmpathAI does not provide professional medical, psychological, psychiatric, or legal advice. 
                      Our AI responses are for informational and emotional support purposes only. Always consult 
                      qualified professionals for medical, mental health, or legal matters.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Emergency Situations</h4>
                    <p className="text-gray-700 leading-relaxed">
                      If you are experiencing a medical or mental health emergency, suicidal thoughts, or are in 
                      immediate danger, do NOT rely solely on EmpathAI. Contact emergency services immediately:
                    </p>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      <li className="flex gap-2">
                        <span className="text-[#4B3F72] font-bold">•</span>
                        <span>Emergency: 911</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#4B3F72] font-bold">•</span>
                        <span>Mental Health Crisis: 988</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#4B3F72] font-bold">•</span>
                        <span>National Women Helpline: 1091</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">AI Limitations</h4>
                    <p className="text-gray-700 leading-relaxed">
                      While we strive for accuracy, our AI may occasionally provide incomplete or inaccurate information. 
                      EmpathAI should be used as a complementary tool, not as a replacement for professional care.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">User Responsibilities</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Age Requirement:</strong> You must be at least 18 years old to use EmpathAI. Users under 18 require parental consent.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Accurate Information:</strong> Provide truthful information when creating your account.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Prohibited Use:</strong> Do not use EmpathAI for illegal activities, harassment, or to harm yourself or others.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span><strong>Account Security:</strong> Maintain the confidentiality of your account credentials.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#4B3F72]" />
                  Legal Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The legal resources and templates provided on EmpathAI are for informational purposes only:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Templates are general guides and may not be suitable for your specific situation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>Laws vary by jurisdiction; consult a licensed attorney for legal advice</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#4B3F72] font-bold">•</span>
                    <span>We are not liable for any legal outcomes resulting from use of our templates</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#4B3F72]" />
                  Liability Limitations
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, EmpathAI and its creators shall not be liable for any direct, 
                  indirect, incidental, consequential, or special damages arising from your use of the service. This 
                  includes but is not limited to damages for loss of profits, data, or other intangible losses.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">Modifications to Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms and Conditions at any time. Users will be notified of 
                  significant changes via email or in-app notification. Continued use of EmpathAI after changes 
                  constitutes acceptance of the modified terms.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to terminate or suspend access to our service immediately, without prior notice, 
                  for any reason, including breach of these Terms and Conditions.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms and Conditions, please contact us at:{' '}
                  <a 
                    href="mailto:run40081@gmail.com" 
                    className="text-[#4B3F72] hover:underline font-semibold"
                  >
                    run40081@gmail.com
                  </a>
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Acknowledgment:</strong> By using EmpathAI, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
