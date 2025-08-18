export const ADMIN_MESSAGES = {
    LOGIN_SUCCESS: "Admin logged in successfully.",
    LOGIN_FAILED: "Admin login failed. Please check your credentials.",

    LOGOUT_SUCCESS: "Admin logged out successfully.",
    LOGOUT_FAILED: "Admin logout failed. Please try again.",

    FETCH_USERS_SUCCESS: "User list fetched successfully.",
    FETCH_USERS_FAILED: "Failed to fetch user list.",

    FETCH_WORKERS_SUCCESS: "Worker list fetched successfully.",
    FETCH_WORKERS_FAILED: "Failed to fetch worker list.",

    UPDATE_USERS_STATUS_SUCCESS: "User status updated successfully.",
    UPDATE_USERS_STATUS_FAILED: "Failed to update user status.",

    UPDATE_WORKERS_STATUS_SUCCESS: "Worker status updated successfully.",
    UPDATE_WORKERS_STATUS_FAILED: "Failed to update worker status.",

    FETCH_NON_VERIFIED_WORKERS_SUCCESS: "Non-verified workers fetched successfully.",
    FETCH_NON_VERIFIED_WORKERS_FAILED: "Failed to fetch non-verified workers.",

    FETCH_AVAILABILITY_SUCCESS: "Availability data fetched successfully.",
    FETCH_AVAILABILITY_FAILED: "Failed to fetch availability data.",

    APPROVE_WORKER_SUCCESS: "Worker approved successfully.",
    APPROVE_WORKER_FAILED: "Failed to approve worker.",

    REJECT_WORKER_SUCCESS: "Worker rejected successfully.",
    REJECT_WORKER_FAILED: "Failed to reject worker.",

    CANT_FIND_ADMIN: "Admin not found.",
    INVALID_PASSWORD: "Invalid password. Please try again.",
    ID_NOT_RECEIVED: "ID not received. Please provide a valid ID.",
    MISSING_CREDENTIALS: "Email and password are required.",

};


export const CATEGORY_MESSAGE = {
    GET_ALL_CATEGORIES_SUCCESS: "All categories fetched successfully.",
    GET_ALL_CATEGORIES_FAILED: "Failed to fetch categories.",

    CREATE_CATEGORY_SUCCESS: "Category created successfully.",
    CREATE_CATEGORY_FAILED: "Failed to create category.",

    UPDATE_CATEGORY_SUCCESS: "Category updated successfully.",
    UPDATE_CATEGORY_FAILED: "Failed to update category.",

    DELETE_CATEGORY_SUCCESS: "Category deleted successfully.",
    DELETE_CATEGORY_FAILED: "Failed to delete category.",

    UPDATE_CATEGORY_STATUS_SUCCESS: "Category status updated successfully.",
    UPDATE_CATEGORY_STATUS_FAILED: "Failed to update category status.",

    GET_CATEGORIES_BY_WORKER_SUCCESS: "Worker's categories fetched successfully.",
    GET_CATEGORIES_BY_WORKER_FAILED: "Failed to fetch categories for the worker.",

    CATEGORY_ALREADY_EXISTS: "Category already exists.",
    CATEGORY_NOT_EXIST: "Category does not exist.",
    ID_NOT_RECEIVED: "IDs not received. Please provide a valid IDs.",

};


export const SERVICE_MESSAGE = {
    CREATE_SERVICE_SUCCESS: "Service created successfully.",
    CREATE_SERVICE_FAILED: "Failed to create service.",

    GET_ALL_SERVICES_SUCCESS: "All services fetched successfully.",
    GET_ALL_SERVICES_FAILED: "Failed to fetch services.",

    UPDATE_SERVICE_SUCCESS: "Service updated successfully.",
    UPDATE_SERVICE_FAILED: "Failed to update service.",

    UPDATE_SERVICE_STATUS_SUCCESS: "Service status updated successfully.",
    UPDATE_SERVICE_STATUS_FAILED: "Failed to update service status.",

    DELETE_SERVICE_SUCCESS: "Service deleted successfully.",
    DELETE_SERVICE_FAILED: "Failed to delete service.",

    GET_SERVICE_BY_CATEGORIES_SUCCESS: "Services by category fetched successfully.",
    GET_SERVICE_BY_CATEGORIES_FAILED: "Failed to fetch services by category.",

    GET_SERVICE_BY_WORKER_SUCCESS: "Worker's services fetched successfully.",
    GET_SERVICE_BY_WORKER_FAILED: "Failed to fetch services for the worker.",

    GET_SERVICE_BY_SEARCH_SUCCESS: "Services fetched based on search query.",
    GET_SERVICE_BY_SEARCH_FAILED: "Failed to fetch services by search.",

    SERVICE_ALREADY_EXIST: "Service already exists.",
    SERVICE_NOT_EXIST: "Service does not exist.",
    ID_NOT_RECEIVED: "IDs not received. Please provide a valid IDs.",
    INVALID_SEARCH_KEY: "Search key is required and cannot be empty.",

};


