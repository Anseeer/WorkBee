import React from 'react';
import { Shield, Lock, Mail, Database, Trash2, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold text-center mb-2">Privacy Policy</h1>
                    <p className="text-center text-blue-100">Last updated: {lastUpdated}</p>
                </div>

                {/* Content */}
                <div className="px-8 py-12 space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-700 leading-relaxed">
                            This Privacy Policy describes how we collect, use, and protect your personal information when you use our application. By using our service, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Database className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">When you sign in with Google, we collect the following information:</p>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Name:</strong> Your full name from your Google account</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Email Address:</strong> Your primary email address</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Profile Picture:</strong> Your Google profile photo</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Google User ID:</strong> A unique identifier for authentication</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Eye className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <p>We use the collected information for the following purposes:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>To authenticate and identify you in our application</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>To provide personalized user experience</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>To communicate with you about your account</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>To improve our services and user experience</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Storage and Security */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Lock className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Data Storage and Security</h2>
                        </div>
                        <div className="bg-green-50 rounded-lg p-6 space-y-3 text-gray-700">
                            <p>We take your privacy seriously and implement appropriate security measures:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    <span>Your data is stored securely in our encrypted database</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    <span>We use industry-standard security protocols</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    <span>We do not share your personal information with third parties</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    <span>We do not sell your data to anyone</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Trash2 className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <p>You have the following rights regarding your personal data:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Access:</strong> You can request a copy of your personal data</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Correction:</strong> You can update your information through your account settings</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Deletion:</strong> You can request deletion of your account and all associated data</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Revoke Access:</strong> You can revoke our access through your Google account settings</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                            <p className="text-gray-700">
                                We use Google OAuth 2.0 for authentication. When you sign in with Google, you are also subject to Google's Privacy Policy. We recommend reviewing Google's privacy practices at{' '}
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    https://policies.google.com/privacy
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* Cookies and Tracking */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                        <p className="text-gray-700">
                            We use cookies and similar tracking technologies to maintain your session and improve your experience. These cookies are essential for the authentication process and do not track your activity outside our application.
                        </p>
                    </section>

                    {/* Changes to Privacy Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                        <p className="text-gray-700">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Mail className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Email:</strong> <span className="text-blue-600">support@yourapp.com</span></p>
                                <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <section className="border-t pt-8">
                        <p className="text-sm text-gray-500 text-center">
                            By using our application, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;