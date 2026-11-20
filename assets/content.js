/* Invisible Hand: learning content.
   Each topic: short concept cards (English + Gen Z), a history chain, key papers
   (all in Q1 journals), video searches, linked films and a quick quiz.
   To add a topic, copy one block and change it. */
window.IH_CONTENT = {

topics: [
/* ============================ ECONOMICS ============================ */
{
  id: "scarcity", area: "econ", level: "Beginner",
  title: "Scarcity & opportunity cost",
  tldr: { en: "We can't have everything, so every choice gives something up. Economics studies how people, firms and governments choose.",
          gz: "You can't have it all, bestie. Every yes is a no to something else, and economics is the study of those trade-offs." },
  cards: [
    { h: "Scarcity", en: "Wants are unlimited but time, money and resources are not. That gap forces choices at every level, from your lunch budget to a national budget.",
      gz: "Infinite wants, finite wallet. That gap is why choices exist at all." },
    { h: "Opportunity cost", en: "The real cost of a choice is the best alternative you give up. An evening studying costs you the shift you could have worked.",
      gz: "The real price of anything is the best thing you skipped for it. Netflix tonight = the gym you didn't hit." },
    { h: "Thinking at the margin", en: "Good decisions compare the extra benefit of one more unit with its extra cost. Should you study one more hour? Only if that hour is worth more than what it replaces.",
      gz: "Don't ask 'is studying good?' Ask 'is ONE more hour worth it?' That's marginal thinking." }
  ],
  chain: [
    { y: "1776", h: "Adam Smith's Wealth of Nations", t: "Smith shows how self-interested choices, coordinated by prices, can serve society. He calls this an 'invisible hand'." },
    { y: "1871", h: "The marginal revolution", t: "Jevons, Menger and Walras independently argue that value comes from the last unit consumed, not the total. Choices happen at the margin." },
    { y: "1894", h: "'Opportunity cost' gets a name", t: "American economist David Green uses the term in the Quarterly Journal of Economics to describe cost as the alternative given up." },
    { y: "1932", h: "Economics defined by scarcity", t: "Lionel Robbins defines economics as the study of choices between scarce means with alternative uses. The definition still opens most textbooks." },
    { y: "1945", h: "Prices as information", t: "Hayek argues prices carry knowledge no planner could collect. Scarcity shows up as a high price, and people adjust without being told." },
    { y: "1980", h: "People don't always do the maths", t: "Richard Thaler documents sunk-cost thinking: people keep paying for things because they already paid. Behavioural economics is born." }
  ],
  papers: [
    { a: "F. A. Hayek", y: 1945, t: "The Use of Knowledge in Society", j: "American Economic Review", url: "https://www.jstor.org/stable/1809376" },
    { a: "R. Thaler", y: 1980, t: "Toward a Positive Theory of Consumer Choice", j: "Journal of Economic Behavior & Organization", url: "https://doi.org/10.1016/0167-2681(80)90051-7" }
  ],
  videos: [["Marginal Revolution University", "opportunity cost"], ["Khan Academy", "scarcity opportunity cost"], ["Crash Course Economics", "intro to economics"]],
  quiz: [
    { q: "You skip a 100,000 so'm shift to attend a free concert. What is the opportunity cost of the concert?", o: ["Zero, the ticket was free", "100,000 so'm of lost wages", "The price of a paid ticket"], a: 1, why: "The cost is the best alternative given up: the wages you would have earned." },
    { q: "'Thinking at the margin' means asking…", o: ["Is this activity good overall?", "Is one more unit worth its extra cost?", "What is the average cost?"], a: 1, why: "Marginal decisions compare the extra benefit and extra cost of one more unit." },
    { q: "Which statement shows the sunk-cost fallacy?", o: ["I'll leave the boring film, the ticket money is gone anyway", "I paid for the gym, so I must go even when I'm ill", "I'll compare the cost of two phones"], a: 1, why: "Money already spent can't be recovered, so it shouldn't drive the next choice." }
  ]
},
{
  id: "supply-demand", area: "econ", level: "Beginner", tool: "sd",
  title: "Supply & demand",
  tldr: { en: "Prices come from the tug-of-war between buyers and sellers. Shift either side and the price and quantity move.",
          gz: "Price = buyers vs sellers in a tug-of-war. Hype goes up, price goes up. More sellers show up, price chills out." },
  cards: [
    { h: "Demand", en: "As the price falls, people want more. Income, tastes and the prices of related goods shift the whole demand curve.",
      gz: "Cheaper = more people want it. A new trend moves the whole curve." },
    { h: "Supply", en: "As the price rises, firms offer more. Costs, technology and the number of sellers shift the supply curve.",
      gz: "Higher price = more sellers hop in. Cheaper production pushes supply out." },
    { h: "Equilibrium", en: "Where the curves cross, the amount buyers want equals the amount sellers offer. Shortages push prices up and surpluses push them down until they meet.",
      gz: "Where the lines cross is the vibe check: no shortage, no leftovers." }
  ],
  chain: [
    { y: "1767", h: "The phrase appears", t: "Scottish economist James Steuart is credited with the first use of the phrase 'supply and demand' in his Principles of Political Oeconomy." },
    { y: "1776", h: "Market price vs natural price", t: "Adam Smith explains how market prices circle around the cost of production as buyers and sellers react." },
    { y: "1838", h: "The first demand curve", t: "Antoine Augustin Cournot writes demand as a mathematical function of price, the first formal demand curve." },
    { y: "1870", h: "The cross diagram", t: "Engineer Fleeming Jenkin draws supply and demand curves crossing on one chart, the picture every student now learns." },
    { y: "1890", h: "Marshall's scissors", t: "Alfred Marshall's Principles of Economics makes the diagram standard. Asking whether supply or demand sets the price, he says, is like asking which blade of the scissors cuts." },
    { y: "1962", h: "Tested in a classroom", t: "Vernon Smith runs market experiments with students and finds prices converge to equilibrium. He wins the Nobel Prize in 2002." }
  ],
  papers: [
    { a: "E. J. Working", y: 1927, t: "What Do Statistical 'Demand Curves' Show?", j: "Quarterly Journal of Economics", url: "https://doi.org/10.2307/1883501" },
    { a: "V. L. Smith", y: 1962, t: "An Experimental Study of Competitive Market Behavior", j: "Journal of Political Economy", url: "https://doi.org/10.1086/258609" }
  ],
  videos: [["Marginal Revolution University", "supply and demand"], ["Khan Academy", "market equilibrium"], ["Economics Explained", "supply and demand"]],
  quiz: [
    { q: "A new study says cotton T-shirts are bad for the planet. What happens in the cotton T-shirt market?", o: ["Demand falls, price falls", "Supply falls, price rises", "Demand rises, price rises"], a: 0, why: "Tastes changed, so the demand curve shifts left. Price and quantity both fall." },
    { q: "A cheaper way to grow cotton is invented. The supply curve…", o: ["Shifts left", "Shifts right", "Doesn't move"], a: 1, why: "Lower costs let firms offer more at every price, so supply shifts right." },
    { q: "At a price below equilibrium there is…", o: ["A surplus", "A shortage", "Equilibrium"], a: 1, why: "Buyers want more than sellers offer, so there is a shortage and the price is pushed up." }
  ]
},
{
  id: "market-failures", area: "econ", level: "Intermediate",
  title: "Market failures",
  tldr: { en: "Markets go wrong when prices miss costs (pollution), when no one can be excluded (street lights) or when one side knows more (used cars).",
          gz: "Markets fumble when the price is lying: pollution nobody pays for, stuff everyone free-rides on, or sellers who know more than you." },
  cards: [
    { h: "Externalities", en: "A cost or benefit that lands on people outside the deal. A factory's smoke harms neighbours who never agreed to it, so the market produces too much.",
      gz: "When your deal splashes on someone else. The factory gets paid, the neighbours get the smoke." },
    { h: "Public goods", en: "Goods no one can be stopped from using and that don't run out, like national defence or clean air. People free-ride, so markets underprovide them.",
      gz: "Everyone uses it, nobody wants to pay. Classic group-project energy." },
    { h: "Asymmetric information", en: "When one side knows more, good products get driven out. Buyers can't tell a good used car from a bad one, so they offer an average price and good sellers leave.",
      gz: "Seller knows the car's a lemon, you don't. Trust breaks, good stuff leaves the chat." }
  ],
  chain: [
    { y: "1920", h: "Pigou taxes the smoke", t: "Arthur Pigou argues governments should tax activities that harm others. 'Pigouvian taxes' like carbon taxes come from here." },
    { y: "1954", h: "Public goods defined", t: "Paul Samuelson shows mathematically why markets underprovide goods everyone can use at once." },
    { y: "1960", h: "Coase's twist", t: "Ronald Coase argues that if property rights are clear and bargaining is cheap, the parties can fix externalities themselves." },
    { y: "1968", h: "Tragedy of the commons", t: "Garrett Hardin warns that shared resources like pastures and fisheries get overused when everyone acts alone." },
    { y: "1970", h: "The market for lemons", t: "George Akerlof shows how hidden information can make a market collapse. Three journals rejected the paper before it was published." },
    { y: "2009", h: "Ostrom's answer", t: "Elinor Ostrom wins the Nobel for showing that communities often manage shared resources well without the state or private owners." }
  ],
  papers: [
    { a: "G. A. Akerlof", y: 1970, t: "The Market for 'Lemons': Quality Uncertainty and the Market Mechanism", j: "Quarterly Journal of Economics", url: "https://doi.org/10.2307/1879431" },
    { a: "R. H. Coase", y: 1960, t: "The Problem of Social Cost", j: "Journal of Law and Economics", url: "https://doi.org/10.1086/466560" },
    { a: "P. A. Samuelson", y: 1954, t: "The Pure Theory of Public Expenditure", j: "Review of Economics and Statistics", url: "https://doi.org/10.2307/1925895" }
  ],
  videos: [["Marginal Revolution University", "externalities"], ["Crash Course Economics", "market failures"], ["Khan Academy", "public goods"]],
  quiz: [
    { q: "A carbon tax is an example of…", o: ["A Pigouvian tax", "A tariff", "A subsidy"], a: 0, why: "It puts a price on a harmful externality, as Pigou proposed." },
    { q: "Why do markets underprovide street lighting?", o: ["It is too expensive", "People can use it without paying", "Nobody wants it"], a: 1, why: "It is non-excludable, so people free-ride instead of paying." },
    { q: "In Akerlof's used-car market, which cars leave first?", o: ["The worst ones", "The best ones", "None"], a: 1, why: "Buyers pay an average price, so owners of good cars won't sell." }
  ]
},
{
  id: "gdp", area: "econ", level: "Beginner",
  title: "Measuring the economy",
  tldr: { en: "GDP measures everything a country produces in a year. Growth, unemployment and GDP per person tell you how an economy is really doing.",
          gz: "GDP is a country's annual receipt. Growth = is it leveling up, unemployment = who's left out." },
  cards: [
    { h: "GDP", en: "The market value of all final goods and services produced in a country in a year. It can be counted three ways: spending, income or production.",
      gz: "Everything a country makes in a year, priced up. Three ways to count it, same answer." },
    { h: "Real vs nominal", en: "Nominal GDP uses today's prices. Real GDP removes inflation so you can see whether the economy produced more, not just charged more.",
      gz: "Nominal = with price glow-up. Real = inflation filter removed. Real is the honest one." },
    { h: "Unemployment", en: "The share of people who want a job and are looking but can't find one. Students and retirees who aren't looking don't count.",
      gz: "Only counts people actively job hunting. Chilling students don't count." }
  ],
  chain: [
    { y: "1665", h: "The first estimate", t: "William Petty estimates England's national income to show how much tax the country could raise for war." },
    { y: "1934", h: "Kuznets reports to Congress", t: "Simon Kuznets builds the first official US national income accounts. He also warns that a nation's welfare can't be inferred from income alone." },
    { y: "1944", h: "GDP goes global", t: "After the Bretton Woods conference, GDP becomes the standard way to compare economies." },
    { y: "1953", h: "One rulebook for all", t: "The UN publishes the System of National Accounts so every country measures GDP the same way." },
    { y: "1958", h: "Jobs vs wages", t: "A. W. Phillips links unemployment to wage growth in the UK, connecting the labour market to the wider economy." },
    { y: "2009", h: "Beyond GDP", t: "The Stiglitz–Sen–Fitoussi report urges countries to also track wellbeing, inequality and sustainability." }
  ],
  papers: [
    { a: "S. Kuznets", y: 1955, t: "Economic Growth and Income Inequality", j: "American Economic Review", url: "https://www.jstor.org/stable/1811581" },
    { a: "A. W. Phillips", y: 1958, t: "The Relation between Unemployment and the Rate of Change of Money Wage Rates in the UK, 1861–1957", j: "Economica", url: "https://doi.org/10.1111/j.1468-0335.1958.tb00003.x" }
  ],
  videos: [["Marginal Revolution University", "GDP"], ["Crash Course Economics", "GDP"], ["Money & Macro", "GDP"]],
  quiz: [
    { q: "Prices doubled but the country made exactly the same goods. Real GDP…", o: ["Doubled", "Stayed the same", "Halved"], a: 1, why: "Real GDP removes price changes, so nothing changed in real terms." },
    { q: "Which of these is counted in GDP?", o: ["Buying a second-hand car", "A new phone made this year", "Buying shares"], a: 1, why: "GDP counts new final goods and services, not resales or financial trades." },
    { q: "A student who isn't looking for work is…", o: ["Unemployed", "Outside the labour force", "Employed"], a: 1, why: "Unemployment only counts people actively looking for work." }
  ]
},
{
  id: "inflation", area: "econ", level: "Beginner", tool: "inflation",
  title: "Inflation",
  tldr: { en: "Inflation is the general rise in prices. It means each so'm, dollar or euro buys a little less than last year.",
          gz: "Inflation = your money slowly getting nerfed. Same cash, smaller bag of groceries." },
  cards: [
    { h: "What it measures", en: "Statisticians price a typical basket of goods and services every month. Inflation is how fast that basket's price rises, usually over a year.",
      gz: "They price a 'typical shopping basket' every month. Inflation = how fast it gets pricier." },
    { h: "Why it happens", en: "Too much money chasing too few goods (demand-pull), rising costs such as energy (cost-push), and expectations that become self-fulfilling.",
      gz: "Too much cash chasing too little stuff, costs going up, or everyone expecting higher prices so they happen." },
    { h: "Who wins, who loses", en: "Savers and people on fixed incomes lose. Borrowers with fixed-rate loans gain, because they repay with money that's worth less.",
      gz: "Savers take the L. Borrowers lowkey win because they pay back in weaker money." }
  ],
  chain: [
    { y: "1500s", h: "The price revolution", t: "Silver from the Americas floods Europe through Spain. Prices rise for a century." },
    { y: "1568", h: "Bodin's explanation", t: "French jurist Jean Bodin argues the new silver, not greedy merchants, is driving prices up. It's an early version of 'more money, higher prices'." },
    { y: "1752", h: "Hume on money", t: "David Hume explains how more money first boosts activity, then just raises prices. That idea still frames debates today." },
    { y: "1923", h: "German hyperinflation", t: "Weimar Germany prints money to pay its bills. Prices double every few days, wiping out savings and destabilising politics." },
    { y: "1968", h: "Friedman's warning", t: "Milton Friedman (and Edmund Phelps) argue there's no lasting trade-off: printing money to cut unemployment only brings higher inflation." },
    { y: "1979", h: "The Volcker shock", t: "After a decade of 1970s 'stagflation', Fed chair Paul Volcker raises interest rates to near 20% and breaks US inflation." },
    { y: "1990", h: "Inflation targeting", t: "New Zealand becomes the first country to give its central bank an explicit inflation target. Most central banks follow." },
    { y: "2021", h: "The post-COVID surge", t: "Supply chain snarls, stimulus and an energy shock push inflation to 40-year highs in many countries, testing the targeting framework." }
  ],
  papers: [
    { a: "M. Friedman", y: 1968, t: "The Role of Monetary Policy", j: "American Economic Review", url: "https://www.jstor.org/stable/1831652" },
    { a: "F. E. Kydland & E. C. Prescott", y: 1977, t: "Rules Rather than Discretion: The Inconsistency of Optimal Plans", j: "Journal of Political Economy", url: "https://doi.org/10.1086/260580" }
  ],
  videos: [["Marginal Revolution University", "inflation"], ["Money & Macro", "inflation"], ["The Economist", "inflation explained"]],
  quiz: [
    { q: "Inflation is 10% and your savings account pays 4%. Your real return is about…", o: ["+14%", "+4%", "−6%"], a: 2, why: "Real return ≈ nominal rate − inflation = 4% − 10% = −6%." },
    { q: "Who usually gains from surprise inflation?", o: ["Savers", "Borrowers with fixed-rate loans", "Pensioners"], a: 1, why: "They repay with money that has lost value." },
    { q: "A big jump in oil prices raising everything else is…", o: ["Demand-pull inflation", "Cost-push inflation", "Deflation"], a: 1, why: "Higher production costs push prices up." }
  ]
},
{
  id: "central-banks", area: "econ", level: "Intermediate",
  title: "Money & central banks",
  tldr: { en: "Central banks control the price of money, the interest rate. Raising it cools inflation; cutting it supports jobs and growth.",
          gz: "Central bank = the economy's thermostat. Rates up to cool inflation, rates down to heat up growth." },
  cards: [
    { h: "What money does", en: "Money is a medium of exchange, a unit of account and a store of value. Modern money is trusted because of the institutions behind it, not gold.",
      gz: "Money = trade it, price stuff in it, save it. It works because we trust the system, not because it's gold." },
    { h: "The policy rate", en: "The central bank sets a short-term interest rate. Banks pass it on to loans and deposits, which changes how much people borrow, spend and save.",
      gz: "They set one key rate, and it trickles into your loan, your savings and how much everyone spends." },
    { h: "Lender of last resort", en: "In a panic the central bank lends to solvent banks so a run doesn't take down the whole system.",
      gz: "When banks panic, the central bank is the emergency contact." }
  ],
  chain: [
    { y: "1668", h: "The first central bank", t: "Sweden's Riksbank is founded. It is the oldest central bank still operating." },
    { y: "1694", h: "Bank of England", t: "Created to lend to the government for war. It becomes the model for central banks worldwide." },
    { y: "1873", h: "Bagehot's rule", t: "Walter Bagehot's Lombard Street says: in a crisis, lend freely to sound banks, against good collateral, at a high rate. Central banks still follow it." },
    { y: "1913", h: "The Federal Reserve", t: "After repeated banking panics, the US creates the Fed." },
    { y: "1930", h: "When the central bank fails", t: "The Fed lets thousands of banks fail, and the money supply collapses. Friedman, Schwartz and later Bernanke blame this for the depth of the Great Depression." },
    { y: "1993", h: "The Taylor rule", t: "John Taylor shows that Fed decisions roughly follow a simple formula based on inflation and output." },
    { y: "2008", h: "Quantitative easing", t: "With rates near zero, central banks buy bonds on a massive scale to keep money flowing after the global financial crisis." }
  ],
  papers: [
    { a: "J. B. Taylor", y: 1993, t: "Discretion versus Policy Rules in Practice", j: "Carnegie-Rochester Conference Series on Public Policy", url: "https://doi.org/10.1016/0167-2231(93)90009-L" },
    { a: "B. S. Bernanke", y: 1983, t: "Nonmonetary Effects of the Financial Crisis in the Propagation of the Great Depression", j: "American Economic Review", url: "https://www.jstor.org/stable/1808111" }
  ],
  videos: [["Money & Macro", "central bank"], ["Marginal Revolution University", "federal reserve"], ["Ben Felix", "interest rates"]],
  quiz: [
    { q: "Inflation is well above target. The central bank most likely…", o: ["Cuts the policy rate", "Raises the policy rate", "Prints more money"], a: 1, why: "Higher rates make borrowing costlier, cooling spending and inflation." },
    { q: "Bagehot's rule says that in a panic, central banks should…", o: ["Lend freely to sound banks at a high rate", "Let banks fail", "Freeze all lending"], a: 0, why: "Lend freely, against good collateral, at a penalty rate." },
    { q: "Quantitative easing means the central bank…", o: ["Raises taxes", "Buys bonds to push down long-term rates", "Sells gold"], a: 1, why: "QE adds money by buying assets when short rates can't go lower." }
  ]
},
{
  id: "trade", area: "econ", level: "Intermediate",
  title: "Trade & exchange rates",
  tldr: { en: "Countries gain by specialising in what they do relatively best and trading. Exchange rates set how much your currency buys abroad.",
          gz: "Do what you're relatively best at, trade for the rest. Exchange rate = how far your money stretches abroad." },
  cards: [
    { h: "Comparative advantage", en: "Even if one country is better at everything, both gain when each specialises in what it gives up least to produce.",
      gz: "Even if you're better at everything, teaming up still wins. Focus on your least-costly skill." },
    { h: "Exchange rates", en: "The price of one currency in another. A weaker so'm makes Uzbek exports cheaper abroad but imports and foreign holidays pricier.",
      gz: "Weaker so'm = exports go brrr, but your imported sneakers cost more." },
    { h: "Tariffs", en: "Taxes on imports. They protect some domestic producers but raise prices for consumers and invite retaliation.",
      gz: "Import taxes. Some local brands win, shoppers pay more, other countries clap back." }
  ],
  chain: [
    { y: "1600s", h: "Mercantilism", t: "European states hoard gold and limit imports, believing exports alone make a nation rich." },
    { y: "1776", h: "Smith attacks mercantilism", t: "Adam Smith argues wealth is what a nation can produce and consume, not gold. Free trade lets countries specialise." },
    { y: "1817", h: "Ricardo's wine and cloth", t: "David Ricardo proves comparative advantage: England and Portugal both gain from trade even though Portugal is better at both goods." },
    { y: "1944", h: "Bretton Woods", t: "44 countries fix their currencies to the dollar, which is tied to gold. The IMF and World Bank are created." },
    { y: "1971", h: "The dollar floats", t: "President Nixon ends the dollar's convertibility to gold. Major currencies start floating against each other." },
    { y: "1995", h: "The WTO", t: "The World Trade Organization replaces GATT and sets global trade rules." },
    { y: "2017", h: "Uzbekistan floats the so'm", t: "In September 2017 Uzbekistan liberalises its currency market, ending the gap between official and black-market rates." }
  ],
  papers: [
    { a: "P. Krugman", y: 1980, t: "Scale Economies, Product Differentiation, and the Pattern of Trade", j: "American Economic Review", url: "https://www.jstor.org/stable/1805774" },
    { a: "R. Dornbusch", y: 1976, t: "Expectations and Exchange Rate Dynamics", j: "Journal of Political Economy", url: "https://doi.org/10.1086/260506" },
    { a: "M. J. Melitz", y: 2003, t: "The Impact of Trade on Intra-Industry Reallocations and Aggregate Industry Productivity", j: "Econometrica", url: "https://doi.org/10.1111/1468-0262.00467" }
  ],
  videos: [["Marginal Revolution University", "comparative advantage"], ["Economics Explained", "exchange rates"], ["Money & Macro", "trade war"]],
  quiz: [
    { q: "The so'm weakens against the dollar. Uzbek exports become…", o: ["Cheaper for foreign buyers", "More expensive for foreign buyers", "Unaffected"], a: 0, why: "Foreigners need fewer dollars to buy the same so'm-priced goods." },
    { q: "Comparative advantage depends on…", o: ["Who produces most", "Who gives up the least to produce", "Who has more money"], a: 1, why: "It is about the lowest opportunity cost, not absolute ability." },
    { q: "Who pays most of a tariff on imported phones?", o: ["Only the foreign firm", "Domestic buyers through higher prices", "Nobody"], a: 1, why: "Much of a tariff is passed on to consumers as higher prices." }
  ]
},
{
  id: "growth", area: "econ", level: "Intermediate",
  title: "Growth & development",
  tldr: { en: "Long-run living standards depend on productivity: technology, skills, capital and, above all, good institutions.",
          gz: "Getting rich long-term = being productive. Tech, skills, tools and rules that actually work." },
  cards: [
    { h: "Productivity", en: "Output per worker is what raises wages over decades. It grows through better tools, better skills and better ideas.",
      gz: "How much you make per hour of work. Better tools + skills + ideas = bigger paychecks over time." },
    { h: "Catch-up growth", en: "Poorer countries can grow faster by adopting existing technology. That's why Uzbekistan can grow 5–8% a year while rich countries grow 1–2%.",
      gz: "Copying what already works = speedrun mode. That's why emerging economies grow faster." },
    { h: "Institutions", en: "Secure property rights, the rule of law and limits on power encourage people to invest. Countries with similar geography can end up very different.",
      gz: "Rules of the game matter. Fair courts + safe property = people actually invest." }
  ],
  chain: [
    { y: "1776", h: "Division of labour", t: "Smith's pin factory shows how specialisation multiplies output per worker." },
    { y: "1798", h: "The Malthusian trap", t: "Thomas Malthus argues population growth will always eat up gains in food production. For most of history he is right." },
    { y: "1956", h: "The Solow model", t: "Robert Solow shows capital alone can't sustain growth because of diminishing returns. Technology must do the work." },
    { y: "1990", h: "Ideas drive growth", t: "Paul Romer models technology as the product of research and ideas, which don't get used up. He wins the 2018 Nobel." },
    { y: "2001", h: "Institutions rule", t: "Acemoglu, Johnson and Robinson link today's income gaps to the institutions colonisers set up. They win the 2024 Nobel." }
  ],
  papers: [
    { a: "R. M. Solow", y: 1956, t: "A Contribution to the Theory of Economic Growth", j: "Quarterly Journal of Economics", url: "https://doi.org/10.2307/1884513" },
    { a: "P. M. Romer", y: 1990, t: "Endogenous Technological Change", j: "Journal of Political Economy", url: "https://doi.org/10.1086/261725" },
    { a: "D. Acemoglu, S. Johnson & J. A. Robinson", y: 2001, t: "The Colonial Origins of Comparative Development", j: "American Economic Review", url: "https://doi.org/10.1257/aer.91.5.1369" },
    { a: "N. G. Mankiw, D. Romer & D. N. Weil", y: 1992, t: "A Contribution to the Empirics of Economic Growth", j: "Quarterly Journal of Economics", url: "https://doi.org/10.2307/2118477" }
  ],
  videos: [["Marginal Revolution University", "Solow model"], ["Economics Explained", "why some countries are poor"], ["Money & Macro", "economic growth"]],
  quiz: [
    { q: "In the Solow model, what sustains growth in the long run?", o: ["More machines", "Technological progress", "More money"], a: 1, why: "Capital hits diminishing returns; only technology keeps output per worker rising." },
    { q: "Why can poorer countries grow faster?", o: ["They print more money", "They can adopt existing technology", "They have less inflation"], a: 1, why: "Catch-up growth comes from copying proven technology and practices." },
    { q: "The 2024 Nobel Prize recognised research on…", o: ["Institutions and prosperity", "Black holes", "Stock options"], a: 0, why: "Acemoglu, Johnson and Robinson studied how institutions shape prosperity." }
  ]
},

/* ============================ FINANCE ============================ */
{
  id: "compounding", area: "fin", level: "Beginner", tool: "compound",
  title: "Interest & compounding",
  tldr: { en: "Money now is worth more than money later. Compounding (earning interest on interest) turns small, early savings into large sums.",
          gz: "Money today > money later. Compounding = your interest earns interest. Start early, thank yourself later." },
  cards: [
    { h: "Time value of money", en: "A dollar today can be invested to become more than a dollar tomorrow. That's why future money is 'discounted'.",
      gz: "Cash today can grow, cash tomorrow can't (yet). So future money is worth less now." },
    { h: "Compounding", en: "Each year you earn interest on your original money and on past interest. Growth accelerates over time, which is why starting early matters more than saving a lot.",
      gz: "Interest on interest on interest. Slow at first, then it goes vertical." },
    { h: "Rule of 72", en: "Divide 72 by the annual interest rate to estimate how many years money takes to double. At 8%, about 9 years.",
      gz: "72 ÷ rate = years to double your money. 8%? About 9 years. Easy mental math." }
  ],
  chain: [
    { y: "c.1800 BCE", h: "Babylonian tablets", t: "Old Babylonian clay tablets set problems on how long money takes to double at compound interest." },
    { y: "1202", h: "Fibonacci's present value", t: "In Liber Abaci, Fibonacci shows merchants how to compare payments at different dates, an early present-value calculation." },
    { y: "1613", h: "Interest tables", t: "Englishman Richard Witt publishes tables of compound interest, the first finance calculator." },
    { y: "1683", h: "Bernoulli finds e", t: "Jacob Bernoulli asks what happens if interest compounds more and more often, and discovers the constant e ≈ 2.718." },
    { y: "1930", h: "Fisher's Theory of Interest", t: "Irving Fisher explains interest as the price of time: impatience versus investment opportunities." },
    { y: "1938", h: "Discounted cash flow", t: "John Burr Williams values a share as the present value of its future dividends. Investors still use DCF valuation today." }
  ],
  papers: [
    { a: "P. A. Samuelson", y: 1937, t: "A Note on Measurement of Utility", j: "Review of Economic Studies", url: "https://doi.org/10.2307/2967612" },
    { a: "R. H. Thaler & S. Benartzi", y: 2004, t: "Save More Tomorrow: Using Behavioral Economics to Increase Employee Saving", j: "Journal of Political Economy", url: "https://doi.org/10.1086/380085" }
  ],
  videos: [["Khan Academy", "compound interest"], ["Humphrey Yang", "compound interest"], ["Ben Felix", "time value of money"]],
  quiz: [
    { q: "Using the rule of 72, money at 6% doubles in about…", o: ["6 years", "12 years", "72 years"], a: 1, why: "72 ÷ 6 = 12 years." },
    { q: "Who ends up with more at 65: Aziza who saves from 25 to 35, or Bekzod who saves the same yearly amount from 35 to 65?", o: ["Often Aziza", "Always Bekzod", "Always equal"], a: 0, why: "Aziza's money compounds for 30 more years; at typical returns, early saving can beat three times as many later contributions." },
    { q: "1,000 at 10% a year, compounded for 2 years, becomes…", o: ["1,200", "1,210", "1,100"], a: 1, why: "1,000 × 1.1 × 1.1 = 1,210. The extra 10 is interest on interest." }
  ]
},
{
  id: "markets", area: "fin", level: "Beginner",
  title: "Stocks, bonds & markets",
  tldr: { en: "Stocks are ownership in a company; bonds are loans to it or to a government. Markets let savers fund businesses and price risk.",
          gz: "Stocks = you own a slice. Bonds = you're the lender. Markets connect people with cash to people with ideas." },
  cards: [
    { h: "Stocks", en: "A share is a piece of ownership. You profit through dividends and rising prices, and you can lose it all if the company fails.",
      gz: "A share = a tiny piece of the company. Big upside, but it can also go to zero." },
    { h: "Bonds", en: "A bond is an IOU. The issuer pays fixed interest and returns your money at maturity. When interest rates rise, existing bond prices fall.",
      gz: "Bond = an IOU with interest. Rates up → old bonds lose value. Remember that one." },
    { h: "Index funds", en: "An index fund owns every stock in an index like the S&P 500. It's cheap and diversified, and most active managers fail to beat it.",
      gz: "Buy the whole market in one click. Low fees, and most pros don't beat it." }
  ],
  chain: [
    { y: "1602", h: "The first shares", t: "The Dutch East India Company sells shares to the public, and they trade in Amsterdam: the first modern stock market." },
    { y: "1792", h: "The Buttonwood Agreement", t: "24 brokers sign a deal under a tree on Wall Street, the start of the New York Stock Exchange." },
    { y: "1929", h: "The great crash", t: "Prices built on borrowed money collapse. The US then creates the SEC (1934) to police markets." },
    { y: "1970", h: "Efficient markets", t: "Eugene Fama argues prices quickly reflect available information, so it's hard to beat the market consistently." },
    { y: "1976", h: "The first index fund", t: "John Bogle's Vanguard launches an index fund for ordinary investors. Critics call it 'Bogle's folly'; today trillions follow it." },
    { y: "2021", h: "GameStop", t: "Retail traders coordinating online push GameStop shares up more than 1,000%, squeezing hedge funds betting against it." }
  ],
  papers: [
    { a: "E. F. Fama", y: 1970, t: "Efficient Capital Markets: A Review of Theory and Empirical Work", j: "Journal of Finance", url: "https://doi.org/10.2307/2325486" },
    { a: "R. J. Shiller", y: 1981, t: "Do Stock Prices Move Too Much to be Justified by Subsequent Changes in Dividends?", j: "American Economic Review", url: "https://www.jstor.org/stable/1802789" },
    { a: "F. Black & M. Scholes", y: 1973, t: "The Pricing of Options and Corporate Liabilities", j: "Journal of Political Economy", url: "https://doi.org/10.1086/260062" }
  ],
  videos: [["The Plain Bagel", "stocks vs bonds"], ["Ben Felix", "index funds"], ["Patrick Boyle", "stock market"]],
  quiz: [
    { q: "Interest rates rise. What happens to the price of bonds you already own?", o: ["It rises", "It falls", "It stays the same"], a: 1, why: "New bonds pay more, so old, lower-paying bonds are worth less." },
    { q: "Owning a share means you…", o: ["Lent money to the firm", "Own part of the firm", "Are guaranteed a dividend"], a: 1, why: "Shares are ownership; dividends are never guaranteed." },
    { q: "Why do index funds often beat active funds?", o: ["Lower fees and markets are hard to beat", "They pick the best stocks", "They are guaranteed by the state"], a: 0, why: "Costs matter and few managers beat the market consistently." }
  ]
},
{
  id: "risk", area: "fin", level: "Intermediate", tool: "diversify",
  title: "Risk, return & diversification",
  tldr: { en: "Higher expected returns come with higher risk. Spreading money across many assets cuts risk without cutting the expected return.",
          gz: "More reward = more risk. But diversifying is the one free lunch: less risk, same expected return." },
  cards: [
    { h: "Risk and return", en: "Investors demand higher expected returns for taking more risk. That's why stocks have historically beaten savings accounts, with bigger swings.",
      gz: "Want bigger gains? Accept bigger swings. No risk, no reward." },
    { h: "Diversification", en: "Assets don't all fall at once. Combining them smooths out the ups and downs. Nobel laureate Harry Markowitz called it 'the only free lunch' in finance.",
      gz: "Don't put all your eggs in one basket. Mix it up and the drops hurt less." },
    { h: "Systematic risk", en: "Some risk can't be diversified away, like a recession that hits everything. That market-wide risk is what investors get paid for bearing.",
      gz: "Some risk hits everyone (recessions). You can't dodge it, but that's what you get paid for." }
  ],
  chain: [
    { y: "1738", h: "Bernoulli's insight", t: "Daniel Bernoulli explains why people avoid risky bets with high average payoffs: an extra coin matters less to the rich than to the poor." },
    { y: "1921", h: "Risk vs uncertainty", t: "Frank Knight separates measurable risk (dice) from true uncertainty (a pandemic), a distinction still used today." },
    { y: "1952", h: "Portfolio selection", t: "Harry Markowitz, a 25-year-old student, shows mathematically how mixing assets reduces risk. Modern portfolio theory is born." },
    { y: "1964", h: "CAPM", t: "William Sharpe shows investors are only paid for market-wide risk (beta). Markowitz and Sharpe share the 1990 Nobel." },
    { y: "1993", h: "Factor models", t: "Fama and French show company size and value explain returns beyond beta, changing how funds are built." }
  ],
  papers: [
    { a: "H. Markowitz", y: 1952, t: "Portfolio Selection", j: "Journal of Finance", url: "https://doi.org/10.1111/j.1540-6261.1952.tb01525.x" },
    { a: "W. F. Sharpe", y: 1964, t: "Capital Asset Prices: A Theory of Market Equilibrium under Conditions of Risk", j: "Journal of Finance", url: "https://doi.org/10.1111/j.1540-6261.1964.tb02865.x" },
    { a: "E. F. Fama & K. R. French", y: 1993, t: "Common Risk Factors in the Returns on Stocks and Bonds", j: "Journal of Financial Economics", url: "https://doi.org/10.1016/0304-405X(93)90023-5" }
  ],
  videos: [["Ben Felix", "diversification"], ["The Plain Bagel", "modern portfolio theory"], ["Khan Academy", "risk and return"]],
  quiz: [
    { q: "Adding assets that don't move together to a portfolio…", o: ["Raises risk", "Lowers risk", "Has no effect"], a: 1, why: "Their ups and downs partly cancel out." },
    { q: "Which risk can't be diversified away?", o: ["One firm's CEO quitting", "A global recession", "A factory fire"], a: 1, why: "Market-wide (systematic) risk affects nearly all assets." },
    { q: "In CAPM, what are investors paid for?", o: ["Total risk", "Market (beta) risk", "No risk"], a: 1, why: "Diversifiable risk earns no reward; beta risk does." }
  ]
},
{
  id: "banking", area: "fin", level: "Intermediate",
  title: "Banking & credit",
  tldr: { en: "Banks turn short-term deposits into long-term loans. That's useful, but it makes them vulnerable to runs.",
          gz: "Banks take your deposits and lend them out long. Great until everyone wants their cash back at once." },
  cards: [
    { h: "What banks do", en: "Banks take deposits you can withdraw any time and lend them for years. This 'maturity transformation' funds homes and businesses.",
      gz: "Your instant-access savings become someone's 20-year mortgage. That's the bank's whole job." },
    { h: "Bank runs", en: "If depositors fear a bank will fail, they all withdraw at once, and even a healthy bank can collapse. Deposit insurance and central banks prevent this.",
      gz: "Everyone panics, everyone withdraws, bank dies. Deposit insurance exists so that doesn't happen." },
    { h: "Credit and interest", en: "Interest rates on loans reflect the policy rate, the borrower's risk and the loan length. Credit scores help lenders price that risk.",
      gz: "Your loan rate = central bank rate + how risky you look + how long you borrow." }
  ],
  chain: [
    { y: "1400s", h: "The Medici bank", t: "Florence's Medici family builds a European network using bills of exchange so merchants don't carry gold." },
    { y: "1600s", h: "Goldsmith bankers", t: "London goldsmiths lend out gold left with them for safekeeping. Fractional reserve banking begins." },
    { y: "1933", h: "Deposit insurance", t: "After thousands of US bank failures, the FDIC guarantees deposits. Runs on insured banks almost disappear." },
    { y: "1983", h: "Diamond & Dybvig", t: "They model why bank runs happen even to healthy banks. With Bernanke they share the 2022 Nobel." },
    { y: "2008", h: "Lehman Brothers", t: "A run on the 'shadow banking' system brings down Lehman and triggers the global financial crisis." },
    { y: "2023", h: "Silicon Valley Bank", t: "Depositors pull $42 billion in a single day, organised in part over social media. It is the fastest bank run in history." }
  ],
  papers: [
    { a: "D. W. Diamond & P. H. Dybvig", y: 1983, t: "Bank Runs, Deposit Insurance, and Liquidity", j: "Journal of Political Economy", url: "https://doi.org/10.1086/261155" },
    { a: "J. E. Stiglitz & A. Weiss", y: 1981, t: "Credit Rationing in Markets with Imperfect Information", j: "American Economic Review", url: "https://www.jstor.org/stable/1802787" }
  ],
  videos: [["Money & Macro", "bank run"], ["Patrick Boyle", "Silicon Valley Bank"], ["Khan Academy", "fractional reserve banking"]],
  quiz: [
    { q: "Why can a healthy bank fail in a run?", o: ["Its loans can't be turned into cash quickly", "It has no deposits", "Interest rates are zero"], a: 0, why: "Loans are long-term and illiquid, but deposits can leave instantly." },
    { q: "Deposit insurance prevents runs because…", o: ["Depositors know their money is safe", "Banks stop lending", "It bans withdrawals"], a: 0, why: "If deposits are guaranteed, there's no reason to rush to withdraw." },
    { q: "A riskier borrower usually pays…", o: ["A lower rate", "A higher rate", "The same rate"], a: 1, why: "Lenders charge a premium for the chance of default." }
  ]
},
{
  id: "corporate", area: "fin", level: "Intermediate",
  title: "Corporate finance",
  tldr: { en: "Firms decide what to invest in, how to fund it (debt or equity) and how to make managers act in owners' interests.",
          gz: "How companies decide what to build, how to pay for it, and how to stop the bosses from doing their own thing." },
  cards: [
    { h: "Net present value", en: "A project is worth doing if the present value of its future cash flows exceeds its cost. NPV is the core tool of corporate investment.",
      gz: "Future cash, discounted to today, minus the cost. Positive? Build it. Negative? Skip." },
    { h: "Debt vs equity", en: "Debt is cheaper and tax-deductible but raises bankruptcy risk. Equity is safer but dilutes owners. Firms balance the two.",
      gz: "Loans are cheaper but risky, selling shares is safer but you own less. It's a balance." },
    { h: "Agency problems", en: "Managers run firms owned by shareholders, and their interests can clash. Bonuses, boards and share options try to align them.",
      gz: "The CEO isn't the owner. Bonuses and boards exist to keep them on the owners' side." }
  ],
  chain: [
    { y: "1602", h: "Limited liability", t: "Dutch East India Company investors can only lose what they put in, so ordinary people can safely own businesses." },
    { y: "1932", h: "Owners vs managers", t: "Berle and Means warn that dispersed shareholders can't control professional managers." },
    { y: "1958", h: "Modigliani–Miller", t: "In a perfect market, how a firm is financed doesn't change its value. Real-world exceptions (taxes, bankruptcy) became the field's agenda." },
    { y: "1976", h: "Agency theory", t: "Jensen and Meckling model the costs of managers not acting for owners, reshaping how executives are paid." },
    { y: "1984", h: "Pecking order", t: "Myers and Majluf show firms prefer internal cash, then debt, then new shares, because selling shares signals bad news." }
  ],
  papers: [
    { a: "F. Modigliani & M. H. Miller", y: 1958, t: "The Cost of Capital, Corporation Finance and the Theory of Investment", j: "American Economic Review", url: "https://www.jstor.org/stable/1809766" },
    { a: "M. C. Jensen & W. H. Meckling", y: 1976, t: "Theory of the Firm: Managerial Behavior, Agency Costs and Ownership Structure", j: "Journal of Financial Economics", url: "https://doi.org/10.1016/0304-405X(76)90026-X" },
    { a: "S. C. Myers & N. S. Majluf", y: 1984, t: "Corporate Financing and Investment Decisions When Firms Have Information That Investors Do Not Have", j: "Journal of Financial Economics", url: "https://doi.org/10.1016/0304-405X(84)90023-0" }
  ],
  videos: [["The Plain Bagel", "net present value"], ["Patrick Boyle", "corporate finance"], ["finance_with_tihon", "valuation"]],
  quiz: [
    { q: "A project costs 100 and its future cash flows are worth 120 today. NPV is…", o: ["+20", "−20", "120"], a: 0, why: "NPV = present value of cash flows − cost = 120 − 100." },
    { q: "Why might a firm prefer debt to new shares?", o: ["Interest is tax-deductible", "Debt never has to be repaid", "Shares are illegal"], a: 0, why: "Debt's tax shield lowers its cost, though it adds bankruptcy risk." },
    { q: "Share options for CEOs aim to…", o: ["Align managers with owners", "Reduce taxes", "Lower the share price"], a: 0, why: "They tie managers' pay to shareholder value." }
  ]
},
{
  id: "behavioral", area: "fin", level: "Intermediate",
  title: "Behavioural finance",
  tldr: { en: "Real people aren't perfectly rational. Fear, overconfidence and herding move markets and shape our money decisions.",
          gz: "Humans are not calculators. FOMO, panic and copying the group move markets more than spreadsheets do." },
  cards: [
    { h: "Loss aversion", en: "Losing 100 hurts about twice as much as winning 100 feels good. That's why investors sell winners too early and hold losers too long.",
      gz: "Losses hit twice as hard as wins feel good. That's why people hold bad stocks forever." },
    { h: "Herding & bubbles", en: "People copy the crowd, pushing prices far beyond fundamentals until the bubble bursts.",
      gz: "Everyone's buying, so you buy. Then it pops. History repeats every few years." },
    { h: "Overconfidence", en: "Most investors think they are above average. Trading more on that belief usually lowers returns after fees.",
      gz: "Everyone thinks they're the main character of investing. More trades = usually worse results." }
  ],
  chain: [
    { y: "1637", h: "Tulip mania", t: "Dutch tulip bulb prices spike and crash, often cited as the first recorded speculative bubble." },
    { y: "1841", h: "Popular delusions", t: "Charles Mackay's book on crowd madness, bubbles and manias becomes a classic warning." },
    { y: "1955", h: "Bounded rationality", t: "Herbert Simon argues people use rules of thumb because they can't process everything. Nobel 1978." },
    { y: "1979", h: "Prospect theory", t: "Kahneman and Tversky show how people actually weigh gains and losses. It becomes one of the most cited papers in economics." },
    { y: "2000", h: "Irrational exuberance", t: "Robert Shiller warns the dot-com boom is a bubble just before it bursts. He shares the 2013 Nobel." },
    { y: "2017", h: "Thaler's Nobel", t: "Richard Thaler wins for 'nudges' that use behavioural insights to help people save and choose better." }
  ],
  papers: [
    { a: "D. Kahneman & A. Tversky", y: 1979, t: "Prospect Theory: An Analysis of Decision under Risk", j: "Econometrica", url: "https://doi.org/10.2307/1914185" },
    { a: "H. A. Simon", y: 1955, t: "A Behavioral Model of Rational Choice", j: "Quarterly Journal of Economics", url: "https://doi.org/10.2307/1884852" },
    { a: "W. F. M. De Bondt & R. Thaler", y: 1985, t: "Does the Stock Market Overreact?", j: "Journal of Finance", url: "https://doi.org/10.1111/j.1540-6261.1985.tb05004.x" }
  ],
  videos: [["Ben Felix", "behavioral finance"], ["The Plain Bagel", "investing biases"], ["Economics Explained", "bubbles"]],
  quiz: [
    { q: "Loss aversion means people…", o: ["Feel losses more than equal gains", "Love risk", "Ignore losses"], a: 0, why: "Losses weigh roughly twice as much as equivalent gains." },
    { q: "Buying a coin because 'everyone online is buying it' is…", o: ["Herding", "Diversification", "Hedging"], a: 0, why: "Copying the crowd regardless of value is herding." },
    { q: "Whose 2000 book 'Irrational Exuberance' warned of the dot-com bubble?", o: ["Robert Shiller", "Adam Smith", "John Taylor"], a: 0, why: "Shiller borrowed Alan Greenspan's 1996 phrase for the title and was proved right weeks later." }
  ]
},
{
  id: "personal", area: "fin", level: "Beginner",
  title: "Personal finance",
  tldr: { en: "Spend less than you earn, keep an emergency fund, avoid expensive debt and invest early. Simple rules beat clever tricks.",
          gz: "Spend < earn, keep a safety stash, dodge high-interest debt, invest early. That's the whole cheat code." },
  cards: [
    { h: "Budgeting", en: "A simple start is the 50/30/20 rule: half for needs, 30% for wants, 20% for saving and paying off debt.",
      gz: "50% needs, 30% fun, 20% future you. Adjust, but track it." },
    { h: "Emergency fund", en: "Keep 3–6 months of essential costs in a safe, easy-to-reach account so a surprise doesn't push you into debt.",
      gz: "3–6 months of bills saved for when life happens. Non-negotiable." },
    { h: "Good vs bad debt", en: "Borrowing for things that raise your income (education) can pay off. High-interest consumer debt and 'buy now, pay later' rarely do.",
      gz: "Debt for skills = maybe. Debt for vibes and BNPL = usually a trap." }
  ],
  chain: [
    { y: "1954", h: "The life-cycle hypothesis", t: "Franco Modigliani and Richard Brumberg argue people save while working to spend in retirement, smoothing consumption over a lifetime." },
    { y: "1957", h: "Permanent income", t: "Milton Friedman shows people spend based on expected long-run income, not this month's paycheck." },
    { y: "1978", h: "The 401(k)", t: "A small line in a US tax law creates the 401(k), shifting retirement saving from employers to individuals." },
    { y: "2004", h: "Save More Tomorrow", t: "Thaler and Benartzi let workers commit future pay rises to savings. Saving rates nearly quadruple." },
    { y: "2014", h: "The literacy gap", t: "Lusardi and Mitchell show most people worldwide fail basic questions about interest, inflation and risk, and it costs them." }
  ],
  papers: [
    { a: "A. Lusardi & O. S. Mitchell", y: 2014, t: "The Economic Importance of Financial Literacy: Theory and Evidence", j: "Journal of Economic Literature", url: "https://doi.org/10.1257/jel.52.1.5" },
    { a: "R. H. Thaler & S. Benartzi", y: 2004, t: "Save More Tomorrow", j: "Journal of Political Economy", url: "https://doi.org/10.1086/380085" }
  ],
  videos: [["Humphrey Yang", "budgeting"], ["Tori Dunlap Her First 100K", "emergency fund"], ["Graham Stephan", "personal finance basics"]],
  quiz: [
    { q: "With the 50/30/20 rule and income of 5,000,000 so'm, how much goes to saving?", o: ["500,000", "1,000,000", "2,500,000"], a: 1, why: "20% of 5,000,000 = 1,000,000 so'm." },
    { q: "An emergency fund should be…", o: ["In volatile stocks", "Safe and easy to access", "Spent on holidays"], a: 1, why: "It must be available when the emergency hits." },
    { q: "Which debt usually costs the most?", o: ["Student loan", "Mortgage", "Credit card balance"], a: 2, why: "Credit cards often charge the highest interest rates." }
  ]
}
],

/* ============================ FILMS ============================ */
films: [
  { t: "A Beautiful Mind", y: 2001, k: "Drama", topics: ["behavioral"], c: "Game theory and the Nash equilibrium: why the best move depends on what everyone else does.", g: "The bar scene = Nash equilibrium explained with dating strategy. Iconic." },
  { t: "The Big Short", y: 2015, k: "Drama", topics: ["banking", "markets"], c: "Subprime mortgages, CDOs and how a few investors bet against the 2008 housing bubble.", g: "Margot Robbie in a bathtub explaining subprime mortgages. Peak edutainment." },
  { t: "Margin Call", y: 2011, k: "Thriller", topics: ["risk", "banking"], c: "One night inside an investment bank as it realises its risk models have failed.", g: "24 hours, one spreadsheet, a whole bank about to fold. Risk management horror movie." },
  { t: "Moneyball", y: 2011, k: "Drama", topics: ["scarcity", "markets"], c: "Using data to find undervalued players: scarcity, market inefficiency and thinking at the margin.", g: "Broke team, big brain. Using data to find bargains everyone else missed." },
  { t: "Inside Job", y: 2010, k: "Documentary", topics: ["banking", "central-banks"], c: "Oscar-winning documentary on the causes of the 2008 crisis: deregulation, incentives and conflicts of interest.", g: "The 2008 crash, receipts included. Watch the interviews with the economists." },
  { t: "Too Big to Fail", y: 2011, k: "Drama", topics: ["central-banks", "banking"], c: "Regulators and bankers race to stop the system collapsing after Lehman Brothers.", g: "The weekend the government had to decide who to save. Lender of last resort, live." },
  { t: "It's a Wonderful Life", y: 1946, k: "Classic", topics: ["banking"], c: "The bank run scene is the clearest explanation of Diamond–Dybvig you'll ever see.", g: "Old movie, but the bank run scene is literally a Nobel paper acted out." },
  { t: "Trading Places", y: 1983, k: "Comedy", topics: ["markets"], c: "Orange-juice futures, insider information and a classic short squeeze on the commodities floor.", g: "Comedy with an actual lesson on futures trading and insider info." },
  { t: "Dumb Money", y: 2023, k: "Drama", topics: ["markets", "behavioral"], c: "The 2021 GameStop short squeeze, retail traders vs hedge funds.", g: "Reddit vs Wall Street, the GameStop saga. Short squeeze explained." },
  { t: "The Wolf of Wall Street", y: 2013, k: "Drama", topics: ["markets", "behavioral"], c: "Penny-stock fraud and pump-and-dump schemes, and why regulators exist.", g: "Chaotic, but it's a masterclass in what a pump-and-dump scam looks like." },
  { t: "Wall Street", y: 1987, k: "Drama", topics: ["corporate", "markets"], c: "Insider trading, corporate raiders and 'greed is good'.", g: "'Greed is good.' Insider trading and hostile takeovers, 80s edition." },
  { t: "The Founder", y: 2016, k: "Drama", topics: ["corporate"], c: "How McDonald's scaled through franchising, real estate and ruthless contracts.", g: "How McDonald's really got rich (hint: real estate). Business model breakdown." },
  { t: "Enron: The Smartest Guys in the Room", y: 2005, k: "Documentary", topics: ["corporate", "behavioral"], c: "Accounting fraud, agency problems and how a giant collapsed in weeks.", g: "How a 'genius' company faked it and collapsed. Accounting can be thrilling." },
  { t: "Rogue Trader", y: 1999, k: "Drama", topics: ["risk", "banking"], c: "Nick Leeson's hidden losses bring down 233-year-old Barings Bank.", g: "One trader hid his losses and sank a 233-year-old bank. Risk controls matter." },
  { t: "The Pursuit of Happyness", y: 2006, k: "Drama", topics: ["personal", "growth"], c: "Human capital, poverty traps and the risk of investing in skills.", g: "Grinding from homeless to broker. Human capital, but make it emotional." },
  { t: "Parasite", y: 2019, k: "Thriller", topics: ["growth"], c: "Inequality and class in modern South Korea, told as a thriller.", g: "Inequality, but it's a thriller that won Best Picture. Watch with subtitles." },
  { t: "The Social Network", y: 2010, k: "Drama", topics: ["corporate"], c: "Network effects, startup equity and share dilution at Facebook.", g: "Facebook's origin story + why you never let your shares get diluted." },
  { t: "BlackBerry", y: 2023, k: "Drama", topics: ["corporate", "trade"], c: "How competition and disruption took down a phone giant.", g: "From everyone's phone to nobody's. Disruption speedrun." },
  { t: "Air", y: 2023, k: "Drama", topics: ["corporate"], c: "Negotiation, incentives and the royalty deal behind Air Jordan.", g: "The Air Jordan deal. Negotiation 101 with royalties." },
  { t: "Boiler Room", y: 2000, k: "Drama", topics: ["markets", "behavioral"], c: "A high-pressure brokerage sells worthless stock with aggressive sales scripts.", g: "Sales bros selling fake stocks. How to spot a financial scam." },
  { t: "Money Monster", y: 2016, k: "Thriller", topics: ["markets"], c: "Algorithmic trading glitches and finance-TV hype.", g: "A finance TV host gets held hostage over a 'glitch'. Algo trading drama." },
  { t: "The Laundromat", y: 2019, k: "Comedy-drama", topics: ["banking"], c: "Shell companies, tax havens and the Panama Papers.", g: "Panama Papers explained by Meryl Streep. Shell companies decoded." },
  { t: "Glengarry Glen Ross", y: 1992, k: "Drama", topics: ["corporate", "behavioral"], c: "Incentives and pressure in a real-estate sales office.", g: "'Always be closing.' What bad incentives do to people." },
  { t: "Arbitrage", y: 2012, k: "Thriller", topics: ["corporate", "risk"], c: "A hedge-fund boss hides losses to sell his firm: fraud and moral hazard.", g: "Rich guy hides losses to sell his fund. Moral hazard in a nice suit." },
  { t: "Capitalism: A Love Story", y: 2009, k: "Documentary", topics: ["banking", "market-failures"], c: "Michael Moore on the 2008 bailouts, foreclosures and who capitalism serves.", g: "Michael Moore vs Wall Street after 2008. Opinionated, but makes you think." },
  { t: "Inequality for All", y: 2013, k: "Documentary", topics: ["growth", "gdp"], c: "Economist Robert Reich explains why US income inequality widened and why it matters for growth.", g: "A former US labour secretary explains inequality with actual charts. Lowkey a lecture, but a good one." },
  { t: "Money for Nothing: Inside the Federal Reserve", y: 2013, k: "Documentary", topics: ["central-banks", "inflation"], c: "How the Fed sets interest rates, told by the people who ran it.", g: "The Fed explained by the people who actually ran it. Central banking, no snooze." },
  { t: "Freakonomics", y: 2010, k: "Documentary", topics: ["scarcity", "behavioral"], c: "Incentives explain surprising behaviour, from baby names to sumo wrestling.", g: "Incentives explain everything, even sumo wrestlers cheating. Big brain energy." },
  { t: "Cinderella Man", y: 2005, k: "Drama", topics: ["gdp", "central-banks"], c: "A boxer's family during the Great Depression: mass unemployment and bank failures up close.", g: "Great Depression through one family's eyes. Unemployment hits different on screen." },
  { t: "The Grapes of Wrath", y: 1940, k: "Classic", topics: ["gdp", "growth"], c: "Farm families pushed west by the Dust Bowl and the Depression: migration and labour markets.", g: "Old but iconic. Families forced to move for work during the Depression." },
  { t: "Erin Brockovich", y: 2000, k: "Drama", topics: ["market-failures"], c: "A company pollutes a town's water: externalities and who pays for them.", g: "A company poisons a town's water and gets caught. Externalities, the movie." },
  { t: "Dark Waters", y: 2019, k: "Drama", topics: ["market-failures", "corporate"], c: "A lawyer exposes decades of chemical pollution: externalities and regulation.", g: "A lawyer takes on a chemical giant. The cost they dumped on everyone else." },
  { t: "Thank You for Smoking", y: 2005, k: "Comedy", topics: ["market-failures", "behavioral"], c: "A tobacco lobbyist spins the facts: externalities, lobbying and persuasion.", g: "A tobacco lobbyist who can spin anything. Satire about selling harm." },
  { t: "Up in the Air", y: 2009, k: "Drama", topics: ["gdp", "corporate"], c: "A man who fires people for a living during the 2008 recession.", g: "His job is firing people during the 2008 recession. Oof." },
  { t: "The Company Men", y: 2010, k: "Drama", topics: ["gdp", "personal"], c: "Executives laid off after 2008 learn what unemployment does to a household budget.", g: "Corporate guys get laid off and learn budgeting the hard way." },
  { t: "99 Homes", y: 2014, k: "Drama", topics: ["banking", "personal"], c: "Foreclosures after the housing crash, seen from both sides of the door.", g: "Losing your house after 2008, then working for the guy who took it." },
  { t: "Joy", y: 2015, k: "Drama", topics: ["corporate"], c: "An inventor fights for her mop: patents, manufacturing costs and TV retail.", g: "Girlboss invents a mop and fights for her business. Patents and pricing 101." },
  { t: "There Will Be Blood", y: 2007, k: "Drama", topics: ["market-failures", "growth"], c: "An oilman's ruthless rise: property rights, resources and monopoly.", g: "Oil, greed and 'I drink your milkshake'. Property rights, explained badly on purpose." },
  { t: "Chinatown", y: 1974, k: "Classic", topics: ["scarcity", "market-failures"], c: "Water rights and corruption in drought-hit Los Angeles.", g: "Who controls the water controls the city. Scarcity noir." },
  { t: "Snowpiercer", y: 2013, k: "Sci-fi", topics: ["scarcity", "growth"], c: "A train as a whole economy: scarce resources, class and who gets what.", g: "The whole economy is a train and the back cars are not okay. Scarcity, but sci-fi." },
  { t: "In Time", y: 2011, k: "Sci-fi", topics: ["inflation", "personal"], c: "Time is literally money: prices rise to keep the poor poor.", g: "Time is the currency and prices keep going up. Inflation, but make it scary." },
  { t: "The Hudsucker Proxy", y: 1994, k: "Comedy", topics: ["markets", "corporate"], c: "Board members try to crash their own share price.", g: "Bosses try to tank their own stock on purpose. Chaotic comedy." },
  { t: "Other People's Money", y: 1991, k: "Comedy-drama", topics: ["corporate"], c: "A corporate raider vs a family firm: shareholder value and takeovers.", g: "Takeover guy vs family business. Who should a company serve?" },
  { t: "Barbarians at the Gate", y: 1993, k: "TV film", topics: ["corporate"], c: "The RJR Nabisco leveraged buyout, the biggest deal of the 1980s.", g: "The wildest buyout of the 80s, funded with debt. Very finance bro." },
  { t: "Equity", y: 2016, k: "Thriller", topics: ["markets", "corporate"], c: "An investment banker runs a tech IPO under pressure and insider leaks.", g: "A banker running a tech IPO while someone leaks secrets. IPOs explained." },
  { t: "Billions", y: 2016, k: "Series", topics: ["markets", "risk"], c: "A hedge-fund titan vs a prosecutor: insider trading and market power.", g: "Hedge fund king vs prosecutor. Insider trading drama for days." },
  { t: "Industry", y: 2020, k: "Series", topics: ["markets", "banking"], c: "Graduates fight for jobs at a London investment bank.", g: "Gen Z grads trying to survive an investment bank. Very real, very messy." },
  { t: "Succession", y: 2018, k: "Series", topics: ["corporate"], c: "A media family fights over control of its company: governance and takeovers.", g: "Rich family fights over the company. Corporate governance, but toxic." },
  { t: "Squid Game", y: 2021, k: "Series", topics: ["personal", "behavioral"], c: "Players in crushing debt risk everything: debt traps and desperate choices.", g: "Everyone's in debt so they play deadly games. Debt traps are no joke." },
  { t: "Money Heist", y: 2017, k: "Series", topics: ["inflation", "central-banks"], c: "Robbers print their own money inside the national mint. What would it do to prices?", g: "They rob the mint by printing new money. Inflation would like a word." },
  { t: "Bad Banks", y: 2018, k: "Series", topics: ["banking", "risk"], c: "A young banker climbs a Frankfurt bank as risky deals pile up.", g: "German banking drama: young, ambitious and about to cause a crisis." },
  { t: "Sorry to Bother You", y: 2018, k: "Comedy", topics: ["gdp", "corporate"], c: "A telemarketer's surreal rise: labour, wages and unions.", g: "Wild satire about work, wages and unions. Gets very weird. Worth it." },
  { t: "Nomadland", y: 2020, k: "Drama", topics: ["gdp", "personal"], c: "After a town's factory closes, a woman lives on the road doing seasonal work.", g: "Her town's factory shuts and she lives in a van doing gig work. Quietly powerful." },
  { t: "Becoming Warren Buffett", y: 2017, k: "Documentary", topics: ["compounding", "markets"], c: "The world's most famous investor on patience, value and compounding.", g: "Warren Buffett on getting rich slowly. Compounding, the documentary." },
  { t: "Bitconned", y: 2024, k: "Documentary", topics: ["behavioral", "markets"], c: "The rise and fall of a crypto scam that raised millions.", g: "A crypto scam told by the guy who ran it. Red flags everywhere." },
  { t: "Fyre: The Greatest Party That Never Happened", y: 2019, k: "Documentary", topics: ["behavioral", "corporate"], c: "Hype, influencers and investor money behind a festival that never existed.", g: "Influencers sold a festival that didn't exist. Hype is not a business plan." },
  { t: "The Inventor: Out for Blood in Silicon Valley", y: 2019, k: "Documentary", topics: ["corporate", "behavioral"], c: "How Theranos raised billions for a technology that didn't work.", g: "Billions raised for a blood test that didn't work. Due diligence matters." },
  { t: "WeWork: or the Making and Breaking of a $47 Billion Unicorn", y: 2021, k: "Documentary", topics: ["corporate", "markets"], c: "A startup valued at $47 billion and why its IPO collapsed.", g: "A $47B startup that wasn't. Valuations can lie." },
  { t: "The China Hustle", y: 2017, k: "Documentary", topics: ["markets", "trade"], c: "Fraudulent Chinese companies listed in the US, and who lost the money.", g: "Fake companies listed on US markets. Investors got played." },
  { t: "Trillion Dollar Bet", y: 2000, k: "Documentary", topics: ["risk", "markets"], c: "How the Black–Scholes formula won a Nobel and a hedge fund using it collapsed.", g: "Nobel-winning math, a hedge fund, and a spectacular crash." },
  { t: "Sicko", y: 2007, k: "Documentary", topics: ["market-failures"], c: "Why health care markets fail without insurance rules: asymmetric information in action.", g: "Why health care is a messy market. Insurance and information gaps." },
  { t: "American Factory", y: 2019, k: "Documentary", topics: ["trade", "growth"], c: "A Chinese company reopens a closed factory in Ohio: globalisation up close.", g: "A Chinese firm runs a factory in Ohio. Globalisation, but real people." },
  { t: "Poverty, Inc.", y: 2014, k: "Documentary", topics: ["growth"], c: "When foreign aid helps and when it hurts local businesses.", g: "Does aid actually help? Sometimes it hurts local businesses." },
  { t: "The Corporation", y: 2003, k: "Documentary", topics: ["market-failures", "corporate"], c: "What happens when companies chase profit and push costs onto others.", g: "If companies were people, what would they be like? Not great, apparently." },
  { t: "Money, Explained", y: 2021, k: "Series", topics: ["personal", "compounding"], c: "Short episodes on credit cards, student loans, scams and retirement.", g: "Short eps on credit cards, loans, scams and saving. Very bingeable." },
  { t: "Dirty Money", y: 2018, k: "Series", topics: ["corporate", "banking"], c: "Each episode investigates a real case of corporate fraud.", g: "One corporate scandal per episode. True crime, but finance." },
  { t: "Madoff: The Monster of Wall Street", y: 2023, k: "Series", topics: ["behavioral", "markets"], c: "The biggest Ponzi scheme in history and why nobody stopped it.", g: "The biggest Ponzi scheme ever. How did nobody notice?" }
],

/* ============================ RESOURCES ============================ */
resources: {
  research: [
    { n: "Google Scholar", u: "https://scholar.google.com", d: "Search papers and see who cites them. Start every literature review here." },
    { n: "SCImago Journal Rank", u: "https://www.scimagojr.com/journalrank.php?category=2002", d: "Check whether a journal is Q1. Filter by Economics and Econometrics." },
    { n: "NBER Working Papers", u: "https://www.nber.org/papers", d: "New research from top economists, often years before journal publication." },
    { n: "SSRN", u: "https://www.ssrn.com", d: "Free preprints in finance, economics and law." },
    { n: "IDEAS / RePEc", u: "https://ideas.repec.org", d: "The largest bibliographic database in economics, with author rankings." },
    { n: "JSTOR", u: "https://www.jstor.org", d: "Archive of classic journal articles. Check your university login." },
    { n: "CORE Econ", u: "https://www.core-econ.org", d: "Free modern economics textbooks used by universities worldwide." },
    { n: "OpenStax Economics", u: "https://openstax.org/details/books/principles-economics-3e", d: "Free, openly licensed intro textbook." }
  ],
  data: [
    { n: "World Bank Open Data", u: "https://data.worldbank.org", d: "Development indicators for every country. Powers this site's dashboard." },
    { n: "IMF Data", u: "https://www.imf.org/en/Data", d: "World Economic Outlook forecasts, debt and balance of payments." },
    { n: "FRED", u: "https://fred.stlouisfed.org", d: "800,000+ economic time series with instant charts." },
    { n: "OECD Data Explorer", u: "https://data-explorer.oecd.org", d: "Comparable statistics for advanced economies." },
    { n: "Our World in Data", u: "https://ourworldindata.org", d: "Beautiful long-run charts on growth, poverty, energy and more." },
    { n: "UN Data", u: "https://data.un.org", d: "Population, trade and social statistics from UN agencies." },
    { n: "Central Bank of Uzbekistan", u: "https://cbu.uz/en/", d: "Policy rate, exchange rates, inflation reports." },
    { n: "Uzbekistan Statistics Agency", u: "https://stat.uz/en/", d: "Official national statistics for Uzbekistan." }
  ],
  ai: [
    { n: "ChatGPT", u: "https://chatgpt.com", d: "General assistant for explaining concepts and drafting." },
    { n: "Claude", u: "https://claude.ai", d: "Long documents, careful reasoning and writing feedback." },
    { n: "Gemini", u: "https://gemini.google.com", d: "Google's assistant, good with Google Docs and Sheets." },
    { n: "Perplexity", u: "https://www.perplexity.ai", d: "Answers with sources linked, handy for quick fact-finding." },
    { n: "NotebookLM", u: "https://notebooklm.google.com", d: "Upload your readings and ask questions only about them." },
    { n: "Elicit", u: "https://elicit.com", d: "Finds and summarises academic papers for a research question." },
    { n: "Consensus", u: "https://consensus.app", d: "Answers questions using peer-reviewed research." },
    { n: "Scite", u: "https://scite.ai", d: "Shows whether later papers support or dispute a study." }
  ],
  youtube: [
    { n: "Marginal Revolution University", d: "Short, clear economics lessons by two professors." },
    { n: "Khan Academy", d: "Full micro, macro and finance courses with exercises." },
    { n: "Crash Course Economics", d: "Fast, fun overviews of big ideas." },
    { n: "Economics Explained", d: "Country deep-dives and big-picture economics." },
    { n: "Money & Macro", d: "Macroeconomics and central banking, by an economist." },
    { n: "Patrick Boyle", d: "Finance news with dry humour, by a finance professor." },
    { n: "Ben Felix", d: "Evidence-based investing from the research literature." },
    { n: "The Plain Bagel", d: "Clear explainers on markets and investing." },
    { n: "How Money Works", d: "Companies, money and markets, explained visually." },
    { n: "The Economist", d: "Short explainers on global economic stories." },
    { n: "Financial Times", d: "Visual journalism on markets and the economy." },
    { n: "Bloomberg Originals", d: "Documentaries on business and finance." }
  ],
  creators: [
    { n: "Humphrey Yang", h: "humphreytalks", d: "Personal finance basics, one of the biggest finance creators." },
    { n: "Tori Dunlap", h: "herfirst100k", d: "Her First $100K: budgeting, investing and negotiating pay." },
    { n: "Erika Kullberg", h: "erikakullberg", d: "Consumer rights and the fine print, explained fast." },
    { n: "Mark Tilbury", h: "marktilbury", d: "Money habits and building wealth." },
    { n: "Chris Kohler", h: "chriskohlernews", d: "Finance journalist turning economic news into short videos." },
    { n: "Finance with Tihon", h: "finance_with_tihon", d: "Excel tips and company valuation for finance students." },
    { n: "Graham Stephan", h: "grahamstephan", d: "Investing, real estate and markets on YouTube." },
    { n: "Andrei Jikh", h: "andreijikh", d: "Investing and market news, beginner-friendly." }
  ]
}
};
