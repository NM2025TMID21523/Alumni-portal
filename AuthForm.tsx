
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { db } from '../services/db';

interface AuthFormProps {
  type: 'login' | 'register' | 'forgot';
  defaultRole: UserRole;
  onSuccess: (user: User) => void;
  onClose: () => void;
  onForgotPassword?: () => void;
  theme: 'light' | 'dark';
}

const AuthForm: React.FC<AuthFormProps> = ({ type, defaultRole, onSuccess, onClose, onForgotPassword, theme }) => {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    graduation_year: '',
    department: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getEmailPlaceholder = () => {
    if (role === UserRole.STUDENT || role === UserRole.ADMIN) {
      return 'your@university.edu';
    }
    return 'your@email.com';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (type === 'register' && !formData.name) newErrors.name = 'Name is required';
    if ((type === 'login' || type === 'register') && !formData.email) newErrors.email = 'Email is required';
    else if ((type === 'login' || type === 'register') && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    else if (type === 'register' && (role === UserRole.STUDENT || role === UserRole.ADMIN)) {
      // Check for university domain for students and admins
      const universityDomains = ['.edu', '.ac.in', '.edu.in', '.university', '.college', '.school'];
      const hasUniversityDomain = universityDomains.some(domain => formData.email.toLowerCase().includes(domain));
      if (!hasUniversityDomain) {
        newErrors.email = 'Please use your official university email address';
      }
    }
    if (type === 'forgot' && !formData.email) newErrors.email = 'Email is required';
    else if (type === 'forgot' && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if ((type === 'login' || type === 'register') && !formData.password) newErrors.password = 'Password is required';
    else if ((type === 'login' || type === 'register') && formData.password.length < 6) newErrors.password = 'Min 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (type === 'register') {
      db.findUserByEmail(formData.email).then(existing => {
        if (existing) {
          setErrors({ email: 'Email already exists' });
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          role: role,
          graduation_year: parseInt(formData.graduation_year) || undefined,
          department: formData.department,
          bio: formData.bio || undefined,
          created_at: new Date().toISOString(),
        };
        
        db.addUser(newUser).then((createdUser) => {
          onSuccess(createdUser);
        }).catch(err => {
          console.error('registration error', err);
          setErrors({ general: err.message || 'Failed to create account. Please try again.' });
        });
      }).catch(err => {
        console.error('email check error', err);
        setErrors({ general: err.message || 'Failed to check email. Please try again.' });
      });
    } else if (type === 'forgot') {
      // For demo purposes, just show success message
      // In a real app, this would send a reset email
      setErrors({ general: 'Password reset link sent to your email address.' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      db.findUserByEmail(formData.email).then(user => {
        if (!user) {
          setErrors({ email: 'User not found' });
          return;
        }
        onSuccess(user);
      }).catch(err => {
          console.error('login error', err);
          setErrors({ general: err.message || 'Failed to login. Please try again.' });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {type === 'login' ? 'Join Portal' : type === 'register' ? 'Register New Account' : 'Reset Password'}
            </h2>
            <p className="text-slate-500 mt-2">
              {type === 'login' ? 'Enter your credentials to join' : type === 'register' ? 'Fill in the details to create your account' : 'Enter your email to receive a reset link'}
            </p>
            {errors.general && <p className={`text-xs mt-2 ${type === 'forgot' && errors.general.includes('sent') ? 'text-green-500' : 'text-rose-500'}`}>{errors.general}</p>}
          </div>

          {type === 'register' && (
            <div className={`flex p-1 rounded-lg mb-8 overflow-x-auto ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button 
                onClick={() => setRole(UserRole.STUDENT)}
                className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-md transition ${role === UserRole.STUDENT ? theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Student
              </button>
              <button 
                onClick={() => setRole(UserRole.ALUMNI)}
                className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-md transition ${role === UserRole.ALUMNI ? theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Alumni
              </button>
              <button 
                onClick={() => setRole(UserRole.ADMIN)}
                className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-md transition ${role === UserRole.ADMIN ? theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Admin
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'register' && (
              <div>
                <label htmlFor="fullName" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                <input 
                  id="fullName"
                  name="fullName"
                  type="text" 
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-900' : 'bg-white border-slate-200 focus:ring-indigo-100'} ${errors.name ? 'border-rose-500' : ''}`}
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-900' : 'bg-white border-slate-200 focus:ring-indigo-100'} ${errors.email ? 'border-rose-500' : ''}`}
                placeholder={type === 'forgot' ? 'your@email.com' : getEmailPlaceholder()}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              {type !== 'forgot' && (
                <p className="text-xs text-slate-500 mt-1">
                  {role === UserRole.STUDENT || role === UserRole.ADMIN 
                    ? 'Please use your official university email address' 
                    : 'You can use any personal email address'}
                </p>
              )}
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>
            {type !== 'forgot' && (
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-900' : 'bg-white border-slate-200 focus:ring-indigo-100'} ${errors.password ? 'border-rose-500' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
              </div>
            )}

            {role === UserRole.ALUMNI && type === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="graduationYear" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Graduation Year</label>
                    <input 
                      id="graduationYear"
                      name="graduationYear"
                      type="number" 
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-900' : 'bg-white border-slate-200 focus:ring-indigo-100'}`}
                      placeholder="2020"
                      value={formData.graduation_year}
                      onChange={e => setFormData({...formData, graduation_year: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Department</label>
                    <select 
                      id="department"
                      name="department"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-900' : 'bg-white border-slate-200 focus:ring-indigo-100'}`}
                      value={formData.department}
                      onChange={e => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Bio</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    rows={2}
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 transition ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:ring-indigo-900' : 'bg-white border-slate-200 focus:ring-indigo-100'}`}
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/20 mt-6"
            >
              {type === 'login' ? 'Join Now' : type === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>

            {type === 'login' && (
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => {
                    if (onForgotPassword) {
                      onForgotPassword();
                    }
                  }}
                  className={`text-sm ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'} underline`}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
