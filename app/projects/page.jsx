import React, { Suspense } from 'react';
import ProjectsClient from './ProjectsClient';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<main className="page" />}>
      <ProjectsClient />
    </Suspense>
  );
}
