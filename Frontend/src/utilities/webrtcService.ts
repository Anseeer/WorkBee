import { socket } from "./socket";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
export let iceCandidateBuffer: RTCIceCandidateInit[] = [];
let isConnected = false;
let isCallInitiated = false;

const servers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ]
};

export function isCallConnected() {
    return isConnected;
}

export async function initiateCall(selectedUserId: string, currentUserId: string) {
    if (isCallInitiated) {
        console.log('Caller: Call already initiated, skipping');
        return;
    }
    isCallInitiated = true;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach((track) => {
            peerConnection?.addTrack(track, localStream!);
        });
        peerConnection.ontrack = (e) => {
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                remoteAudio.play().catch(error => console.error('Caller: Failed to play audio:', error));
            } else {
                console.error('Caller: Remote audio element not found');
            }
        };
        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit('webrtc-ice-candidate', {
                    targetUserId: selectedUserId,
                    candidate: e.candidate
                });
            }
        };
        peerConnection.onconnectionstatechange = () => {
            if (peerConnection?.connectionState === 'connected') {
                isConnected = true;
            } else if (peerConnection?.connectionState === 'disconnected' || peerConnection?.connectionState === 'failed') {
                isConnected = false;
                socket.emit('webrtc-end-call', { targetUserId: selectedUserId });
            }
        };
        peerConnection.oniceconnectionstatechange = () => {
            console.log('Caller: ICE connection state:', peerConnection?.iceConnectionState);
        };
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('webrtc-offer', {
            targetUserId: selectedUserId,
            offer: offer,
            callerId: currentUserId
        });
    } catch (error) {
        console.error('Caller: Failed to initiate call:', error);
        isCallInitiated = false;
    }
}

export async function acceptCall(callerId: string, offer: RTCSessionDescriptionInit) {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach((track) => {
            peerConnection?.addTrack(track, localStream!);
        });
        peerConnection.ontrack = (e) => {
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                remoteAudio.play().catch(error => console.error('Callee: Failed to play audio:', error));
            } else {
                console.error('Callee: Remote audio element not found');
            }
        };
        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit('webrtc-ice-candidate', {
                    targetUserId: callerId,
                    candidate: e.candidate
                });
            }
        };
        peerConnection.onconnectionstatechange = () => {
            if (peerConnection?.connectionState === 'connected') {
                isConnected = true;
            } else if (peerConnection?.connectionState === 'disconnected' || peerConnection?.connectionState === 'failed') {
                isConnected = false;
                socket.emit('webrtc-end-call', { targetUserId: callerId });
            }
        };
        peerConnection.oniceconnectionstatechange = () => {
            console.log('Callee: ICE connection state:', peerConnection?.iceConnectionState);
        };
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('webrtc-answer', {
            targetUserId: callerId,
            answer: answer
        });
        while (iceCandidateBuffer.length > 0) {
            const candidate = iceCandidateBuffer.shift();
            if (candidate) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('Callee: Failed to add buffered ICE candidate:', error);
                }
            }
        }
    } catch (error) {
        console.error('Callee: Error accepting call:', error);
    }
}

export function handleAnswerCall({ answer }: { answer: RTCSessionDescriptionInit }) {
    if (peerConnection) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
            .then(() => {
                while (iceCandidateBuffer.length > 0) {
                    const candidate = iceCandidateBuffer.shift();
                    if (candidate) {
                        peerConnection?.addIceCandidate(new RTCIceCandidate(candidate))
                            .then(() => console.log('Caller: Buffered ICE candidate added'))
                            .catch(error => console.error('Caller: Failed to add buffered ICE candidate:', error));
                    }
                }
            })
            .catch(error => console.error('Caller: Failed to set remote description:', error));
    }
}

export function handleIncomingIceCandidates({ candidate }: { candidate: RTCIceCandidateInit }) {
    try {
        if (peerConnection && candidate) {
            if (peerConnection.remoteDescription) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .then(() => console.log('ICE candidate added'))
                    .catch(error => console.error('Failed to add ICE candidate:', error));
            } else {
                iceCandidateBuffer.push(candidate);
            }
        }
    } catch (error) {
        console.error('Failed to process ICE candidate:', error);
    }
}

export function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => {
            track.stop();
        });
        localStream = null;
    }
    const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
    if (remoteAudio) {
        remoteAudio.srcObject = null;
        remoteAudio.pause();
    }
    iceCandidateBuffer = [];
    isConnected = false;
    isCallInitiated = false;
}