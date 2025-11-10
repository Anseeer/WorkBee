import React, { useEffect, useState } from 'react';
import type { IWorker } from '../../types/IWorker';
import type { Iuser } from '../../types/IUser';
import type { IWork } from '../../types/IWork';
import { fetchCategory, fetchEarnings, fetchService, fetchTopThree, fetchUsers, fetchWallet, fetchWorkers, fetchWorks } from '../../services/adminService';
import UsersIcon from "../../assets/users-icon.png";
import WorkersIcon from "../../assets/workers-icon.png";
import JobsIcon from "../../assets/jobs-icon.png";
import { BarChart } from "lucide-react";
import CategoryAndServicesIcon from "../../assets/category&services.png";
import serviceIcon from "../../assets/service-icon.png";
import EarningsChart from '../worker/Earnings';
import type { IWallet } from '../../types/IWallet';
import AnimatedNumber from '../../utilities/AnimatedNumber';

interface TopItem {
  name: string;
  count: number;
}

type Filter = "monthly" | 'yearly';

const Dashboard: React.FC = () => {
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [users, setUsers] = useState<Iuser[]>([]);
  const [works, setWorks] = useState<IWork[]>([]);
  const [services, setServices] = useState<IWork[]>([]);
  const [category, setCategory] = useState<IWork[]>([]);
  const [topWorkers, setTopWorkers] = useState<TopItem[]>([]);
  const [topUsers, setTopUsers] = useState<TopItem[]>([]);
  const [topServices, setTopServices] = useState<TopItem[]>([]);
  const [topCategories, setTopCategories] = useState<TopItem[]>([]);
  const [filter, setFilter] = useState<Filter>('monthly');
  const [earnings, setEarnings] = useState([]);
  const [Wallet, setWallet] = useState<IWallet>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workerRes = await fetchWorkers(1, 1000);
        const userRes = await fetchUsers(1, 1000);
        const workRes = await fetchWorks(1, 1000);
        const categoryRes = await fetchCategory(1, 1000);
        const serviceRes = await fetchService(1, 1000);
        const topThreeRes = await fetchTopThree();
        const earningsData = await fetchEarnings(filter);
        const walletRes = await fetchWallet();
        const topThree = topThreeRes.getTopThree[0];
        const { TopCategory, TopServices, TopUsers, TopWorker } = topThree;
        setWallet(walletRes.earnings)
        setEarnings(earningsData.earnings)
        setTopCategories(TopCategory);
        setTopServices(TopServices);
        setTopUsers(TopUsers);
        setTopWorkers(TopWorker);
        setWorkers(workerRes.data.data.workers);
        setUsers(userRes.data.data.users);
        setServices(serviceRes.data.data.services);
        setCategory(categoryRes.data.data.category);
        setWorks(workRes.data.data.paginatedWorks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [filter]);

  const renderSection = (title: string, items: TopItem[]) => {
    const maxCount = Math.max(...items.map(item => item.count), 1);
    return (
      <div className="bg-white p-6 animate-zoomIn rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{item.name}</span>
                  <span className="text-gray-500 text-sm">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No data available</p>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="container mx-auto p-6 max-h-[585px] overflow-y-auto animate-fadeInUp scrollbar-hide">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
        {[
          { label: "Total Workers", value: workers.length, icon: WorkersIcon },
          { label: "Total Users", value: users.length, icon: UsersIcon },
          { label: "Total Jobs", value: works.length, icon: JobsIcon },
          { label: "Total Category", value: category.length, icon: CategoryAndServicesIcon },
          { label: "Total Service", value: services.length, icon: serviceIcon },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeInScale`}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div>
              <p className="text-sm font-medium text-gray-500 animate-fadeInDown">{stat.label}</p>
              <h2 className="text-2xl font-bold text-gray-900 animate-fadeInUp">
                <AnimatedNumber value={Number(stat.value)} />
              </h2>
            </div>
            <div className="p-3 bg-green-100 rounded-full flex items-center justify-center animate-zoomIn">
              <img
                src={stat.icon}
                alt={stat.label}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slideInRight" style={{ animationDelay: "0.1s" }}>
          {renderSection('Top Workers', topWorkers)}
        </div>
        <div className="animate-slideInRight" style={{ animationDelay: "0.2s" }}>
          {renderSection('Top Users', topUsers)}
        </div>
        <div className="animate-slideInRight" style={{ animationDelay: "0.3s" }}>
          {renderSection('Top Categories', topCategories)}
        </div>
        <div className="animate-slideInRight" style={{ animationDelay: "0.4s" }}>
          {renderSection('Top Services', topServices)}
        </div>
      </div>

      {/* Chart + Wallet */}
      <div className="flex flex-col lg:flex-row gap-6 p-3 w-full mt-4">
        {/* Chart Section */}
        <div className="flex-1 p-4 rounded-xl bg-white border border-gray-200 space-y-6 animate-fadeInUp">
          <div className="flex space-x-3 items-center animate-fadeInDown">
            <label htmlFor="filter" className="text-sm font-medium text-gray-700">
              Filter:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-300 transition-all"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {(!earnings || earnings.length === 0) ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm font-medium">
              No earnings available.
            </div>
          ) : (
            <EarningsChart filter={filter} rawData={earnings} />
          )}
        </div>

        {/* Wallet Section */}
        <div className="w-full lg:w-1/3 border border-gray-200 p-6 rounded-2xl shadow flex flex-col items-center justify-center text-center bg-white animate-zoomIn hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
          <p className="text-lg text-green-800 animate-fadeInDown">Wallet Balance</p>
          <h2 className="text-4xl font-bold text-green-900 animate-fadeInScale">
            ₹<AnimatedNumber value={Number(Wallet?.balance)} />
          </h2>
          <BarChart className="mt-4 w-20 h-20 text-green-700 animate-fadeInUp" />
        </div>
      </div>
    </div>
  );

};

export default Dashboard;