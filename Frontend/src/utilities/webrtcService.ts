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

/* improved-webrtc.ts */
import { socket } from "./socket";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
export let iceCandidateBufferMap: Record<string, RTCIceCandidateInit[]> = {};
let isConnected = false;
let isCallInitiated = false;

// NOTE: public/free TURN servers are flaky. Use a paid TURN for production.
const servers: RTCConfiguration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
};

function makeId() {
    return Math.random().toString(36).slice(2, 9);
}

function ensureAudioElement(id = "remote-audio") {
    const el = document.getElementById(id) as HTMLAudioElement | null;
    if (!el) return null;

    el.autoplay = true;
    el.muted = false;
    el.volume = 1.0;

    el.setAttribute("playsinline", "");

    return el;
}

function attachTrackLogging(track: MediaStreamTrack, label: string) {
    console.log(`${label} track readyState:`, track.readyState);
    track.addEventListener("ended", () => {
        console.warn(`${label} track ended`);
    });
    track.addEventListener("mute", () => {
        console.warn(`${label} track muted`);
    });
    track.addEventListener("unmute", () => {
        console.log(`${label} track unmuted`);
    });
}

export function isCallConnected() {
    return isConnected;
}

function resetState() {
    isConnected = false;
    isCallInitiated = false;
    iceCandidateBufferMap = {};
}

export async function initiateCall(selectedUserId: string, currentUserId: string) {
    if (isCallInitiated) {
        console.log("Caller: Call already initiated, skipping");
        return;
    }
    isCallInitiated = true;
    const callId = makeId(); // id for this call -> used for candidate buffer
    iceCandidateBufferMap[callId] = [];

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const audioTrack = localStream.getAudioTracks()[0];
        if (!audioTrack) throw new Error("No audio track from getUserMedia()");
        audioTrack.enabled = true;
        attachTrackLogging(audioTrack, "Local");

        try {
            // applyConstraints might be rejected on some devices; swallow but log errors
            await audioTrack.applyConstraints({
                echoCancellation: true,
                noiseSuppression: false,
                autoGainControl: false,
            });
        } catch (cErr) {
            console.warn("applyConstraints failed:", cErr);
        }

        // create pc
        peerConnection = new RTCPeerConnection(servers);

        // attach event handlers
        peerConnection.ontrack = (e) => {
            console.log("Caller: ontrack", e.streams);
            const remoteAudio = ensureAudioElement();
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                remoteAudio.play().catch(err => console.warn("Caller: remoteAudio.play failed:", err));
            } else {
                console.error("Caller: Remote audio element not found");
            }
        };

        peerConnection.onicecandidate = (ev) => {
            if (ev.candidate) {
                // include callId so callee can map candidate to correct call if needed
                socket.emit("webrtc-ice-candidate", {
                    targetUserId: selectedUserId,
                    candidate: ev.candidate,
                    callId,
                });
            }
        };

        peerConnection.onconnectionstatechange = () => {
            console.log("Caller: connectionState ->", peerConnection?.connectionState);
            if (peerConnection?.connectionState === "connected") {
                isConnected = true;
            } else if (
                peerConnection?.connectionState === "disconnected" ||
                peerConnection?.connectionState === "failed" ||
                peerConnection?.connectionState === "closed"
            ) {
                console.warn("Caller: connection lost -> ending call");
                endCall();
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log("Caller: ICE connection state:", peerConnection?.iceConnectionState);
        };

        // add tracks - avoid adding duplicates if pc already has senders
        const existingSenders = peerConnection.getSenders();
        if (existingSenders.length === 0) {
            localStream.getTracks().forEach((track) => {
                peerConnection?.addTrack(track, localStream!);
            });
        }

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("webrtc-offer", {
            targetUserId: selectedUserId,
            offer: offer,
            callerId: currentUserId,
            callId,
        });
    } catch (error) {
        console.error("Caller: Failed to initiate call:", error);
        resetState();
    }
}

