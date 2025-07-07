import { useAppSelector } from "../../hooks/useAppSelector";

const Dashboard = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
    </div>
  );
};

export default Dashboard;