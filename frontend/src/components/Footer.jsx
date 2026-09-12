import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Award, Heart } from 'lucide-react';

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
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                SmartSchool
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students through academic rigor, digital innovation, and holistic development. Recognized among top institutions for academic excellence.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                CBSE Affiliated #213098
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ISO 9001:2015
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Campus</a></li>
              <li><a href="#academics" className="hover:text-white transition-colors">Academics & Curricula</a></li>
              <li><a href="#facilities" className="hover:text-white transition-colors">Campus Facilities</a></li>
              <li><a href="#faculty" className="hover:text-white transition-colors">Faculty Directory</a></li>
              <li><a href="#notices" className="hover:text-white transition-colors">School Notices</a></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Portals & Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Faculty Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student & Parent Portal</Link></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">Online Admissions 2026</a></li>
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
                <span>14 Knowledge Park Boulevard, Pune, Maharashtra 411001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 20 4912 3400</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>admissions@smartschool.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartSchool System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern MERN architecture <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
