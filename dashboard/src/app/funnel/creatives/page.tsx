'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CreativesPage() {
  const [activeCategory, setActiveCategory] = useState('static');

  const categories = {
    static: {
      title: 'Static Ads',
      count: '24 variations',
      desc: 'Before/after, mechanism, emotional, proof, scarcity, guarantee',
      items: [
        { name: 'Before/After Transformation', count: 4 },
        { name: 'Mechanism/How It Works', count: 4 },
        { name: 'Emotional/Lifestyle', count: 4 },
        { name: 'Objection/Proof', count: 4 },
        { name: 'Scarcity/Urgency', count: 4 },
        { name: 'Guarantee/Risk Reversal', count: 3 },
      ]
    },
    carousel: {
      title: 'Carousel Ads',
      count: '6 templates',
      desc: '5-slide carousels with narrative flow',
      items: [
        { name: 'The Transformation Story', slides: 5 },
        { name: 'The Science Behind It', slides: 5 },
        { name: 'Real Results', slides: 5 },
        { name: 'How It Works (5 Steps)', slides: 5 },
        { name: 'Objections Answered', slides: 6 },
        { name: 'Scarcity + Guarantee', slides: 5 },
      ]
    },
    video: {
      title: 'Video Scripts',
      count: '12 variations',
      desc: '15s to 120s formats optimized by platform',
      items: [
        { name: '15-Second Testimonial', duration: '15s' },
        { name: '15-Second Hook', duration: '15s' },
        { name: '30-Second Mechanism', duration: '30s' },
        { name: '30-Second Emotional', duration: '30s' },
        { name: '30-Second Proof', duration: '30s' },
        { name: '60-Second Full Story', duration: '60s' },
        { name: '60-Second Mechanism Deep Dive', duration: '60s' },
        { name: '60-Second Scarcity', duration: '60s' },
        { name: '90-Second Journey', duration: '90s' },
        { name: '90-Second FAQ', duration: '90s' },
        { name: '120-Second Social Proof', duration: '120s' },
        { name: '120-Second Transformation', duration: '120s' },
      ]
    }
  };

  const platformTargets = [
    { platform: 'Facebook', strategy: 'Before/after carousels, emotional copy, scarcity angles', target: 'Women 30-55' },
    { platform: 'Instagram', strategy: 'Lifestyle imagery, testimonial videos, Reels', target: 'Women 30-50' },
    { platform: 'TikTok', strategy: 'Short testimonials, authentic content, trending sounds', target: 'Women 25-45' },
    { platform: 'Pinterest', strategy: 'Before/after pins, infographics, long-form', target: 'Women 35-60' },
    { platform: 'YouTube', strategy: '15s skippable, testimonial videos, strong hook', target: 'Women 30-55' },
    { platform: 'Google Search', strategy: 'Keyword bids, landing page match, extensions', target: 'High intent' },
  ];

  const currentCategory = categories[activeCategory as keyof typeof categories];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/funnel" className="text-teal-400 hover:text-teal-300 text-sm mb-4 inline-block">
            ← Back to Funnel
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Ad Creatives</h1>
          <p className="text-slate-400">50+ variations across static, carousel, and video formats</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {Object.entries(categories).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 font-medium border-b-2 transition ${
                activeCategory === key
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {value.title}
              <span className="ml-2 text-sm opacity-75">({value.count})</span>
            </button>
          ))}
        </div>

        {/* Category Content */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">{currentCategory.title}</h2>
          <p className="text-slate-400 mb-6">{currentCategory.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentCategory.items as any[]).map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-600 bg-slate-700/30 p-4">
                <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                <div className="text-xs text-teal-400 mt-2">
                  {item.count && `${item.count} variations`}
                  {item.slides && `${item.slides} slides`}
                  {item.duration && `${item.duration}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Strategy */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Platform-Specific Strategy</h2>
          <div className="grid grid-cols-1 gap-4">
            {platformTargets.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-600 bg-slate-700/30 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{item.platform}</h3>
                    <p className="text-sm text-slate-300 mb-2">{item.strategy}</p>
                    <p className="text-xs text-teal-400">Target: {item.target}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* A/B Testing Framework */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">A/B Testing Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-teal-400 mb-3">Headlines to Test</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ "She Lost 26 Lbs Without Dieting"</li>
                <li>✓ "47,000+ Women Lost 10-30 Lbs in 8 Weeks"</li>
                <li>✓ "The Only Weight Loss Patch That Works"</li>
                <li>✓ "Stop Fighting Your Body. Start Working With It."</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-teal-400 mb-3">Body Copy to Test</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ Emotional ("Reclaim your confidence")</li>
                <li>✓ Mechanism ("Hunger down 40%")</li>
                <li>✓ Proof ("Real women, real results")</li>
                <li>✓ Urgency ("Supply closes in 48 hours")</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Targets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">2-4%</div>
            <div className="text-xs text-slate-400">CTR</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">8-12%</div>
            <div className="text-xs text-slate-400">LP Conversion</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">2-3%</div>
            <div className="text-xs text-slate-400">Overall Funnel</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">$50-100</div>
            <div className="text-xs text-slate-400">CPA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
