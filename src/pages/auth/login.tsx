import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Something went wrong');
      } else {
        // ✅ Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        Cookies.set("token", data.token, { expires: 7 });

        // ✅ Optional: Store user info if needed
        // localStorage.setItem('user', JSON.stringify(data.user));

        console.log('User:', data.user);
        router.push('/about'); // ✅ Redirect after login
      }
    } catch (error) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B2B2B] to-[#B3B3B3] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-6 text-center">Login to Your Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-[#2B2B2B] text-white py-2 rounded-lg hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>

        <p className="text-center text-sm text-[#B3B3B3] mt-6">
          Don’t have an account?{' '}
          <Link href="/auth/signup" className="text-[#2B2B2B] underline hover:text-[#000]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;