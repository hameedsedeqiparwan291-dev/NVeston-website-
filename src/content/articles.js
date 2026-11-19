// Article bodies (draft educational content, pending founder review).
// Block types: p, h2, ul, example { title, lines[] }, quote.
// All figures are illustrative arithmetic; no external statistics are cited.

export const ARTICLE_BODIES = {
  'why-profitable-businesses-run-out-of-cash': [
    { p: 'It is one of the most common and least intuitive problems in business: the accounts show a healthy profit, yet there is not enough money in the bank to pay next week’s bills. It happens to young companies and established ones, and it often happens precisely when things seem to be going well.' },
    { p: 'The explanation is simple once you see it. Profit and cash measure different things.' },
    { h2: 'Profit measures earnings. Cash measures timing.' },
    { p: 'Profit tells you whether, over a period, you earned more than it cost you to deliver your products or services. Cash tells you whether the money is actually available when obligations fall due. A sale counts toward profit when you make it; it only counts toward cash when the customer pays.' },
    { p: 'If customers pay you 30, 60 or 90 days after you deliver, while your staff, rent and suppliers must be paid now, there is a gap. You are, in effect, financing your customers. As long as sales are stable, that gap stays roughly the same size. When sales grow, it gets larger.' },
    { example: { title: 'Illustrative example', lines: [
      'A business sells $50,000 a month. Materials cost 60% of sales and are paid immediately; fixed costs are $15,000 a month. Monthly profit is $5,000.',
      'Customers pay two months after the sale. Sales start growing 5% a month.',
      'In month three, profit has risen to $7,050, yet only about $1,925 of net cash arrives, because customer payments still reflect the smaller sales of two months earlier while costs reflect today’s larger volume.',
      'Add a $2,000 monthly loan repayment and the bank balance falls slightly that month, even though the business is more profitable than ever.',
    ] } },
    { h2: 'Growth consumes cash' },
    { p: 'This is the counter-intuitive part. Faster growth can make a cash shortage worse, not better, because each additional sale requires money to be spent before the corresponding payment arrives. A business can grow itself into a crisis.' },
    { p: 'Other common causes of the same pattern include buying inventory ahead of demand, large annual payments such as insurance, loan repayments (which reduce cash but are mostly not an expense in the profit calculation), and owners drawing money out based on profit rather than cash.' },
    { h2: 'What helps' },
    { ul: [
      'Forecast cash separately from profit, month by month, including the timing of customer payments.',
      'Watch how long customers take to pay, and whether it is getting longer.',
      'Plan growth with the cash it will require, not just the profit it will produce.',
      'Arrange financing such as a credit line before it is urgently needed, when terms are usually better.',
      'Review payment terms with customers and suppliers; small changes in timing can release meaningful cash.',
    ] },
    { p: 'None of this is complicated, but it does require looking at the business through a second lens. Profit asks “are we earning?” Cash asks “can we pay?” A business needs a good answer to both.' },
  ],

  'understanding-your-break-even-point': [
    { p: 'Every business owner eventually asks some version of the same question: how much do I need to sell just to stop losing money? The answer is your break-even point, and knowing it changes how you think about prices, costs and targets.' },
    { h2: 'Two kinds of cost' },
    { p: 'Break-even analysis starts by separating costs into two groups. Fixed costs are those you pay regardless of how much you sell: rent, salaried staff, insurance, software subscriptions. Variable costs rise with each unit you sell: materials, packaging, delivery, payment-processing fees.' },
    { p: 'The difference between your selling price and the variable cost of one unit is called the contribution margin. It is the amount each sale contributes toward covering fixed costs and, once those are covered, toward profit.' },
    { example: { title: 'Illustrative example', lines: [
      'A product sells for $50 and costs $30 to make and deliver. Each sale contributes $20.',
      'Fixed costs are $12,000 a month. Break-even = $12,000 ÷ $20 = 600 units, or $30,000 in revenue.',
      'To earn a $6,000 monthly profit, the business needs ($12,000 + $6,000) ÷ $20 = 900 units.',
    ] } },
    { h2: 'Why it is so useful' },
    { p: 'Break-even turns vague goals into concrete ones. “We need to grow” becomes “we need 600 units a month just to cover costs, and 900 to make the profit we want.” It also shows how sensitive the business is to change.' },
    { ul: [
      'A small price increase raises the contribution margin and can lower the break-even point substantially.',
      'A rise in variable costs, such as a supplier price increase, does the opposite.',
      'A new fixed cost, such as an additional hire, raises the number of units you must sell every month.',
    ] },
    { p: 'In the example, raising the price from $50 to $55 increases the contribution from $20 to $25 and lowers break-even from 600 to 480 units. That is the kind of trade-off worth understanding before deciding on a price.' },
    { h2: 'Where to be careful' },
    { p: 'Real businesses rarely sell a single product at a single price. When products have different margins, break-even depends on the mix. Fixed costs also tend to rise in steps as a business grows. And break-even is about profit, not cash: you can be above break-even and still be short of money if customers pay slowly.' },
    { p: 'Used with those limits in mind, break-even analysis is one of the simplest and most valuable tools an owner has.' },
  ],

  'revenue-profit-and-cash-flow': [
    { p: 'Revenue, profit and cash flow are often used as if they meant the same thing. They do not, and confusing them leads to some of the most common financial mistakes in business, and in personal finances too.' },
    { h2: 'Revenue: what comes in the door' },
    { p: 'Revenue is the total value of what you sell before any costs are subtracted. It is the easiest number to see and the most satisfying to grow. On its own, it says very little about whether a business is healthy.' },
    { h2: 'Profit: what is left after costs' },
    { p: 'Profit is revenue minus the costs of earning it. A business with $1 million in revenue and $1.05 million in costs is losing money, however impressive the top line looks. Profit margin, which is profit as a share of revenue, shows how much of each dollar of sales the business actually keeps.' },
    { h2: 'Cash flow: when the money moves' },
    { p: 'Cash flow tracks the actual movement of money in and out of the bank, and when it happens. It is affected by things that do not appear in profit at all, such as loan principal repayments, equipment purchases and inventory build-ups, and by timing differences, such as customers paying weeks after a sale.' },
    { example: { title: 'Illustrative example', lines: [
      'In one month a business invoices $40,000 (revenue) and incurs $34,000 of costs, for a profit of $6,000.',
      'But $15,000 of that month’s invoices will not be paid until next month, no earlier invoices are collected, and the business also repays $3,000 of loan principal.',
      'Cash actually falls during the month, even though revenue was strong and the business was profitable.',
    ] } },
    { h2: 'Why the distinction matters' },
    { ul: [
      'Revenue tells you about demand.',
      'Profit tells you whether the business model works.',
      'Cash flow tells you whether you can keep operating.',
    ] },
    { p: 'Each answers a different question, and a decision that improves one can worsen another. Offering longer payment terms might lift revenue while straining cash. Cutting prices might lift revenue while reducing profit. Seeing all three together is what allows a decision to be judged properly.' },
  ],

  'why-more-revenue-does-not-always-mean-more-profit': [
    { p: 'More sales feel like progress. But whether growth makes a business more profitable depends on what each additional sale costs and on what it takes to win and serve the new customers.' },
    { h2: 'When growth helps profit' },
    { p: 'If each additional sale carries a healthy contribution margin and fixed costs stay the same, profit rises faster than revenue. This is the ideal case, and it is why businesses with high fixed costs and low variable costs can become very profitable once they pass break-even.' },
    { h2: 'When it does not' },
    { ul: [
      'Discounts: winning volume by lowering prices can reduce the contribution of every sale, not just the new ones.',
      'Higher costs to serve: new customers may be smaller, further away or more demanding.',
      'Step changes in fixed costs: growth often requires another hire, a larger space or new systems.',
      'Rising acquisition costs: each additional customer may cost more in marketing than the last.',
    ] },
    { example: { title: 'Illustrative example', lines: [
      'A business sells 1,000 units a month at $40, with a variable cost of $25 and fixed costs of $10,000. Profit is 1,000 × $15 − $10,000 = $5,000.',
      'To grow, it cuts the price to $36 and sells 1,300 units. Revenue rises from $40,000 to $46,800.',
      'But contribution per unit falls to $11, so profit becomes 1,300 × $11 − $10,000 = $4,300. Revenue grew 17%; profit fell 14%.',
    ] } },
    { h2: 'What to look at instead' },
    { p: 'The more useful questions are about contribution and cost: how much does each additional sale really add after the costs it creates, and what fixed costs will the growth require? Analysing profitability by product, customer or channel often reveals that some revenue is far more valuable than other revenue, and that some is not worth having at all.' },
    { p: 'Growth is usually worth pursuing. The point is to pursue the kind that strengthens the business.' },
  ],

  'how-interest-rates-affect-borrowing-costs': [
    { p: 'When interest rates change, the effect on any single monthly payment can look modest. Over the full life of a loan, however, small differences in rate add up, and the longer the loan, the more they matter.' },
    { h2: 'How a loan payment is built' },
    { p: 'Most business and consumer loans are amortizing: each payment covers the interest due for that period, and the rest reduces the balance. Early payments are mostly interest; later ones are mostly principal. The interest rate determines how much of each payment goes to the lender rather than toward clearing the debt.' },
    { example: { title: 'Illustrative example: $250,000 over 7 years, monthly payments', lines: [
      'At 7% a year, the payment is about $3,773 a month and total interest is about $66,900.',
      'At 9% a year, the payment is about $4,022 a month and total interest is about $87,900.',
      'A two-point difference in rate adds roughly $250 a month, or about $20,900 over the life of the loan.',
    ] } },
    { h2: 'Term matters as much as rate' },
    { p: 'Stretching a loan over a longer period lowers each payment but increases total interest, because the balance stays outstanding for longer. A lower monthly payment can therefore be the more expensive choice overall. Which is better depends on what matters more to you: monthly cash flow or total cost.' },
    { h2: 'What else to check' },
    { ul: [
      'Whether the rate is fixed or variable, and how a variable rate could change.',
      'Fees, which can make a loan with a lower headline rate more expensive.',
      'How the lender quotes the rate (for example, as an APR) and how often interest compounds.',
      'Whether there are penalties for repaying early.',
      'Whether your cash flow could still support the payment if revenue dipped.',
    ] },
    { p: 'Interest rates are set by forces outside any borrower’s control. What a borrower can control is how well they understand the cost of a loan before they commit, and how sensitive their plans are to the rate they end up paying.' },
  ],

  'scenario-analysis-for-better-business-decisions': [
    { p: 'Most business plans contain a single forecast: sales will grow by this much, costs will rise by that much, and the result will be this profit. The forecast is almost certainly wrong. The reason is rarely carelessness; nobody can predict the future precisely.' },
    { p: 'Scenario analysis accepts that uncertainty and works with it. Instead of asking “what will happen?”, it asks “what would happen if…?” and “what would we do then?”' },
    { h2: 'Three scenarios are often enough' },
    { ul: [
      'A base case: a realistic central expectation.',
      'A downside case: things go meaningfully worse, with lower sales, higher costs or slower payments.',
      'An upside case: things go meaningfully better, which raises its own questions about capacity and cash.',
    ] },
    { example: { title: 'Illustrative example', lines: [
      'A business has $50,000 of monthly revenue, $45,000 of monthly costs and $30,000 in reserves.',
      'Base case: $5,000 monthly profit.',
      'Revenue down 10% with costs unchanged: profit falls to zero. Revenue down 20%: a $5,000 monthly loss, which would use up reserves in about six months.',
    ] } },
    { h2: 'The value is in the preparation' },
    { p: 'The example does not tell the owner which scenario will happen. It tells them something more useful: a 10% fall in revenue would remove the entire margin, and a 20% fall would give them roughly six months. With that knowledge, they can decide in advance which costs they would cut first, at what point they would act, and whether a larger cash reserve or a standby credit line is worth arranging now.' },
    { h2: 'Sensitivity: which assumptions matter most' },
    { p: 'A related technique, sensitivity analysis, changes one assumption at a time to see which ones move the result most. Often a business discovers that its outcome depends far more on one variable, such as the price of a key input or how quickly customers pay, than on the ones it spends most time discussing.' },
    { p: 'Good scenario analysis is not pessimism. It is the discipline of thinking through the range of plausible outcomes while there is still time to prepare for them.' },
  ],

  'what-market-volatility-tells-you': [
    { p: 'When markets move sharply, the word “volatility” appears in every headline. It is a useful concept, but it is often misunderstood, and that misunderstanding can lead to anxious, poorly considered decisions.' },
    { h2: 'Volatility measures movement, not direction' },
    { p: 'Volatility describes how much and how quickly prices move, in either direction. A highly volatile asset can rise sharply, fall sharply, or do both within a short period. Volatility on its own says nothing about which way prices will go next.' },
    { h2: 'Volatility and risk are related, but not identical' },
    { p: 'For someone who may need to sell an asset soon, large price swings are a real risk: they might be forced to sell at a low point. For someone with a long time horizon and no need to sell, the same swings may matter much less than other risks, such as the permanent loss of value or the risk of not keeping up with inflation. What “risky” means depends on the person’s circumstances.' },
    { h2: 'Why markets become volatile' },
    { ul: [
      'New information that changes expectations, such as economic data or company results.',
      'Changes in interest rates or expectations about them.',
      'Shifts in sentiment, when many participants become more cautious or more optimistic at once.',
      'Lower trading activity, which can make prices move more on each trade.',
    ] },
    { h2: 'Reading volatile markets calmly' },
    { p: 'History shows that markets have experienced many periods of sharp volatility, and that what followed has varied widely. That is precisely why historical patterns should be treated as context rather than prediction.' },
    { p: 'A calmer approach separates three questions: What has actually happened? Why does it appear to have happened? And does it change anything about my own situation and time horizon? The first two are matters of analysis. The third depends on personal circumstances. For decisions about specific investments, it is a question for an appropriately licensed professional.' },
    { p: 'This article is general education. It is not a recommendation to buy, sell or hold any investment.' },
  ],
};

export function readingMinutes(blocks) {
  const text = blocks
    .map((b) => b.p || b.h2 || (b.ul ? b.ul.join(' ') : '') || (b.example ? b.example.lines.join(' ') : '') || b.quote || '')
    .join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}
