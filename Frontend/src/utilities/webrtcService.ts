// import { socket } from "./socket";

// let localStream: MediaStream | null = null;
// let peerConnection: RTCPeerConnection | null = null;
// export let iceCandidateBuffer: RTCIceCandidateInit[] = [];
// let isConnected = false;
// let isCallInitiated = false;

// const servers = {
//     iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         {
//             urls: "turn:openrelay.metered.ca:80",
//             username: "openrelayproject",
//             credential: "openrelayproject"
//         }
//     ]
// };

// export function isCallConnected() {
//     return isConnected;
// }

// export async function initiateCall(selectedUserId: string, currentUserId: string) {
//     if (isCallInitiated) {
//         console.log('Caller: Call already initiated, skipping');
//         return;
//     }
//     isCallInitiated = true;
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         peerConnection = new RTCPeerConnection(servers);
//         localStream.getTracks().forEach((track) => {
//             peerConnection?.addTrack(track, localStream!);
//         });
//         peerConnection.ontrack = (e) => {
//             const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
//             if (remoteAudio) {
//                 remoteAudio.srcObject = e.streams[0];
//                 remoteAudio.play().catch(error => console.error('Caller: Failed to play audio:', error));
//             } else {
//                 console.error('Caller: Remote audio element not found');
//             }
//         };
//         peerConnection.onicecandidate = (e) => {
//             if (e.candidate) {
//                 socket.emit('webrtc-ice-candidate', {
//                     targetUserId: selectedUserId,
//                     candidate: e.candidate
//                 });
//             }
//         };
//         peerConnection.onconnectionstatechange = () => {
//             if (peerConnection?.connectionState === 'connected') {
//                 isConnected = true;
//             }
//         };

