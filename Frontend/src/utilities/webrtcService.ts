import { socket } from "./socket";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
export let iceCandidateBuffer: RTCIceCandidateInit[] = [];
let isConnected = false;
let isCallInitiated = false;

const servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
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
        console.log("Caller: Microphone access granted", localStream.getAudioTracks());
        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach((track) => {
            console.log("Caller: Adding track", track);
            peerConnection?.addTrack(track, localStream!);
        });
        peerConnection.ontrack = (e) => {
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                console.log("Caller: Remote stream tracks", e.streams[0].getAudioTracks());
                remoteAudio.play().catch(error => console.error('Caller: Failed to play audio:', error));
                console.log('Caller: Remote track received');
            } else {
                console.error('Caller: Remote audio element not found');
            }
        };
        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                console.log('Caller: ICE candidate generated', e.candidate);
                socket.emit('webrtc-ice-candidate', {
                    targetUserId: selectedUserId,
                    candidate: e.candidate
                });
            }
        };
        peerConnection.onconnectionstatechange = () => {
            console.log('Caller: Connection state:', peerConnection?.connectionState);
            if (peerConnection?.connectionState === 'connected') {
                isConnected = true;
                console.log('Caller: WebRTC connection established');
            } else if (peerConnection?.connectionState === 'disconnected' || peerConnection?.connectionState === 'failed') {
                console.log('Caller: Connection failed or disconnected');
                isConnected = false;
                socket.emit('webrtc-end-call', { targetUserId: selectedUserId });
            }
        };
        peerConnection.oniceconnectionstatechange = () => {
            console.log('Caller: ICE connection state:', peerConnection?.iceConnectionState);
        };
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log("Caller: Offer created", offer);
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
        console.log('Callee: Microphone access granted', localStream.getAudioTracks());
        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach((track) => {
            console.log("Callee: Adding track", track);
            peerConnection?.addTrack(track, localStream!);
        });
        peerConnection.ontrack = (e) => {
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                console.log("Callee: Remote stream tracks", e.streams[0].getAudioTracks());
                remoteAudio.play().catch(error => console.error('Callee: Failed to play audio:', error));
                console.log('Callee: Remote track received');
            } else {
                console.error('Callee: Remote audio element not found');
            }
        };
        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                console.log('Callee: ICE candidate generated', e.candidate);
                socket.emit('webrtc-ice-candidate', {
                    targetUserId: callerId,
                    candidate: e.candidate
                });
            }
        };
        peerConnection.onconnectionstatechange = () => {
            console.log('Callee: Connection state:', peerConnection?.connectionState);
            if (peerConnection?.connectionState === 'connected') {
                isConnected = true;
                console.log('Callee: WebRTC connection established');
            } else if (peerConnection?.connectionState === 'disconnected' || peerConnection?.connectionState === 'failed') {
                console.log('Callee: Connection failed or disconnected');
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
        console.log('Callee: Answer sent');
        while (iceCandidateBuffer.length > 0) {
            const candidate = iceCandidateBuffer.shift();
            if (candidate) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('Callee: Buffered ICE candidate added');
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
                console.log('Caller: Answer received and set');
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
    console.log('Incoming ICE candidate received', candidate);
    try {
        if (peerConnection && candidate) {
            if (peerConnection.remoteDescription) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .then(() => console.log('ICE candidate added'))
                    .catch(error => console.error('Failed to add ICE candidate:', error));
            } else {
                iceCandidateBuffer.push(candidate);
                console.log('ICE candidate buffered');
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
            console.log('Stopping track:', track);
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
    console.log('Call cleaned up');
}