import { useState, useEffect } from 'react';
import { socket } from '../../utilities/socket';
import { initiateCall, endCall, isCallConnected } from '../../utilities/webrtcService';
import { toast } from 'react-toastify';

interface Props {
    user: {
        _id: string | undefined;
        name: string | undefined;
        profileImage: string | undefined;
    };
    onCallEnd: () => void;
    isOutgoing: boolean;
    me: string;
}

const CallComponent = ({ user, onCallEnd, isOutgoing, me }: Props) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        console.log('CallComponent: Mounting for user', user._id, 'isOutgoing:', isOutgoing);
        const animationInterval = setInterval(() => {
            setIsAnimating(prev => !prev);
        }, 1000);

        let connectionCheck: NodeJS.Timeout | null = null;

        const startCall = async () => {
            if (isOutgoing && user._id) {
                console.log('CallComponent: Initiating call to', user._id);
                await initiateCall(user._id, me);
            }
        };

        const handleReject = () => {
            console.log('CallComponent: Call rejected by', user._id);
            toast.error(`Call rejected by ${user.name || 'User'}`);
            endCall();
            setIsCallActive(false);
            onCallEnd();
        };

        const handleEnd = () => {
            console.log('CallComponent: Call ended by', user._id);
            toast('Call ended');
            endCall();
            setIsCallActive(false);
            onCallEnd();
        };

        connectionCheck = setInterval(() => {
            if (isCallConnected()) {
                if (!isCallActive) {
                    console.log('CallComponent: Call is now connected');
                    setIsCallActive(true);
                }
            }
        }, 500);

        if (isOutgoing) {
            startCall();
        }

        socket.on('webrtc-reject', handleReject);
        socket.on('webrtc-end-call', handleEnd);

        return () => {
            console.log('CallComponent: Cleaning up for user', user._id);
            clearInterval(animationInterval);
            if (connectionCheck) clearInterval(connectionCheck);
            socket.off('webrtc-reject', handleReject);
            socket.off('webrtc-end-call', handleEnd);
            if (isCallActive) {
                endCall();
            }
        };
    }, [user._id, isOutgoing, me, onCallEnd, isCallActive]);

    const handleEndCall = () => {
        console.log('CallComponent: handleEndCall triggered for', user._id);
        socket.emit('webrtc-end-call', { targetUserId: user._id });
        endCall();
        setIsAnimating(false);
        setIsCallActive(false);
        onCallEnd();
    };

    const toggleMute = () => {
        const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
        if (remoteAudio) {
            remoteAudio.muted = !remoteAudio.muted;
            setIsMuted(remoteAudio.muted);
            console.log('CallComponent: Audio muted:', remoteAudio.muted);
            if (!remoteAudio.muted) {
                remoteAudio.play().catch(error => console.error('CallComponent: Failed to play audio after unmute:', error));
            }
        }
    };

    return (
        <div
            style={{ backgroundImage: `url(${user?.profileImage})` }}
            className="flex flex-col w-full h-full bg-black bg-cover bg-center bg-opacity-80 rounded-xl p-4"
        >
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                    <p className={`text-lg mb-6 w-full animate-pulse ${isAnimating ? 'opacity-100' : 'opacity-50'}`}>
                        {isCallActive ? 'Connected' : 'Calling...'}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleEndCall}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 text-lg font-semibold"
                        >
                            End Call
                        </button>
                        <button
                            onClick={toggleMute}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
                        >
                            {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallComponent;