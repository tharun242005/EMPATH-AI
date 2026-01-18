import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { ParticleWaves } from '../components/ParticleWaves';
import { Heart, Shield, Brain, Scale, Lock, Sparkles, ArrowRight, Mail } from 'lucide-react';
import handsImage from 'figma:asset/bf295781ccf2e5721590339d4c2401177ef9419d.png';

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B3F72] via-[#C27691] to-[#5D8AA8] relative overflow-hidden">
      <ParticleWaves />
      <FloatingOrbs />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-20">
        {/* Subtle Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${handsImage})` }}
        />

        {/* Lens flare effects */}
        <div className="lens-flare" style={{ top: '10%', left: '20%' }} />
        <div className="lens-flare" style={{ bottom: '20%', right: '15%' }} />

        {/* Floating Auth Buttons */}
        <div className="absolute top-6 right-4 sm:right-8 flex flex-col sm:flex-row gap-3 z-20">
          <Link to="/login">
            <Button 
              variant="ghost"
              className="px-5 py-2 rounded-lg bg-transparent border border-white/40 text-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button 
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:opacity-90 transition-all"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge - 20% smaller */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#FFE6A7]" />
              <span className="text-white text-sm font-semibold">AI That Listens, Understands, and Cares 💜</span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight tracking-tight"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
            >
              AI That Listens
            </motion.h1>
            
            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
            >
              Your 24×7 emotional, mental, and legal companion — private, kind, and intelligent. 
              Experience compassionate support whenever you need it most.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center mb-12"
            >
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="group bg-white text-[#4B3F72] hover:bg-white/90 text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(255,230,167,0.6)] transition-all duration-300 hover:scale-105"
                >
                  <Heart className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 text-white/80"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">Privacy-First</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <span className="text-sm">AI-Driven</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm">Always Listening</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4B3F72] via-[#C27691] to-[#5D8AA8] bg-clip-text text-transparent">
              Why Choose EmpathAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with advanced AI and deep understanding of human emotions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                color: '#C27691',
                gradient: 'from-[#C27691] to-[#FFB6A3]',
                title: 'Emotional Support',
                description: 'Empathetic AI that understands your feelings and provides compassionate responses.',
              },
              {
                icon: Brain,
                color: '#5D8AA8',
                gradient: 'from-[#5D8AA8] to-[#4B3F72]',
                title: 'Mental Wellness',
                description: 'Evidence-based techniques and gentle guidance for your mental health journey.',
              },
              {
                icon: Scale,
                color: '#4B3F72',
                gradient: 'from-[#4B3F72] to-[#6C4B8C]',
                title: 'Legal Guidance',
                description: 'Informational support on harassment, rights, and legal resources when you need them.',
              },
              {
                icon: Shield,
                color: '#6C4B8C',
                gradient: 'from-[#6C4B8C] to-[#C27691]',
                title: 'Privacy First',
                description: 'End-to-end privacy. Your conversations stay between you and our AI.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-3d group"
              >
                <div className="glass-card p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-[#4B3F72] to-[#C27691]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Ready to Feel Heard?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands who trust EmpathAI for compassionate support and guidance.
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-[#4B3F72] hover:bg-white/90 text-xl px-12 py-8 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-6 h-6 mr-3" fill="currentColor" />
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}