import type { IWork } from "../../types/IWork";
import { DataTable, type Column } from "../common/Table";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { useEffect, useState } from "react";
import { fetchWorkHistory } from "../../services/workerService";
import { StatusBadge } from "../../utilities/StatusBadge";
import WorkDetailsModal from "./WorkDetailsModal";

const WorkHistory = () => {

    const worker = useSelector((state: RootState) => state?.worker.worker);
    const [workHistory, setWorkHistory] = useState<IWork[]>([])
    const [workId, setWorkId] = useState('')
    const [isModal, setIsModalOpen] = useState(false)
    console.log(worker);

    useEffect(() => {
        const fetchData = async () => {
            const history = await fetchWorkHistory(worker?._id as string);
            setWorkHistory(history.data)
        }
        fetchData()
    }, [isModal])

    const handleInfoModal = (workId: string) => {
        setWorkId(workId);
        setIsModalOpen(true);
    }

    const columns: Column<IWork>[] = [
        {
            key: '_id',
            label: 'ID',
            render: (u) => u._id
                ? '#' + u._id.toString().slice(2, 11).toUpperCase()
                : '-'
        },
        { key: 'service', label: 'Service' },
        { key: 'location', label: 'Location', render: (u) => u.location?.address.split(' ').slice(0, 2).join(" ") ?? '-' },
        { key: 'sheduleDate', label: 'Date', render: (u) => new Date(u.sheduleDate).toLocaleDateString() },
        { key: 'sheduleTime', label: 'Sheduled' },
        { key: 'wage', label: 'Wage', render: (u) => "₹" + u.wage },
        { key: 'status', label: 'Status', render: (u) => <StatusBadge status={u.status} /> },
        {
            key: 'status',
            label: 'Actions',
            render: (u) => (
                <button
                    className="px-3 py-1 text-sm rounded bg-green-700 text-white hover:bg-green-600"
                    onClick={() => handleInfoModal(u._id as string)}
                >
                    Info
                </button>
            )
        }
    ]

    const onClsoe = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            {isModal ? (
                <WorkDetailsModal workId={workId} closeModal={onClsoe} />
            ) : (
                <DataTable
                    itemsPerPage={5}
                    data={workHistory.map(w => ({
                        ...w,
                        id: w._id ?? ''
                    }))} columns={columns}
                    searchKeys={['userName', 'service', 'description', 'wage', 'workType', 'size', 'location', 'sheduleDate', 'sheduleTime', 'status']}
                />
            )}

        </>
    );
}

export default WorkHistory;