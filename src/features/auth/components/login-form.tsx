import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import EyeIcon from '../../../assets/icons/EyeIcon.svg';
import CirclesSvg from '../../../assets/images/Circles.svg';

export const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#004587]">
      {/* Circles */}
      <div className="absolute inset-0 z-0">
        <img
          src={CirclesSvg}
          className="absolute bottom-0 left-5 w-96 rotate-180"
          alt="Decorative circles"
        />
      </div>

      <div className="font-uber-regular  z-10 w-80  text-center font-medium">
        {/* Login Form */}
        <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="font-uber-regular mb-6 text-2xl font-bold text-gray-900">
            Log in to your account
          </h2>

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="font-uber-regular block text-left text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="font-uber-regular mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="example@maua.br"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="font-uber-regular block text-left text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                className="font-uber-regular mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
              {/* Use a button for toggling password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                onClick={togglePasswordVisibility}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    togglePasswordVisibility();
                  }
                }}
                aria-pressed={isPasswordVisible} // Indicate the toggle state
                aria-label={
                  isPasswordVisible ? 'Hide password' : 'Show password'
                }
              >
                <img
                  className="size-5 text-gray-400"
                  src={EyeIcon}
                  alt={isPasswordVisible ? 'Hide password' : 'Show password'} // Alt text for accessibility
                />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full rounded-md bg-[#004587] px-4 py-2 text-white shadow hover:opacity-90"
            >
              Login now
            </button>
          </div>

          {/* Sign up Link */}
          <div className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to={`/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
