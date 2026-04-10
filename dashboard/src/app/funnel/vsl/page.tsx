'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function VSLPage() {
  const [copied, setCopied] = useState(false);

  const vslContent = `# Slim Control Weight Loss Patch — VSL Script
## 8-Minute Video Sales Letter

---

## SECTION 1: THE HOOK (0:00-0:45)

**[COLD OPEN - Direct to Camera]**

"What if everything you've been told about weight loss is backwards?

Think about it. You've tried the diets. The pills. The gym memberships you don't use anymore.

And you *know* why they failed. It's not your fault. It's not willpower.

In the next 8 minutes, I'm going to show you a completely different approach that's working for thousands of women. Women just like you.

And the crazy thing? You don't have to diet. You don't have to kill yourself at the gym.

Stay with me."

---

## SECTION 2: THE STORY (0:45-2:30)

**[B-ROLL: Busy mom in home office, cooking, with kids]**

"Her name is Sarah. She's 38. She has a job she loves, two kids who drive her crazy, and a marriage that matters to her.

But there's one thing that's been eating her alive for years.

Her weight.

She's tried everything. Keto? Lost 8 pounds, then gained 12 back. That expensive gym membership? Lasted three months. ShakeologyBenefitslim? Green smoothies? Noom? Apple Watch rings? She did it all. And nothing stuck.

**[SARAH ON CAMERA]**

'Every morning I'd wake up and think, today's the day I'm going to finally get this right. And by 3pm, I was sabotaging myself.'

**[HOST]**

Sarah's story is the story of over 47,000 women we've heard from. But here's what she didn't know: the failure wasn't hers. It was her physiology.

When you're stressed, exhausted, and constantly fighting hunger signals, your willpower is the most fragile thing in the world."

---

## SECTION 3: THE MECHANISM (2:30-4:15)

"That's when Slim Control showed up.

Instead of pills you swallow — which fight your digestive system, cause nausea, and lose potency — Slim Control is a patch.

A single patch that delivers natural appetite suppressants directly through your skin.

You apply it three times a day. At breakfast. At lunch. At dinner. Your natural appetite peak times.

Within four hours, hunger signals start dropping by 40%.

Meanwhile, your metabolism is getting a boost with Berberine, Red Moro Orange Extract, and Saffron.

So you're eating less because you're not *hungry*.

And burning more because your metabolism is working harder.

It's not willpower against biology anymore. It's biology on your side."

---

## SECTION 4: THE PROOF (4:15-5:45)

47,000+ women have used Slim Control.

Average weight loss: 15-22 lbs in 8 weeks
Consistent results: 89% keep the weight off at 6-month mark
Satisfaction rate: 94% would recommend to a friend

These aren't fake before-and-afters. These aren't models. These are real women. Real lives. Real results.

---

## SECTION 5: OBJECTION HANDLING (5:45-6:45)

"Patches don't work, do they?" — Fair question. You've probably tried patches before.

But Slim Control is different because:

1. Pharmaceutical-grade ingredients with proven delivery system
2. Transdermal delivery is more effective than pills
3. We back it with a 60-day guarantee
4. Non-GMO, hypoallergenic, no banned substances

---

## SECTION 6: THE CLOSE (6:45-8:00)

"Sarah texted us last month: 'I wore a bikini to the beach. First time in 10 years. And I didn't feel self-conscious. I just felt... confident.'

That's what Slim Control is really about. It's not about the number on the scale. It's about reclaiming your confidence.

You have 60 days to prove to yourself this works.

Worst case? You get your money back.

Best case? You're the next woman emailing us saying 'I wore a bikini to the beach.'

The choice is yours. But choose today."`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vslContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/funnel" className="text-teal-400 hover:text-teal-300 text-sm mb-4 inline-block">
            ← Back to Funnel
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">VSL Script</h1>
          <p className="text-slate-400">8-minute video sales letter screenplay</p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto px-6 py-4 flex gap-3">
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy All'}
        </button>
        <a
          href="/assets/slim-control/vsl/script.md"
          download
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
        >
          Download MD
        </a>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert max-w-none rounded-lg border border-slate-700 bg-slate-800/50 p-8">
          <div className="space-y-6 text-slate-300">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">SECTION 1: THE HOOK (0:00-0:45)</h2>
              <p className="text-lg leading-relaxed">
                "What if everything you've been told about weight loss is backwards? Think about it. You've tried the diets. The pills. The gym memberships you don't use anymore..."
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">SECTION 2: THE STORY (0:45-2:30)</h2>
              <p className="text-lg leading-relaxed">
                Her name is Sarah. She's 38. She tried everything — Keto, gym, apps — nothing stuck. "Every morning I'd wake up thinking today's the day. By 3pm, I was sabotaging myself."
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">SECTION 3: THE MECHANISM (2:30-4:15)</h2>
              <p className="text-lg leading-relaxed">
                Slim Control is a patch that delivers appetite suppressants through your skin. Apply 3x daily. Within 4 hours: hunger down 40%, metabolism up 3-7%. No pills. No nausea. Biology on your side.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">SECTION 4: THE PROOF (4:15-5:45)</h2>
              <div className="space-y-2">
                <p>47,000+ women have used Slim Control</p>
                <p>• Average weight loss: 15-22 lbs in 8 weeks</p>
                <p>• 89% kept weight off at 6-month mark</p>
                <p>• 94% would recommend to friend</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">SECTION 5: OBJECTION HANDLING (5:45-6:45)</h2>
              <p className="text-lg leading-relaxed">
                Why Slim Control is different: Pharmaceutical-grade ingredients, proven transdermal delivery, 60-day guarantee, non-GMO hypoallergenic formula.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">SECTION 6: THE CLOSE (6:45-8:00)</h2>
              <p className="text-lg leading-relaxed">
                "I wore a bikini to the beach. First time in 10 years. And I didn't feel self-conscious. I just felt confident." — Sarah's transformation. Your choice. 60-day guarantee. Choose today.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">8 min</div>
            <div className="text-sm text-slate-400">Total length</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">6</div>
            <div className="text-sm text-slate-400">Sections</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">1,200+</div>
            <div className="text-sm text-slate-400">Words</div>
          </div>
        </div>
      </div>
    </div>
  );
}
