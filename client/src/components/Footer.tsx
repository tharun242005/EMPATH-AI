import { Heart, Shield, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-white/95 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#C27691] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4B3F72] to-[#C27691] bg-clip-text text-transparent">
                EmpathAI
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              AI-driven emotional, mental, and legal companion providing compassionate support when you need it most.
            </p>
            <a 
              href="mailto:run40081@gmail.com" 
              className="flex items-center gap-2 text-sm text-[#4B3F72] hover:text-[#6C4B8C] transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              run40081@gmail.com
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Privacy & Security</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#4B3F72]" />
                End-to-end encryption
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4B3F72]" />
                No message storage
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#4B3F72]" />
                Anonymized analytics only
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/legal" className="hover:text-[#4B3F72] transition-colors">
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#4B3F72] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#4B3F72] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-gray-500">
            © 2025 EmpathAI. Owned by Tharun P. Built with care for those who need support. 💜
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            <strong>Disclaimer:</strong> EmpathAI provides informational guidance and emotional support, not professional legal or medical counsel. 
            In case of emergency, please contact local authorities or crisis helplines immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}