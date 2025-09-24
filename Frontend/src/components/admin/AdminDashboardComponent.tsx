import React from 'react';

const AdminDashboardComponent: React.FC = () => {
    // Demo data
    const stats = {
        earnings: { value: 22780, change: 45 },
        workers: { value: 550, change: 58 },
        customers: { value: 1230, change: 45 },
        jobs: { value: 3553, change: 58 },
    };

    const trendData = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        users: [200, 400, 300, 500, 400],
        workers: [100, 300, 200, 400, 300],
        jobs: [500, 700, 600, 800, 700],
        earnings: [4000, 6000, 5000, 7000, 6000],
    };

    const categories = [
        { name: 'Cleaning', value: 45, color: '#A78BFA' },
        { name: 'Repair', value: 30, color: '#5EEAD4' },
        { name: 'Moving', value: 25, color: '#FDBA74' },
    ];

    const locations = [
        { name: 'Kochi', value: 300 },
        { name: 'Thiruvananthapuram', value: 200 },
        { name: 'Kottayam', value: 150 },
        { name: 'Thrissur', value: 100 },
    ];

    const topWorkers = [
        { name: 'WorkerOne', jobCount: 96 },
        { name: 'WorkerTwo', jobCount: 85 },
        { name: 'WorkerThree', jobCount: 78 },
        { name: 'WorkerFour', jobCount: 72 },
    ];

    // Line chart configuration
    const chartWidth = 400;
    const chartHeight = 200;
    const maxTrendValue = Math.max(...Object.values(trendData).filter((v): v is number[] => Array.isArray(v) && v.every(item => typeof item === 'number')).flat());
    const lineColors = {
        users: '#C084FC',
        workers: '#60A5FA',
        jobs: '#34D399',
        earnings: '#FBBF24',
    };

    const getPoints = (data: number[]) => {
        return data.map((val, i) => {
            const x = (i / (data.length - 1)) * chartWidth;
            const y = chartHeight - (val / maxTrendValue) * chartHeight;
            return `${x},${y}`;
        }).join(' ');
    };

    // Pie chart configuration
    const pieRadius = 80;
    let startAngle = 0;
    const piePaths = categories.map((cat) => {
        const angle = (cat.value / 100) * 360;
        const endAngle = startAngle + angle;
        const largeArc = angle > 180 ? 1 : 0;
        const x1 = pieRadius + pieRadius * Math.cos((startAngle * Math.PI) / 180);
        const y1 = pieRadius - pieRadius * Math.sin((startAngle * Math.PI) / 180);
        const x2 = pieRadius + pieRadius * Math.cos((endAngle * Math.PI) / 180);
        const y2 = pieRadius - pieRadius * Math.sin((endAngle * Math.PI) / 180);
        startAngle = endAngle;
        return `M ${pieRadius},${pieRadius} L ${x1},${y1} A ${pieRadius},${pieRadius} 0 ${largeArc},0 ${x2},${y2} Z`;
    });

    // Bar chart configuration
    const barWidth = 50;
    const barSpacing = 20;
    const barChartWidth = (barWidth + barSpacing) * locations.length - barSpacing;
    const maxBarValue = Math.max(...locations.map(l => l.value));

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Earnings</p>
                        <h2 className="text-2xl font-bold text-gray-900">₹{stats.earnings.value.toLocaleString()}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-green-600">{stats.earnings.change}%</p>
                        <svg className="w-8 h-8" viewBox="0 0 36 36">
                            <path d="M18 3 a15 15 0 0 1 0 30 a15 15 0 0 1 0 -30" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                            <path d="M18 3 a15 15 0 0 1 0 30" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${stats.earnings.change * 0.94}, 94.2`} transform="rotate(-90 18 18)" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Workers</p>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.workers.value}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-green-600">{stats.workers.change}%</p>
                        <svg className="w-8 h-8" viewBox="0 0 36 36">
                            <path d="M18 3 a15 15 0 0 1 0 30 a15 15 0 0 1 0 -30" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                            <path d="M18 3 a15 15 0 0 1 0 30" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${stats.workers.change * 0.94}, 94.2`} transform="rotate(-90 18 18)" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Customers</p>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.customers.value}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-green-600">{stats.customers.change}%</p>
                        <svg className="w-8 h-8" viewBox="0 0 36 36">
                            <path d="M18 3 a15 15 0 0 1 0 30 a15 15 0 0 1 0 -30" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                            <path d="M18 3 a15 15 0 0 1 0 30" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${stats.customers.change * 0.94}, 94.2`} transform="rotate(-90 18 18)" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Jobs</p>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.jobs.value}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-green-600">{stats.jobs.change}%</p>
                        <svg className="w-8 h-8" viewBox="0 0 36 36">
                            <path d="M18 3 a15 15 0 0 1 0 30 a15 15 0 0 1 0 -30" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                            <path d="M18 3 a15 15 0 0 1 0 30" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${stats.jobs.change * 0.94}, 94.2`} transform="rotate(-90 18 18)" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Line Chart: Top Active Jobs */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Active Jobs (Monthly)</h3>
                    <svg className="w-full h-52" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                        <polyline points={getPoints(trendData.users)} stroke={lineColors.users} strokeWidth="2" fill="none" />
                        <polyline points={getPoints(trendData.workers)} stroke={lineColors.workers} strokeWidth="2" fill="none" />
                        <polyline points={getPoints(trendData.jobs)} stroke={lineColors.jobs} strokeWidth="2" fill="none" />
                        <polyline points={getPoints(trendData.earnings)} stroke={lineColors.earnings} strokeWidth="2" fill="none" />
                    </svg>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                        {trendData.months.map(month => <span key={month}>{month}</span>)}
                    </div>
                    <div className="flex justify-center space-x-4 mt-4 text-sm">
                        <div className="flex items-center"><span className="w-3 h-3 bg-purple-400 mr-2 inline-block"></span>Users</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-blue-400 mr-2 inline-block"></span>Workers</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-green-400 mr-2 inline-block"></span>Jobs</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-yellow-400 mr-2 inline-block"></span>Earnings</div>
                    </div>
                </div>

                {/* Pie Chart: Top Categories */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Categories</h3>
                    <div className="flex flex-col items-center">
                        <svg className="w-40 h-40" viewBox={`0 0 ${pieRadius * 2} ${pieRadius * 2}`}>
                            {piePaths.map((path, i) => (
                                <path key={i} d={path} fill={categories[i].color} />
                            ))}
                        </svg>
                        <div className="mt-4 space-y-2">
                            {categories.map(cat => (
                                <div key={cat.name} className="flex items-center">
                                    <span className="w-4 h-4 mr-2 inline-block" style={{ backgroundColor: cat.color }}></span>
                                    <span>{cat.name} - {cat.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Top Locations */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Locations</h3>
                    <svg className="w-full h-40" viewBox={`0 0 ${barChartWidth} 200`}>
                        {locations.map((loc, i) => {
                            const height = (loc.value / maxBarValue) * 150;
                            const x = i * (barWidth + barSpacing);
                            return (
                                <g key={loc.name}>
                                    <rect x={x} y={200 - height} width={barWidth} height={height} fill="#60A5FA" />
                                    <text x={x + barWidth / 2} y={190 - height} textAnchor="middle" className="text-xs">{loc.value}</text>
                                    <text x={x + barWidth / 2} y="190" textAnchor="middle" className="text-xs">{loc.name.slice(0, 8)}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* List: Top Workers */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Workers</h3>
                    <div className="space-y-2">
                        {topWorkers.map((worker, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span>{worker.name}</span>
                                <span>Job Count: {worker.jobCount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardComponent;