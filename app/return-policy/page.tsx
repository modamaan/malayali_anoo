import React from 'react';
import Link from 'next/link';

export default function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 pt-32 min-h-screen">
      <h1 className="text-4xl font-heading font-black mb-8 text-white">Return Policy</h1>
      
      <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        {/* UK Consumer Contracts Regulations 2013 Compliance */}
        {/* Source: https://www.gov.uk/online-and-distance-selling-for-businesses */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Your Right to Cancel (Cooling-Off Period)</h2>
          <p>
            Under the UK Consumer Contracts Regulations, you have the right to cancel your order within 14 days without giving any reason. 
            The cancellation period will expire after 14 days from the day on which you acquire, or a third party other than the carrier and indicated by you acquires, physical possession of the goods.
          </p>
          <p>
            To exercise the right to cancel, you must inform us of your decision to cancel this contract by a clear statement (e.g., a letter sent by post or email).
          </p>
          <p>
            <strong>Email:</strong> malayaliaaanoo@gmail.com<br />
            <strong>Phone:</strong> +44 7344 909757
          </p>
          <p>
            To meet the cancellation deadline, it is sufficient for you to send your communication concerning your exercise of the right to cancel before the cancellation period has expired.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Effects of Cancellation</h2>
          <p>
            If you cancel this contract, we will reimburse to you all payments received from you, including the costs of delivery (except for the supplementary costs arising if you chose a type of delivery other than the least expensive type of standard delivery offered by us).
          </p>
          <p>
            We may make a deduction from the reimbursement for loss in value of any goods supplied, if the loss is the result of unnecessary handling by you.
          </p>
          <p>
            We will make the reimbursement without undue delay, and not later than:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>14 days after the day we receive back from you any goods supplied, or</li>
            <li>(if earlier) 14 days after the day you provide evidence that you have returned the goods, or</li>
            <li>if there were no goods supplied, 14 days after the day on which we are informed about your decision to cancel this contract.</li>
          </ul>
          <p>
            We will make the reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of the reimbursement. We may withhold reimbursement until we have received the goods back or you have supplied evidence of having sent back the goods, whichever is the earliest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Returning the Goods</h2>
          <p>
            You shall send back the goods or hand them over to us without undue delay and in any event not later than 14 days from the day on which you communicate your cancellation from this contract to us. The deadline is met if you send back the goods before the period of 14 days has expired.
          </p>
          <p>
            <strong>Return Address:</strong><br />
            London, United Kingdom (Please contact us for the full return address).
          </p>
          <p>
            You will have to bear the direct cost of returning the goods.
          </p>
        </section>

        {/* Consumer Rights Act 2015 Compliance */}
        {/* Source: https://www.gov.uk/accepting-returns-and-giving-refunds */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Faulty or Defective Goods</h2>
          <p>
            Under the UK Consumer Rights Act 2015, goods must be as described, fit for purpose, and of satisfactory quality. If your goods are faulty, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Get a full refund if you claim within 30 days of receiving your goods.</li>
            <li>Get a repair or replacement if you claim after 30 days but within 6 months. (If the repair or replacement is unsuccessful, you may then claim a refund or price reduction).</li>
          </ul>
          <p>
            If you receive a faulty item, please contact us immediately at malayaliaaanoo@gmail.com with details of the product and the defect. We will cover the return shipping costs for faulty items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Exceptions to the Right to Cancel</h2>
          <p>
            The right to cancel does not apply to the following kind of contracts:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The supply of goods that are made to the consumer's specifications or are clearly personalised.</li>
            <li>The supply of goods which are liable to deteriorate or expire rapidly.</li>
            <li>The supply of sealed goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.</li>
            <li>The supply of goods which are, after delivery, according to their nature, inseparably mixed with other items.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about our Returns Policy, please contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>By email: malayaliaaanoo@gmail.com</li>
            <li>By phone: +44 7344 909757</li>
          </ul>
        </section>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/terms-and-conditions" className="text-primary-500 hover:text-primary-400 transition-colors">
            View our Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
