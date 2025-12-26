import { lazy, Suspense, useState } from "react";
import Header from "../../components/user/Header";
import Loader from "../../components/common/Loader";
const WorkDetailForm = lazy(() => import("../../components/user/WorkDetailsForm"));
const WorkerListing = lazy(() => import("../../components/user/WorkerListing"));

const WorkDetails = () => {
    const [step, setStep] = useState(1);
    return (
        <>
            <Suspense fallback={<Loader />}>
                <Header />
                {step == 1 ? (
                    <WorkDetailForm setStep={setStep} />
                ) : step == 2 ? (
                    <WorkerListing />
                ) : null}
            </Suspense>
        </>
    )
}

export default WorkDetails;
