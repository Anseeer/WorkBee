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

        // Keep track references alive
        stream.getTracks().forEach(track => {
            console.log('Track obtained:', track.kind, 'enabled:', track.enabled, 'readyState:', track.readyState);

            // Prevent track from being stopped
            track.onended = () => {
                console.error('Track ended unexpectedly:', track.kind);
            };
            track.onmute = () => {
                console.warn('Track muted:', track.kind);
            };
            track.onunmute = () => {
                console.log('Track unmuted:', track.kind);
            };
        });

        return stream;
    } catch (error) {
        console.error('Failed to get user media:', error);
        throw error;
    }
}

function setupPeerConnection(isInitiator: boolean, targetUserId: string) {
    const pc = new RTCPeerConnection(servers);

    pc.onicecandidate = (e) => {
        if (e.candidate) {
            console.log(`${isInitiator ? 'Caller' : 'Callee'}: Sending ICE candidate`);
            socket.emit('webrtc-ice-candidate', {
                targetUserId: targetUserId,
                candidate: e.candidate
            });
        }
    };

    pc.ontrack = (e) => {
        console.log(`${isInitiator ? 'Caller' : 'Callee'}: Received remote track:`, e.track.kind);
        console.log('Track state:', e.track.readyState, 'enabled:', e.track.enabled);

        // Store remote stream reference
        remoteStream = e.streams[0];

        const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
        if (remoteAudio) {
            remoteAudio.srcObject = e.streams[0];
            remoteAudio.volume = 1.0; // Ensure volume is at max

            // Force play
            const playPromise = remoteAudio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Audio playing successfully');
                    })
                    .catch(error => {
                        console.error('Failed to play audio:', error);
                        // Retry on user interaction
                        const retryPlay = () => {
                            remoteAudio.play();
                            document.removeEventListener('click', retryPlay);
                            document.removeEventListener('touchstart', retryPlay);
                        };
                        document.addEventListener('click', retryPlay);
                        document.addEventListener('touchstart', retryPlay);
                    });
            }
        }

        // Monitor remote track
        e.track.onended = () => {
            console.error('Remote track ended');
        };
        e.track.onmute = () => {
            console.warn('Remote track muted');
        };
        e.track.onunmute = () => {
            console.log('Remote track unmuted');
        };
    };

    pc.onconnectionstatechange = () => {
        console.log(`${isInitiator ? 'Caller' : 'Callee'}: Connection state:`, pc.connectionState);
        if (pc.connectionState === 'connected') {
            isConnected = true;
            // Verify tracks are still active
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    console.log('Local track status:', track.kind, 'enabled:', track.enabled, 'readyState:', track.readyState);
                });
            }
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            console.error('Connection failed');
            isConnected = false;
        }
    };

    pc.oniceconnectionstatechange = () => {
        console.log(`${isInitiator ? 'Caller' : 'Callee'}: ICE state:`, pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed') {
            console.log('ICE failed, restarting...');
            pc.restartIce();
        }
    };

    // Monitor signaling state
    pc.onsignalingstatechange = () => {
        console.log(`${isInitiator ? 'Caller' : 'Callee'}: Signaling state:`, pc.signalingState);
    };

    return pc;
}

export async function initiateCall(selectedUserId: string, currentUserId: string) {
    if (isCallInitiated) {
        console.log('Call already initiated');
        return;
    }
    isCallInitiated = true;

    try {
        console.log('Caller: Initiating call');

        // Get local stream first
        localStream = await getLocalStream();

        // Create peer connection
        peerConnection = setupPeerConnection(true, selectedUserId);

        // Add all local tracks to peer connection
        localStream.getTracks().forEach((track) => {
            console.log('Caller: Adding track to peer connection:', track.kind, track.id);
            const sender = peerConnection?.addTrack(track, localStream!);
            console.log('Caller: Track added, sender:', sender);
        });

        // Log senders to verify tracks are added
        setTimeout(() => {
            const senders = peerConnection?.getSenders();
            console.log('Caller: Current senders:', senders?.length);
            senders?.forEach(sender => {
                if (sender.track) {
                    console.log('Sender track:', sender.track.kind, 'enabled:', sender.track.enabled, 'readyState:', sender.track.readyState);
                }
            });
        }, 1000);

        // Create offer
        const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true
        });

        await peerConnection.setLocalDescription(offer);
        console.log('Caller: Local description set');

        socket.emit('webrtc-offer', {
            targetUserId: selectedUserId,
            offer: offer,
            callerId: currentUserId
        });

        console.log('Caller: Offer sent');

    } catch (error) {
        console.error('Caller: Failed to initiate call:', error);
        isCallInitiated = false;
        endCall();
        throw error;
    }
}

