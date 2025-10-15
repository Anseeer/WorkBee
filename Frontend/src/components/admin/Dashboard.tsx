import React, { useEffect, useState } from 'react';
import type { IWorker } from '../../types/IWorker';
import type { Iuser } from '../../types/IUser';
import type { IWork } from '../../types/IWork';
import { fetchCategory, fetchEarnings, fetchService, fetchTopThree, fetchUsers, fetchWallet, fetchWorkers, fetchWorks } from '../../services/adminService';
import UsersIcon from "../../assets/users-icon.png";
import WorkersIcon from "../../assets/workers-icon.png";
import JobsIcon from "../../assets/jobs-icon.png";
import WalletIcon from "../../assets/stepFour-icon.png";
import CategoryAndServicesIcon from "../../assets/category&services.png";
import serviceIcon from "../../assets/service-icon.png";
import EarningsChart from '../worker/Earnings';
import type { IWallet } from '../../types/IWallet';

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
  console.log('Wallet :', Wallet)

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
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
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
    <div className="container mx-auto p-6 max-h-[585px] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Workers</p>
            <h2 className="text-2xl font-bold text-gray-900">{workers.length}</h2>
          </div>
          <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={WorkersIcon}
              alt="Workers"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold text-gray-900">{users.length}</h2>
          </div>
          <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={UsersIcon}
              alt="Users"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Jobs</p>
            <h2 className="text-2xl font-bold text-gray-900">{works.length}</h2>
          </div>
          <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={JobsIcon}
              alt="Jobs"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Category</p>
            <h2 className="text-2xl font-bold text-gray-900">{category.length}</h2>
          </div>
          <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={CategoryAndServicesIcon}
              alt="CategoryAndServicesIcon"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Service</p>
            <h2 className="text-2xl font-bold text-gray-900">{services.length}</h2>
          </div>
          <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={serviceIcon}
              alt="Service"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderSection('Top Workers', topWorkers)}
        {renderSection('Top Users', topUsers)}
        {renderSection('Top Categories', topCategories)}
        {renderSection('Top Services', topServices)}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-3 w-full">
        {/* Chart Section */}
        <div className="flex-1 p-4 rounded-xl bg-white border border-gray-200 space-y-6">
          {/* Filter buttons */}
          <div className="flex space-x-3">
            <label htmlFor="filter" className="text-sm font-medium text-gray-700">
              Filter:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-300"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Chart */}
          <EarningsChart filter={filter} rawData={earnings} />
        </div>

        {/* Wallet Section */}
        <div className="w-full lg:w-1/3 border border-gray-200 p-6 rounded-lg shadow flex flex-col items-center justify-center text-center">
          <p className="text-lg text-green-800">Wallet balance</p>
          <h2 className="text-4xl font-bold text-green-900">₹{Wallet?.balance}</h2>

          <img
            src={WalletIcon}
            alt="walletIcon"
            className="mt-4 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
          />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;