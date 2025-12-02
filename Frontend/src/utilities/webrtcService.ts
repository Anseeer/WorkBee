import { socket } from "./socket";

let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
export let iceCandidateBuffer: RTCIceCandidateInit[] = [];
let isConnected = false;
let isCallInitiated = false;

const servers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ],
    iceCandidatePoolSize: 10
};

export function isCallConnected() {
    return isConnected;
}

async function getLocalStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 48000
            }
        });

        stream.getTracks().forEach(track => {
            console.log("Track obtained:", track.kind, track.enabled, track.readyState);

            track.onended = () => console.error("Track ended unexpectedly:", track.kind);
            track.onmute = () => console.warn("Track muted:", track.kind);
            track.onunmute = () => console.log("Track unmuted:", track.kind);
        });

        return stream;
    } catch (error) {
        console.error("Failed to get microphone:", error);
        throw error;
    }
}

function ensureRemoteAudioPlayback(stream: MediaStream) {
    const remoteAudio = document.getElementById("remote-audio") as HTMLAudioElement | null;
    if (!remoteAudio) return;

    remoteAudio.srcObject = stream;
    remoteAudio.volume = 1.0;

    const playPromise = remoteAudio.play();
    if (!playPromise) return;

    playPromise
        .then(() => {
            console.log("Audio playing successfully");
        })
        .catch(error => {
            console.error("Audio autoplay blocked:", error);

            const retryPlay = () => {
                remoteAudio.play()
                    .then(() => {
                        console.log("Audio playback succeeded after user interaction");
                        document.removeEventListener("click", retryPlay);
                        document.removeEventListener("touchstart", retryPlay);
                    })
                    .catch(err => {
                        console.error("Retry audio playback failed:", err);
                    });
            };

            document.addEventListener("click", retryPlay);
            document.addEventListener("touchstart", retryPlay);
        });
}

function setupPeerConnection(_isInitiator: boolean, targetUserId: string) {
    const pc = new RTCPeerConnection(servers);

    pc.onicecandidate = (e) => {
        if (e.candidate) {
            socket.emit("webrtc-ice-candidate", {
                targetUserId,
                candidate: e.candidate
            });
        }
    };

    pc.ontrack = (e) => {
        console.log("Received remote track:", e.track.kind);
        remoteStream = e.streams[0];
        ensureRemoteAudioPlayback(e.streams[0]);
    };

    pc.onconnectionstatechange = () => {
        console.log("connectionState:", pc.connectionState);

        if (pc.connectionState === "connected") {
            isConnected = true;
        }

        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
            console.warn("Peer disconnected or failed");
            isConnected = false;
        }
    };

    pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") {
            console.warn("ICE failed — restarting");
            pc.restartIce();
        }
    };

    return pc;
}

export async function initiateCall(selectedUserId: string, currentUserId: string) {
    if (isCallInitiated) {
        console.log("Call already initiated");
        return;
    }

    isCallInitiated = true;

    try {
        localStream = await getLocalStream();
        peerConnection = setupPeerConnection(true, selectedUserId);

        localStream.getTracks().forEach(track => peerConnection!.addTrack(track, localStream!));

        const offer = await peerConnection.createOffer({ offerToReceiveAudio: true });
        await peerConnection.setLocalDescription(offer);

        socket.emit("webrtc-offer", {
            targetUserId: selectedUserId,
            offer,
            callerId: currentUserId
        });

    } catch (error) {
        console.error("Caller error:", error);
        isCallInitiated = false;
        endCall();
    }
}

export async function acceptCall(callerId: string, offer: RTCSessionDescriptionInit) {
    try {
        localStream = await getLocalStream();
        peerConnection = setupPeerConnection(false, callerId);

        localStream.getTracks().forEach(track => peerConnection!.addTrack(track, localStream!));

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
            targetUserId: callerId,
            answer
        });

        const pending = [...iceCandidateBuffer];
        iceCandidateBuffer = [];

        for (const candidate of pending) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Failed adding buffered ICE:", err);
            }
        }

    } catch (error) {
        console.error("Callee error:", error);
        endCall();
    }
}

export async function handleAnswerCall({ answer }: { answer: RTCSessionDescriptionInit }) {
    if (!peerConnection) return;

    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

        const pending = [...iceCandidateBuffer];
        iceCandidateBuffer = [];

        for (const candidate of pending) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Error adding ICE:", err);
            }
        }
    } catch (error) {
        console.error("handleAnswer error:", error);
    }
}

export async function handleIncomingIceCandidates({ candidate }: { candidate: RTCIceCandidateInit }) {
    if (!peerConnection) {
        iceCandidateBuffer.push(candidate);
        return;
    }

    try {
        if (peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
            iceCandidateBuffer.push(candidate);
        }
    } catch (error) {
        console.error("ICE candidate error:", error);
    }
}

export function endCall() {
    console.log("Ending call…");

    try {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
            remoteStream = null;
        }

        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }

        const remoteAudio = document.getElementById("remote-audio") as HTMLAudioElement;
        if (remoteAudio) {
            remoteAudio.srcObject = null;
            remoteAudio.pause();
        }

        iceCandidateBuffer = [];
        isConnected = false;
        isCallInitiated = false;
    } catch (error) {
        console.error("Error during endCall:", error);
    }

    console.log("Call fully cleaned up.");
}

export function debugTrackStatus() {
    console.log("isCallInitiated:", isCallInitiated);
    console.log("isConnected:", isConnected);

    if (localStream) {
        console.log("Local tracks:", localStream.getTracks());
    } else {
        console.log("No local stream");
    }

    if (peerConnection) {
        console.log("PeerConnection:", {
            connection: peerConnection.connectionState,
            ice: peerConnection.iceConnectionState,
            signal: peerConnection.signalingState,
            senders: peerConnection.getSenders(),
            receivers: peerConnection.getReceivers()
        });
    } else {
        console.log("No peerConnection");
    }
}
