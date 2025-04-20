import React from 'react';
import { Link } from 'react-router-dom';

export default function WhoWeArePage() {
  const teamMembers = [
    {
      name: 'Ali Yassine',
      role: 'Full Stack Developer',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', 
      bio: 'Experienced developer with a passion for creating innovative solutions.',
    },
    {
      name: 'Hadi Chahine',
      role: 'Backend Developer',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
      bio: 'Specialized in building robust and scalable backend systems.',
    },
    {
      name: 'Sarah Johnson',
      role: 'UI/UX Designer',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
      bio: 'Creative designer focused on building intuitive and beautiful user experiences.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
              Meet the Team Behind CareerSwipe
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                We are a passionate team of developers and designers committed to revolutionizing the job search experience. Our diverse backgrounds and shared vision drive us to create innovative solutions for both job seekers and employers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Team</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet the talented individuals who make CareerSwipe possible.
          </p>
        </div>
        <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {teamMembers.map((person) => (
            <li key={person.name}>
              <img
                className="aspect-[3/2] w-full rounded-2xl object-cover"
                src={person.imageUrl}
                alt={person.name}
              />
              <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
              <p className="text-base leading-7 text-indigo-600">{person.role}</p>
              <p className="mt-4 text-base leading-7 text-gray-600">{person.bio}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Vision section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Vision</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We envision a future where finding the perfect job or the ideal candidate is as simple as a swipe. By leveraging cutting-edge technology and human-centered design, we're making this vision a reality.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">Join Our Journey</h3>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We're always looking for talented individuals who share our passion for innovation and excellence. If you're interested in joining our team, check out our careers page or reach out to us directly.
          </p>
        </div>
      </div>

      {/* Contact section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get in Touch</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have questions or want to learn more about CareerSwipe? We'd love to hear from you.
          </p>
          <div className="mt-10 space-y-4 text-base leading-7 text-gray-600">
            <p>
              <strong className="font-semibold text-gray-900">Email:</strong>{' '}
              <a href="mailto:contact@careerswipe.com" className="text-indigo-600 hover:text-indigo-500">
                contact@careerswipe.com
              </a>
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Location:</strong>{' '}
              Beirut, Lebanon
            </p>
          </div>
        </div>

        {/* Navigation links */}
        {/* <div className="mx-auto mt-16 max-w-2xl flex justify-center space-x-6">
          <Link to="/" className="text-base font-semibold text-indigo-600 hover:text-indigo-500">
            Home
          </Link>
          <Link to="/about" className="text-base font-semibold text-indigo-600 hover:text-indigo-500">
            About Us
          </Link>
        </div> */}
      </div>
    </div>
  );
}
