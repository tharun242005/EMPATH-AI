import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Settings as SettingsIcon, Volume2, Moon, Sun, Trash2, Shield, ArrowLeft, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { initNotificationMonitor } from '../utils/notificationMonitor';

export function Settings() {
  const { user } = useAuth();
  const [monitoring, setMonitoring] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceSelection, setVoiceSelection] = useState('female');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load settings from localStorage
    const savedMonitoring = localStorage.getItem('empathai_monitoring') === 'true';
    const savedTts = localStorage.getItem('empathai_tts') === 'true';
    const savedDarkMode = localStorage.getItem('empathai_darkMode') === 'true';
    const savedVoice = localStorage.getItem('empathai_voice') || 'female';
    const savedNotifications = localStorage.getItem('notificationsEnabled') === 'true';

    setMonitoring(savedMonitoring);
    setTtsEnabled(savedTts);
    setDarkMode(savedDarkMode);
    setVoiceSelection(savedVoice);
    
    // Sync notifications toggle with actual permission status
    if (savedNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        // Start listener if permission is granted
        initNotificationMonitor().catch(console.error);
      } else {
        // Permission was revoked or denied, update state
        setNotificationsEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
      }
    } else {
      setNotificationsEnabled(savedNotifications);
    }

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleMonitoringChange = (checked: boolean) => {
    setMonitoring(checked);
    localStorage.setItem('empathai_monitoring', checked.toString());
    toast.success(checked ? 'Real-time monitoring enabled' : 'Real-time monitoring disabled');
  };

  const handleTtsChange = (checked: boolean) => {
    setTtsEnabled(checked);
    localStorage.setItem('empathai_tts', checked.toString());
    toast.success(checked ? 'Text-to-speech enabled' : 'Text-to-speech disabled');
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem('empathai_darkMode', checked.toString());
    
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(checked ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handleVoiceChange = (value: string) => {
    setVoiceSelection(value);
    localStorage.setItem('empathai_voice', value);
    toast.success(`Voice set to ${value}`);
  };

  const handleNotificationsChange = async (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('notificationsEnabled', String(checked));

    if (checked) {
      try {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
          toast.error('⚠️ Your browser does not support notifications.');
          setNotificationsEnabled(false);
          localStorage.setItem('notificationsEnabled', 'false');
          return;
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          toast.success('🔔 Notifications enabled — EmpathAI will alert you when needed.');
          // Start background listener
          await initNotificationMonitor();
        } else if (permission === 'denied') {
          toast.error('⚠️ Notifications are blocked — please allow them in browser settings.');
          setNotificationsEnabled(false);
          localStorage.setItem('notificationsEnabled', 'false');
        } else {
          toast('ℹ️ You dismissed the prompt — you can enable notifications anytime.');
          setNotificationsEnabled(false);
          localStorage.setItem('notificationsEnabled', 'false');
        }
      } catch (error) {
        console.error('Notification permission error:', error);
        toast.error('Something went wrong while enabling notifications.');
        setNotificationsEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
      }
    } else {
      toast('🔕 Notifications disabled.');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all local data? This cannot be undone.')) {
      localStorage.removeItem('empathai_consent');
      localStorage.removeItem('empathai_monitoring');
      localStorage.removeItem('empathai_tts');
      localStorage.removeItem('empathai_voice');
      localStorage.removeItem('notificationsEnabled');
      toast.success('Local data cleared successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
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
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4B3F72] to-[#C27691] bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg text-gray-600">
            Customize your EmpathAI experience
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* User Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user?.email || 'Guest'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium">{user ? 'Registered' : 'Guest'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#4B3F72]" />
                  Privacy & Monitoring
                </CardTitle>
                <CardDescription>Control how EmpathAI monitors and analyzes your conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label htmlFor="monitoring" className="cursor-pointer font-semibold">
                      Real-time Emotional Monitoring
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Analyze conversations in real-time to provide timely emotional support
                    </p>
                  </div>
                  <Switch
                    id="monitoring"
                    checked={monitoring}
                    onCheckedChange={handleMonitoringChange}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Privacy Notice:</strong> When enabled, EmpathAI analyzes your messages to detect emotions and provide support. 
                    Only anonymized metadata is stored - your actual messages are never saved.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications & Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#4B3F72]" />
                  Notifications & Alerts
                </CardTitle>
                <CardDescription>
                  Allow EmpathAI to show supportive messages and safety alerts when harassment is detected in your device notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label htmlFor="notifications" className="cursor-pointer font-semibold">
                      Enable Notifications
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive gentle notifications to support you during distressing moments
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationsChange}
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-xs text-gray-600">
                    When enabled, EmpathAI can send gentle notifications to support you during distressing moments. 
                    You'll be prompted to allow notifications in your browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#4B3F72]" />
                  Voice & Audio
                </CardTitle>
                <CardDescription>Configure text-to-speech settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label htmlFor="tts" className="cursor-pointer font-semibold">
                      Enable Text-to-Speech
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Hear AI responses read aloud
                    </p>
                  </div>
                  <Switch
                    id="tts"
                    checked={ttsEnabled}
                    onCheckedChange={handleTtsChange}
                  />
                </div>

                {ttsEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice Selection</Label>
                    <Select value={voiceSelection} onValueChange={handleVoiceChange}>
                      <SelectTrigger id="voice">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female Voice</SelectItem>
                        <SelectItem value="male">Male Voice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how EmpathAI looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <Label htmlFor="darkMode" className="cursor-pointer font-semibold flex items-center gap-2">
                      {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={handleDarkModeChange}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-[#4B3F72]" />
                  Data Management
                </CardTitle>
                <CardDescription>Manage your local data and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Clear all locally stored data including settings, preferences, and consent records. 
                    This will not delete your account.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleClearData}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Local Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
