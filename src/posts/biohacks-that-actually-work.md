---
title: "Resting heart rate 68 to 56: what changed in my dev work"
created: 04/04/2026
description: "A 6-month n=1 experiment applying athletic training principles to software development. Intermittent hypoxia, structured rest, and a few other physiological interventions that produced measurable differences."
tags: productivity, biohacking, breathwork, startup
cover_image: /images/cover-images/37_cover_image.webp
cover_image_mobile: /images/cover-images/37_cover_image_mobile.webp
cover_color: "#1a2634"
---

I normally write about web frameworks, WebAssembly, and JavaScript internals. And I normally don't publish on a Saturday. But I've been wanting to write this for a while and today I woke up inspired, so here it is.

This isn't a technical article. It's personal. But I genuinely believe it can help a lot of people, especially developers and founders who spend long hours in front of a screen and feel like their brain gives up before their schedule does.

I want to talk about the things that changed my daily performance more than any tool, framework, or productivity app ever did. Not hypothetical stuff I read on a blog. Things I've been doing for months (some for years) that produced measurable, repeatable differences in how I work.

Here are the numbers first:

- Resting heart rate: 68 → 56 bpm
- Breathing rate: 14-16 → 8-10 breaths/min
- Deep work blocks: ~90 min max → 3-4 hours consistently
- Post-meeting recovery: 20-30 min → basically instant

None of this came from a supplement, an app, or a course. It came from applying things I learned through competitive athletics to how I work as a developer.

