import React from 'react';
import { getActiveCategories, getActiveProjects } from '../../lib/queries';
import { CTABlock } from '../../src/components';
import ProjectsExplorer from './ProjectsExplorer';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Projects — Anchor Associates & Builders' };

export default async function ProjectsPage() {
  const [categories, projects] = await Promise.all([
    getActiveCategories(),
    getActiveProjects(),
  ]);

  return (
    <main className="page">
      <header className="page-header page-header-center">
        <div className="container-wide">
          <div className="crumb">— PROJECTS / SELECTED WORK</div>
          <div className="title">
            <h1 className="hd-display">A portfolio in <i>concrete,</i> steel and glass.</h1>
          </div>
        </div>
      </header>

      <ProjectsExplorer categories={categories} projects={projects} />

      <CTABlock />
    </main>
  );
}
