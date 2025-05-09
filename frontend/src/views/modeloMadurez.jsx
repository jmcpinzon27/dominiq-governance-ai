import React from 'react';
import Header from '../components/Header';
import StepperSidebar from '../components/StepperSidebar';
import MaturityModelForm from '../components/MaturityModelForm';

export default function ModeloMadurez() {
  return (
    <div className="flex h-screen bg-gray-100">
      <StepperSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <MaturityModelForm />
        </main>
      </div>
    </div>
  );
}
