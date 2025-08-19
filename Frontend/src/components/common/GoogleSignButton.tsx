import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse} from "@react-oauth/google";

interface Props {
  handleGoogleLogin: (response: CredentialResponse) => void;
  handleGoogleError?: () => void;
}

const GoogleAuth = ({ handleGoogleLogin, handleGoogleError }: Props) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.error("Google login failed");
          if (handleGoogleError) handleGoogleError();
        }}
        useOneTap 
        type="icon" 
        shape="circle" 
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