export async function acceptCall(callerId: string, offer: RTCSessionDescriptionInit) {
    try {
        console.log('Callee: Accepting call');

        // Get local stream first
        localStream = await getLocalStream();

        // Create peer connection
        peerConnection = setupPeerConnection(false, callerId);

        // Add all local tracks BEFORE setting remote description
        localStream.getTracks().forEach((track) => {
            console.log('Callee: Adding track to peer connection:', track.kind, track.id);
            const sender = peerConnection?.addTrack(track, localStream!);
            console.log('Callee: Track added, sender:', sender);
        });

        // Set remote description
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Callee: Remote description set');

        // Create answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Callee: Local description set');

        // Send answer
        socket.emit('webrtc-answer', {
            targetUserId: callerId,
            answer: answer
        });

        console.log('Callee: Answer sent');

        // Process buffered ICE candidates
        console.log('Callee: Processing', iceCandidateBuffer.length, 'buffered candidates');
        const candidatesToProcess = [...iceCandidateBuffer];
        iceCandidateBuffer = [];

        for (const candidate of candidatesToProcess) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('Callee: Buffered candidate added');
            } catch (error) {
                console.error('Callee: Failed to add buffered candidate:', error);
            }
        }

        // Log senders to verify tracks are added
        setTimeout(() => {
            const senders = peerConnection?.getSenders();
            console.log('Callee: Current senders:', senders?.length);
            senders?.forEach(sender => {
                if (sender.track) {
                    console.log('Sender track:', sender.track.kind, 'enabled:', sender.track.enabled, 'readyState:', sender.track.readyState);
                }
            });
        }, 1000);

    } catch (error) {
        console.error('Callee: Error accepting call:', error);
        endCall();
        throw error;
    }
}

export async function handleAnswerCall({ answer }: { answer: RTCSessionDescriptionInit }) {
    if (!peerConnection) {
        console.error('Caller: No peer connection exists');
        return;
    }

    try {
        console.log('Caller: Received answer');
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Caller: Remote description set');

        // Process buffered ICE candidates
        console.log('Caller: Processing', iceCandidateBuffer.length, 'buffered candidates');
        const candidatesToProcess = [...iceCandidateBuffer];
        iceCandidateBuffer = [];

        for (const candidate of candidatesToProcess) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('Caller: Buffered candidate added');
            } catch (error) {
                console.error('Caller: Failed to add buffered candidate:', error);
            }
        }

        // Verify tracks after answer
        setTimeout(() => {
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    console.log('Caller: Local track after answer:', track.kind, 'enabled:', track.enabled, 'readyState:', track.readyState);
                });
            }
        }, 2000);

    } catch (error) {
        console.error('Caller: Failed to handle answer:', error);
    }
}

export async function handleIncomingIceCandidates({ candidate }: { candidate: RTCIceCandidateInit }) {
    try {
        if (!peerConnection) {
            console.log('No peer connection, buffering candidate');
            iceCandidateBuffer.push(candidate);
            return;
        }

        if (!candidate) {
            return;
        }

        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('ICE candidate added');
        } else {
            console.log('Remote description not set, buffering candidate');
            iceCandidateBuffer.push(candidate);
        }
    } catch (error) {
        console.error('Failed to process ICE candidate:', error);
    }
}

export function endCall() {
    console.log('Ending call, cleaning up resources');

    // Stop all local tracks
    if (localStream) {
        localStream.getTracks().forEach(track => {
            console.log('Stopping local track:', track.kind);
            track.stop();
        });
        localStream = null;
    }

    // Stop all remote tracks
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => {
            console.log('Stopping remote track:', track.kind);
            track.stop();
        });
        remoteStream = null;
    }

    // Close peer connection
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    // Clear audio element
    const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
    if (remoteAudio) {
        remoteAudio.srcObject = null;
        remoteAudio.pause();
    }

    // Reset state
    iceCandidateBuffer = [];
    isConnected = false;
    isCallInitiated = false;

    console.log('Call ended, all resources cleaned up');
}

// Debug function - call this to check track status
export function debugTrackStatus() {
    console.log('=== DEBUG TRACK STATUS ===');
    console.log('isCallInitiated:', isCallInitiated);
    console.log('isConnected:', isConnected);

    if (localStream) {
        console.log('Local stream tracks:');
        localStream.getTracks().forEach(track => {
            console.log(`  ${track.kind}: enabled=${track.enabled}, readyState=${track.readyState}, id=${track.id}`);
        });
    } else {
        console.log('No local stream');
    }

    if (peerConnection) {
        console.log('Peer connection state:', peerConnection.connectionState);
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        console.log('Signaling state:', peerConnection.signalingState);

        const senders = peerConnection.getSenders();
        console.log('Senders:', senders.length);
        senders.forEach((sender, i) => {
            if (sender.track) {
                console.log(`  Sender ${i}: ${sender.track.kind}, enabled=${sender.track.enabled}, readyState=${sender.track.readyState}`);
            }
        });

        const receivers = peerConnection.getReceivers();
        console.log('Receivers:', receivers.length);
        receivers.forEach((receiver, i) => {
            if (receiver.track) {
                console.log(`  Receiver ${i}: ${receiver.track.kind}, enabled=${receiver.track.enabled}, readyState=${receiver.track.readyState}`);
            }
        });
    } else {
        console.log('No peer connection');
    }
    console.log('========================');
}