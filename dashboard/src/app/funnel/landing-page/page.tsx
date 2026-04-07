'use client';

import Link from 'next/link';

export default function LandingPagePage() {
  const blocks = [
    { num: 1, title: 'Hero Section', desc: 'Main headline, subheading, and CTA' },
    { num: 2, title: 'Problem Recognition', desc: 'You\'ve done everything right. It still didn\'t work.' },
    { num: 3, title: 'Root Cause', desc: 'Why diets actually fail (biology, not willpower)' },
    { num: 4, title: 'Solution Intro', desc: 'Meet Slim Control: Transdermal technology' },
    { num: 5, title: 'How It Works', desc: '5-step visual process: Apply → Absorb → Suppress → Burn → Repeat' },
    { num: 6, title: 'Ingredients & Science', desc: '5 clinically validated ingredients with research links' },
    { num: 7, title: 'Real Results', desc: '47,000+ women, testimonials with before/after photos' },
    { num: 8, title: 'Testimonial Video', desc: 'Embedded video of real women stories' },
    { num: 9, title: 'Objection #1', desc: 'Patches don\'t work, do they?' },
    { num: 10, title: 'Objection #2', desc: 'Is this safe? Will it cause side effects?' },
    { num: 11, title: 'Objection #3', desc: 'What if this doesn\'t work for me?' },
    { num: 12, title: 'Scarcity & Urgency', desc: 'Limited supply due to ingredient shortage' },
    { num: 13, title: 'Final CTA', desc: 'Claim your starter pack + pricing options' },
    { num: 14, title: 'Trust & Footer', desc: 'Guarantees, support, policy links, trust badges' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/funnel" className="text-teal-400 hover:text-teal-300 text-sm mb-4 inline-block">
            ← Back to Funnel
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Landing Page Structure</h1>
          <p className="text-slate-400">14 blocks of conversion-optimized copy</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Overview */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Page Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-teal-400 mb-3">Primary Flow</h3>
              <ol className="space-y-2 text-slate-300 text-sm">
                <li>1. Hook (hero)</li>
                <li>2. Problem (pain)</li>
                <li>3. Root cause (why diets fail)</li>
                <li>4. Solution (Slim Control intro)</li>
                <li>5. How it works (mechanism)</li>
                <li>6. Science (ingredients)</li>
                <li>7. Social proof (results)</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-teal-400 mb-3">Conversion Path</h3>
              <ol className="space-y-2 text-slate-300 text-sm">
                <li>8. Video testimonials</li>
                <li>9-11. Objection handling (3 blocks)</li>
                <li>12. Scarcity/urgency</li>
                <li>13. Final CTA + pricing</li>
                <li>14. Trust signals + footer</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Block Breakdown */}
        <h2 className="text-2xl font-bold text-white mb-6">14-Block Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blocks.map((block) => (
            <div key={block.num} className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 text-white font-bold text-sm">
                    {block.num}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{block.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{block.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Design Notes */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Design Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-teal-400 mb-3">Color Scheme</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-teal-600"></div>
                  <span className="text-slate-300">Primary: Teal (#1B9B9B)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-600"></div>
                  <span className="text-slate-300">Secondary: Rose (#E87B7B)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-600"></div>
                  <span className="text-slate-300">Accent: Gold (#D4A574)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-teal-400 mb-3">Typography</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Headlines: Bold, 32-48px</li>
                <li>• Subheadings: Medium, 20-24px</li>
                <li>• Body: Regular, 16-18px</li>
                <li>• CTA buttons: Bold, white on colored</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">14</div>
            <div className="text-sm text-slate-400">Blocks</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">8-12%</div>
            <div className="text-sm text-slate-400">Expected conversion</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">&lt;2s</div>
            <div className="text-sm text-slate-400">Load time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
