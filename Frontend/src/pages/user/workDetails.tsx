import { useState } from "react";
import Header from "../../components/user/Header";
import WorkDetailForm from "../../components/user/WorkDetailsForm";
import WorkerListing from "../../components/user/WorkerListing";

const WorkDetails = () => {
    const [step, setStep] = useState(1);
    return (
        <>
            <Header />
            {step == 1 ? (
                <WorkDetailForm setStep={setStep} />
            ) : step == 2 ? (
                <WorkerListing />
            ) : null}
        </>
    )
}

export default WorkDetails;
