import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Scale, FileText, Phone, Copy, Download, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function Legal() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const legalSections = [
    {
      title: 'IPC Section 354 - Assault or Criminal Force on Woman',
      content: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year but which may extend to five years, and shall also be liable to fine.',
      template: 'COMPLAINT UNDER IPC SECTION 354\n\nTo,\nThe Police Commissioner/Inspector,\n[Police Station Name]\n\nSubject: Complaint regarding assault/criminal force\n\nI, [Your Name], resident of [Your Address], wish to file a complaint...',
    },
    {
      title: 'IPC Section 354A - Sexual Harassment',
      content: 'Any man who commits any of the following acts—physical contact and advances involving unwelcome and explicit sexual overtures; a demand or request for sexual favours; showing pornography against the will of a woman; or making sexually coloured remarks, shall be guilty of the offence of sexual harassment.',
      template: 'COMPLAINT UNDER IPC SECTION 354A\n\nTo,\nThe Police Commissioner/Inspector,\n[Police Station Name]\n\nSubject: Complaint regarding sexual harassment\n\nI, [Your Name], resident of [Your Address], wish to file a complaint...',
    },
    {
      title: 'IPC Section 354D - Stalking',
      content: 'Any man who follows a woman and contacts, or attempts to contact such woman to foster personal interaction repeatedly despite a clear indication of disinterest by such woman; or monitors the use by a woman of the internet, email or any other form of electronic communication commits the offence of stalking.',
      template: 'COMPLAINT UNDER IPC SECTION 354D\n\nTo,\nThe Police Commissioner/Inspector,\n[Police Station Name]\n\nSubject: Complaint regarding stalking\n\nI, [Your Name], resident of [Your Address], wish to file a complaint...',
    },
    {
      title: 'IT Act Section 67 - Publishing Obscene Material',
      content: 'Whoever publishes or transmits or causes to be published or transmitted in the electronic form, any material which is lascivious or appeals to the prurient interest or if its effect is such as to tend to deprave and corrupt persons who are likely to read, see or hear the matter contained or embodied in it, shall be punished on first conviction with imprisonment of either description for a term which may extend to three years.',
      template: 'COMPLAINT UNDER IT ACT SECTION 67\n\nTo,\nThe Cyber Crime Cell,\n[City Name]\n\nSubject: Complaint regarding publishing obscene material online\n\nI, [Your Name], wish to file a complaint...',
    },
    {
      title: 'POSH Act - Workplace Sexual Harassment',
      content: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 provides protection against sexual harassment of women at workplace and for the prevention and redressal of complaints of sexual harassment.',
      template: 'COMPLAINT UNDER POSH ACT\n\nTo,\nThe Internal Complaints Committee,\n[Organization Name]\n\nSubject: Complaint regarding workplace sexual harassment\n\nI, [Your Name], employee of [Organization], wish to file a complaint...',
    },
  ];

  const helplines = [
    { name: 'National Women Helpline', number: '1091', description: '24/7 support for women in distress' },
    { name: 'Domestic Violence Helpline', number: '181', description: 'Support for domestic violence victims' },
    { name: 'Cyber Crime Helpline', number: '1930', description: 'Report cybercrime and get assistance' },
    { name: 'Police Emergency', number: '100', description: 'Emergency police assistance' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadTemplate = (title: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Template downloaded!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/chat">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#4B3F72] to-[#C27691] mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4B3F72] to-[#C27691] bg-clip-text text-transparent">
            Legal Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access legal information, complaint templates, and helplines. This is for informational purposes only and does not constitute legal advice.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Important Legal Disclaimer</h3>
                  <p className="text-sm text-orange-800">
                    The information provided here is for educational purposes only and does not constitute legal advice. 
                    For specific legal guidance, please consult with a qualified attorney or legal professional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#4B3F72]" />
            Legal Provisions & Templates
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {legalSections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-lg border px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold text-left">{section.title}</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Complaint Template:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                      {section.template}
                    </pre>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(section.template)}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Template
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadTemplate(section.title, section.template)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Helplines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Phone className="w-6 h-6 text-[#4B3F72]" />
            Emergency Helplines
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {helplines.map((helpline, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{helpline.name}</CardTitle>
                  <CardDescription>{helpline.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#4B3F72]">{helpline.number}</span>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(`tel:${helpline.number}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Steps to File Complaint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Steps to File a Complaint</CardTitle>
              <CardDescription>Follow these steps when filing a formal complaint</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {[
                  'Collect and preserve all evidence (messages, screenshots, emails, etc.)',
                  'Choose the appropriate complaint template from the sections above',
                  'Fill in your personal details and incident information',
                  'Visit the nearest police station or cyber crime cell',
                  'Submit your complaint and receive an FIR/complaint number',
                  'Keep copies of all documents for your records',
                  'Follow up regularly on your complaint status',
                ].map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4B3F72] text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
