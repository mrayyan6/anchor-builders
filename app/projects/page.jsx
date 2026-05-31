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

  const total = projects.length;

  return (
    <main className="page">
      <header className="page-header">
        <div className="container-wide">
          <div className="crumb">— PROJECTS / SELECTED WORK</div>
          <div className="title">
            <h1 className="hd-display">A portfolio in <i>concrete,</i> steel and glass.</h1>
            <p className="lede">
              {total > 0
                ? `${total} project${total === 1 ? '' : 's'} across Pakistan — for government bodies, retainer clients and private developers. Filter by category, or browse the full list.`
                : 'Project portfolio coming soon.'}
            </p>
          </div>
        </div>
      </header>

      <ProjectsExplorer categories={categories} projects={projects} />

      <CTABlock />
    </main>
  );
}
