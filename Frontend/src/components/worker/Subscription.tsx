import { useState } from 'react';

interface PlanCardProps {
    title: string;
    price: number;
    commission: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

const PlanCard = ({
    title,
    price,
    commission,
    description,
    isSelected,
    onSelect,
}: PlanCardProps) => {
    return (
        <div
            onClick={onSelect}
            className={`bg-white border-2 ${isSelected ? 'border-green-800' : 'border-gray-300'
                } rounded-lg p-6 cursor-pointer transition-all hover:border-green-600`}
        >
            <div className="flex items-center mb-4">
                <div
                    className={`w-5 h-5 rounded-full border-2 ${isSelected
                        ? 'border-green-800 bg-white'
                        : 'border-gray-400 bg-white'
                        } flex items-center justify-center mr-2`}
                >
                    {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-green-800"></div>
                    )}
                </div>
                <span className="font-semibold text-gray-900">{title}</span>
            </div>

            <div className="mb-3">
                <span className="text-4xl font-bold text-gray-900">
                    {price == 0 ? `Freee ₹${price}` : `Just for ₹${price}`}
                </span>
            </div>

            <div className="mb-4">
                <span className="text-xl font-bold text-gray-900">
                    Commission {commission}
                </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        </div>
    );
};

export const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: 'basic',
            title: 'Basic',
            price: 0,
            commission: '10%',
            description: 'Perfect for starters. No monthly fee, 10% commission per job',
        },
        {
            id: 'pro',
            title: 'Pro',
            price: 200,
            commission: '5%',
            description: 'Perfect for intermediates. only 200 monthly fee, 5% commission per job',
        },
        {
            id: 'elite',
            title: 'Elite',
            price: 300,
            commission: '2%',
            description: 'Perfect for experts. only 300 monthly fee, 2% commission per job',
        },
    ];

    const handleStartReceiving = () => {
        if (selectedPlan) {
            alert(`Selected plan: ${selectedPlan}`);
        } else {
            alert('Please select a plan');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-8 border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Choose Your Subscription Plan
                    </h1>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        Unlock your access to job requests and start earning. Select a plan that fits your goals — higher plans mean lower commission, more profit, and priority support.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            title={plan.title}
                            price={plan.price}
                            commission={plan.commission}
                            description={plan.description}
                            isSelected={selectedPlan === plan.id}
                            onSelect={() => setSelectedPlan(plan.id)}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleStartReceiving}
                        className="bg-green-800 hover:bg-green-900 text-white font-semibold px-12 py-3 rounded-lg transition-colors"
                    >
                        Start Receiving Jobs
                    </button>
                </div>
            </div>
        </div>
    );
};
