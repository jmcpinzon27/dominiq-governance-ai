import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function StepperSidebar() {
  const loc = useLocation().pathname;
  const steps = [
    { path: '/', label: 'Home' },
    { path: '/dominiQ', label: 'Proyecto' },
    { path: '/modelo-madurez-form', label: 'Modelo de Madurez' },
    { path: '/modelo-madurez/:sessionToken', label: 'Chat' }
  ];

  return (
    <aside className="w-48 bg-gray-200 p-4 space-y-2">
      {steps.map(s => (
        <Link
          key={s.path}
          to={s.path.replace(':sessionToken', '')}
          className={`block p-2 rounded ${
            loc.startsWith(s.path.replace(':sessionToken', ''))
              ? 'bg-blue-500 text-white'
              : 'hover:bg-blue-100'
          }`}
        >
          {s.label}
        </Link>
      ))}
    </aside>
  );
}
