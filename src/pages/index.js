import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">

        <h1 className="hero__title" style={{ fontWeight: 'bold', fontSize: '3.5rem' }}>{siteConfig.title}</h1>
        <p className="hero__subtitle" style={{ fontSize: '1.5rem' }}>{siteConfig.tagline}</p>
        <p className="hero__author" style={{ fontSize: '1.4rem', marginTop: '15px' }}>By <strong>Muhammad Ashhad Khan</strong></p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/introduction/why-physical-ai-matters">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="An interactive online book on Physical AI and Humanoid Robotics.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.aboutAuthor}>
          <div className="container">
            <h2 className="text--center">About the Author</h2>
            <p className="text--center">
              This book was created by Muhammad Ashhad Khan, an AI & Robotics enthusiast passionate about Physical AI and humanoid robotics.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}