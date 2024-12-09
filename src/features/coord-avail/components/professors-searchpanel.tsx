import React from 'react';

export const ProfessorSearch = () => (
  <div id="professor-search" className="flex items-center">
    <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
      <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span className="block">Teachers Availability and Suitability</span>
      </h2>
      <p>View and manage teachers availability and suitability</p>
      <div className="flex items-center justify-center gap-4">
        <button
          className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
          onClick={() =>
            document
              .getElementById('teachers-table')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Search a teacher
        </button>
      </div>
    </div>
  </div>
);