//         peerConnection.oniceconnectionstatechange = () => {
//             console.log('Caller: ICE connection state:', peerConnection?.iceConnectionState);
//         };
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         socket.emit('webrtc-offer', {
//             targetUserId: selectedUserId,
//             offer: offer,
//             callerId: currentUserId
//         });
//     } catch (error) {
//         console.error('Caller: Failed to initiate call:', error);
//         isCallInitiated = false;
//     }
// }

// export async function acceptCall(callerId: string, offer: RTCSessionDescriptionInit) {
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         peerConnection = new RTCPeerConnection(servers);
//         localStream.getTracks().forEach((track) => {
//             peerConnection?.addTrack(track, localStream!);
//         });
//         peerConnection.ontrack = (e) => {
//             const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
//             if (remoteAudio) {
//                 remoteAudio.srcObject = e.streams[0];
//                 remoteAudio.play().catch(error => console.error('Callee: Failed to play audio:', error));
//             } else {
//                 console.error('Callee: Remote audio element not found');
//             }
//         };
//         peerConnection.onicecandidate = (e) => {
//             if (e.candidate) {
//                 socket.emit('webrtc-ice-candidate', {
//                     targetUserId: callerId,
//                     candidate: e.candidate
//                 });
//             }
//         };
//         peerConnection.onconnectionstatechange = () => {
//             if (peerConnection?.connectionState === 'connected') {
//                 isConnected = true;
//             }
//         };

//         peerConnection.oniceconnectionstatechange = () => {
//             console.log('Callee: ICE connection state:', peerConnection?.iceConnectionState);
//         };
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         socket.emit('webrtc-answer', {
//             targetUserId: callerId,
//             answer: answer
//         });
//         while (iceCandidateBuffer.length > 0) {
//             const candidate = iceCandidateBuffer.shift();
//             if (candidate) {
//                 try {
//                     await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//                 } catch (error) {
//                     console.error('Callee: Failed to add buffered ICE candidate:', error);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Callee: Error accepting call:', error);
//     }
// }

// export function handleAnswerCall({ answer }: { answer: RTCSessionDescriptionInit }) {
//     if (peerConnection) {
//         peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
//             .then(() => {
//                 while (iceCandidateBuffer.length > 0) {
//                     const candidate = iceCandidateBuffer.shift();
//                     if (candidate) {
//                         peerConnection?.addIceCandidate(new RTCIceCandidate(candidate))
//                             .then(() => console.log('Caller: Buffered ICE candidate added'))
//                             .catch(error => console.error('Caller: Failed to add buffered ICE candidate:', error));
//                     }
//                 }
//             })
//             .catch(error => console.error('Caller: Failed to set remote description:', error));
//     }
// }

// export function handleIncomingIceCandidates({ candidate }: { candidate: RTCIceCandidateInit }) {
//     try {
//         if (peerConnection && candidate) {
//             if (peerConnection.remoteDescription) {
//                 peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//                     .then(() => console.log('ICE candidate added'))
//                     .catch(error => console.error('Failed to add ICE candidate:', error));
//             } else {
//                 iceCandidateBuffer.push(candidate);
//             }
//         }
//     } catch (error) {
//         console.error('Failed to process ICE candidate:', error);
//     }
// }

// export function endCall() {
//     if (peerConnection) {
//         peerConnection.close();
//         peerConnection = null;
//     }
//     if (localStream) {
//         localStream.getTracks().forEach(track => {
//             track.stop();
//         });
//         localStream = null;
//     }
//     const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
//     if (remoteAudio) {
//         remoteAudio.srcObject = null;
//         remoteAudio.pause();
//     }
//     iceCandidateBuffer = [];
//     isConnected = false;
//     isCallInitiated = false;
// }




import { socket } from "./socket";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
export let iceCandidateBuffer: RTCIceCandidateInit[] = [];
let isConnected = false;
let isCallInitiated = false;

const servers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }, // Added backup STUN
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
    iceCandidatePoolSize: 10 // Pre-gather ICE candidates
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
        // Request audio with specific constraints
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        peerConnection = new RTCPeerConnection(servers);

        // Add tracks with proper error handling
        localStream.getTracks().forEach((track) => {
            console.log('Caller: Adding track:', track.kind, track.enabled);
            peerConnection?.addTrack(track, localStream!);
        });

        peerConnection.ontrack = (e) => {
            console.log('Caller: Received remote track:', e.track.kind);
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                // Ensure audio plays
                remoteAudio.play().catch(error => {
                    console.error('Caller: Failed to play audio:', error);
                    // Retry play on user interaction
                    document.addEventListener('click', () => {
                        remoteAudio.play();
                    }, { once: true });
                });
            } else {
                console.error('Caller: Remote audio element not found');
            }
        };

        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                console.log('Caller: Sending ICE candidate');
                socket.emit('webrtc-ice-candidate', {
                    targetUserId: selectedUserId,
                    candidate: e.candidate
                });
            } else {
                console.log('Caller: All ICE candidates sent');
            }
        };

        peerConnection.onconnectionstatechange = () => {
            console.log('Caller: Connection state:', peerConnection?.connectionState);
            if (peerConnection?.connectionState === 'connected') {
                isConnected = true;
            } else if (peerConnection?.connectionState === 'disconnected' ||
                peerConnection?.connectionState === 'failed') {
                console.error('Caller: Connection failed or disconnected');
                isConnected = false;
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log('Caller: ICE connection state:', peerConnection?.iceConnectionState);
            if (peerConnection?.iceConnectionState === 'failed') {
                // Attempt ICE restart
                console.log('Caller: ICE failed, attempting restart');
                peerConnection?.restartIce();
            }
        };

        // Monitor track state
        localStream.getTracks().forEach(track => {
            track.onended = () => {
                console.error('Caller: Local track ended:', track.kind);
            };
            track.onmute = () => {
                console.warn('Caller: Local track muted:', track.kind);
            };
            track.onunmute = () => {
                console.log('Caller: Local track unmuted:', track.kind);
            };
        });

        const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true
        });
        await peerConnection.setLocalDescription(offer);

        socket.emit('webrtc-offer', {
            targetUserId: selectedUserId,
            offer: offer,
            callerId: currentUserId
        });

        console.log('Caller: Offer sent');
    } catch (error) {
        console.error('Caller: Failed to initiate call:', error);
        isCallInitiated = false;
        throw error;
    }
}

