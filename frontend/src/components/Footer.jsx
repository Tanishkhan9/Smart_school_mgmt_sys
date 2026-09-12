import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Award, Heart, Users } from 'lucide-react';
import { school } from '../data/school';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white tracking-tight block">
                  Alpha Learning Zone
                </span>
                <span className="text-[11px] text-indigo-400 font-semibold tracking-wider uppercase">
                  Nikhrail, Dagarua, Purnea
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students through conceptual clarity, discipline, and modern education in Nikhrail, Dagarua, Purnea, Bihar.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-300">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Co-founders: Mr. Mobin & Mr. Gautam
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Academic Excellence
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About School</a></li>
              <li><a href="#leadership" className="hover:text-white transition-colors">Our Founders</a></li>
              <li><a href="#academics" className="hover:text-white transition-colors">Academics & Classes</a></li>
              <li><a href="#facilities" className="hover:text-white transition-colors">Campus Facilities</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Office</a></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Portals & Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Teacher Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Portal</Link></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">New Admissions 2026</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Campus Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Nikhrail, Dagarua, Purnea, Bihar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 98012 34567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>info@alphalearningzone.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Alpha Learning Zone. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Founded by Mr. Mobin & Mr. Gautam <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
