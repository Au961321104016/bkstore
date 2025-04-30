import React, { useState } from 'react';
import { useRouter } from 'next/router';

const VerifyOtp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-OTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Something went wrong');
      } else {
        console.log('OTP verified successfully:', data.user);
        router.push('/about'); // Redirect to a welcome or dashboard page
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
        <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-6 text-center">Verify OTP</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
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

          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[#2B2B2B] mb-1">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-[#D4D4D4] rounded-lg text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B]"
              placeholder="Enter the OTP you received"
              required
            />
          </div>

          {/* Display error message */}
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2B2B2B] text-white py-2 rounded-lg hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-[#B3B3B3] mt-6">
          Haven't received OTP?{' '}
          <span
            className="text-[#2B2B2B] underline hover:text-black cursor-pointer"
            onClick={() => router.push('/auth/signup')} // Go back to signup if OTP isn't received
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
