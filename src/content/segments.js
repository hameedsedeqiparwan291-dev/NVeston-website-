export const SEGMENT_DETAILS = {
  individuals: {
    eyebrow: 'Individuals & Households',
    headline: 'Financial clarity for the decisions that shape your life.',
    lead: 'You do not need a finance degree to understand your own finances. You need your numbers organized, explained plainly and tested against the choices you are actually facing.',
    concerns: [
      { title: 'Money seems to disappear', text: 'Income is reasonable, yet little is left at the end of each month and it is hard to say exactly why.' },
      { title: 'Debt feels heavy', text: 'Several balances, different rates and minimum payments that make it difficult to see the real cost or the fastest way out.' },
      { title: 'A big decision is coming', text: 'A home, a car, a career change or a family milestone — and uncertainty about what you can truly afford.' },
      { title: 'Not enough of a cushion', text: 'The bills are paid, but an unexpected expense or a gap in income would quickly cause strain.' },
    ],
    help: [
      { slug: 'personal-financial-services', text: 'A clear map of your income, spending, debt and resilience, and side-by-side comparisons of the decisions you are weighing.' },
      { slug: 'macro-market-intelligence', text: 'What inflation and interest rates mean for your savings, your borrowing and your long-term plans.' },
      { slug: 'risk-scenario-analysis', text: 'How your finances would hold up if income fell or costs rose — and what preparation would help most.' },
    ],
    example: {
      title: 'Paying down debt or building savings first?',
      text: 'Someone with $8,000 on a credit card at a high rate and almost no savings faces a genuine trade-off. Paying the card aggressively saves the most interest; building a small reserve first reduces the chance that the next emergency goes straight back onto the card. Analysis lays out both paths month by month so the person can choose the balance that fits their situation.',
    },
    tools: ['financial-resilience', 'debt-financing'],
    topic: 'cashflow',
  },
  'small-businesses': {
    eyebrow: 'Small Businesses',
    headline: 'Know where your business really stands.',
    lead: 'You run the business every day. NVeston helps you see its finances clearly — profit, cash and costs — so your decisions are based on numbers you understand.',
    concerns: [
      { title: 'Busy, but cash is tight', text: 'Sales are growing, yet paying suppliers and payroll on time feels harder, not easier.' },
      { title: 'Margins are slipping', text: 'Costs keep rising and it is not clear which prices, products or customers still make money.' },
      { title: 'Pricing by instinct', text: 'Prices were set years ago or by matching competitors, and nobody is sure they still cover the true cost.' },
      { title: 'Growth or financing on the table', text: 'An opportunity to hire, expand or borrow, without a clear view of whether the business can carry it.' },
    ],
    help: [
      { slug: 'entrepreneur-business-advisory', text: 'Profitability by product and customer, cash-flow forecasting, pricing and break-even analysis.' },
      { slug: 'risk-scenario-analysis', text: 'How the business would cope with a sales dip, a cost increase or slower customer payments.' },
      { slug: 'macro-market-intelligence', text: 'What interest rates, inflation and consumer trends could mean for your costs and demand.' },
    ],
    example: {
      title: 'Profitable on paper, short of cash in practice',
      text: 'A business sells $50,000 a month and makes a healthy profit, but customers pay 60 days after invoicing while staff and suppliers are paid within the month. When sales grow, the business must fund more work before the cash arrives — so the bank balance can fall even as profit rises. Seeing this pattern in advance turns a crisis into a planning question: a credit line, revised payment terms or a slower growth pace.',
    },
    tools: ['cash-flow', 'business-profitability', 'break-even'],
    topic: 'cashflow',
  },
  entrepreneurs: {
    eyebrow: 'Entrepreneurs & Founders',
    headline: 'Test the numbers before you commit.',
    lead: 'A new venture asks for your savings, your time and often borrowed money. NVeston helps you understand what it will cost, how long it may take to break even and what happens if things go slower than planned.',
    concerns: [
      { title: 'How much will it really cost?', text: 'Start-up costs, the months before revenue arrives and the cushion needed for surprises.' },
      { title: 'When will it pay for itself?', text: 'The sales volume and pricing needed to cover costs — and whether that is realistic.' },
      { title: 'Which model works best?', text: 'Different pricing, channels or cost structures that change the economics of the business.' },
      { title: 'Should I borrow or raise funds?', text: 'What financing would cost, what it commits you to and how it changes your risk.' },
    ],
    help: [
      { slug: 'entrepreneur-business-advisory', text: 'Start-up cost analysis, financial projections, break-even targets and business-model comparisons.' },
      { slug: 'risk-scenario-analysis', text: 'What happens if launch takes longer, sales are lower or costs are higher than planned.' },
      { slug: 'premium-strategic-advisory', text: 'A deeper engagement when the venture involves several major, interconnected decisions.' },
    ],
    example: {
      title: 'How many customers before it works?',
      text: 'A founder plans a service business with $12,000 in monthly fixed costs. Each client pays $500 a month and costs $200 to serve. The business needs 40 clients to break even and 60 to earn $6,000 a month. Knowing those numbers in advance changes the plan: how long it may take to win 40 clients, and how much cash is needed to get there.',
    },
    tools: ['break-even', 'cash-flow', 'debt-financing'],
    topic: 'expansion',
  },
  'market-participants': {
    eyebrow: 'Market Participants',
    headline: 'Understand markets, rather than react to them.',
    lead: 'For people who follow financial markets and want context, not noise: what is happening, why it is happening and how economic forces connect to what you see in prices.',
    concerns: [
      { title: 'Too much commentary', text: 'Constant headlines and opinions, with little explanation of what actually matters.' },
      { title: 'Confusing volatility', text: 'Sharp price movements that are hard to place in context.' },
      { title: 'Connecting the dots', text: 'How interest rates, inflation, earnings and policy relate to market behaviour.' },
      { title: 'Asking better questions', text: 'Wanting to have more informed conversations with licensed advisers.' },
    ],
    help: [
      { slug: 'financial-markets-portfolio-intelligence', text: 'Plain-language research on market developments, asset classes and the principles of diversification and risk.' },
      { slug: 'macro-market-intelligence', text: 'Sourced analysis of the economic forces behind market moves.' },
      { slug: 'risk-scenario-analysis', text: 'Frameworks for thinking about uncertainty, volatility and the range of possible outcomes.' },
    ],
    example: {
      title: 'Volatility is not the same as direction',
      text: 'A market that moves sharply up and down is volatile, but volatility alone says nothing about where prices will go next. Separating the size of movements from their causes — and from your own time horizon — makes market news easier to read calmly.',
    },
    tools: [],
    note: 'NVeston does not provide personalized investment recommendations, portfolio management or trading signals. For personal investment advice, consult an appropriately registered professional.',
    topic: 'analysis',
  },
};