- [Some context about me](#some-context-about-me)
- [The parkour connection](#the-parkour-connection)
- [Hack #1: Intermittent hypoxia](#hack-1-intermittent-hypoxia)
  - [What it actually is](#what-it-actually-is)
  - [What changed for me](#what-changed-for-me)
  - [The science (briefly)](#the-science-briefly)
- [Hack #2: The Pomodoro technique, done right](#hack-2-the-pomodoro-technique-done-right)
  - [Why most people do it wrong](#why-most-people-do-it-wrong)
  - [The parkour parallel](#the-parkour-parallel)
  - [How I actually use it](#how-i-actually-use-it)
- [Hack #3: Walking meetings](#hack-3-walking-meetings)
- [Hack #4: Strategic caffeine](#hack-4-strategic-caffeine)
- [Hack #5: Cold exposure](#hack-5-cold-exposure)
- [Hack #6: Power naps](#hack-6-power-naps)
- [What didn't work](#what-didnt-work)
- [The thing nobody talks about: Silicon Valley already does this](#the-thing-nobody-talks-about-silicon-valley-already-does-this)
- [The physiological argument for founders](#the-physiological-argument-for-founders)
- [How to start](#how-to-start)
- [References](#references)

## Some context about me

I've been in software development for over ten years. Most of that time I've been deep in open source. I created [NextTranslate](https://github.com/aralroca/next-translate), [Teaful](https://github.com/teafuljs/teaful), and more recently [Brisa](https://brisa.build), a web framework built on web components. I also recently built [Kitmul](https://kitmul.com/en), which went from a testing ground for my libraries to 300+ browser-based tools in three weeks (I wrote about that [here](ai-agents-should-be-the-app)).

That's the professional side. But there's another side that's been part of my life for just as long: parkour.

## The parkour connection

I started doing parkour in the mid-2000s. By 2011 I was competing in Red Bull events. Not casually. This was serious training, serious risk, serious discipline. I trained alongside people who are now elite athletes preparing for the Olympics. Parkour will officially be part of the Games, and some of the people I used to train with are on that path.

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-aral-redbull.webp" alt="Aral competing at a Red Bull parkour event in Santorini" />
  <figcaption><small>Red Bull Art of Motion, Santorini</small></figcaption>
</figure>

In 2021 I had the worst accident of my life. I misjudged a jump from a rooftop to a fence, fell badly, and ended up in a coma for three days. When I woke up, my vestibular system was damaged. The apparatus that controls balance. For weeks I couldn't walk straight without the world spinning.

Most people would have quit parkour after that. I did the opposite. I used parkour as rehabilitation. I went back to basics. Simple movements, low risk, building balance from scratch. The mindset was the same one I apply to debugging: the jump wasn't the problem. My execution was. I analyzed what I did wrong, and I trained specifically to fix it.

It took years of patient work. But this year, I went back and completed that exact same jump. Rooftop to fence. Clean.

<iframe align="center" width="560" height="315" src="https://www.youtube.com/embed/cGpxGp7wHG8" frameborder="0" allowfullscreen></iframe>

I'm telling this story because it's directly relevant to everything that follows. The accident taught me something I already knew intellectually but had never felt in my bones: your body is the foundation of everything you do. When it breaks, nothing else matters. Not your code, not your startup, not your deadlines. And when you rebuild it deliberately, with discipline, everything else gets better too.

These days I do parkour as a hobby to stay in shape. But the years of competitive training, the accident, the recovery, gave me something that no programming book or productivity course ever could: an intuitive understanding of how the body and brain actually perform under pressure. And how fragile that performance is if you don't take care of the hardware.

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-aral-climbing.webp" alt="Aral climbing natural rock formations" />
  <figcaption><small>Training outdoors</small></figcaption>
</figure>

Athletes know things about performance that knowledge workers generally ignore. How rest periods affect output quality. How breathing patterns change your nervous system state. How adrenaline management is a trainable skill, not a personality trait. How the difference between a good day and a bad day often comes down to physiology, not motivation. And how you recover from failure matters more than the failure itself.

Once I started applying these principles to my work as a developer, everything changed.

And exercise itself, just moving your body regularly, is the most underrated performance hack that exists. It increases BDNF (the protein that helps your brain form new connections), regulates cortisol, improves sleep, and directly enhances executive function. Everything else I'm about to describe works better on top of a foundation of consistent physical activity. Parkour is my thing, but any movement practice works.

<iframe align="center" width="560" height="315" src="https://www.youtube.com/embed/Fz7hOUp0PXk" frameborder="0" allowfullscreen></iframe>

## Hack #1: Intermittent hypoxia

This is the one that surprised me the most.

### What it actually is

Intermittent hypoxia training (IHT) is simple: you alternate short periods of reduced oxygen breathing with normal recovery. It's the same principle behind altitude training, the thing that endurance athletes have been doing for decades to improve oxygen efficiency, except you can do it at sea level, sitting at your desk, in 15-30 minutes.

The protocol: controlled breathing cycles that temporarily reduce your blood oxygen saturation, followed by recovery breathing. Repeat for several rounds. That's it.

I started doing this to improve my breath-hold times and cardiovascular performance for parkour. The results in training were immediate. Longer runs, faster recovery between sequences, and much better composure during high-risk movements. When you're mid-air in a precision jump, the ability to manage your adrenaline response is not optional. IHT gave me noticeably more control over that.

### What changed for me

But the real surprise came outside of training sessions. And this is the part that I think matters for anyone who works with their brain.

After about two weeks of consistent IHT practice, I noticed something: **I was breathing more slowly throughout the entire day**. Not because I was trying to. My body had simply recalibrated. Where I used to take 14-16 breaths per minute sitting at my desk, I dropped to 8-10.

This sounds minor. It's not.

Patrick McKeown, author of _The Oxygen Advantage_, has documented extensively how slower, lighter nasal breathing improves CO2 tolerance. Higher CO2 tolerance means better oxygen delivery to tissues, including your brain. It's counterintuitive (more CO2 = better oxygenation?), but the physiology is well-established: CO2 is what triggers hemoglobin to release oxygen to cells (the Bohr effect). If you breathe fast and shallow, you actually reduce oxygen delivery despite taking in more air.

Here's what I noticed in my daily work after my breathing shifted:

**Sustained focus got dramatically easier.** I used to hit a wall at about 90 minutes of deep work. That wall moved to 3-4 hours. Not through willpower or discipline. I just didn't get tired as quickly. Better brain oxygenation, fewer stress hormones circulating, more stable energy.

**Adrenaline management at work.** This was the one I didn't expect. Running a startup (or even just being a senior developer) means constant high-stakes moments. A production incident at 2am. A hard conversation with a coworker. An investor call where you have 20 minutes to make your case. Before IHT, these situations would leave me wired for hours afterward. Now the recovery is almost instant. The same nervous system control that helps me stay calm mid-air during parkour helps me stay clear-headed during a crisis at work.

**Faster cognitive recovery.** After an intense 3-hour coding session or a difficult meeting, I used to need a significant break before I could do anything useful again. Now I bounce back in minutes. It's like my brain's recovery time dropped from "restart the computer" to "close the tab and open a new one."

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-meditation.webp" alt="Controlled breathing practice at sunrise" />
  <figcaption><small>The simplest performance intervention: breathe less</small></figcaption>
</figure>

### The science (briefly)

I'll keep this short because I'm a developer, not a scientist, but I did go down the rabbit hole on the research:

A 2022 study in _Frontiers in Neuroscience_ found that IHT causes "proadaptive modifications" in the brain, stimulating BDNF (brain-derived neurotrophic factor) and increasing what they called "the adaptive potential, endurance, and working capacity of the brain" [[1]](#references). Another study showed significant gains in memory recall and attention in participants following IHT protocols [[2]](#references).

The mechanism is called **hormesis**. Controlled, small doses of stress that make the body more resilient. Same principle as cold exposure, sauna, or fasting. The difference is that hypoxia specifically targets oxygen efficiency and neural adaptation.

A study published in _Physiology_ documented that intermittent hypoxia upregulates three growth factors (EPO, BDNF, and VEGF) all directly linked to enhanced neural function and cellular resilience [[10]](#references). This isn't about feeling zen. It's about building a more capable brain at the physiological level.

Andrew Huberman, a Stanford neuroscientist, has documented how breathing protocols shift autonomic nervous system state, reducing cortisol, increasing parasympathetic tone, and enhancing executive function [[4]](#references). IHT is essentially a more intense version of breathwork: it doesn't just teach you to breathe better in the moment. It permanently upgrades your baseline respiratory efficiency.

My resting heart rate went from 68 to 56 bpm. That's not a small change.

## Hack #2: The Pomodoro technique, done right

I know, I know. Everyone's heard of Pomodoro. "25 minutes of work, 5 minutes of break, revolutionary." Most people try it for a week and drop it because it feels artificial.

I did the same thing years ago. Then parkour taught me something that made me come back to it with a completely different understanding.

### Why most people do it wrong

The issue isn't the timer. It's what people do during the "break."

Most developers hit the 5-minute break and immediately check Slack, scroll Twitter, read email, or look at their phone. That's not rest. That's a different kind of cognitive load. Your prefrontal cortex doesn't get to discharge. It just switches to a different task. When the timer starts again, you're not fresh. You're fragmented.

### The parkour parallel

Here's what parkour taught me about rest, and it took me years to really internalize this:

**You need rest to improve. The gains happen during recovery, not during effort.**

In a parkour training session, you give 100% on a sequence. A run, a series of jumps, a technical combination. Then you walk back. You breathe. You shake out your arms. You stand there for a minute doing literally nothing. And then you go again at 100%.

If you skip that recovery and try to chain explosive movements back-to-back, two things happen: your performance degrades fast, and you get injured. Every serious practitioner learns this the hard way.

Your brain works exactly the same.

When you try to code for four straight hours without structured breaks, the last two hours are objectively worse. Your attention drifts. Your error rate climbs. You make architectural decisions you'll regret tomorrow. But you don't notice it in the moment because cognitive degradation is invisible from the inside.

### How I actually use it

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-focus.webp" alt="Focused deep work session at a desk" />
  <figcaption><small>25 minutes of this, then 5 minutes of not-this</small></figcaption>
</figure>

Once I understood that the 5-minute break is not a concession to weakness but the actual mechanism that makes high performance sustainable, Pomodoro clicked for me.

**25 minutes of full-intensity focus.** One task. No Slack. No email. No "quick check" on anything. If something pops into my head, I write it on a sticky note and go back to what I'm doing. The goal is to create a state of total immersion, the same mental state I'm in during a parkour sequence where I literally can't afford to think about anything else.

**5 minutes of real rest.** Stand up. Look out the window. Walk to the kitchen. Breathe. The key word is "real." Your eyes need to leave the screen. Your working memory needs to flush. If you don't do this, you're just doing 4 hours of gradually degrading work with arbitrary timer interruptions.

The parallel to parkour is direct: train hard in bursts, rest completely between sets. The rest is what lets you sustain 100% intensity. Without it, by the third round you're operating at 60% and making mistakes. Except at your desk, the "injury" is a bug you'll spend two days debugging.

Here's a trick I use that combines both hacks: **during some Pomodoro breaks, I do a quick round of breath-hold exercises.** Five minutes of controlled breathing resets my autonomic nervous system and primes me for the next focus block. It's like a mini-reboot. When the timer starts again, I'm genuinely fresh, not just "took a break" fresh.

After four Pomodoro cycles, I take a longer break of 15-20 minutes. Go outside if possible. Move. The compounding effect across a full day is dramatic. Hour six feels like hour one.

## Hack #3: Walking meetings

This one is simple but I almost never see people talk about it.

Many meetings don't require you to be sitting at a desk staring at slides. Status updates, brainstorming sessions, 1-on-1s, planning discussions. For all of these, you can be walking.

I use a walking treadmill at my desk during meetings. Slow pace, 3-4 km/h, just enough to keep blood flowing. The effects are immediate: better attention, less fidgeting, fewer distractions. There's something about low-intensity movement that keeps the brain engaged without consuming cognitive resources. Research backs this up: walking improves creative thinking and sustained attention.

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-aral-treadmill.webp" alt="Aral walking on a treadmill desk while working" />
  <figcaption><small>My walking treadmill setup. Most meetings don't require sitting.</small></figcaption>
</figure>

But here's the part nobody mentions: **what happens after the meeting.** When you've been sitting for an hour-long call, you finish drained. You need a transition period before you can do real work again. When you've been walking during that same call, you finish energized. You sit down at your desk and you're immediately ready to work. The meeting didn't drain your battery. It charged it.

This has been particularly useful for me during weeks with heavy meeting loads. The meetings themselves become light exercise, and the transitions between meetings and deep work become seamless.

Obviously this doesn't work for every meeting. If you're pair programming, sharing your screen, or doing a code review where you need to type, sit down. But for the 60-70% of meetings that are primarily conversation, walking is strictly better than sitting.

## Hack #4: Strategic caffeine

I've never been a big coffee drinker. But I noticed that the few times I did have coffee, the effect was massive. That got me thinking about why.

The answer is simple: most people drink coffee every day, and daily caffeine consumption builds tolerance fast. After a couple of weeks, your morning coffee doesn't enhance your performance. It gets you back to your baseline. You're not getting a boost. You're paying a tax (dependency, sleep disruption, afternoon crashes) to feel normal. That's a bad trade.

Because I don't have that daily habit, I can treat caffeine purely as a tool.

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-coffee.webp" alt="Coffee cups" />
  <figcaption><small>What if the daily coffee ritual is actually costing you more than it gives?</small></figcaption>
</figure>

Most days I drink water. Just water. This means my caffeine tolerance stays low. Then, when I actually need it (I slept poorly and have a big day ahead, there's a product launch, I'm doing a full day of complex pair programming) a single coffee delivers a genuine cognitive boost. Alertness, processing speed, working memory, all measurably better because my body isn't habituated.

Think of it like a power-up in a game. If you use it on every level, it stops being special. If you save it for the boss fight, it actually matters.

The transition period when you stop daily coffee is about a week of mild headaches and low energy. After that, you reach a new normal where you feel fine without it, and caffeine becomes something you choose to deploy strategically rather than something you depend on to function.

I know this one is controversial. Coffee culture is deeply embedded in developer identity. All I can say is: try it for two weeks and see what happens. The worst that can happen is you go back to your regular habit.

## Hack #5: Cold exposure

This is a quick one. A cold shower at the end of my normal shower, 60-90 seconds of cold water, produces a norepinephrine spike that improves alertness and mood for hours. This is well-documented by Huberman and others [[4]](#references).

I'm not doing ice baths or any extreme Wim Hof protocol. Just cold water at the end. The cost is minimal (it's uncomfortable for about 30 seconds, then you adapt). The effect on morning focus is noticeable and consistent.

Wim Hof's method (breathing + cold + meditation) was actually validated in a Radboud University study that showed trained participants could voluntarily influence their sympathetic nervous system and innate immune response [[8]](#references). That's remarkable. But you don't need the full method to get the basic alertness benefit. Just turn the handle to cold for a minute at the end of your shower.

## Hack #6: Power naps

When I hit a wall after lunch or after a heavy morning, a 20-30 minute nap resets me completely. Not a "nice to have." A genuine cognitive reboot.

The key is keeping it under 30 minutes. Go longer and you enter deep sleep, which means you wake up groggy and worse than before. But a short nap, 20 minutes is the sweet spot, clears the mental fog and gives you what feels like a second morning. I've had some of my most productive afternoons right after a power nap.

I don't schedule them. I just listen to my body. If I'm not tired, napping is pointless. But when the signal is there, fighting it with coffee or willpower is a losing strategy. The nap is faster, free, and has no side effects.

## What didn't work

I think it's important to mention what I tried that either didn't stick or didn't produce noticeable results. Not everything works for everyone, and I don't want to give the impression that I just tried five things and all five were magic.

**Meditation apps.** I tried Headspace and Calm for a few months each. They're well-made products, but guided meditation didn't produce the same physiological changes as breathwork and IHT. My suspicion is that meditation works better as a long-term practice (years, not months) while breathing protocols produce measurable changes in weeks. Your mileage may vary.

**Strict time-blocking the entire day.** I tried scheduling every 30-minute slot for a few weeks. It created more anxiety than productivity. Pomodoro works for me because it structures _intensity and rest_, not _content_. I decide what to work on, then I decide how intensely to focus on it. Scheduling every minute took away the flexibility that makes creative work possible.

## The thing nobody talks about: Silicon Valley already does this

<figure align="center">
  <img class="center" src="/images/blog-images/biohack-sv.webp" alt="Modern tech office corridor" />
  <figcaption><small>Behind the clean offices, a quiet obsession with physiological optimization</small></figcaption>
</figure>

Here's what I find interesting. These aren't fringe biohacking experiments. Breathwork and oxygen manipulation have been quietly adopted across the tech industry for years. Not as a trend, but as a serious performance tool.

Bryan Johnson, the founder of Braintree (sold to PayPal for $800M), spends roughly $2M per year on biohacking protocols. The man literally moved his office into a hyperbaric chamber [[5]](#references). Now, $2M/year is absurd and not what I'm suggesting. But the underlying logic, that physiological optimization directly translates to cognitive performance, is sound.

Jack Dorsey, co-founder of Twitter and Block, has practiced meditation and controlled breathing for over 20 years [[6]](#references). Tim Ferriss has dedicated entire podcast episodes to breathing protocols for performance, hosting James Nestor (author of the NYT bestseller _Breath: The New Science of a Lost Art_) to discuss how subtle breathing adjustments transform cognitive output [[7]](#references).

Dave Asprey, founder of Bulletproof, has worked extensively with Wim Hof. Patrick McKeown's Oxygen Advantage method, which is essentially breath-hold training that simulates altitude, has been adopted by athletes, military operators, and increasingly, tech executives [[3]](#references).

_Longevity Technology_ reported that biohacking has become "a major trend among Silicon Valley executives seeking to optimize health and performance," with breathwork, cryotherapy, and oxygen manipulation among the most commonly adopted protocols [[9]](#references).

What's telling is _why_ these people gravitate toward physiological hacks rather than (or in addition to) productivity software. When you're building something that demands 12-16 hours of sustained cognitive output per day, across months and years, the bottleneck is not your task manager. It's not your team structure. It's not your tech stack. **The bottleneck is your brain's ability to maintain quality output under sustained pressure.** That's a physiology problem, not a tooling problem.

And marginal gains in oxygen efficiency and stress resilience compound dramatically over time.

## The physiological argument for founders

The startup world glorifies hustle but ignores the hardware it runs on. You can optimize your deployment pipeline, your sprint process, your hiring funnel. But if your brain is running on shallow breathing and chronic cortisol, none of it matters. You're making your worst decisions at the end of the day, exactly when they matter most.

Consider what changes when your baseline physiology is different:

**Your resting heart rate drops.** Mine went from 68 to 56 bpm. A lower resting heart rate correlates with better cardiovascular efficiency, better stress recovery, and better autonomic regulation. You're literally running calmer all day.

**Your breathing rate drops.** 8 breaths per minute instead of 15. Fewer breaths means less sympathetic nervous system activation throughout the day. Less fight-or-flight. Less background anxiety. Less cortisol.

**Your work is structured around recovery.** Pomodoro ensures that hour six of your day is as sharp as hour one. You don't gradually degrade. You stay at peak performance in short bursts and actively recover between them.

**Your oxygen utilization improves.** The same blood volume delivers more oxygen to your prefrontal cortex, the part of your brain that handles planning, decision-making, and impulse control. The exact functions you need most as a founder.

**Your stress recovery accelerates.** The interval between "something went wrong" and "here's what we're going to do about it" shrinks from minutes to seconds. This is probably the most practically valuable change. In a startup, the speed at which you can move from panic to plan is everything.

None of this is woo. James Nestor's research, documented across multiple peer-reviewed collaborations, shows that breathing efficiency is one of the single highest-leverage interventions for cognitive performance [[7]](#references). And a study published in _Physiology_ documented that intermittent hypoxia upregulates EPO, BDNF, and VEGF, three growth factors directly linked to neural function and cellular resilience [[10]](#references).

## How to start

None of this requires expensive equipment or complicated protocols.

**Intermittent hypoxia, the 5-minute version:**

1. Breathe normally through your nose for 2 minutes. Just calm, quiet nasal breathing.
2. Take a normal breath in, exhale gently, and hold your breath.
3. Walk slowly while holding. When you feel a moderate urge to breathe, stop.
4. Resume nasal breathing and recover for 1-2 minutes.
5. Repeat for 6-8 rounds.

This is a simplified version of Patrick McKeown's Oxygen Advantage method [[3]](#references). It works by increasing your CO2 tolerance and training your body to do more with less oxygen, exactly what altitude training does, but at sea level.

For more structured sessions with timed rounds and progressive difficulty, I built an [intermittent hypoxia breathing timer](https://kitmul.com/en/sport-performance/hypoxia-breathing-timer) as one of the tools on Kitmul.

**Pomodoro, the non-negotiable version:**

1. Pick one task. Not "a few things." One.
2. Set a timer for 25 minutes.
3. Work at full focus. No Slack, no email, no phone.
4. When the timer rings, stop. Stand up. Walk away from your screen for 5 minutes.
5. Repeat. After 4 cycles, take a 15-20 minute break.

The discipline is in the rest, not the work. Anyone can focus for 25 minutes. The hard part is actually stopping and actually resting. If you want a good timer, there's a [Pomodoro timer on Kitmul](https://kitmul.com/en/agile-project-management/pomodoro-agile) too.

**Caffeine reset:**

Stop drinking coffee for one week. Push through the headaches (they peak at day 2-3 and disappear by day 5). Then only use caffeine on days when you genuinely need a boost. You'll be amazed at how much more effective a single cup becomes.

**Cold exposure:**

At the end of your normal shower, turn the water to cold for 60-90 seconds. That's it. The first week is uncomfortable. After that, it becomes almost pleasant, and the alertness benefit is consistent.

**Walking meetings:**

Buy a cheap walking treadmill. Use it during any meeting where you don't need to type. You'll finish meetings energized instead of drained.

---

I started all of this because of parkour. The breathing work, the structured rest, the body awareness. It all came from athletic training, not from reading productivity blogs. But the transfer to knowledge work was immediate and dramatic.

The best productivity hack I've found in over ten years of professional software development isn't a tool, a framework, or an AI agent. It's optimizing the machine that runs all the other machines: your body.

Oxygen and well-timed rest. That's it.

## References

1. Rybnikova, E. & Nalivaeva, N. (2022). "Intermittent Hypoxic Training as an Effective Tool for Increasing the Adaptive Potential, Endurance and Working Capacity of the Brain." _Frontiers in Neuroscience_. [Read study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9254677/)

2. Schega, L. et al. (2013). "Effects of Intermittent Hypoxia on Cognitive Performance and Quality of Life in Elderly Adults." _Gerontology_. [Read on PubMed](https://pubmed.ncbi.nlm.nih.gov/23689305/)

3. McKeown, P. _The Oxygen Advantage_. Breath-hold exercises that simulate altitude training at sea level. [Official site](https://oxygenadvantage.com/pages/patrick-mckeown-m-a-tcd)

4. Huberman, A. "Breathwork Protocols for Health, Focus & Stress." _Huberman Lab_. [Read article](https://www.hubermanlab.com/newsletter/breathwork-protocols-for-health-focus-stress)

5. Johnson, B. Braintree founder, $2M/year biohacking protocol including hyperbaric oxygen. [Source](https://longevity.technology/news/silicon-valleys-biohacking-obsession-why-tech-executives-are-hooked/)

6. Dorsey, J. 20+ years of meditation and breathwork practice. [Source](https://longevity.technology/news/silicon-valleys-biohacking-obsession-why-tech-executives-are-hooked/)

7. Nestor, J. _Breath: The New Science of a Lost Art_. NYT bestseller on breathing science. [Official site](https://www.mrjamesnestor.com/)

8. Wim Hof Method. Radboud University study on voluntary influence over sympathetic nervous system. [Read more](https://www.wimhofmethod.com/biohacking)

9. "Silicon Valley's biohacking obsession: Why tech executives are hooked." _Longevity Technology_. [Read article](https://longevity.technology/news/silicon-valleys-biohacking-obsession-why-tech-executives-are-hooked/)

10. Dale, E. et al. (2014). "Unexpected Benefits of Intermittent Hypoxia: Enhanced Respiratory and Nonrespiratory Motor Function." _Physiology_. [Read study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4073945/)

11. [Intermittent Hypoxia Breathing Timer](https://kitmul.com/en/sport-performance/hypoxia-breathing-timer). Free guided tool for structured IHT sessions.

12. [Pomodoro Timer](https://kitmul.com/en/agile-project-management/pomodoro-agile). Free focus timer with structured work/rest cycles.
