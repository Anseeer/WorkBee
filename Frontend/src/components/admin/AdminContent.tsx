
interface Props{
    activeTab : string;
}
const AdminContant = ({activeTab}:Props)=>{
    switch(activeTab){
        case "users":
            return <h1>Users</h1>;
        case "workers":
            return <h1>Workers</h1>;
        case "jobs":
            return <h1>Jobs</h1>;
        default:
            return <h1>Dashboard</h1>
    }
};

export default AdminContant;