import WorkerHeroImg from "../../assets/workerHeroImg.png"
import StepOneIcon from "../../assets/stepOne-icon.png"
import StepTwoIcon from "../../assets/stepTwo-icon.png"
import StepThreeIcon from "../../assets/setThree-icon.png"
import StepFourIcon from "../../assets/stepFour-icon.png"
import { useNavigate } from "react-router-dom"

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-white items-center">
            <div className="max-w-7xl mx-auto px-6 grid py-10 grid-cols-1 md:grid-cols-2 gap-10 items-center">

                <div className="space-y-6">
                    <h1 className="text-5xl font-bold text-black-900 leading-snug">
                        Welcome To WorkBee
                    </h1>
                    <h4 className="text-3xl font-semibold text-black-900 leading-snug">
                        Earn on Your Own Terms. Join WorkBee Today.                    </h4>
                    <p className="text-green-950 text-lg leading-relaxed">
                        Turn your skills into income. Whether you're a cleaner, plumber, technician, or just good with hands — get matched with people who need your help in your area                    </p>

                    <button onClick={()=> navigate('/workers/register')} className="flex px-3 py-1 bg-green-700 text-white  rounded-full border overflow-hidden shadow-lg max-w-md">
                        Get started
                    </button>
                </div>
                {/* hero image section */}
                <div className="w-full p-5">
                    <img
                        src={WorkerHeroImg}
                        alt="Skilled worker"
                        className="w-full h-[500px] object-cover rounded-sm shadow-lg"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-evenly items-center py-20 px-6 md:px-20 gap-10">

                <div className="w-full md:w-1/2 space-y-4 text-center">
                    <h1 className="text-3xl font-semibold text-black leading-snug">What is WorkBee</h1>
                    <h3 className="text-lg font-medium text-black leading-snug">
                        WorkBee is a local service platform that connects skilled individuals like you with people nearby
                        who need help with everyday tasks — from cleaning and repairs to moving and more.
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Whether you're looking for extra income or want to grow your work as a trusted helper,
                        <span className="font-medium text-green-800"> WorkBee </span>
                        gives you the freedom to work when and where you want.
                    </p>
                </div>

                <div className="w-full md:w-1/2 space-y-4 text-center">
                    <h1 className="text-3xl font-semibold text-black leading-snug">Our vision</h1>
                    <h3 className="text-lg font-medium text-black leading-snug">
                        At WorkBee, we believe everyone deserves the chance to earn with dignity, flexibility, and pride in their work. its a  platform where skilled hands meet real needs — right in your local community
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Choose your own schedule, set your skills, and get started — all on your terms.
                    </p>
                </div>
            </div>


            <h1 className="items-center pt-20 flex justify-center text-4xl font-semibold text-black leading-snug">How You Earn with WorkBee</h1>
            <div className="w-full flex flex-col md:flex-row justify-evenly items-center pt-20 pb-30 px-6 md:px-20 gap-10">
                <div className="w-full md:w-1/4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <img src={StepOneIcon} alt="" className="w-6 h-6" />
                        <h3 className="text-lg font-medium text-black leading-snug">Sign up</h3>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Quick and easy. Just enter your name, email, phone number, location, category of work and create a password to get started.
                    </p>
                </div>

                <div className="w-full md:w-1/4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <img src={StepTwoIcon} alt="" className="w-6 h-6" />
                        <h3 className="text-lg font-medium text-black leading-snug">Build Your Profile</h3>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Tell us more about your skills, set your availability, and complete your profile to help customers find you.
                    </p>
                </div>

                <div className="w-full md:w-1/4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <img src={StepThreeIcon} alt="" className="w-6 h-6" />
                        <h3 className="text-lg font-medium text-black leading-snug">Verify Your Identity</h3>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Upload a valid government ID to confirm your identity and build trust with customers. Once verified, your profile will be marked as "Verified".
                    </p>
                </div>

                <div className="w-full md:w-1/4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <img src={StepFourIcon} alt="" className="w-6 h-6" />
                        <h3 className="text-lg font-medium text-black leading-snug">Subscription Plan</h3>
                    </div>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Select a plan to activate your WorkBee profile and start receiving job requests based on your services and location.
                    </p>
                </div>
            </div>



        </section>
    )
}

export default HeroSection;