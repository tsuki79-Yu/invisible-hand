# Invisible Hand

Economics and finance for students: the 7 things to know about any country, news from reliable sources, concepts with their history, Q1 papers, films and research tools.

Plain HTML, CSS and JavaScript. No build step, no server, no cost.

## Put it online (GitHub Pages, free)

1. Create a **public** repository on GitHub, e.g. `invisible-hand`.
2. Upload everything in this folder, **including the hidden `.github` folder** (drag the whole folder in, or use GitHub Desktop).
3. In the repository: **Settings → Pages → Deploy from a branch → `main` / root → Save**.
4. In **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions** and save. This lets the news updater save new headlines.
5. In the **Actions** tab, open **Update data** and click **Run workflow** once to test it.

Your site: `https://<your-username>.github.io/invisible-hand/`

## What updates by itself

| What | How often | File |
|---|---|---|
| News headlines from 22 sources | every 3 hours | `data/news.js` |
| "Worth your attention" picks | every 3 hours | `data/spotlight.js` |
| Country data (World Bank) | once a day | `data/countries.js` |

"Worth your attention" is picked by `scripts/make-spotlight.mjs`: the story the most outlets are covering, next to a quieter story about the real economy, plus one pair from Uzbekistan & Central Asia. To write the picks by hand instead, set `"mode": "editor"` and today's date in `"updated"`; the automatic picker then leaves them alone for 7 days.

## What you edit by hand

| What | File |
|---|---|
| Topics, history chains, papers, quizzes, films, resources | `assets/content.js` |

Edit any of these on GitHub with the pencil icon. The site updates within a minute or two.

## Yu, the study-buddy penguin

`assets/yu.js` and `assets/yu.css`. Settings (reminder times, idle limit) are at the top of `assets/yu.js`.

- **Active time** counts only while the tab is visible and the student did something (scroll, click, type, move the mouse, touch) in the last 60 seconds.
- **Reminders:** at 10 minutes, a nudge to practise; every 25 minutes, alternating a break and an "explain it out loud" tip.
- Students can turn on **Quiet mode** or **hide Yu** from her menu. She hides in Seminar mode and keeps still for people who turn off animations in their device settings.

## Feedback by email (free)

Students write feedback through Yu (her menu, or "Send us feedback" in the footer). She folds it into a paper plane and it arrives in your inbox through [Web3Forms](https://web3forms.com).

1. Go to web3forms.com and enter the email where you want to receive messages.
2. Copy the access key they email you.
3. Paste it into `data/config.js` (`feedbackKey: '...'`).

Free plan: 250 messages a month. Until a key is added, Yu tells students sending isn't switched on yet and keeps their message.

## Run the updaters yourself

```bash
node scripts/fetch-news.mjs
node scripts/fetch-countries.mjs
```

## Folder map

```
index.html              the page
assets/style.css        design
assets/app.js           how it works
assets/content.js       learning content
data/                   news, country data, "worth your attention" picks
scripts/                updaters (run by GitHub Actions)
.github/workflows/      the schedule
```
