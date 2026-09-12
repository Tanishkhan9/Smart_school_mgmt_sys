import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Building2,
  Cpu,
  Trophy,
  Microscope,
  Music,
  CheckCircle2,
  Calendar,
  Bell,
  Phone,
  MapPin,
  Send,
  Clock,
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import api from '../../services/api';

export default function Home() {
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('senior');

  // Admission Form state
  const [admissionForm, setAdmissionForm] = useState({
    studentName: '',
    dateOfBirth: '',
    applyingClass: '10',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    previousSchool: '',
  });
  const [admissionLoading, setAdmissionLoading] = useState(false);
  const [admissionSuccess, setAdmissionSuccess] = useState(false);
  const [admissionError, setAdmissionError] = useState('');

  // Contact Form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    // Load public teachers
    api
      .get('/public/teachers')
      .then((res) => {
        if (res.data?.data) setTeachers(res.data.data);
      })
      .catch(() => {});

    // Load public notices
    api
      .get('/notices')
      .then((res) => {
        if (res.data?.data) {
          const publicOnly = res.data.data.filter(
            (n) => n.audience === 'public' || n.audience === 'all'
          );
          setNotices(publicOnly.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    setAdmissionLoading(true);
    setAdmissionError('');
    setAdmissionSuccess(false);
    try {
      await api.post('/admissions', admissionForm);
      setAdmissionSuccess(true);
      setAdmissionForm({
        studentName: '',
        dateOfBirth: '',
        applyingClass: '10',
        parentName: '',
        phone: '',
        email: '',
        address: '',
        previousSchool: '',
      });
    } catch (err) {
      setAdmissionError(
        err.response?.data?.message || 'Unable to submit application. Please check your details.'
      );
    } finally {
      setAdmissionLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);
    try {
      await api.post('/contact', contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const academicPrograms = {
    primary: {
      title: 'Primary School (Grades 1 – 5)',
      description:
        'Focusing on curiosity-led foundational learning, literacy, cognitive development, arts, and early mathematical reasoning in a nurturing environment.',
      features: [
        'Activity-based experiential learning',
        'Phonics, expressive reading & creative writing',
        'Visual mathematics & problem-solving puzzles',
        'Music, theatre & physical education daily',
      ],
      age: 'Ages 6 to 10',
    },
    middle: {
      title: 'Middle School (Grades 6 – 8)',
      description:
        'Transitioning into disciplined subject mastery, scientific inquiry, critical debate, and introductory coding paradigms.',
      features: [
        'Integrated Science laboratory experiments',
        'Computational thinking & scratch coding',
        'Bilingual language proficiency programs',
        'Inter-school sports leagues & leadership clubs',
      ],
      age: 'Ages 11 to 13',
    },
    senior: {
      title: 'Senior Secondary (Grades 9 – 12)',
      description:
        'Rigorous board examination preparation, advanced STEM/Humanities streams, competitive coaching, and university placement guidance.',
      features: [
        'Dedicated Physics, Chemistry & Biology research labs',
        'CBSE curriculum with competitive test analytics',
        'Career counseling & college portfolio mentorship',
        'National Olympiads and Model United Nations (MUN)',
      ],
      age: 'Ages 14 to 18',
    },
  };

  const facilities = [
    {
      icon: Cpu,
      title: 'Smart Digital Classrooms',
      desc: 'Interactive 85" 4K touch displays, multimedia curriculum integration, and high-speed campus Wi-Fi.',
      tag: 'Digital Campus',
    },
    {
      icon: Microscope,
      title: 'Advanced Science Labs',
      desc: 'Separate state-of-the-art physics, chemistry, and biology laboratories equipped for CBSE practicals.',
      tag: 'Innovation',
    },
    {
      icon: Trophy,
      title: 'Sports Complex & Turf',
      desc: 'FIFA-approved artificial turf, indoor synthetic badminton courts, Olympic swimming pool, and basketball arena.',
      tag: 'Athletics',
    },
    {
      icon: BookOpen,
      title: 'Central Digital Library',
      desc: 'Over 25,000 reference volumes, private study carrels, and unlimited access to JSTOR & EBSCO journals.',
      tag: 'Research',
    },
    {
      icon: Music,
      title: 'Performing Arts & Auditorium',
      desc: 'Acoustically treated 1,000-seat amphitheater for theatre productions, classical concerts, and student MUNs.',
      tag: 'Culture',
    },
    {
      icon: Building2,
      title: 'AI & Robotics Studio',
      desc: 'Equipped with 3D printers, IoT microcontrollers, drone simulators, and Python algorithmic workstations.',
      tag: 'Next-Gen',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Admission Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Admissions Open for Academic Year 2026–2027
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Inspiring Young Minds. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                Shaping Tomorrow’s Leaders.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              SmartSchool combines world-class academic standards with holistic character building,
              modern STEM innovation, and a vibrant community of passionate educators.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a href="#admissions">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg shadow-indigo-600/30">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Apply for Admission
                </Button>
              </a>
              <Link to="/login">
                <Button size="lg" variant="glass" className="w-full sm:w-auto">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  Access Portals
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">25+</div>
              <div className="text-xs sm:text-sm text-indigo-300 font-medium mt-1">Years of Legacy</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">2,500+</div>
              <div className="text-xs sm:text-sm text-indigo-300 font-medium mt-1">Active Students</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">150+</div>
              <div className="text-xs sm:text-sm text-indigo-300 font-medium mt-1">Expert Faculty</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">99.4%</div>
              <div className="text-xs sm:text-sm text-indigo-300 font-medium mt-1">Board Distinction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACADEMICS SECTION */}
      <section id="academics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="primary">Academic Excellence</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Holistic Curricula Designed for Every Stage
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            From early foundational exploration to rigorous secondary board examinations, our students
            build deep conceptual competence.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300">
            <button
              onClick={() => setActiveTab('primary')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'primary' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Primary (1–5)
            </button>
            <button
              onClick={() => setActiveTab('middle')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'middle' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Middle (6–8)
            </button>
            <button
              onClick={() => setActiveTab('senior')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'senior' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Senior Secondary (9–12)
            </button>
          </div>
        </div>

        {/* Active Program Card */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {academicPrograms[activeTab].age}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {academicPrograms[activeTab].title}
              </h3>
            </div>
            <a href="#admissions">
              <Button size="sm" variant="outline">
                Inquire for this Grade
              </Button>
            </a>
          </div>

          <p className="text-slate-600 mt-6 leading-relaxed">
            {academicPrograms[activeTab].description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {academicPrograms[activeTab].features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAMPUS FACILITIES */}
      <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="cyan">World-Class Infrastructure</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Designed to Stimulate Discovery
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Spread across 18 acres of green campus, our facilities empower students across sports, science, arts, and coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <Card key={idx} hoverable className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="default" size="sm">
                      {fac.tag}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{fac.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{fac.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. FACULTY SPOTLIGHT */}
      <section id="faculty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="purple">Expert Faculty</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Mentorship by Dedicated Educators
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Our educators bring an average of 12+ years of teaching excellence, holding advanced degrees and pedagogical credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.length > 0 ? (
            teachers.map((tch) => (
              <Card key={tch._id} hoverable className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-2xl flex items-center justify-center shadow-md mb-4">
                  {tch.name?.charAt(0) || 'T'}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{tch.name}</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{tch.qualification}</p>
                <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                  {tch.bio || 'Dedicated to student empowerment and academic growth.'}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Emp ID: {tch.employeeId}</span>
                </div>
              </Card>
            ))
          ) : (
            // Demo faculty fallback
            [
              {
                name: 'Daniel Okonkwo',
                qualification: 'M.Sc. Mathematics, B.Ed.',
                bio: 'Senior faculty with a focus on conceptual clarity, algebra, and Olympiad problem-solving.',
                id: 'TCH0001',
              },
              {
                name: 'Dr. Sunita Sharma',
                qualification: 'Ph.D. Physics, IISc',
                bio: 'Passionate about laboratory exploration, astrophysics concepts, and scientific methodology.',
                id: 'TCH0002',
              },
              {
                name: 'Robert Vance',
                qualification: 'M.A. English Literature, Oxford',
                bio: 'Literature educator guiding students in creative writing, debate, and critical analytical essays.',
                id: 'TCH0003',
              },
            ].map((tch, idx) => (
              <Card key={idx} hoverable className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-2xl flex items-center justify-center shadow-md mb-4">
                  {tch.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{tch.name}</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{tch.qualification}</p>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{tch.bio}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Faculty ID: {tch.id}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* 5. LIVE NOTICES */}
      <section id="notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="warning">Campus Updates</Badge>
            <h2 className="font-display text-3xl font-bold text-slate-900 mt-2">
              Official Notice Board
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Stay informed about schedules, event announcements, and institutional bulletins.
            </p>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-1" />
              View Portal Notices
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.length > 0 ? (
            notices.map((ntc) => (
              <div
                key={ntc._id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={ntc.priority === 'high' ? 'danger' : 'primary'} size="sm">
                    {ntc.priority} priority
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ntc.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{ntc.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ntc.content}</p>
              </div>
            ))
          ) : (
            [
              {
                title: 'Admissions open for Academic Year 2026-27',
                content: 'Applications are currently being accepted for Classes 1 through 11. Early submissions recommended.',
                priority: 'high',
                date: 'Sep 2026',
              },
              {
                title: 'Mid-term examination timetable published',
                content: 'The upcoming examination timetable has been distributed on the student and faculty portals.',
                priority: 'normal',
                date: 'Sep 2026',
              },
            ].map((ntc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={ntc.priority === 'high' ? 'danger' : 'primary'} size="sm">
                    {ntc.priority} priority
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ntc.date}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{ntc.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ntc.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. ONLINE ADMISSION APPLICATION FORM */}
      <section
        id="admissions"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl border border-indigo-500/20">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
              Direct Application Desk
            </span>
            <h2 className="font-display text-3xl font-bold mt-3 text-white">
              Apply for School Admission
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Fill out the inquiry application below. Our admissions committee will review your profile and contact you within 48 hours.
            </p>
          </div>

          {admissionSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>
                Application submitted successfully! Your submission reference has been logged. Our admissions desk will be in touch shortly.
              </span>
            </div>
          )}

          {admissionError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-sm">
              {admissionError}
            </div>
          )}

          <form onSubmit={handleAdmissionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={admissionForm.studentName}
                  onChange={(e) =>
                    setAdmissionForm({ ...admissionForm, studentName: e.target.value })
                  }
                  placeholder="e.g. Aryan Sharma"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={admissionForm.dateOfBirth}
                  onChange={(e) =>
                    setAdmissionForm({ ...admissionForm, dateOfBirth: e.target.value })
                  }
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Applying for Class / Grade *
                </label>
                <select
                  value={admissionForm.applyingClass}
                  onChange={(e) =>
                    setAdmissionForm({ ...admissionForm, applyingClass: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-900 border border-white/20 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  value={admissionForm.parentName}
                  onChange={(e) =>
                    setAdmissionForm({ ...admissionForm, parentName: e.target.value })
                  }
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={admissionForm.phone}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Parent Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={admissionForm.email}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Previous School Attended
                </label>
                <input
                  type="text"
                  value={admissionForm.previousSchool}
                  onChange={(e) =>
                    setAdmissionForm({ ...admissionForm, previousSchool: e.target.value })
                  }
                  placeholder="Previous School Name"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={admissionForm.address}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                  placeholder="City, State"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="pt-3 text-center">
              <Button
                type="submit"
                size="lg"
                loading={admissionLoading}
                variant="primary"
                className="w-full sm:w-auto min-w-[200px]"
              >
                Submit Admission Application
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 7. CONTACT & INQUIRIES */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div>
            <Badge variant="primary">Campus Contact</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              We’d Love to Hear From You
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Whether you are a prospective parent seeking a school tour or an educator interested in our faculty, get in touch with our administrative office.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Campus Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    14 Knowledge Park Boulevard, Pune, Maharashtra 411001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Visiting Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Monday to Friday: 8:30 AM – 4:00 PM | Saturday: 9:00 AM – 1:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Lines</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Admissions: +91 20 4912 3400 | Office: +91 20 4912 3401
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Box */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Send a Message</h3>
            <p className="text-xs text-slate-500 mb-6">
              Our front desk responds to all general inquiries within 24 hours.
            </p>

            {contactSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Thank you! Your message has been sent to our campus office.</span>
              </div>
            )}

            {contactError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {contactError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Campus Tour / Admission inquiry"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <Button
                type="submit"
                variant="brand"
                size="md"
                loading={contactLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