export const USERS_MESSAGE = {
    USER_UPDATE_SUCCESS:"User update successfull.",
    USER_UPDATE_FAILD:"User update faild.",
    FETCH_AVAILABILITY_SUCCESS:"Fetch availability successfull.",
    FETCH_AVAILABILITY_FAILD:"Fetch availability faild.",
    FETCH_USER_SUCCESS:"Fetch user successfull.",
    FETCH_USER_FAILD:"Fetch user faild.",
    REGISTRATION_SUCCESS: "User registered successfully.",
    REGISTRATION_FAILED: "User registration failed.",
    LOGIN_SUCCESS: "Login successful.",
    LOGIN_FAILED: "Login failed. Please check your credentials.",
    LOGOUT_SUCCESS: "Logout successful.",
    LOGOUT_FAILED: "Logout failed.",
    CANT_FIND_USER: "Unable to find user.",
    SUCCESSFULLY_SEND_OTP: "OTP sent successfully.",
    SUCCESSFULLY_RESEND_OTP: "OTP re-sent successfully.",
    FAILD_RESEND_OTP: "OTP re-sent Faild.",
    FAILD_SEND_OTP: "OTP sent Faild.",
    VERIFY_OTP: "OTP verified successfully.",
    FAILED_VERIFY_OTP: "Failed to verify OTP.",
    CREDENTIALS_ARE_REQUIRED: "Email and password are required.",
    PASSWORD_RESET_SUCCESSFULLY: "Password has been reset successfully.",
    PASSWORD_RESET_FAILED: "Failed to reset password.",
    GOOGLE_LOGIN_SUCCESS: "Google login successful.",
    GOOGLE_LOGIN_FAILED: "Google login failed.",
    ALL_FIELDS_REQUIRED_FOR_REGISTRATION: "All fields are required for registration.",
    USER_ALREADY_EXISTS_WITH_EMAIL: "User already exists with this email.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    NO_OTP_FOUND_FOR_THIS_EMAIL: "No OTP found for this email.",
    OTP_EXPIRED: "OTP has expired.",
    INVALID_OTP: "Invalid OTP entered.",
    USER_ID_NOT_GET: "User Id not get.",
    USER_BLOCKED: "User blocked by admin.",

};

export const WORKER_MESSAGE = {
    EMAIL_AND_PASS_REQUIRED: "Email and password are required.",
    LOGIN_FAILD: "Worker login failed. Please check credentials.",
    LOGIN_SUCCESS: "Worker login successful.",
    REGISTRATION_SUCCESS: "Worker registered successfully.",
    REGISTRATION_FAILD: "Worker registration failed.",
    LOGOUT_FAILD: "Logout failed. Please try again.",
    LOGOUT_SUCCESs: "Logout successful.",
    WORKER_ID_MISSING_OR_INVALID: "Worker ID is missing or invalid.",
    WORKER_ACCOUNT_BUILD_SUCCESSFULLY: "Worker account built successfully.",
    WORKER_ACCOUNT_BUILD_FAILD: "Failed to build worker account.",
    CANT_FIND_WORKER: "Cannot find worker details.",
    SUCCESSFULLUY_SEND_OTP: "OTP sent successfully.",
    FAILD_SEND_OTP: "Failed to send OTP.",
    SUCCESSFULLUY_RESEND_OTP: "OTP resent successfully.",
    FAILD_RESEND_OTP: "Failed to resend OTP.",
    VERIFY_OTP: "OTP verified successfully.",
    FAILD_VERIFY_OTP: "OTP verification failed.",
    PASSWORD_RESET_SUCCESSFULLY: "Password reset successfully.",
    PASSWORD_RESET_FAILD: "Failed to reset password.",
    WORKER_DETAILS_FETCH_SUCCESSFULLY: "Worker details fetched successfully.",
    WORKER_DETAILS_FETCH_FAILD: "Failed to fetch worker details.",
    Availability_or_WorkerID_In_Availability_Not_Get: "Availability or worker ID is missing.",
    UPDATE_WORKER_SUCCESSFULLY: "Worker updated successfully.",
    UPDATE_WORKER_FAILD: "Failed to update worker.",
    CANT_FIND_AVAILABILITY: "Cannot find availability.",
    INVALID_PASS: "Invalid password.",
    ALL_FIELDS_ARE_REQUIRED: "All fields are required.",
    WORKER_ALREADY_EXIST: "Worker already exists.",
    WORKER_NOT_EXIST: "Worker not exists.",
    FAILDTO_UPDATE_AVAILABILITY: "Failed to update availability.",
    FAILDTO_DELETE_AVAILABILITY: "Failed to delete availability.",
    FAILDTO_CREATE_AVAILABILITY: "Failed to create availability.",
    NO_OTP_FOUND: "No OTP found.",
    INVALID_OTP: "Invalid OTP.",
    OTP_EXPIRED: "OTP has expired.",
    WORKER_DATA_OR_ID_NOT_GET: "Worker data or ID not provided.",
    WORKER_BLOCKED: "Worker blocked by admin.",
};

export const WORK_MESSAGE = {
    WORK_NOT_EXIST:"Work not exist",
    WORK_DETAILS_GET_SUCCESS:"Work details get successfull.",
    WORK_DETAILS_GET_FAILD:"Work details get faild.",
    WORK_ID_NOT_GET:"Can`t get workId.",
    WORKER_ID_NOT_GET:"Can`t get workerId.",
    USER_ID_NOT_GET:"Can`t get userId.",
    CANT_GET_WORK_DETAILS: "Can't get the job details.",
    WORK_HISTORY_FETCH_SUCCESS: "Work-History fetch successfully.",
    WORK_HISTORY_FETCH_FAILD: "Work-History fetch faild.",
    WORK_CANCEL_SUCCESS: "Work-Booking cancel successfully.",
    WORK_CANCEL_FAILD: "Work-Booking cancel faild.",
    WORK_COMPLETED_SUCCESS: "Work-Booking completed successfully.",
    WORK_COMPLETED_FAILD: "Work-Booking completed faild.",
    WORK_ACCEPT_SUCCESS: "Work-Booking accepted successfully.",
    WORK_ACCEPT_FAILD: "Work-Booking accepted faild.",
    WORK_CREATED_SUCCESS: "Job created successfully.",
    WORK_CREATED_FAILD: "Failed to create job."
}
