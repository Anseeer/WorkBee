import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-[#2B4E34] to-[#1a2e20] text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <FileText className="w-16 h-16 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Terms and Conditions
                    </h1>
                    <p className="text-lg text-gray-200">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Important Notice</h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            Please read these terms and conditions carefully before using WorkBee.
                            By accessing or using our platform, you agree to be bound by these terms.
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        1. Introduction
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            Welcome to WorkBee ("we," "our," or "us"). WorkBee is a service marketplace platform
                            that connects users ("Customers") with skilled service providers ("Workers") for various
                            home and professional services including but not limited to plumbing, electrical work,
                            cleaning, painting, and general maintenance.
                        </p>
                        <p>
                            These Terms and Conditions ("Terms") govern your access to and use of the WorkBee platform,
                            including our website, mobile applications, and all related services (collectively, the "Platform").
                            By creating an account or using our services, you acknowledge that you have read, understood,
                            and agree to be bound by these Terms.
                        </p>
                        <p>
                            If you do not agree with any part of these Terms, you must not use our Platform.
                            We reserve the right to modify these Terms at any time, and such modifications will be
                            effective immediately upon posting on the Platform.
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        2. Use of Platform
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            <strong>2.1 Eligibility:</strong> You must be at least 18 years old to use WorkBee.
                            By using the Platform, you represent and warrant that you meet this age requirement
                            and have the legal capacity to enter into these Terms.
                        </p>
                        <p>
                            <strong>2.2 Account Registration:</strong> To access certain features of the Platform,
                            you must create an account. You agree to provide accurate, current, and complete information
                            during registration and to update such information to keep it accurate and current.
                            You are responsible for maintaining the confidentiality of your account credentials and
                            for all activities that occur under your account.
                        </p>
                        <p>
                            <strong>2.3 Prohibited Activities:</strong> You may not use the Platform to engage in
                            any illegal, fraudulent, or unauthorized activities. This includes but is not limited to:
                            harassing or threatening other users, posting false information, attempting to circumvent
                            our verification processes, or using the Platform for any commercial purpose not explicitly
                            authorized by WorkBee.
                        </p>
                        <p>
                            <strong>2.4 Account Suspension:</strong> We reserve the right to suspend or terminate
                            your account at any time, without prior notice, if we believe you have violated these Terms
                            or engaged in conduct that we deem inappropriate or harmful to the Platform or other users.
                        </p>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        3. User Responsibilities
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            <strong>3.1 Customer Responsibilities:</strong> As a Customer, you are responsible for
                            accurately describing your service needs, providing clear access to your property when required,
                            and treating Workers with respect. You agree to be present or make necessary arrangements
                            for the Worker to access your property at the scheduled time.
                        </p>
                        <p>
                            <strong>3.2 Worker Responsibilities:</strong> As a Worker, you are responsible for providing
                            accurate information about your skills and qualifications, completing jobs professionally and
                            on time, and maintaining appropriate licenses and insurance as required by law. You agree to
                            treat Customers with respect and to communicate promptly about any issues or delays.
                        </p>
                        <p>
                            <strong>3.3 Verification and Background Checks:</strong> Workers must undergo our verification
                            process, which may include background checks, skill assessments, and reference verification.
                            Providing false information during this process may result in immediate account termination.
                        </p>
                        <p>
                            <strong>3.4 Communication Standards:</strong> All users must communicate professionally through
                            our in-app chat system. Harassment, inappropriate language, or discriminatory behavior will not
                            be tolerated and may result in account suspension or termination.
                        </p>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        4. Payments and Refunds
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            <strong>4.1 Pricing:</strong> Service prices are determined by Workers and displayed on
                            the Platform. WorkBee charges a service fee for facilitating connections between Customers
                            and Workers. All prices include applicable taxes unless otherwise stated.
                        </p>
                        <p>
                            <strong>4.2 Payment Processing:</strong> All payments must be processed through the Platform's
                            secure payment system. We accept major credit cards, debit cards, and other payment methods
                            as indicated on the Platform. Payment is typically required at the time of booking or upon
                            completion of service, depending on the service type.
                        </p>
                        <p>
                            <strong>4.3 Worker Payments:</strong> Workers will receive payment for completed services
                            minus WorkBee's service fee. Payments are typically processed within 2-5 business days after
                            service completion and customer verification. Workers must maintain valid payment information
                            to receive funds.
                        </p>
                        <p>
                            <strong>4.4 Refund Policy:</strong> Refunds may be issued in cases of service cancellation,
                            non-performance, or significant service defects. Customers must submit refund requests within
                            48 hours of service completion through the Platform. Each case will be reviewed individually,
                            and WorkBee reserves the right to make the final determination on refund eligibility.
                        </p>
                        <p>
                            <strong>4.5 Cancellation Policy:</strong> Customers may cancel bookings up to 24 hours before
                            the scheduled service time for a full refund. Cancellations within 24 hours may incur a
                            cancellation fee. Workers who cancel confirmed bookings without valid reason may face
                            penalties or account suspension.
                        </p>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        5. Data Privacy and Security
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            <strong>5.1 Data Collection:</strong> We collect personal information necessary to provide
                            our services, including name, contact information, payment details, location data, and
                            service history. Our collection and use of personal information is governed by our Privacy Policy,
                            which is incorporated into these Terms by reference.
                        </p>
                        <p>
                            <strong>5.2 Data Usage:</strong> We use your information to facilitate services, improve
                            the Platform, communicate with you, and ensure platform security. We may also use aggregated,
                            anonymized data for analytics and business purposes.
                        </p>
                        <p>
                            <strong>5.3 Data Sharing:</strong> We share your information with Workers or Customers only
                            as necessary to facilitate services. We do not sell your personal information to third parties.
                            We may share information with service providers who assist in platform operations, subject to
                            confidentiality agreements.
                        </p>
                        <p>
                            <strong>5.4 Data Security:</strong> We implement industry-standard security measures to protect
                            your information, including encryption, secure servers, and regular security audits. However,
                            no method of transmission over the internet is completely secure, and we cannot guarantee
                            absolute security.
                        </p>
                        <p>
                            <strong>5.5 Your Rights:</strong> You have the right to access, correct, or delete your
                            personal information. You may also object to certain processing activities or request data
                            portability. To exercise these rights, please contact us using the information provided in
                            Section 6.
                        </p>
                    </div>
                </div>

                {/* Section 6 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        6. Limitation of Liability
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            <strong>6.1 Platform Role:</strong> WorkBee acts solely as an intermediary platform connecting
                            Customers with Workers. We do not employ Workers, and they are independent contractors.
                            We are not responsible for the quality, safety, or legality of services provided by Workers.
                        </p>
                        <p>
                            <strong>6.2 No Warranties:</strong> The Platform is provided "as is" without warranties of any
                            kind, either express or implied. We do not guarantee that the Platform will be error-free,
                            uninterrupted, or secure at all times.
                        </p>
                        <p>
                            <strong>6.3 Limitation of Damages:</strong> To the maximum extent permitted by law, WorkBee
                            shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                            arising from your use of the Platform or services obtained through the Platform.
                        </p>
                        <p>
                            <strong>6.4 Dispute Resolution:</strong> Any disputes between Customers and Workers should
                            be resolved directly between the parties. WorkBee may assist in mediation but is not obligated
                            to do so. For disputes involving WorkBee, both parties agree to first attempt to resolve
                            issues through good-faith negotiation.
                        </p>
                    </div>
                </div>

                {/* Section 7 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        7. Intellectual Property
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            All content on the Platform, including text, graphics, logos, images, software, and design,
                            is the property of WorkBee or its licensors and is protected by copyright, trademark, and
                            other intellectual property laws. You may not reproduce, distribute, modify, or create
                            derivative works from any content without our express written permission.
                        </p>
                        <p>
                            By submitting content to the Platform (such as reviews, photos, or messages), you grant
                            WorkBee a non-exclusive, worldwide, royalty-free license to use, reproduce, and display
                            such content in connection with the Platform and our business operations.
                        </p>
                    </div>
                </div>

                {/* Section 8 */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#2B4E34]">
                        8. Contact Information
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            If you have any questions, concerns, or complaints regarding these Terms or the Platform,
                            please contact us:
                        </p>
                        <div className="bg-gray-100 rounded-lg p-6 mt-4">
                            <p className="font-semibold text-gray-900 mb-2">WorkBee Customer Support</p>
                            <p className="text-gray-700">Email: support@workbee.com</p>
                            <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                            <p className="text-gray-700">Address: 123 Service Street, Suite 100, San Francisco, CA 94102</p>
                            <p className="text-gray-700 mt-2">Business Hours: Monday - Friday, 9:00 AM - 6:00 PM PST</p>
                        </div>
                    </div>
                </div>

                {/* Acceptance */}
                <div className="bg-[#2B4E34]/5 border-l-4 border-[#2B4E34] rounded-r-lg p-6 mt-12">
                    <h3 className="font-semibold text-gray-900 mb-2">Acceptance of Terms</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        By using WorkBee, you acknowledge that you have read, understood, and agree to be bound by
                        these Terms and Conditions. If you do not agree with these Terms, please discontinue use of
                        the Platform immediately.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditions;