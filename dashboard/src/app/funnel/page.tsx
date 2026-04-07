'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FunnelPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const assets = [
    {
      id: 'vsl',
      name: 'VSL Script',
      description: '8-minute video sales letter screenplay',
      icon: '📹',
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: '14-block complete structure with copy',
      icon: '🌐',
    },
    {
      id: 'emails',
      name: 'Email Sequence',
      description: '5-email psychological progression funnel',
      icon: '📧',
    },
    {
      id: 'creatives',
      name: 'Ad Creatives',
      description: '50+ variations (static, carousel, video)',
      icon: '🎨',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Slim Control Marketing Funnel
          </h1>
          <p className="text-slate-400">
            Complete advertorial suite: VSL, landing page, email sequence, 50+ ad creatives
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {assets.map((asset) => (
            <Link
              key={asset.id}
              href={`/funnel/${asset.id}`}
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-teal-500 hover:bg-slate-800"
            >
              <div className="text-4xl mb-3">{asset.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{asset.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{asset.description}</p>
              <div className="text-xs text-teal-400 font-medium">
                View Asset →
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="text-3xl font-bold text-teal-400 mb-2">1,723</div>
            <div className="text-slate-400">Lines of production-ready copy</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="text-3xl font-bold text-rose-400 mb-2">8</div>
            <div className="text-slate-400">Complete asset files</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <div className="text-3xl font-bold text-amber-400 mb-2">47,000+</div>
            <div className="text-slate-400">Women in proof points</div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Funnel Overview</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">📹 VSL Script</h3>
              <p className="text-slate-400">
                8-minute video screenplay with 6 sections: Hook → Story → Mechanism → Proof → Objections → Close.
                Complete with production notes and timing guidelines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🌐 Landing Page</h3>
              <p className="text-slate-400">
                14-block structure: Hero, Problem, Solution, How It Works, Ingredients, Results, Testimonials,
                Objections (3), Scarcity, CTA, and Trust Footer. Full copy ready to design.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">📧 Email Sequence</h3>
              <p className="text-slate-400">
                5-email psychological progression: Welcome → Story → Proof → Urgency → Final Close.
                Proven structure for warm-up to conversion.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🎨 Ad Creatives</h3>
              <p className="text-slate-400">
                24 static ad sets, 6 carousel templates, 12 video scripts (15s to 120s).
                Platform-specific optimization for Facebook, Instagram, TikTok, Pinterest, YouTube, Google Search.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <Link
            href="/funnel/vsl"
            className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 font-medium transition"
          >
            View VSL Script
          </Link>
          <Link
            href="/funnel/landing-page"
            className="rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 font-medium transition"
          >
            View Landing Page
          </Link>
          <Link
            href="/funnel/emails"
            className="rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 font-medium transition"
          >
            View Emails
          </Link>
          <Link
            href="/funnel/creatives"
            className="rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 font-medium transition"
          >
            View Ad Creatives
          </Link>
        </div>
      </div>
    </div>
  );
}
