import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl">
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About CareerSwipe</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Revolutionizing the way job seekers and employers connect. Our platform combines cutting-edge technology with a user-friendly interface to make job hunting and recruitment more efficient and effective.
            </p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            To transform the job search experience by creating meaningful connections between talented individuals and forward-thinking companies. We believe in making career advancement accessible, efficient, and enjoyable for everyone.
          </p>
        </div>
      </div>

      {/* Values section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900">Innovation</dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">We constantly push boundaries to create better solutions for job seekers and employers.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900">Transparency</dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">We believe in honest, open communication and clear expectations in the job search process.</p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-base font-semibold leading-7 text-gray-900">Empowerment</dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">We empower individuals to take control of their career paths and achieve their professional goals.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Stats section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Impact
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              We're proud of the difference we're making in the job market
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Active Users</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">100k+</dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Job Matches Made</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">50k+</dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Partner Companies</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">1000+</dd>
            </div>
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Success Rate</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">95%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