export async function acceptCall(callerId: string, offer: RTCSessionDescriptionInit, callId?: string) {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = localStream.getAudioTracks()[0];
        if (!audioTrack) throw new Error("No audio track from getUserMedia()");
        audioTrack.enabled = true;
        attachTrackLogging(audioTrack, "Local (Callee)");

        try {
            await audioTrack.applyConstraints({
                echoCancellation: true,
                noiseSuppression: false,
                autoGainControl: false,
            });
        } catch (cErr) {
            console.warn("Callee applyConstraints failed:", cErr);
        }

        peerConnection = new RTCPeerConnection(servers);

        peerConnection.ontrack = (e) => {
            console.log("Callee: ontrack", e.streams);
            const remoteAudio = ensureAudioElement();
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                remoteAudio.play().catch(err => console.warn("Callee: remoteAudio.play failed:", err));
            } else {
                console.error("Callee: Remote audio element not found");
            }
        };

        peerConnection.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("webrtc-ice-candidate", {
                    targetUserId: callerId,
                    candidate: e.candidate,
                    callId,
                });
            }
        };

        peerConnection.onconnectionstatechange = () => {
            console.log("Callee: connectionState ->", peerConnection?.connectionState);
            if (peerConnection?.connectionState === "connected") {
                isConnected = true;
            } else if (
                peerConnection?.connectionState === "disconnected" ||
                peerConnection?.connectionState === "failed" ||
                peerConnection?.connectionState === "closed"
            ) {
                console.warn("Callee: connection lost -> ending call");
                endCall();
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log("Callee: ICE connection state:", peerConnection?.iceConnectionState);
        };

        // add local tracks if not already added
        const existingSenders = peerConnection.getSenders();
        if (existingSenders.length === 0) {
            localStream.getTracks().forEach((track) => {
                peerConnection?.addTrack(track, localStream!);
            });
        }

        // set remote offer and answer
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
            targetUserId: callerId,
            answer,
            callId,
        });

        // drain buffered candidates specific to this callId
        const buf = callId ? (iceCandidateBufferMap[callId] || []) : [];
        while (buf && buf.length > 0) {
            const candidate = buf.shift();
            if (candidate) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log("Callee: added buffered candidate");
                } catch (err) {
                    console.error("Callee: failed to add buffered candidate:", err);
                }
            }
        }
    } catch (error) {
        console.error("Callee: Error accepting call:", error);
        resetState();
    }
}

export function handleAnswerCall({ answer, callId }: { answer: RTCSessionDescriptionInit; callId?: string }) {
    if (!peerConnection) {
        console.warn("Caller: no peerConnection when handling answer");
        return;
    }
    peerConnection
        .setRemoteDescription(new RTCSessionDescription(answer))
        .then(async () => {
            console.log("Caller: remote description set");

            if (callId) {
                const buf = iceCandidateBufferMap[callId] || [];
                while (buf.length > 0) {
                    const c = buf.shift();
                    if (c) {
                        try {
                            await peerConnection?.addIceCandidate(new RTCIceCandidate(c));
                            console.log("Caller: Buffered ICE candidate added");
                        } catch (err) {
                            console.error("Caller: Failed to add buffered ICE candidate:", err);
                        }
                    }
                }
            }
        })
        .catch((error) => console.error("Caller: Failed to set remote description:", error));
}

export function handleIncomingIceCandidates({ candidate, callId }: { candidate: RTCIceCandidateInit; callId?: string }) {
    try {
        if (!candidate) return;
        if (!peerConnection) {
            // store per callId (or default) until peerConnection exists
            const key = callId || "default";
            iceCandidateBufferMap[key] = iceCandidateBufferMap[key] || [];
            iceCandidateBufferMap[key].push(candidate);
            console.log("Candidate buffered for", key);
            return;
        }

        // if remoteDescription is set, add immediately
        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            peerConnection
                .addIceCandidate(new RTCIceCandidate(candidate))
                .then(() => console.log("ICE candidate added"))
                .catch((error) => console.error("Failed to add ICE candidate:", error));
        } else {
            const key = callId || "default";
            iceCandidateBufferMap[key] = iceCandidateBufferMap[key] || [];
            iceCandidateBufferMap[key].push(candidate);
            console.log("Candidate buffered (no remoteDesc yet) for", key);
        }
    } catch (error) {
        console.error("Failed to process ICE candidate:", error);
    }
}

export function endCall() {
    try {
        if (peerConnection) {
            try {
                peerConnection.getSenders().forEach((s) => {
                    try {
                        // stop sender tracks if needed
                        s.track?.stop();
                    } catch { throw new Error }
                });
            } catch { throw new Error }
            peerConnection.close();
            peerConnection = null;
        }
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                try {
                    track.stop();
                } catch { throw new Error }
            });
            localStream = null;
        }
        const remoteAudio = document.getElementById("remote-audio") as HTMLAudioElement | null;
        if (remoteAudio) {
            remoteAudio.srcObject = null;
            remoteAudio.pause();
        }
    } finally {
        resetState();
    }
}
