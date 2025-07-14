

const AdminRegistrationPage = () => {


    return (
        <div className="min-h-screen bg-gray-50 p-4 fixed w-full">
            <div className="absolute top-7.5 left-7.5">
                <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
            </div>

            <div className="flex items-center justify-center m-25">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-3xl border-2 min-h-[300px] border-green-600 p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
                            Create your admin account
                        </h2>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                            </div>


                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-green-900 h-[30px] hover:bg-green-600 text-white font-semibold py-3 pt-1 px-4 rounded-full transition-colors duration-200"
                                >
                                    Sign up
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <span className="text-green-600 hover:text-green-700 font-medium cursor-pointer">
                                        Sign in
                                    </span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrationPage;
