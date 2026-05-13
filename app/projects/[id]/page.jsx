import React, { Suspense } from 'react';
import ProjectDetailClient from './ProjectDetailClient';

export default function ProjectDetailPage({ params }) {
  return (
    <Suspense fallback={<main className="page" />}>
      <ProjectDetailClient params={params} />
    </Suspense>
  );
}
