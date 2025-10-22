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
    console.log(isAnimating)
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
    }, [user._id, isOutgoing, me, onCallEnd, isCallActive, user.name]);

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
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (isCallActive) {
            const interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isCallActive]);
    return (
        <div
            className="flex relative min-h-screen bg-center bg-cover bg-no-repeat  flex-col w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden">
            <div
                className="absolute inset-0 opacity-20 blur-sm bg-center bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${user?.profileImage})`,
                }}
            />

            {/* Content */}
            <div className="relative flex flex-col h-full z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                        <span className="text-white text-sm font-medium">
                            {isCallActive ? 'Connected' : 'Connecting...'}
                        </span>
                    </div>
                    <div className="text-white text-sm opacity-75">
                        {isCallActive && (() => {

                            const mins = Math.floor(seconds / 60);
                            const secs = seconds % 60;
                            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                        })()}
                    </div>
                </div>

                {/* Center Content - User Info */}
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    {/* Avatar */}
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden ring-4 ring-white/10">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Pulse ring effect */}
                        {!isCallActive && (
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-75" />
                        )}
                    </div>

                    {/* User Name */}
                    <h2 className="text-3xl font-semibold text-white mb-2">
                        {user?.name}
                    </h2>

                    {/* Status */}
                    <p className="text-gray-400 text-lg mb-8">
                        {isCallActive ? 'Voice call in progress' : 'Calling...'}
                    </p>
                </div>

                {/* Bottom Controls */}
                <div className="p-8">
                    <div className="flex justify-center items-center gap-6">
                        {/* Mute Button */}
                        <button
                            onClick={toggleMute}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted
                                ? 'bg-gray-600 hover:bg-gray-500'
                                : 'bg-white/10 hover:bg-white/20'
                                } backdrop-blur-sm`}
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            <svg
                                className="w-7 h-7 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMuted ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                )}
                            </svg>
                        </button>

                        {/* End Call Button */}
                        <button
                            onClick={handleEndCall}
                            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
                            aria-label="End Call"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-white "
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 15.46a16.05 16.05 0 0 0-4.35-1.22l-2.1 2.1a1.65 1.65 0 0 1-1.65.4 12.05 12.05 0 0 1-5.35-5.35 1.65 1.65 0 0 1 .4-1.65l2.1-2.1A16.05 16.05 0 0 0 8.54 3H7a2 2 0 0 0-2 2c0 9.39 7.61 17 17 17a2 2 0 0 0 2-2v-1.54z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Button Labels */}
                    <div className="flex justify-center items-center gap-6 mt-4">
                        <span className="w-16 text-center text-xs text-gray-400">
                            {isMuted ? 'Unmute' : 'Mute'}
                        </span>
                        <span className="w-20 text-center text-xs text-gray-400">
                            End Call
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallComponent;