'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EmailsPage() {
  const [expandedEmail, setExpandedEmail] = useState<number | null>(0);

  const emails = [
    {
      num: 1,
      subject: 'Welcome to the Slim Control community 🎉',
      sendTime: 'Immediately after signup',
      preview: 'Hi [First Name], Welcome to the Slim Control community. I\'m Sarah, and I sent this email myself because I wanted to thank you personally.',
      keyPoints: [
        'Personalized welcome from founder',
        'Sets expectations: 3-5 day delivery',
        'Builds anticipation for first application',
        '5-step timeline to results',
        'Introduces 60-day guarantee'
      ]
    },
    {
      num: 2,
      subject: 'How a busy mom lost 26 lbs without dieting (and kept it off)',
      sendTime: 'Day 3 after signup',
      preview: 'Your starter pack should be arriving soon. Before it does, I want to tell you about a woman named Sarah.',
      keyPoints: [
        'Sarah\'s 8-year struggle story',
        'Root cause: biology vs. willpower',
        'Breakthrough with transdermal delivery',
        'Week-by-week transformation',
        'Proof that it\'s not about dieting'
      ]
    },
    {
      num: 3,
      subject: 'Real results from real women (see their faces) ✓',
      sendTime: 'Day 6 after signup',
      preview: 'By now, your starter pack has either arrived or is on the way.',
      keyPoints: [
        '4 real testimonials with results',
        'Statistics: 47,000+ women used it',
        'Data: 15-22 lbs average loss',
        '89% maintained at 6 months',
        '94% satisfaction/repurchase rate'
      ]
    },
    {
      num: 4,
      subject: '48 hours left: Supply running low 🚨',
      sendTime: 'Day 12 after signup',
      preview: 'I\'m sending this because I want to be direct with you. Our supply is running out faster than we expected.',
      keyPoints: [
        'Real scarcity: ingredient shortage',
        'Authentic supply constraint',
        '48-hour window before closure',
        'No fake countdown tactics',
        'Transparent about next batch timing'
      ]
    },
    {
      num: 5,
      subject: 'Your last chance — supply closes tonight',
      sendTime: 'Day 14 after signup (final deadline)',
      preview: 'This is my last email about Slim Control. After tonight, the offer closes.',
      keyPoints: [
        'Psychological cost of waiting',
        'Binary choice: now or June 2026',
        'Risk reversal emphasized',
        'Emotional appeal to confidence',
        'Final CTA with urgency'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/funnel" className="text-teal-400 hover:text-teal-300 text-sm mb-4 inline-block">
            ← Back to Funnel
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Email Sequence</h1>
          <p className="text-slate-400">5-email psychological progression funnel</p>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Funnel Strategy</h2>
          <p className="text-slate-300 mb-6">
            This 5-email sequence uses psychological progression to move subscribers from awareness to action.
            Each email serves a specific purpose in the buying journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-teal-400 font-bold mb-2">Email 1</div>
              <div className="text-sm text-slate-300">Welcome</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-teal-400 font-bold mb-2">Email 2</div>
              <div className="text-sm text-slate-300">Story</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-teal-400 font-bold mb-2">Email 3</div>
              <div className="text-sm text-slate-300">Proof</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-teal-400 font-bold mb-2">Email 4</div>
              <div className="text-sm text-slate-300">Urgency</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="text-teal-400 font-bold mb-2">Email 5</div>
              <div className="text-sm text-slate-300">Close</div>
            </div>
          </div>
        </div>

        {/* Email Breakdown */}
        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.num}
              className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden"
            >
              <button
                onClick={() => setExpandedEmail(expandedEmail === email.num ? null : email.num)}
                className="w-full p-6 text-left hover:bg-slate-700/30 transition flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 text-white font-bold text-sm">
                        {email.num}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{email.subject}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {email.sendTime} • {email.preview}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-teal-400 ml-4">
                  {expandedEmail === email.num ? '−' : '+'}
                </div>
              </button>

              {expandedEmail === email.num && (
                <div className="border-t border-slate-700 px-6 py-4 bg-slate-800/30">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Key Points:</h4>
                    <ul className="space-y-2">
                      {email.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                          <span className="text-teal-400 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">5</div>
            <div className="text-sm text-slate-400">Emails in sequence</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">14 days</div>
            <div className="text-sm text-slate-400">Total campaign length</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">15-20%</div>
            <div className="text-sm text-slate-400">Expected conversion</div>
          </div>
        </div>
      </div>
    </div>
  );
}