export async function acceptCall(callerId: string, offer: RTCSessionDescriptionInit) {
    try {
        console.log('Callee: Accepting call');

        // Request audio with specific constraints
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        peerConnection = new RTCPeerConnection(servers);

        // Add tracks BEFORE setting remote description
        localStream.getTracks().forEach((track) => {
            console.log('Callee: Adding track:', track.kind, track.enabled);
            peerConnection?.addTrack(track, localStream!);
        });

        peerConnection.ontrack = (e) => {
            console.log('Callee: Received remote track:', e.track.kind);
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                remoteAudio.play().catch(error => {
                    console.error('Callee: Failed to play audio:', error);
                    document.addEventListener('click', () => {
                        remoteAudio.play();
                    }, { once: true });
                });
            } else {
                console.error('Callee: Remote audio element not found');
            }
        };

        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                console.log('Callee: Sending ICE candidate');
                socket.emit('webrtc-ice-candidate', {
                    targetUserId: callerId,
                    candidate: e.candidate
                });
            } else {
                console.log('Callee: All ICE candidates sent');
            }
        };

        peerConnection.onconnectionstatechange = () => {
            console.log('Callee: Connection state:', peerConnection?.connectionState);
            if (peerConnection?.connectionState === 'connected') {
                isConnected = true;
            } else if (peerConnection?.connectionState === 'disconnected' ||
                peerConnection?.connectionState === 'failed') {
                console.error('Callee: Connection failed or disconnected');
                isConnected = false;
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log('Callee: ICE connection state:', peerConnection?.iceConnectionState);
            if (peerConnection?.iceConnectionState === 'failed') {
                console.log('Callee: ICE failed, attempting restart');
                peerConnection?.restartIce();
            }
        };

        // Monitor track state
        localStream.getTracks().forEach(track => {
            track.onended = () => {
                console.error('Callee: Local track ended:', track.kind);
            };
            track.onmute = () => {
                console.warn('Callee: Local track muted:', track.kind);
            };
            track.onunmute = () => {
                console.log('Callee: Local track unmuted:', track.kind);
            };
        });

        // Set remote description FIRST
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Callee: Remote description set');

        // Create and set answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Callee: Local description set');

        socket.emit('webrtc-answer', {
            targetUserId: callerId,
            answer: answer
        });

        // Process buffered ICE candidates AFTER setting remote description
        console.log('Callee: Processing', iceCandidateBuffer.length, 'buffered candidates');
        const candidatesToProcess = [...iceCandidateBuffer];
        iceCandidateBuffer = [];

        for (const candidate of candidatesToProcess) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('Callee: Buffered ICE candidate added');
            } catch (error) {
                console.error('Callee: Failed to add buffered ICE candidate:', error);
            }
        }
    } catch (error) {
        console.error('Callee: Error accepting call:', error);
        throw error;
    }
}

export async function handleAnswerCall({ answer }: { answer: RTCSessionDescriptionInit }) {
    if (!peerConnection) {
        console.error('Caller: No peer connection exists');
        return;
    }

    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Caller: Remote description set');

        // Process buffered ICE candidates
        console.log('Caller: Processing', iceCandidateBuffer.length, 'buffered candidates');
        const candidatesToProcess = [...iceCandidateBuffer];
        iceCandidateBuffer = [];

        for (const candidate of candidatesToProcess) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('Caller: Buffered ICE candidate added');
            } catch (error) {
                console.error('Caller: Failed to add buffered ICE candidate:', error);
            }
        }
    } catch (error) {
        console.error('Caller: Failed to set remote description:', error);
    }
}

export async function handleIncomingIceCandidates({ candidate }: { candidate: RTCIceCandidateInit }) {
    try {
        if (!peerConnection) {
            console.warn('No peer connection, buffering ICE candidate');
            iceCandidateBuffer.push(candidate);
            return;
        }

        if (!candidate) {
            console.warn('Received null ICE candidate');
            return;
        }

        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('ICE candidate added successfully');
            } catch (error) {
                console.error('Failed to add ICE candidate:', error);
            }
        } else {
            console.log('Remote description not set, buffering ICE candidate');
            iceCandidateBuffer.push(candidate);
        }
    } catch (error) {
        console.error('Failed to process ICE candidate:', error);
    }
}

export function endCall() {
    console.log('Ending call');

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localStream) {
        localStream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped track:', track.kind);
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